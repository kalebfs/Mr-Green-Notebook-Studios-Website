
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-storage.js";

/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
    apiKey: "AIzaSyADRGeBqk6dXcfO5dta9rd-V0mnzTn6cfg",
    authDomain: "mr-green-notebook-studios.firebaseapp.com",
    projectId: "mr-green-notebook-studios",
    storageBucket: "mr-green-notebook-studios.firebasestorage.app",
    messagingSenderId: "256162765324",
    appId: "1:256162765324:web:25ec3353400d337fb06c29"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const ADMIN_UID = "Qouhq47ZojcixHwiXkfmXwfT2xe2";

/* =========================
   TRANSLATIONS
========================= */

const translations = {
    pt: {
        navHome: "Início",
        navMods: "Mods",
        navRemakes: "Remakes",
        navGames: "Jogos",
        navUpdates: "Atualizações",
        navPosts: "Posts",
        navAbout: "Sobre",

        heroEyebrow: "ESTÚDIO INDEPENDENTE • DESDE 2026",
        heroText: "Um universo de jogos, mods e remakes. Explore nossos projetos, acompanhe novidades e descubra o que está sendo desenvolvido.",
        explore: "EXPLORAR PROJETOS",
        aboutButton: "CONHECER O ESTÚDIO",

        featured: "Projetos em destaque",
        featuredSub: "Uma seleção dos nossos projetos.",

        modsTitle: "Mods",
        modsIntro: "Modificações, novas ideias e experiências diferentes para jogos.",

        remakesTitle: "Remakes",
        remakesIntro: "Projetos inspirados em jogos que marcaram época, recriados com ideias e identidade próprias.",

        gamesTitle: "Jogos",
        gamesIntro: "Conheça os jogos originais desenvolvidos pelo estúdio.",

        updatesTitle: "Atualizações",
        updatesIntro: "Novidades, anúncios e registros do desenvolvimento.",

        postsTitle: "Posts",
        postsIntro: "Notícias, novidades e publicações do estúdio.",
        createPost: "+ Criar post",
        noPosts: "Ainda não existem publicações.",
        uploadImage: "Escolher imagem",
        publishPost: "Publicar",
        publishingPost: "Publicando...",
        postTitlePlaceholder: "Digite o título...",
        postDescriptionPlaceholder: "Escreva sua publicação...",
        postImageError: "Formato de imagem não permitido.",
        postSizeError: "A imagem deve ter no máximo 10 MB.",
        postPermissionError: "Você não tem permissão para publicar.",
        postPublishError: "Não foi possível publicar. Verifique o Firebase.",
        postLoadingError: "Não foi possível carregar as publicações.",

        updateOneTitle: "O site do Mr Green Notebook Studios foi criado!",
        updateOneText: "Esta é a primeira versão do portal. Em breve, mais projetos e novidades serão adicionados.",

        updateTwoTitle: "Mais novidades chegando",
        updateTwoText: "Acompanhe esta página para conhecer os próximos lançamentos.",

        comingSoon: "EM BREVE",

        aboutTitle: "Sobre o estúdio",
        aboutHeading: "Criatividade em cada projeto.",
        aboutText: "Mr Green Notebook Studios é um espaço independente para criar jogos, mods e remakes. Este site reúne os projetos em um só lugar e será atualizado conforme novas experiências forem desenvolvidas.",

        contactHeading: "Contato e comunidade",
        contactText: "Adicione aqui seus links oficiais, como YouTube, Roblox ou outras redes. Não coloque informações pessoais privadas.",

        rights: "Todos os direitos reservados.",
        footer: "Feito com criatividade.",

        soon: "EM DESENVOLVIMENTO",
        empty: "Nenhum projeto adicionado aqui ainda.",

        downloadTitle: "Links para download:",
        download: "Download",
        comingSoonDownload: "Em breve",
        unavailable: "Não disponível",
        viewDetails: "Ver detalhes"
    },

    en: {
        navHome: "Home",
        navMods: "Mods",
        navRemakes: "Remakes",
        navGames: "Games",
        navUpdates: "Updates",
        navPosts: "Posts",
        navAbout: "About",

        heroEyebrow: "INDEPENDENT STUDIO • SINCE 2026",
        heroText: "A universe of games, mods and remakes. Explore our projects, follow the news and discover what is being developed.",
        explore: "EXPLORE PROJECTS",
        aboutButton: "ABOUT THE STUDIO",

        featured: "Featured projects",
        featuredSub: "A selection of our projects.",

        modsTitle: "Mods",
        modsIntro: "Modifications, new ideas and different experiences for games.",

        remakesTitle: "Remakes",
        remakesIntro: "Projects inspired by memorable games, recreated with original ideas and identity.",

        gamesTitle: "Games",
        gamesIntro: "Discover original games developed by the studio.",

        updatesTitle: "Updates",
        updatesIntro: "News, announcements and development logs.",

        postsTitle: "Posts",
        postsIntro: "News, announcements and studio publications.",
        createPost: "+ Create Post",
        noPosts: "There are no posts yet.",
        uploadImage: "Choose image",
        publishPost: "Publish",
        publishingPost: "Publishing...",
        postTitlePlaceholder: "Enter the title...",
        postDescriptionPlaceholder: "Write your post...",
        postImageError: "Image format not allowed.",
        postSizeError: "The image must be no larger than 10 MB.",
        postPermissionError: "You do not have permission to publish.",
        postPublishError: "Could not publish. Check Firebase.",
        postLoadingError: "Could not load posts.",

        updateOneTitle: "The Mr Green Notebook Studios website was created!",
        updateOneText: "This is the first version of the portal. More projects and news will be added soon.",

        updateTwoTitle: "More news coming soon",
        updateTwoText: "Check this page to discover upcoming releases.",

        comingSoon: "COMING SOON",

        aboutTitle: "About the studio",
        aboutHeading: "Creativity in every project.",
        aboutText: "Mr Green Notebook Studios is an independent space for creating games, mods and remakes. This website brings the projects together and will be updated as new experiences are developed.",

        contactHeading: "Contact and community",
        contactText: "Add your official links here, such as YouTube, Roblox or other social networks. Do not publish private personal information.",

        rights: "All rights reserved.",
        footer: "Made with creativity.",

        soon: "IN DEVELOPMENT",
        empty: "No projects added here yet.",

        downloadTitle: "Download links:",
        download: "Download",
        comingSoonDownload: "Coming Soon",
        unavailable: "Not available",
        viewDetails: "View Details"
    }
};

