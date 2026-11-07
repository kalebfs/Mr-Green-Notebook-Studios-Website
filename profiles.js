
import {
    doc,
    getDoc,
    runTransaction,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

export function initProfiles({ auth, db, accountBar, getLanguage }) {

    const content = document.getElementById("profileContent");
    const editButton = document.getElementById("editProfileButton");
    const editor = document.getElementById("profileEditorDialog");
    const form = document.getElementById("profileForm");
    const closeButton = document.getElementById("closeProfileEditor");

    const displayNameInput = document.getElementById("profileDisplayName");
    const usernameInput = document.getElementById("profileUsername");
    const bioInput = document.getElementById("profileBio");
    const errorElement = document.getElementById("profileError");

    let currentProfile = null;
    let viewedUid = null;
    let profileListener = null;

    const profileButton = document.createElement("button");
    profileButton.type = "button";
    profileButton.className = "account-button";
    profileButton.textContent = "Meu perfil";

    accountBar?.querySelector(".account-actions")?.appendChild(profileButton);

    function slugify(value) {
        return value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "")
            .slice(0, 20);
    }

    function validateProfile(displayName, username, bio) {

        if (displayName.length < 2 || displayName.length > 32) {
            throw new Error("O nome deve ter entre 2 e 32 caracteres.");
        }

        if (!/^[a-z0-9_]{3,20}$/.test(username)) {
            throw new Error(
                "O arroba deve ter entre 3 e 20 caracteres e usar apenas letras minúsculas, números e _."
            );
        }

        if (bio.length > 160) {
            throw new Error("A bio pode ter no máximo 160 caracteres.");
        }
    }

    async function ensureProfile(user) {

        const userRef = doc(db, "users", user.uid);
        const existing = await getDoc(userRef);

        if (existing.exists()) {
            return existing.data();
        }

        let base = slugify(user.displayName || user.email?.split("@")[0] || "user");

        if (base.length < 3) base = "user";

        return runTransaction(db, async transaction => {

            const userSnapshot = await transaction.get(userRef);

            if (userSnapshot.exists()) {
                return userSnapshot.data();
            }

            let username = base;
            let usernameRef;
            let available = false;

            for (let i = 0; i < 100; i++) {

                username = i === 0
                    ? base
                    : `${base.slice(0, 16)}${i}`;

                usernameRef = doc(db, "usernames", username);

                const usernameSnapshot = await transaction.get(usernameRef);

                if (!usernameSnapshot.exists()) {
                    available = true;
                    break;
                }
            }

            if (!available) {
                throw new Error("Não foi possível gerar um arroba disponível.");
            }

            const profile = {
                uid: user.uid,
                displayName: user.displayName || "User",
                username,
                usernameLower: username,
                bio: "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            transaction.set(userRef, profile);

            transaction.set(usernameRef, {
                uid: user.uid
            });

            return profile;
        });
    }

    async function saveProfile(displayName, username, bio) {

        const user = auth.currentUser;

        if (!user) {
            throw new Error("Você precisa entrar na sua conta.");
        }

        displayName = displayName.trim();
        username = username.trim().toLowerCase().replace(/^@/, "");
        bio = bio.trim();

        validateProfile(displayName, username, bio);

        const userRef = doc(db, "users", user.uid);

        await runTransaction(db, async transaction => {

            const userSnapshot = await transaction.get(userRef);

            if (!userSnapshot.exists()) {
                throw new Error("Seu perfil ainda não foi criado. Tente novamente.");
            }

            const oldProfile = userSnapshot.data();
            const oldUsername = oldProfile.username;

            const newUsernameRef = doc(db, "usernames", username);

            const newUsernameSnapshot = username === oldUsername
                ? null
                : await transaction.get(newUsernameRef);

            if (
                newUsernameSnapshot?.exists() &&
                newUsernameSnapshot.data().uid !== user.uid
            ) {
                throw new Error("Este arroba já está sendo utilizado.");
            }

            const oldUsernameRef = oldUsername
                ? doc(db, "usernames", oldUsername)
                : null;

            if (oldUsernameRef && oldUsername !== username) {
                const oldUsernameSnapshot = await transaction.get(oldUsernameRef);

                if (
                    oldUsernameSnapshot.exists() &&
                    oldUsernameSnapshot.data().uid === user.uid
                ) {
                    transaction.delete(oldUsernameRef);
                }
            }

            if (oldUsername !== username) {
                transaction.set(newUsernameRef, {
                    uid: user.uid
                });
            }

            transaction.update(userRef, {
                displayName,
                username,
                usernameLower: username,
                bio,
                updatedAt: serverTimestamp()
            });
        });

        return { displayName, username, bio };
    }

    function renderProfile(profile, isOwner) {

        content.replaceChildren();

        if (!profile) {
            content.textContent = "Perfil não encontrado.";
            editButton.hidden = true;
            return;
        }

        const card = document.createElement("div");
        card.className = "profile-card";

        const avatar = document.createElement("div");
        avatar.className = "profile-avatar";
        avatar.textContent = (profile.displayName || "?")
            .charAt(0).toUpperCase();

        const name = document.createElement("h2");
        name.textContent = profile.displayName || "User";

        const username = document.createElement("p");
        username.className = "profile-username";
        username.textContent = `@${profile.username || "user"}`;

        const bio = document.createElement("p");
        bio.className = "profile-bio";
        bio.textContent = profile.bio || "Nenhuma bio adicionada.";

        const label = document.createElement("span");
        label.className = "profile-label";
        label.textContent = isOwner ? "SEU PERFIL" : "PERFIL PÚBLICO";

        card.append(label, avatar, name, username, bio);
        content.appendChild(card);

        editButton.hidden = !isOwner;
    }

    function openEditor() {

        if (!auth.currentUser || !currentProfile) return;

        errorElement.textContent = "";

        displayNameInput.value = currentProfile.displayName || "";
        usernameInput.value = currentProfile.username || "";
        bioInput.value = currentProfile.bio || "";

        editor.showModal();
    }

    async function openProfile(uid) {

        if (!uid) return;

        viewedUid = uid;

        if (profileListener) {
            profileListener();
            profileListener = null;
        }

        const isOwner = auth.currentUser?.uid === uid;

        content.textContent = "Carregando perfil...";
        editButton.hidden = true;

        if (profileButton.dataset.navigation !== "ready") {
            profileButton.dataset.navigation = "ready";
        }

        document.querySelector('[data-page="profile"]')?.click();

        profileListener = onSnapshot(
            doc(db, "users", uid),
            snapshot => {

                if (!snapshot.exists()) {
                    renderProfile(null, false);
                    return;
                }

                const profile = snapshot.data();

                if (isOwner) {
                    currentProfile = profile;
                }

                renderProfile(profile, isOwner);
            },
            error => {
                console.error("Profile loading error:", error);
                content.textContent = "Não foi possível carregar este perfil.";
            }
        );
    }

    profileButton.addEventListener("click", () => {
        if (auth.currentUser) {
            openProfile(auth.currentUser.uid);
        }
    });

    editButton.addEventListener("click", openEditor);

    closeButton.addEventListener("click", () => {
        editor.close();
    });

    editor.addEventListener("click", event => {
        if (event.target === editor) editor.close();
    });

    form.addEventListener("submit", async event => {

        event.preventDefault();
        errorElement.textContent = "";

        const submitButton = form.querySelector('[type="submit"]');
        submitButton.disabled = true;

        try {

            const profile = await saveProfile(
                displayNameInput.value,
                usernameInput.value,
                bioInput.value
            );

            currentProfile = {
                ...currentProfile,
                ...profile
            };

            editor.close();
            renderProfile(currentProfile, true);

            // Mantém o nome atualizado no Firebase Authentication.
            await updateProfile(auth.currentUser, {
                displayName: profile.displayName
            });

            await updateProfile(auth.currentUser, {
                displayName: profile.displayName
            });

        } catch (error) {

            console.error("Profile update error:", error);
            errorElement.textContent = error.message || "Não foi possível salvar.";

        } finally {
            submitButton.disabled = false;
        }
    });

    window.addEventListener("mrgreen:view-profile", event => {
        openProfile(event.detail?.uid);
    });

    onSnapshot(
        auth.currentUser
            ? doc(db, "users", auth.currentUser.uid)
            : doc(db, "users", "__none__"),
        () => { }
    );

    import {
        onAuthStateChanged,
        updateProfile
    } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

    onAuthStateChanged(auth, async user => {

        const accountActions = accountBar?.querySelector(".account-actions");

        if (accountActions && !accountActions.contains(profileButton)) {
            accountActions.appendChild(profileButton);
        }

        profileButton.hidden = !user;

        if (!user) {
            currentProfile = null;
            viewedUid = null;

            if (profileListener) {
                profileListener();
                profileListener = null;
            }

            content.textContent = "Entre para visualizar seu perfil.";
            editButton.hidden = true;
            return;
        }

        try {
            currentProfile = await ensureProfile(user);
            openProfile(user.uid);
        } catch (error) {
            console.error("Profile initialization error:", error);
        }
    });

    return {
        openProfile,
        saveProfile
    };
}
