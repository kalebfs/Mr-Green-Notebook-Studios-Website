
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

export function initComments({ auth, db, adminUid, getLanguage }) {
    let currentUser = null;

    const listeners = new Map();
    const profileListeners = new Map();
    const authorElements = new Map();

    const translations = {
        pt: {
            login: "Entrar",
            register: "Criar conta",
            logout: "Sair",
            guest: "Você está navegando como visitante.",
            logged: "Conectado como",
            comments: "Comentários",
            noComments: "Nenhum comentário ainda. Seja o primeiro!",
            placeholder: "Escreva um comentário...",
            send: "Publicar",
            delete: "Excluir",
            email: "E-mail",
            password: "Senha",
            username: "Nome de usuário",
            loginTitle: "Entrar na conta",
            registerTitle: "Criar uma conta",
            error: "Ocorreu um erro. Tente novamente."
        },
        en: {
            login: "Log in",
            register: "Create account",
            logout: "Log out",
            guest: "You are browsing as a guest.",
            logged: "Logged in as",
            comments: "Comments",
            noComments: "No comments yet. Be the first!",
            placeholder: "Write a comment...",
            send: "Post",
            delete: "Delete",
            email: "Email",
            password: "Password",
            username: "Username",
            loginTitle: "Log in",
            registerTitle: "Create an account",
            error: "Something went wrong. Try again."
        }
    };

    function t(key) {
        const lang = getLanguage() === "en" ? "en" : "pt";
        return translations[lang][key] || key;
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    function createButton(text, className, callback) {
        const button = createElement("button", className, text);
        button.type = "button";
        button.addEventListener("click", callback);
        return button;
    }

    // Abre o perfil do autor do comentário.
    function openAuthorProfile(uid) {
        if (!uid) return;

        // Dispara o evento utilizado pelo profiles.js.
        document.dispatchEvent(
            new CustomEvent("mrgreen:view-profile", {
                detail: { uid }
            })
        );
    }

    // Atualiza o nome e a foto dos autores em tempo real.
    function watchCommentAuthor(uid, authorElement) {
        if (!uid || !authorElement) return;

        if (!authorElements.has(uid)) {
            authorElements.set(uid, new Set());
        }

        authorElements.get(uid).add(authorElement);

        if (profileListeners.has(uid)) return;

        const profileRef = doc(db, "users", uid);

        const unsubscribe = onSnapshot(profileRef, snapshot => {
            const profile = snapshot.exists()
                ? snapshot.data()
                : {};

            const username = profile.username || "user";
            const photoURL = profile.photoURL || "";

            const elements = authorElements.get(uid);

            if (!elements) return;

            elements.forEach(element => {
                if (!element.isConnected) {
                    elements.delete(element);
                    return;
                }

                const avatar = element.querySelector(".comment-avatar");
                const usernameElement = element.querySelector(
                    ".comment-author-username"
                );

                if (!avatar || !usernameElement) return;

                // Somente o @username é exibido.
                usernameElement.textContent = `@${username}`;

                // Atualiza a foto.
                avatar.replaceChildren();

                if (photoURL) {
                    const image = document.createElement("img");

                    image.src = photoURL;
                    image.alt = "Foto de perfil";

                    image.onerror = () => {
                        image.remove();
                        avatar.textContent =
                            username.charAt(0).toUpperCase() || "U";
                    };

                    avatar.appendChild(image);
                } else {
                    avatar.textContent =
                        username.charAt(0).toUpperCase() || "U";
                }
            });
        }, error => {
            console.error("Erro ao carregar perfil do autor:", error);
        });

        profileListeners.set(uid, unsubscribe);
    }

    function showDialog(title, fields, submitText, onSubmit) {
        const overlay = createElement("div", "comments-modal-overlay");
        const modal = createElement("form", "comments-modal");

        const heading = createElement("h2", "", title);

        const close = createButton(
            "×",
            "comments-modal-close",
            () => overlay.remove()
        );

        const header = createElement("div", "comments-modal-header");
        header.append(heading, close);
        modal.appendChild(header);

        const inputs = {};

        fields.forEach(field => {
            const label = createElement("label", "comments-field");
            label.textContent = field.label;

            const input = createElement("input", "comments-input");
            input.type = field.type;
            input.placeholder = field.label;
            input.required = true;
            input.autocomplete = field.autocomplete || "off";

            label.appendChild(input);
            modal.appendChild(label);

            inputs[field.name] = input;
        });

        const error = createElement("p", "comments-error");

        const submit = createElement("button", "comments-submit", submitText);
        submit.type = "submit";

        modal.append(error, submit);

        modal.addEventListener("submit", async event => {
            event.preventDefault();

            error.textContent = "";
            submit.disabled = true;

            try {
                const values = Object.fromEntries(
                    Object.entries(inputs).map(([key, input]) => [
                        key,
                        input.value.trim()
                    ])
                );

                await onSubmit(values);
                overlay.remove();
            } catch (err) {
                console.error(err);
                error.textContent = err.message || t("error");
                submit.disabled = false;
            }
        });

        overlay.addEventListener("click", event => {
            if (event.target === overlay) overlay.remove();
        });

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    function openLogin() {
        showDialog(
            t("loginTitle"),
            [
                {
                    name: "email",
                    label: t("email"),
                    type: "email",
                    autocomplete: "email"
                },
                {
                    name: "password",
                    label: t("password"),
                    type: "password",
                    autocomplete: "current-password"
                }
            ],
            t("login"),
            async values => {
                await signInWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                );
            }
        );
    }

    function openRegister() {
        showDialog(
            t("registerTitle"),
            [
                {
                    name: "username",
                    label: t("username"),
                    type: "text",
                    autocomplete: "nickname"
                },
                {
                    name: "email",
                    label: t("email"),
                    type: "email",
                    autocomplete: "email"
                },
                {
                    name: "password",
                    label: t("password"),
                    type: "password",
                    autocomplete: "new-password"
                }
            ],
            t("register"),
            async values => {
                if (values.username.length < 2 || values.username.length > 40) {
                    throw new Error(
                        "O nome deve ter entre 2 e 40 caracteres."
                    );
                }

                if (values.password.length < 6) {
                    throw new Error(
                        "A senha precisa ter pelo menos 6 caracteres."
                    );
                }

                const result = await createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                );

                await updateProfile(result.user, {
                    displayName: values.username
                });
            }
        );
    }

    const accountBar = createElement("div", "account-bar");
    const accountInfo = createElement("div", "account-info");
    const accountActions = createElement("div", "account-actions");

    accountBar.append(accountInfo, accountActions);

    function renderAccount() {
        accountInfo.replaceChildren();
        accountActions.replaceChildren();

        if (currentUser) {
            accountInfo.appendChild(
                createElement(
                    "span",
                    "account-status",
                    `${t("logged")}: ${currentUser.displayName || "User"}`
                )
            );

            accountActions.appendChild(
                createButton(
                    t("logout"),
                    "account-button logout-button",
                    async () => {
                        await signOut(auth);
                    }
                )
            );
        } else {
            accountInfo.appendChild(
                createElement("span", "account-status", t("guest"))
            );

            accountActions.append(
                createButton(t("login"), "account-button", openLogin),
                createButton(
                    t("register"),
                    "account-button register-button",
                    openRegister
                )
            );
        }
    }

    function getCollection(type, id) {
        return collection(db, type, id, "comments");
    }

    function renderComments(type, id, card) {
        const listenerKey = `${type}_${id}`;

        if (listeners.has(listenerKey)) {
            listeners.get(listenerKey)();
            listeners.delete(listenerKey);
        }

        const commentsSection = createElement("section", "post-comments");

        const toggleButton = createButton(
            `${t("comments")} (0)`,
            "comments-toggle"
        );

        const commentsContent = createElement("div", "comments-content");
        commentsContent.hidden = true;

        toggleButton.addEventListener("click", () => {
            const isOpen = commentsContent.hidden;

            commentsContent.hidden = !isOpen;
            toggleButton.classList.toggle("comments-open", isOpen);
        });

        const heading = createElement(
            "h3",
            "comments-heading",
            t("comments")
        );

        const commentForm = createElement("form", "comment-form");

        const commentInput = createElement("textarea", "comment-input");
        commentInput.placeholder = t("placeholder");
        commentInput.maxLength = 1000;
        commentInput.rows = 3;
        commentInput.required = true;

        const submitButton = createButton(t("send"), "primary");
        submitButton.type = "submit";

        commentForm.append(commentInput, submitButton);

        const commentList = createElement("div", "comment-list");

        commentsContent.append(heading, commentForm, commentList);
        commentsSection.append(toggleButton, commentsContent);
        card.appendChild(commentsSection);

        const commentsCollection = getCollection(type, id);

        commentForm.addEventListener("submit", async event => {
            event.preventDefault();

            const user = auth.currentUser;

            if (!user) {
                alert("Você precisa estar conectado para comentar.");
                return;
            }

            const text = commentInput.value.trim();

            if (!text) return;

            try {
                submitButton.disabled = true;
                submitButton.textContent = "Publicando...";

                await addDoc(commentsCollection, {
                    text,
                    authorUid: user.uid,
                    authorName: user.displayName || "User",
                    createdAt: serverTimestamp()
                });

                commentInput.value = "";
            } catch (error) {
                console.error("Erro ao publicar comentário:", error);
                alert("Não foi possível publicar o comentário.");
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = t("send");
            }
        });

        const commentsQuery = query(
            commentsCollection,
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(commentsQuery, snapshot => {
            commentList.replaceChildren();

            heading.textContent = `${t("comments")} (${snapshot.size})`;
            toggleButton.textContent = `${t("comments")} (${snapshot.size})`;

            if (snapshot.empty) {
                commentList.appendChild(
                    createElement("p", "comments-empty", t("noComments"))
                );

                return;
            }

            snapshot.forEach(commentDoc => {
                const comment = commentDoc.data();

                const commentItem = createElement("article", "comment-item");
                const commentHeader = createElement("div", "comment-header");

                // Botão do autor: foto + @username.
                const author = createElement("button", "comment-author");
                author.type = "button";
                author.title = "Ver perfil";

                const avatar = createElement("span", "comment-avatar");
                avatar.textContent = "U";

                const authorInfo = createElement(
                    "span",
                    "comment-author-info"
                );

                const username = createElement(
                    "span",
                    "comment-author-username",
                    "@user"
                );

                authorInfo.appendChild(username);
                author.append(avatar, authorInfo);

                // Busca username e foto no documento users/{uid}.
                if (comment.authorUid) {
                    watchCommentAuthor(comment.authorUid, author);
                }

                // Clicar no nome ou na foto abre o perfil.
                author.addEventListener("click", () => {
                    openAuthorProfile(comment.authorUid);
                });

                commentHeader.appendChild(author);

                // Verificação: autor do comentário ou administrador.
                const canDelete =
                    currentUser &&
                    (
                        currentUser.uid === comment.authorUid ||
                        currentUser.uid === adminUid
                    );

                if (canDelete) {
                    const deleteButton = createButton(
                        t("delete"),
                        "comment-delete"
                    );

                    deleteButton.addEventListener("click", async () => {
                        if (!confirm(
                            "Tem certeza que deseja excluir este comentário?"
                        )) {
                            return;
                        }

                        try {
                            await deleteDoc(
                                doc(db, type, id, "comments", commentDoc.id)
                            );
                        } catch (error) {
                            console.error(
                                "Erro ao excluir comentário:",
                                error
                            );

                            alert("Não foi possível excluir o comentário.");
                        }
                    });

                    commentHeader.appendChild(deleteButton);
                }

                const commentText = createElement(
                    "p",
                    "comment-text",
                    comment.text || ""
                );

                commentItem.append(commentHeader, commentText);
                commentList.appendChild(commentItem);
            });
        }, error => {
            console.error("Erro ao carregar comentários:", error);

            commentList.replaceChildren();

            commentList.appendChild(
                createElement(
                    "p",
                    "comments-error",
                    "Não foi possível carregar os comentários."
                )
            );
        });

        listeners.set(listenerKey, unsubscribe);

        return commentsSection;
    }

    function refreshLanguage() {
        renderAccount();
    }

    onAuthStateChanged(auth, user => {
        currentUser = user;
        renderAccount();
    });

    renderAccount();

    return {
        renderComments,
        refreshLanguage,
        accountBar
    };
}