/* =========================
   PROJECTS
========================= */

const projects = [
    {
        name: "Baldi's Basics Remagined",
        type: "mods",
        icon: "",
        tag: "Mod",
        image: "images/baldi-mods.jpg",
        pc: "https://github.com/kalebfs/Mr-Green-Notebook-Studios-Website/releases/download/V1.6/baldi_s_basics_remagined_v16.rar",
        mobile: "NEVER",
        desc: {
            pt: "Uma nova experiência de Baldi’s Basics com modificadores.",
            en: "A new Baldi’s Basics experience with modifiers."
        }
    },

    {
        name: "Granny Redux",
        type: "remakes",
        icon: "",
        tag: "Remake",
        image: "images/granny-remake.jpg",
        pc: "",
        mobile: "",
        desc: {
            pt: "Um projeto de remake de terror em desenvolvimento.",
            en: "A horror remake project currently in development."
        }
    },

    {
        name: "Momo Horror Game Escape House Reunion",
        type: "games",
        icon: "",
        tag: "Game",
        image: "images/momo-horror.jpg",
        pc: "",
        mobile: "",
        desc: {
            pt: "Um jogo original de terror desenvolvido pelo estúdio.",
            en: "An original horror game developed by the studio."
        }
    }
];

/* =========================
   STATE
========================= */

let language = "pt";
let currentProjectIndex = null;
let isAdmin = false;
let latestUpdates = [];
let postPreviewURL = null;

const validPages = [
    "home",
    "mods",
    "remakes",
    "games",
    "updates",
    "posts",
    "about"
];

/* =========================
   ELEMENTS
========================= */

