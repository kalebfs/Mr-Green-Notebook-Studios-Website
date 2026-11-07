
import {
    doc,
    runTransaction,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const CLOUDINARY_CLOUD_NAME = "kqzpdeaz";
const CLOUDINARY_UPLOAD_PRESET = "kalebfs_posts";
const MAX_PROFILE_PHOTO_SIZE = 2 * 1024 * 1024;

export function initProfiles({ auth, db, accountBar, getLanguage }) {
    const profileContent = document.getElementById("profileContent");
    const editProfileButton = document.getElementById("editProfileButton");
    const profileEditorDialog = document.getElementById("profileEditorDialog");
    const profileForm = document.getElementById("profileForm");
    const closeProfileEditor = document.getElementById("closeProfileEditor");

    const profileDisplayName = document.getElementById("profileDisplayName");
    const profileUsername = document.getElementById("profileUsername");
    const profileBio = document.getElementById("profileBio");
    const profileError = document.getElementById("profileError");

    let currentProfile = null;
    let viewedUid = null;
    let profileListener = null;

    const accountActions = accountBar?.querySelector(".account-actions");

    // Botão de perfil no canto superior.
    const profileButton = document.createElement("button");
    profileButton.type = "button";
    profileButton.className = "profile-corner-button";
    profileButton.title = "Meu perfil";
    profileButton.setAttribute("aria-label", "Abrir meu perfil");
    profileButton.textContent = "M";

    if (accountActions) {
        accountActions.appendChild(profileButton);
    }

    // Campo de foto do editor.
    let photoInput = document.getElementById("profilePhoto");
    let photoPreview = document.getElementById("profilePhotoPreview");

    if (profileForm && !photoInput) {
        const photoField = document.createElement("div");
        photoField.className = "profile-photo-field";

        const label = document.createElement("label");
        label.htmlFor = "profilePhoto";
        label.textContent = "Foto de perfil";

        photoInput = document.createElement("input");
        photoInput.type = "file";
        photoInput.id = "profilePhoto";
        photoInput.accept = "image/jpeg,image/png,image/webp";

        photoPreview = document.createElement("div");
        photoPreview.id = "profilePhotoPreview";
        photoPreview.className = "profile-photo-preview";
        photoPreview.textContent = "M";

        photoField.append(label, photoInput, photoPreview);

        const submitButton = profileForm.querySelector('[type="submit"]');

        if (submitButton) {
            profileForm.insertBefore(photoField, submitButton);
        } else {
            profileForm.appendChild(photoField);
        }
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]);
    }

    function slugify(value) {
        return String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9_]/g, "")
            .slice(0, 20);
    }

    function validateProfile(displayName, username, bio) {
        if (!displayName || displayName.length > 32) {
            return "O nome deve ter entre 1 e 32 caracteres.";
        }

        if (!/^[a-z0-9_]{3,20}$/.test(username)) {
            return "O usuário deve ter de 3 a 20 caracteres, usando letras minúsculas, números ou _.";
        }

        if (bio.length > 160) {
            return "A bio pode ter no máximo 160 caracteres.";
        }

        return null;
    }

    function updateProfileButton(profile) {
        if (!profileButton) return;

        profileButton.replaceChildren();

        if (profile?.photoURL) {
            const image = document.createElement("img");
            image.src = profile.photoURL;
            image.alt = "Foto de perfil";
            profileButton.appendChild(image);
        } else {
            profileButton.textContent =
                profile?.displayName?.charAt(0)?.toUpperCase() || "M";
        }
    }

    function renderProfile(profile, uid) {
        if (!profileContent) return;

        const avatar = profile.photoURL
            ? `<img src="${escapeHTML(profile.photoURL)}" alt="Foto de perfil">`
            : escapeHTML(profile.displayName?.charAt(0)?.toUpperCase() || "M");

        profileContent.innerHTML = `
            <div class="profile-card-avatar">${avatar}</div>
            <h2>${escapeHTML(profile.displayName || "User")}</h2>
            <p class="profile-username">@${escapeHTML(profile.username || "user")}</p>
            <p class="profile-bio">${escapeHTML(profile.bio || "Nenhuma bio adicionada.")}</p>
        `;

        const isOwnProfile = auth.currentUser?.uid === uid;

        if (editProfileButton) {
            editProfileButton.hidden = !isOwnProfile;
        }

        if (isOwnProfile) {
            currentProfile = profile;
            updateProfileButton(profile);
        }
    }

    async function ensureProfile(user) {
        const userRef = doc(db, "users", user.uid);

        return runTransaction(db, async transaction => {
            const profileSnapshot = await transaction.get(userRef);

            if (profileSnapshot.exists()) {
                return profileSnapshot.data();
            }

            const baseName = slugify(user.displayName || "user") || "user";

            const username =
                `${baseName.slice(0, 12)}_${user.uid.slice(0, 6).toLowerCase()}`;

            const usernameRef = doc(db, "usernames", username);

            const usernameSnapshot = await transaction.get(usernameRef);

            if (usernameSnapshot.exists()) {
                throw new Error("Não foi possível criar seu nome de usuário.");
            }

            const newProfile = {
                uid: user.uid,
                displayName: user.displayName || "User",
                username,
                usernameLower: username,
                bio: "",
                photoURL: "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            transaction.set(userRef, newProfile);

            transaction.set(usernameRef, {
                uid: user.uid
            });

            return newProfile;
        });
    }

    async function uploadProfilePhoto(file) {
        if (!file) return currentProfile?.photoURL || "";

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            throw new Error("Use uma imagem JPG, PNG ou WebP.");
        }

        if (file.size > MAX_PROFILE_PHOTO_SIZE) {
            throw new Error("A foto deve ter no máximo 2 MB.");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok || !result.secure_url) {
            throw new Error(
                result.error?.message || "Não foi possível enviar a foto."
            );
        }

        return result.secure_url;
    }

    async function saveProfile(user, data) {
        const userRef = doc(db, "users", user.uid);
        const newUsernameRef = doc(db, "usernames", data.username);

        await runTransaction(db, async transaction => {
            const profileSnapshot = await transaction.get(userRef);
            const newUsernameSnapshot = await transaction.get(newUsernameRef);

            const oldProfile = profileSnapshot.exists()
                ? profileSnapshot.data()
                : {};

            const oldUsername =
                oldProfile.usernameLower || oldProfile.username || "";

            if (
                newUsernameSnapshot.exists() &&
                newUsernameSnapshot.data().uid !== user.uid
            ) {
                throw new Error("Esse nome de usuário já está em uso.");
            }

            let oldUsernameRef = null;

            if (oldUsername && oldUsername !== data.username) {
                oldUsernameRef = doc(db, "usernames", oldUsername);
                await transaction.get(oldUsernameRef);
            }

            transaction.set(userRef, {
                uid: user.uid,
                displayName: data.displayName,
                username: data.username,
                usernameLower: data.username,
                bio: data.bio,
                photoURL: data.photoURL,
                createdAt: oldProfile.createdAt || serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            transaction.set(newUsernameRef, {
                uid: user.uid
            });

            if (oldUsernameRef) {
                transaction.delete(oldUsernameRef);
            }
        });
    }

    async function openProfile(uid) {
        if (!uid) return;

        viewedUid = uid;

        // Esconde o botão enquanto o perfil carrega.
        if (editProfileButton) {
            editProfileButton.hidden = true;
        }

        // Evita mostrar dados do perfil anterior.
        if (profileListener) {
            profileListener();
            profileListener = null;
        }

        if (profileContent) {
            profileContent.innerHTML = "<p>Carregando perfil...</p>";
        }

        const userRef = doc(db, "users", uid);

        profileListener = onSnapshot(userRef, snapshot => {
            // Ignora respostas de perfis que não estão mais abertos.
            if (viewedUid !== uid) return;

            if (!snapshot.exists()) {
                currentProfile = null;

                if (profileContent) {
                    profileContent.innerHTML =
                        "<p>Perfil não encontrado.</p>";
                }

                return;
            }

            const profile = snapshot.data();

            renderProfile(profile, uid);

            // Verifica novamente se é o próprio perfil.
            if (editProfileButton) {
                editProfileButton.hidden = !(
                    auth.currentUser?.uid === uid
                );
            }
        }, error => {
            console.error("Erro ao carregar perfil:", error);

            if (profileContent) {
                profileContent.innerHTML =
                    "<p>Não foi possível carregar este perfil.</p>";
            }
        });
    }

    function openEditor() {
        if (!currentProfile || !profileEditorDialog) return;

        // Impede editar o perfil de outra pessoa.
        if (
            !auth.currentUser ||
            auth.currentUser.uid !== viewedUid
        ) {
            return;
        }

        profileDisplayName.value = currentProfile.displayName || "";
        profileUsername.value = currentProfile.username || "";
        profileBio.value = currentProfile.bio || "";

        if (photoInput) {
            photoInput.value = "";
        }

        updatePhotoPreview(currentProfile.photoURL);

        if (profileError) {
            profileError.textContent = "";
        }

        profileEditorDialog.showModal();
    }

    function updatePhotoPreview(url) {
        if (!photoPreview) return;

        photoPreview.replaceChildren();

        if (url) {
            const image = document.createElement("img");
            image.src = url;
            image.alt = "Prévia da foto";
            photoPreview.appendChild(image);
        } else {
            photoPreview.textContent =
                currentProfile?.displayName?.charAt(0)?.toUpperCase() || "M";
        }
    }

    photoInput?.addEventListener("change", () => {
        const file = photoInput.files?.[0];

        if (!file) {
            updatePhotoPreview(currentProfile?.photoURL || "");
            return;
        }

        if (file.size > MAX_PROFILE_PHOTO_SIZE) {
            if (profileError) {
                profileError.textContent =
                    "A foto deve ter no máximo 2 MB.";
            }

            photoInput.value = "";
            return;
        }

        const previewURL = URL.createObjectURL(file);
        updatePhotoPreview(previewURL);
    });

    profileButton.addEventListener("click", async () => {
        const user = auth.currentUser;
        if (!user) return;

        await openProfile(user.uid);

        document.dispatchEvent(new CustomEvent("mrgreen:open-profile", {
            detail: { uid: user.uid }
        }));
    });

    editProfileButton?.addEventListener("click", openEditor);

    closeProfileEditor?.addEventListener("click", () => {
        profileEditorDialog.close();
    });

    profileForm?.addEventListener("submit", async event => {
        event.preventDefault();

        const user = auth.currentUser;

        if (!user || user.uid !== viewedUid) return;

        const displayName = profileDisplayName.value.trim();
        const username = slugify(profileUsername.value.trim());
        const bio = profileBio.value.trim();
        const selectedPhoto = photoInput?.files?.[0] || null;

        const validationError = validateProfile(
            displayName,
            username,
            bio
        );

        if (validationError) {
            profileError.textContent = validationError;
            return;
        }

        const submitButton = profileForm.querySelector('[type="submit"]');

        try {
            profileError.textContent = "";

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Salvando...";
            }

            const photoURL = selectedPhoto
                ? await uploadProfilePhoto(selectedPhoto)
                : currentProfile?.photoURL || "";

            await saveProfile(user, {
                displayName,
                username,
                bio,
                photoURL
            });

            profileEditorDialog.close();
            await openProfile(user.uid);

        } catch (error) {
            console.error("Erro ao salvar perfil:", error);

            profileError.textContent =
                error.message || "Não foi possível salvar o perfil.";

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Salvar alterações";
            }
        }
    });

    document.addEventListener("mrgreen:view-profile", async event => {
        const uid = event.detail?.uid;

        if (!uid) return;

        // Abre o perfil da pessoa.
        await openProfile(uid);

        // Muda para a página Perfil.
        document.querySelector('[data-page="profile"]')?.click();
    });

    auth.onAuthStateChanged(async user => {
        if (!user) {
            currentProfile = null;
            viewedUid = null;

            profileButton.hidden = true;

            if (editProfileButton) {
                editProfileButton.hidden = true;
            }

            if (profileListener) {
                profileListener();
                profileListener = null;
            }

            if (profileContent) {
                profileContent.innerHTML = "";
            }

            return;
        }

        profileButton.hidden = false;

        if (editProfileButton) {
            editProfileButton.hidden = true;
        }

        try {
            await ensureProfile(user);
            await openProfile(user.uid);
        } catch (error) {
            console.error("Erro ao inicializar perfil:", error);
        }
    });
}
