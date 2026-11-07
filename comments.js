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

export function initComments({
    auth,
    db,
    adminUid,
    postsList,
    getLanguage
}) {
    let currentUser = null;

    const commentListeners = new Map();
    const postElements = new Map();

    const accountBar = document.createElement("div");
    accountBar.className = "account-bar";

    const accountInfo = document.createElement("div");
    accountInfo.className = "account-info";

    const accountActions = document.createElement("div");
    accountActions.className = "account-actions";

    accountBar.append(accountInfo, accountActions);

    postsList.parentElement.insertBefore(accountBar, postsList);

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
            cancel: "Cancelar",
            loginTitle: "Entrar na conta",
            registerTitle: "Criar uma conta",
            loginRequired: "Entre na sua conta para comentar.",
            empty: "Escreva um comentário antes de publicar.",
            error: "Ocorreu um erro. Tente novamente.",
            accountCreated: "Conta criada com sucesso!"
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
            cancel: "Cancel",
            loginTitle: "Log in",
            registerTitle: "Create an account",
            loginRequired: "Log in to comment.",
            empty: "Write a comment before posting.",
            error: "Something went wrong. Try again.",
            accountCreated: "Account created successfully!"
        }
    };

    function t(key) {
        const lang = getLanguage() === "en" ? "en" : "pt";
        return translations[lang][key] || key;
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function createButton(text, className, callback) {
        const button = createElement("button", className, text);
        button.type = "button";
        button.addEventListener("click", callback);
        return button;
    }

    function showDialog(title, fields, submitText, onSubmit) {
        const overlay = createElement("div", "comments-modal-overlay");
        const modal = createElement("form", "comments-modal");

        const heading = createElement("h2", "", title);
        const closeButton = createButton("×", "comments-modal-close", () => {
            overlay.remove();
        });

        const header = createElement("div", "comments-modal-header");
        header.append(heading, closeButton);

        const inputs = {};

        modal.appendChild(header);

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
                await onSubmit(
                    Object.fromEntries(
                        Object.entries(inputs).map(([key, input]) => [
                            key,
                            input.value.trim()
                        ])
                    )
                );

                overlay.remove();
            } catch (err) {
                console.error(err);
                error.textContent = err.message || t("error");
                submit.disabled = false;
            }
        });

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                overlay.remove();
            }
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

    function renderAccount() {
        accountInfo.replaceChildren();
        accountActions.replaceChildren();

        if (currentUser) {
            const name = currentUser.displayName ||
                currentUser.email ||
                "User";

            accountInfo.appendChild(
                createElement("span", "account-status",
                    `${t("logged")}: ${name}`)
            );

            accountActions.appendChild(
                createButton(t("logout"), "account-button logout-button", async () => {
                    await signOut(auth);
                })
            );
        } else {
            accountInfo.appendChild(
                createElement("span", "account-status", t("guest"))
            );

            accountActions.append(
                createButton(t("login"), "account-button", openLogin),
                createButton(t("register"), "account-button register-button", openRegister)
            );
        }
    }

    function renderPostComments(postId, card) {
        postElements.set(postId, card);

        let section = card.querySelector(".post-comments");

        if (!section) {
            section = createElement("section", "post-comments");
            card.appendChild(section);
        }

        section.replaceChildren();

        const heading = createElement("h3", "comments-heading", t("comments"));
        section.appendChild(heading);

        if (currentUser) {
            const form = createElement("form", "comment-form");

            const textarea = createElement("textarea", "comment-input");
            textarea.placeholder = t("placeholder");
            textarea.maxLength = 1000;
            textarea.required = true;
            textarea.rows = 3;

            const submit = createElement("button", "comment-submit", t("send"));
            submit.type = "submit";

            form.append(textarea, submit);

            form.addEventListener("submit", async event => {
                event.preventDefault();

                const text = textarea.value.trim();

                if (!text) {
                    alert(t("empty"));
                    return;
                }

                submit.disabled = true;

                try {
                    await addDoc(
                        collection(db, "posts", postId, "comments"),
                        {
                            text: text,
                            authorUid: currentUser.uid,
                            authorName: currentUser.displayName ||
                                currentUser.email ||
                                "User",
                            createdAt: serverTimestamp()
                        }
                    );

                    textarea.value = "";
                } catch (error) {
                    console.error(error);
                    alert(t("error"));
                }

                submit.disabled = false;
            });

            section.appendChild(form);
        } else {
            const message = createElement(
                "p",
                "comments-login-message",
                t("loginRequired")
            );

            section.appendChild(message);
        }

        const list = createElement("div", "comments-list");
        section.appendChild(list);

        if (!commentListeners.has(postId)) {
            const commentsQuery = query(
                collection(db, "posts", postId, "comments"),
                orderBy("createdAt", "asc")
            );

            const unsubscribe = onSnapshot(
                commentsQuery,
                snapshot => {
                    list.replaceChildren();

                    if (snapshot.empty) {
                        list.appendChild(
                            createElement("p", "comments-empty", t("noComments"))
                        );
                        return;
                    }

                    snapshot.forEach(commentDoc => {
                        const comment = commentDoc.data();

                        const item = createElement("div", "comment-item");

                        const header = createElement("div", "comment-header");

                        const author = createElement(
                            "strong",
                            "comment-author",
                            comment.authorName || "User"
                        );

                        header.appendChild(author);

                        const canDelete = currentUser && (
                            currentUser.uid === comment.authorUid ||
                            currentUser.uid === adminUid
                        );

                        if (canDelete) {
                            const deleteButton = createButton(
                                t("delete"),
                                "comment-delete",
                                async () => {
                                    const confirmed = confirm(
                                        getLanguage() === "en"
                                            ? "Delete this comment?"
                                            : "Excluir este comentário?"
                                    );

                                    if (!confirmed) return;

                                    try {
                                        await deleteDoc(
                                            doc(
                                                db,
                                                "posts",
                                                postId,
                                                "comments",
                                                commentDoc.id
                                            )
                                        );
                                    } catch (error) {
                                        console.error(error);
                                        alert(t("error"));
                                    }
                                }
                            );

                            header.appendChild(deleteButton);
                        }

                        const content = createElement(
                            "p",
                            "comment-text",
                            comment.text || ""
                        );

                        item.append(header, content);
                        list.appendChild(item);
                    });
                },
                error => {
                    console.error("Erro ao carregar comentários:", error);
                    list.replaceChildren(
                        createElement("p", "comments-error",
                            "Não foi possível carregar os comentários.")
                    );
                }
            );

            commentListeners.set(postId, unsubscribe);
        }
    }

    function stopCommentListeners() {
        commentListeners.forEach(unsubscribe => unsubscribe());
        commentListeners.clear();
        postElements.clear();
    }

    function refreshLanguage() {
        renderAccount();

        postElements.forEach((card, postId) => {
            renderPostComments(postId, card);
        });
    }

    onAuthStateChanged(auth, user => {
        currentUser = user;

        renderAccount();

        postElements.forEach((card, postId) => {
            renderPostComments(postId, card);
        });
    });

    renderAccount();

    return {
        renderPostComments,
        stopCommentListeners,
        refreshLanguage
    };
}