const dialog = document.getElementById("projectDialog");
const dialogImage = document.getElementById("dialogImage");
const dialogTitle = document.getElementById("dialogTitle");
const dialogCategory = document.getElementById("dialogCategory");
const dialogDescription = document.getElementById("dialogDescription");
const dialogDownloads = document.getElementById("dialogDownloads");

const langToggle = document.getElementById("langToggle");
const closeDialogButton = document.getElementById("closeDialog");

const adminLoginButton = document.getElementById("adminLoginButton");
const adminLogoutButton = document.getElementById("adminLogoutButton");
const createUpdateButton = document.getElementById("createUpdateButton");

const adminLoginDialog = document.getElementById("adminLoginDialog");
const updateEditorDialog = document.getElementById("updateEditorDialog");

const closeAdminLogin = document.getElementById("closeAdminLogin");
const closeUpdateEditor = document.getElementById("closeUpdateEditor");

const adminLoginForm = document.getElementById("adminLoginForm");
const updateForm = document.getElementById("updateForm");

const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");

const loginError = document.getElementById("loginError");
const updateError = document.getElementById("updateError");

const updateTitle = document.getElementById("updateTitle");
const updateDescription = document.getElementById("updateDescription");
const updateDate = document.getElementById("updateDate");

const updatesList = document.getElementById("updatesList");

/* POSTS ELEMENTS */

const createPostButton = document.getElementById("createPostButton");
const postEditorDialog = document.getElementById("postEditorDialog");
const postForm = document.getElementById("postForm");

const postTitle = document.getElementById("postTitle");
const postDescription = document.getElementById("postDescription");
const postImage = document.getElementById("postImage");
const postImagePreview = document.getElementById("postImagePreview");

const postError = document.getElementById("postError");
const publishPostButton = document.getElementById("publishPostButton");
const cancelPostButton = document.getElementById("cancelPostButton");

const postsList = document.getElementById("postsList");

/* =========================
   GENERAL HELPERS
========================= */

function getLocalDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function translate(key) {
    return translations[language][key] || key;
}

/* =========================
   SEASONAL THEMES
========================= */

function updateSeasonalTheme() {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    let theme = "green";

    if (month === 9) {
        theme = "orange";
    }

    if (month === 11 && day >= 1 && day <= 25) {
        theme = "christmas";
    }

    if (
        (month === 11 && day >= 30) ||
        (month === 0 && day <= 1)
    ) {
        theme = "newyear";
    }

    document.documentElement.dataset.theme = theme;

    const themeColors = {
        green: "#080d09",
        orange: "#120b06",
        christmas: "#fffafa",
        newyear: "#090909"
    };

    const themeColorMeta = document.querySelector(
        'meta[name="theme-color"]'
    );

    if (themeColorMeta) {
        themeColorMeta.setAttribute("content", themeColors[theme]);
    }
}

updateSeasonalTheme();
setInterval(updateSeasonalTheme, 60 * 1000);

/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId, updateHistory = true) {
    if (!validPages.includes(pageId)) {
        pageId = "home";
    }

    document.querySelectorAll(".page").forEach(section => {
        section.classList.toggle("active", section.id === pageId);
    });

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });

    if (updateHistory && location.hash !== `#${pageId}`) {
        history.pushState(null, "", `#${pageId}`);
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================
   PROJECT CARDS
========================= */


function createProjectCard(project, index) {
    const card = document.createElement("article");
    card.className = "card";

    const cover = document.createElement("div");
    cover.className = "cover";

    if (project.image) {
        const image = document.createElement("img");

        image.src = project.image;
        image.alt = project.name;
        image.loading = "lazy";
        image.onerror = () => image.remove();

        cover.appendChild(image);
    }

    if (project.icon && project.icon.trim() !== "") {
        const icon = document.createElement("span");

        icon.className = "cover-icon";
        icon.textContent = project.icon;

        cover.appendChild(icon);
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = project.tag;

    const title = document.createElement("h3");
    title.textContent = project.name;

    const description = document.createElement("p");
    description.textContent = project.desc[language];

    const footer = document.createElement("div");
    footer.className = "card-foot";

    // Only Granny Redux displays the development status.
    if (project.name === "granny redux") {
        const status = document.createElement("span");
        status.className = "status";
        status.textContent = `● ${translate("soon")}`;

        footer.appendChild(status);
    }

    const details = document.createElement("button");
    details.type = "button";
    details.className = "project-link";
    details.textContent = translate("viewDetails");

    details.addEventListener("click", () => {
        openProject(index);
    });

    footer.appendChild(details);

    body.append(tag, title, description, footer);
    card.append(cover, body);

    return card;
}


/* =========================
   RENDER PROJECTS
========================= */

function renderGrid(gridId, items) {
    const grid = document.getElementById(gridId);

    if (!grid) return;

    grid.replaceChildren();

    if (items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = translate("empty");

        grid.appendChild(empty);
        return;
    }

    items.forEach(item => {
        grid.appendChild(
            createProjectCard(item.project, item.index)
        );
    });
}

function renderProjects() {
    const indexedProjects = projects.map((project, index) => ({
        project,
        index
    }));

    renderGrid("featuredGrid", indexedProjects);

    renderGrid(
        "modsGrid",
        indexedProjects.filter(item => item.project.type === "mods")
    );

    renderGrid(
        "remakesGrid",
        indexedProjects.filter(item => item.project.type === "remakes")
    );

    renderGrid(
        "gamesGrid",
        indexedProjects.filter(item => item.project.type === "games")
    );
}

/* =========================
   DOWNLOAD BUTTONS
========================= */

function createDownloadButton(platform, url) {
    if (typeof url === "string" && url.trim().toLowerCase() === "never") {
        const unavailable = document.createElement("span");

        unavailable.className = "download-button disabled";
        unavailable.textContent = `${platform} — ${translate("unavailable")}`;

        return unavailable;
    }

    if (!url) {
        const unavailable = document.createElement("span");

        unavailable.className = "download-button disabled";
        unavailable.textContent = `${platform} — ${translate("comingSoonDownload")}`;

        return unavailable;
    }

    const link = document.createElement("a");

    link.className = "download-button";
    link.href = url;
    link.textContent = `${platform} — ${translate("download")}`;

    return link;
}

/* =========================
   PROJECT DETAILS
========================= */

function openProject(index) {
    const project = projects[index];

    if (!project || !dialog) return;

    currentProjectIndex = index;

    dialogTitle.textContent = project.name;
    dialogCategory.textContent = project.tag.toUpperCase();
    dialogDescription.textContent = project.desc[language];

    dialogImage.hidden = true;
    dialogImage.removeAttribute("src");

    dialogImage.onload = () => {
        dialogImage.hidden = false;
    };

    dialogImage.onerror = () => {
        dialogImage.hidden = true;
    };

    if (project.image) {
        dialogImage.src = project.image;
    }

    dialogDownloads.replaceChildren();

    dialogDownloads.append(
        createDownloadButton("PC", project.pc),
        createDownloadButton("Mobile", project.mobile)
    );

    if (!dialog.open) {
        dialog.showModal();
    }
}

function closeProject() {
    if (dialog?.open) {
        dialog.close();
    }

    currentProjectIndex = null;
}

closeDialogButton?.addEventListener("click", closeProject);

dialog?.addEventListener("click", event => {
    if (event.target === dialog) {
        closeProject();
    }
});

/* =========================
   ADMIN LOGIN
========================= */

adminLoginButton?.addEventListener("click", () => {
    loginError.textContent = "";
    adminLoginDialog.showModal();
});

closeAdminLogin?.addEventListener("click", () => {
    adminLoginDialog.close();
});

adminLoginDialog?.addEventListener("click", event => {
    if (event.target === adminLoginDialog) {
        adminLoginDialog.close();
    }
});

adminLoginForm?.addEventListener("submit", async event => {
    event.preventDefault();
    loginError.textContent = "";

    try {
        const result = await signInWithEmailAndPassword(
            auth,
            adminEmail.value.trim(),
            adminPassword.value
        );

        if (result.user.uid !== ADMIN_UID) {
            await signOut(auth);
            throw new Error("Unauthorized account.");
        }

        adminLoginForm.reset();
        adminLoginDialog.close();

    } catch (error) {
        console.error("Admin login error:", error);

        loginError.textContent =
            "Login failed. Check your email and password.";
    }
});

/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(auth, user => {
    isAdmin = !!user && user.uid === ADMIN_UID;

    if (adminLoginButton) {
        adminLoginButton.hidden = isAdmin;
    }

    if (createUpdateButton) {
        createUpdateButton.hidden = !isAdmin;
    }

    if (createPostButton) {
        createPostButton.hidden = !isAdmin;
    }

    if (adminLogoutButton) {
        adminLogoutButton.hidden = !isAdmin;
    }

    // Atualiza os botões de deletar
    renderFirestoreUpdates();
    renderLatestPosts();
});

/* =========================
   ADMIN LOGOUT
========================= */

adminLogoutButton?.addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout error:", error);
    }
});

/* =========================
   CREATE UPDATE
========================= */

createUpdateButton?.addEventListener("click", () => {
    updateError.textContent = "";
    updateDate.value = getLocalDate();
    updateEditorDialog.showModal();
});

closeUpdateEditor?.addEventListener("click", () => {
    updateEditorDialog.close();
});

updateEditorDialog?.addEventListener("click", event => {
    if (event.target === updateEditorDialog) {
        updateEditorDialog.close();
    }
});

/* =========================
   PUBLISH UPDATE
========================= */

updateForm?.addEventListener("submit", async event => {
    event.preventDefault();
    updateError.textContent = "";

    if (!auth.currentUser || auth.currentUser.uid !== ADMIN_UID) {
        updateError.textContent = "Administrator access required.";
        return;
    }

    try {
        await addDoc(collection(db, "updates"), {
            title: updateTitle.value.trim(),
            description: updateDescription.value.trim(),
            date: updateDate.value,
            createdAt: serverTimestamp()
        });

        updateForm.reset();
        updateEditorDialog.close();

    } catch (error) {
        console.error("Update publishing error:", error);

        updateError.textContent =
            "Could not publish. Check Firebase permissions.";
    }
});

/* =========================
   DATE FORMATTING
========================= */

function formatUpdateDate(dateString) {
    if (!dateString) return "";

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);

    if (!match) return dateString;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(year, month - 1, day, 12);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    if (language === "pt") {
        const monthName = new Intl.DateTimeFormat("pt-BR", {
            month: "short"
        }).format(date).replace(/\./g, "");

        return `${String(day).padStart(2, "0")} ${monthName} ${year}`.toUpperCase();
    }

    const monthName = new Intl.DateTimeFormat("en-US", {
        month: "short"
    }).format(date);

    return `${monthName.toUpperCase()} ${String(day).padStart(2, "0")} ${year}`;
}

/* =========================
   FIRESTORE UPDATES
========================= */

function renderFirestoreUpdates() {
    if (!updatesList) return;

    updatesList
        .querySelectorAll("[data-firestore-update]")
        .forEach(element => element.remove());

    latestUpdates.forEach(update => {
        const article = document.createElement("article");
        article.className = "update";
        article.dataset.firestoreUpdate = "true";

        const time = document.createElement("time");
        time.textContent = formatUpdateDate(update.date);

        const title = document.createElement("h3");
        title.textContent = update.title || "";

        const description = document.createElement("p");
        description.textContent = update.description || "";

        article.append(time, title, description);

        if (isAdmin) {
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", async () => {
                const confirmed = confirm(
                    "Are you sure you want to delete this update?"
                );

                if (!confirmed) return;

                try {
                    await deleteDoc(doc(db, "updates", update.id));
                } catch (error) {
                    console.error("Update deletion error:", error);

                    alert("Could not delete this update. Check Firebase permissions.");
                }
            });

            article.appendChild(deleteButton);
        }

        updatesList.appendChild(article);
    });
}

const updatesQuery = query(
    collection(db, "updates"),
    orderBy("createdAt", "desc")
);

onSnapshot(
    updatesQuery,
    snapshot => {
        latestUpdates = snapshot.docs.map(document => ({
            id: document.id,
            ...document.data()
        }));

        renderFirestoreUpdates();
    },
    error => {
        console.error("Could not load updates:", error);
    }
);

/* =========================
   POSTS: IMAGE SETTINGS
========================= */

const allowedImageTypes = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/avif"
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/* =========================
   POSTS: OPEN EDITOR
========================= */

createPostButton?.addEventListener("click", () => {
    if (!isAdmin) return;

    postError.textContent = "";
    postForm.reset();

    postImagePreview.hidden = true;
    postImagePreview.removeAttribute("src");

    postEditorDialog.showModal();
});

/* =========================
   POSTS: CANCEL
========================= */

cancelPostButton?.addEventListener("click", () => {
    postEditorDialog.close();
});

postEditorDialog?.addEventListener("click", event => {
    if (event.target === postEditorDialog) {
        postEditorDialog.close();
    }
});

/* =========================
   POSTS: IMAGE PREVIEW
========================= */

postImage?.addEventListener("change", () => {
    const file = postImage.files[0];

    postError.textContent = "";
    postImagePreview.hidden = true;
    postImagePreview.removeAttribute("src");

    if (postPreviewURL) {
        URL.revokeObjectURL(postPreviewURL);
        postPreviewURL = null;
    }

    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
        postError.textContent = translate("postImageError");
        postImage.value = "";
        return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
        postError.textContent = translate("postSizeError");
        postImage.value = "";
        return;
    }

    postPreviewURL = URL.createObjectURL(file);
    postImagePreview.src = postPreviewURL;
    postImagePreview.hidden = false;
});

/* =========================
   POSTS: PUBLISH
========================= */

postForm?.addEventListener("submit", async event => {
    event.preventDefault();

    postError.textContent = "";

    const user = auth.currentUser;

    if (!user || user.uid !== ADMIN_UID) {
        postError.textContent = translate("postPermissionError");
        return;
    }

    const title = postTitle.value.trim();
    const description = postDescription.value.trim();
    const imageFile = postImage.files[0];

    if (!title || !description) {
        postError.textContent = "Preencha o título e a descrição.";
        return;
    }

    if (imageFile && !allowedImageTypes.includes(imageFile.type)) {
        postError.textContent = translate("postImageError");
        return;
    }

    if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
        postError.textContent = translate("postSizeError");
        return;
    }

    publishPostButton.disabled = true;
    publishPostButton.textContent = translate("publishingPost");

    try {
        let imageUrl = "";

        // Upload image
        if (imageFile) {
            const safeName = imageFile.name.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );

            const imageReference = storageRef(
                storage,
                `posts/${user.uid}/${Date.now()}_${safeName}`
            );

            await uploadBytes(imageReference, imageFile, {
                contentType: imageFile.type
            });

            imageUrl = await getDownloadURL(imageReference);
        }

        // Save post in Firestore
        const postReference = await addDoc(
            collection(db, "posts"),
            {
                title: title,
                description: description,
                imageUrl: imageUrl,
                date: getLocalDate(),
                createdAt: serverTimestamp(),
                author: user.uid
            }
        );

        console.log("Post published successfully:", postReference.id);

        postForm.reset();

        postImagePreview.hidden = true;
        postImagePreview.removeAttribute("src");

        if (postPreviewURL) {
            URL.revokeObjectURL(postPreviewURL);
            postPreviewURL = null;
        }

        postEditorDialog.close();

    } catch (error) {
        console.error("Post publishing error:", error);

        postError.textContent =
            "Error: " + (error.code || error.message || "Unknown Firebase error");

    } finally {
        publishPostButton.disabled = false;
        publishPostButton.textContent = translate("publishPost");
    }
});

/* =========================
   POSTS: RENDER
========================= */

function renderPosts(posts) {
    if (!postsList) return;

    postsList.replaceChildren();

    if (posts.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = translate("noPosts");

        postsList.appendChild(empty);
        return;
    }

    posts.forEach(post => {
        const data = post.data();

        const card = document.createElement("article");
        card.className = "post-card";

        if (data.imageUrl) {
            const image = document.createElement("img");

            image.src = data.imageUrl;
            image.alt = data.title || "Post image";
            image.loading = "lazy";

            card.appendChild(image);
        }

        const date = document.createElement("time");
        date.className = "post-date";
        date.textContent = formatUpdateDate(data.date);

        const title = document.createElement("h2");
        title.textContent = data.title || "";

        const description = document.createElement("p");
        description.textContent = data.description || "";

        card.append(date, title, description);

        // ADMIN DELETE BUTTON
        if (isAdmin) {
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", async () => {
                const confirmed = confirm(
                    "Are you sure you want to delete this post?"
                );

                if (!confirmed) return;

                deleteButton.disabled = true;

                try {
                    // Delete image from Storage
                    if (data.imageUrl) {
                        try {
                            await deleteObject(
                                storageRef(storage, data.imageUrl)
                            );
                        } catch (imageError) {
                            console.warn(
                                "Could not delete post image:",
                                imageError
                            );
                        }
                    }

                    // Delete post from Firestore
                    await deleteDoc(doc(db, "posts", post.id));

                } catch (error) {
                    console.error("Post deletion error:", error);

                    alert("Could not delete post. Check Firebase permissions.");

                    deleteButton.disabled = false;
                }
            });

            card.appendChild(deleteButton);
        }

        postsList.appendChild(card);
    });
}

/* =========================
   POSTS: FIRESTORE LISTENER
========================= */

let latestPosts = [];

function renderLatestPosts() {
    renderPosts(latestPosts);
}

const postsQuery = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
);

onSnapshot(
    postsQuery,
    snapshot => {
        latestPosts = snapshot.docs;

        renderLatestPosts();
    },
    error => {
        console.error("Could not load posts:", error);

        if (postsList) {
            postsList.textContent = translate("postLoadingError");
        }
    }
);

/* =========================
   POSTS: CLEANUP PREVIEW
========================= */

postEditorDialog?.addEventListener("close", () => {
    if (postPreviewURL) {
        URL.revokeObjectURL(postPreviewURL);
        postPreviewURL = null;
    }
});

/* =========================
   LANGUAGE
========================= */

function changeLanguage() {
    language = language === "pt" ? "en" : "pt";

    document.documentElement.lang =
        language === "pt" ? "pt-BR" : "en";

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;
        const translated = translations[language][key];

        if (translated !== undefined) {
            element.textContent = translated;
        }
    });

    document.querySelectorAll("time[data-date]").forEach(time => {
        time.textContent = formatUpdateDate(time.dataset.date);
    });

    if (langToggle) {
        langToggle.textContent = language === "pt" ? "EN" : "PT";
    }

    if (postTitle) {
        postTitle.placeholder = translate("postTitlePlaceholder");
    }

    if (postDescription) {
        postDescription.placeholder = translate("postDescriptionPlaceholder");
    }

    if (publishPostButton) {
        publishPostButton.textContent = translate("publishPost");
    }

    renderProjects();
    renderFirestoreUpdates();

    if (
        currentProjectIndex !== null &&
        dialog?.open
    ) {
        openProject(currentProjectIndex);
    }
}

langToggle?.addEventListener("click", changeLanguage);

/* =========================
   NAVIGATION EVENTS
========================= */

document.querySelectorAll("[data-page]").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault();
        showPage(element.dataset.page);
    });
});

/* =========================
   BROWSER HISTORY
========================= */

function getPageFromHash() {
    const pageId = location.hash.replace("#", "");

    return validPages.includes(pageId)
        ? pageId
        : "home";
}

window.addEventListener("popstate", () => {
    showPage(getPageFromHash(), false);
});

/* =========================
   INITIALIZATION
========================= */

function initializeWebsite() {
    if (
        !dialog ||
        !dialogImage ||
        !dialogTitle ||
        !dialogCategory ||
        !dialogDescription ||
        !dialogDownloads ||
        !langToggle ||
        !closeDialogButton
    ) {
        console.error(
            "MR GREEN: A required HTML element is missing."
        );

        return;
    }

    showPage(getPageFromHash(), false);

    renderProjects();

    document.querySelectorAll("time[data-date]").forEach(time => {
        time.textContent = formatUpdateDate(time.dataset.date);
    });

    if (postTitle) {
        postTitle.placeholder = translate("postTitlePlaceholder");
    }

    if (postDescription) {
        postDescription.placeholder = translate("postDescriptionPlaceholder");
    }

    console.log("MR GREEN: Website loaded successfully!");
}

initializeWebsite();
