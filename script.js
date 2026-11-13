
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";

import { initComments } from "./comments.js";
import { initProfiles } from "./profiles.js";

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
    doc,
    updateDoc,
    writeBatch
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

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

const ADMIN_UID = "Qouhq47ZojcixHwiXkfmXwfT2xe2";

/* =========================
   CLOUDINARY
========================= */

const CLOUDINARY_CLOUD_NAME = "kqzpdeaz";
const CLOUDINARY_UPLOAD_PRESET = "kalebfs_posts";

async function uploadPostImage(file) {
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

    if (!response.ok) {
        throw new Error(
            result.error?.message || "Cloudinary upload failed."
        );
    }

    return result.secure_url;
}

/* =========================
   TRANSLATIONS
========================= */

const translations = {
    pt: {
        navHome: "Início",
        navMods: "Mods",
        navRemakes: "Remakes",
        navGames: "Jogos",
        navVideos: "Vídeos",
        videosTitle: "Vídeos",
        videosIntro: "Todos os vídeos do nosso canal no YouTube.",
        watchVideo: "ASSISTIR",
        loadMoreVideos: "CARREGAR MAIS",
        loadingVideos: "Carregando vídeos...",
        videosError: "Não foi possível carregar os vídeos.",
        noVideos: "Nenhum vídeo encontrado.",
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
        navVideos: "Videos",
        videosTitle: "Videos",
        videosIntro: "All videos from our YouTube channel.",
        watchVideo: "WATCH",
        loadMoreVideos: "LOAD MORE",
        loadingVideos: "Loading videos...",
        videosError: "Could not load videos.",
        noVideos: "No videos found.",
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
        pc: "https://github.com/kalebfs/Mr-Green-Notebook-Studios-Website/releases/download/V0.6/Momo.Horror.Game.Escape.House.Reunion.0.6.PC.Port.rar",
        mobile: "",
        desc: {
            pt: "Um jogo original de terror desenvolvido pelo estúdio.",
            en: "An original horror game developed by the studio."
        }
    }
];

/* =========================
   LANGUAGE STATE
========================= */

const LANGUAGE_STORAGE_KEY = "mrGreenWebsiteLanguage";

function getSavedLanguage() {
    try {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return saved === "en" || saved === "pt" ? saved : "pt";
    } catch {
        return "pt";
    }
}

let language = getSavedLanguage();

let currentProjectIndex = null;
let isAdmin = false;

let latestUpdates = [];
let latestPosts = [];

let postPreviewURL = null;

let postsRenderVersion = 0;
let updatesRenderVersion = 0;

let editingUpdateId = null;
let editingPostId = null;
let editingPostImageUrl = "";

let updatingOrder = {
    updates: false,
    posts: false
};

const validPages = [
    "home",
    "mods",
    "remakes",
    "games",
    "videos",
    "updates",
    "posts",
    "about",
    "profile"
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

const languageSelect = document.getElementById("languageSelect");
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
const updateSourceLanguage = document.getElementById("updateSourceLanguage");

const updatesList = document.getElementById("updatesList");

const createPostButton = document.getElementById("createPostButton");
const postEditorDialog = document.getElementById("postEditorDialog");
const postForm = document.getElementById("postForm");

const postTitle = document.getElementById("postTitle");
const postDescription = document.getElementById("postDescription");
const postSourceLanguage = document.getElementById("postSourceLanguage");
const postImage = document.getElementById("postImage");
const postImagePreview = document.getElementById("postImagePreview");

const postError = document.getElementById("postError");
const publishPostButton = document.getElementById("publishPostButton");
const cancelPostButton = document.getElementById("cancelPostButton");

const postsList = document.getElementById("postsList");

/* =========================
   COMMENTS AND PROFILES
========================= */

const commentsFeature = initComments({
    auth,
    db,
    adminUid: ADMIN_UID,
    getLanguage: () => language
});

const profilesFeature = initProfiles({
    auth,
    db,
    accountBar: commentsFeature.accountBar,
    getLanguage: () => language
});

if (commentsFeature.accountBar && postsList?.parentElement) {
    postsList.parentElement.insertBefore(
        commentsFeature.accountBar,
        postsList
    );
}

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
   MANUAL REORDER SYSTEM
========================= */

function sortByManualOrder(items, getData = item => item) {
    return [...items].sort((a, b) => {
        const dataA = getData(a);
        const dataB = getData(b);

        const orderA = typeof dataA.manualOrder === "number"
            ? dataA.manualOrder
            : Infinity;

        const orderB = typeof dataB.manualOrder === "number"
            ? dataB.manualOrder
            : Infinity;

        return orderA - orderB;
    });
}

function createReorderControls(type, items, index, card) {
    if (!isAdmin || items.length < 2) return;

    const controls = document.createElement("div");
    controls.className = "reorder-controls";

    const upButton = document.createElement("button");

    upButton.type = "button";
    upButton.className = "reorder-button";
    upButton.textContent = "↑";
    upButton.title = language === "pt"
        ? "Mover para cima"
        : "Move up";

    upButton.disabled = index === 0 || updatingOrder[type];

    const downButton = document.createElement("button");

    downButton.type = "button";
    downButton.className = "reorder-button";
    downButton.textContent = "↓";
    downButton.title = language === "pt"
        ? "Mover para baixo"
        : "Move down";

    downButton.disabled =
        index === items.length - 1 || updatingOrder[type];

    upButton.addEventListener("click", () => {
        moveItem(type, index, -1);
    });

    downButton.addEventListener("click", () => {
        moveItem(type, index, 1);
    });

    controls.append(upButton, downButton);
    card.appendChild(controls);
}

async function saveManualOrder(type, items) {
    const batch = writeBatch(db);

    items.forEach((item, index) => {
        batch.update(
            doc(db, type, item.id),
            {
                manualOrder: index
            }
        );
    });

    await batch.commit();
}

async function moveItem(type, index, direction) {
    if (!isAdmin || updatingOrder[type]) return;

    if (type !== "updates" && type !== "posts") return;

    const currentItems = type === "updates"
        ? sortByManualOrder(latestUpdates)
        : sortByManualOrder(latestPosts, post => post.data());

    if (currentItems.length < 2) return;

    if (!Number.isInteger(index)) return;

    const newIndex = index + direction;

    if (index < 0 || index >= currentItems.length) return;
    if (newIndex < 0 || newIndex >= currentItems.length) return;

    const oldItems = [...currentItems];
    const newItems = [...currentItems];

    const [item] = newItems.splice(index, 1);

    newItems.splice(newIndex, 0, item);

    updatingOrder[type] = true;

    if (type === "updates") {
        latestUpdates = newItems;
        renderFirestoreUpdates();
    } else {
        latestPosts = newItems;
        renderLatestPosts();
    }

    try {
        await saveManualOrder(type, newItems);

    } catch (error) {
        console.error("Reordering error:", error);

        if (type === "updates") {
            latestUpdates = oldItems;
            renderFirestoreUpdates();
        } else {
            latestPosts = oldItems;
            renderLatestPosts();
        }

        alert(
            language === "pt"
                ? "Não foi possível salvar a nova ordem. A ordem anterior foi restaurada."
                : "Could not save the new order. The previous order was restored."
        );

    } finally {
        updatingOrder[type] = false;

        if (type === "updates") {
            renderFirestoreUpdates();
        } else {
            renderLatestPosts();
        }
    }
}

function getNewManualOrder(items, getData = item => item) {
    const manualOrders = items
        .map(item => getData(item).manualOrder)
        .filter(order => typeof order === "number");

    if (manualOrders.length === 0) return null;

    return Math.min(...manualOrders) - 1;
}

/* =========================
   LANGUAGE DETECTION
========================= */

const portugueseWords = new Set([
    "sim", "não", "uma", "umas", "uns", "um",
    "atualização", "atualizações", "vazamento",
    "natal", "natalino", "chegando", "novidade",
    "novidades", "jogo", "jogos", "projeto",
    "projetos", "estúdio", "desenvolvimento",
    "publicação", "publicações", "descrição",
    "título", "imagem", "foi", "está", "estão",
    "será", "serão", "para", "com", "sobre",
    "mais", "aqui", "agora", "novo", "nova",
    "novos", "novas", "em", "do", "da", "dos",
    "das", "que", "por", "como", "seu", "sua",
    "seus", "suas", "breve", "hoje", "amanhã",
    "olá", "oi", "obrigado", "obrigada",
    "bem", "vindo", "vinda", "muito", "bom",
    "boa", "dia", "noite", "tarde", "também",
    "porque", "quando", "onde", "estou", "somos",
    "tem", "tenho", "fazer", "feito", "chegou",
    "lançamento", "atualizado", "disponível"
]);

const englishWords = new Set([
    "yes", "no", "the", "this", "that", "these",
    "those", "is", "are", "was", "were", "will",
    "would", "can", "could", "should", "have",
    "has", "had", "with", "from", "about",
    "coming", "soon", "news", "update", "updates",
    "leak", "leaks", "christmas", "mode", "game",
    "games", "project", "projects", "studio",
    "development", "description", "title",
    "image", "more", "new", "here", "now",
    "today", "tomorrow", "for", "of", "to",
    "in", "on", "and", "but", "not", "your",
    "you", "we", "our", "it", "its", "a", "an",
    "hello", "hi", "hey", "thanks", "thank",
    "welcome", "good", "morning", "night",
    "evening", "very", "much", "because",
    "when", "where", "who", "what", "how",
    "been", "being", "make", "made", "arrived",
    "released", "available"
]);

function detectSourceLanguage(text, fallback = "pt") {
    if (!text || typeof text !== "string") {
        return fallback === "en" ? "en" : "pt";
    }

    const normalized = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z\s]/g, " ");

    const words = normalized.split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return fallback === "en" ? "en" : "pt";
    }

    const shortWords = {
        oi: "pt",
        ola: "pt",
        obrigado: "pt",
        obrigada: "pt",
        sim: "pt",
        nao: "pt",
        hi: "en",
        hey: "en",
        hello: "en",
        yes: "en",
        no: "en"
    };

    if (words.length <= 2) {
        for (const word of words) {
            if (shortWords[word]) {
                return shortWords[word];
            }
        }

        return fallback === "en" ? "en" : "pt";
    }

    let portugueseScore = 0;
    let englishScore = 0;

    for (const word of words) {
        if (portugueseWords.has(word)) {
            portugueseScore += 2;
        }

        if (englishWords.has(word)) {
            englishScore += 2;
        }
    }

    if (/[ãõçáéíóúâêô]/i.test(text)) {
        portugueseScore += 5;
    }

    if (englishScore > portugueseScore) return "en";
    if (portugueseScore > englishScore) return "pt";

    return fallback === "en" ? "en" : "pt";
}

/* =========================
   CONTENT LANGUAGE
========================= */

function detectContentLanguage(data) {
    if (data?.sourceLanguage === "pt" || data?.sourceLanguage === "en") {
        return data.sourceLanguage;
    }

    const content = `${data?.title || ""} ${data?.description || ""}`;

    return detectSourceLanguage(content, "pt");
}

/* =========================
   MYMEMORY TRANSLATION
========================= */

const MYMEMORY_URL = "https://api.mymemory.translated.net/get";
const MAX_TRANSLATION_CHUNK = 450;
const TRANSLATION_CACHE_PREFIX = "mrGreenTranslation_";

function createTranslationCacheKey(source, target, text) {
    return `${TRANSLATION_CACHE_PREFIX}${source}_${target}_${text}`;
}

function readTranslationCache(key) {
    try {
        const value = localStorage.getItem(key);

        return value === null ? null : value;
    } catch (error) {
        console.warn("Translation cache read error:", error);
        return null;
    }
}

function saveTranslationCache(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.warn("Translation cache save error:", error);
    }
}

function decodeTranslationEntities(text) {
    const textarea = document.createElement("textarea");

    textarea.innerHTML = text;

    return textarea.value;
}

function splitTranslationText(text) {
    const chunks = [];
    let remaining = text;

    while (remaining.length > MAX_TRANSLATION_CHUNK) {
        let splitPosition = remaining.lastIndexOf(
            " ",
            MAX_TRANSLATION_CHUNK
        );

        if (splitPosition <= 0) {
            splitPosition = MAX_TRANSLATION_CHUNK;
        }

        chunks.push(remaining.slice(0, splitPosition));

        remaining = remaining.slice(splitPosition);
    }

    if (remaining.length > 0) {
        chunks.push(remaining);
    }

    return chunks;
}

async function requestMyMemoryTranslation(text, source, target) {
    if (!text || !text.trim()) return text;

    const params = new URLSearchParams({
        q: text,
        langpair: `${source}|${target}`
    });

    const response = await fetch(
        `${MYMEMORY_URL}?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error(
            `Translation service returned ${response.status}.`
        );
    }

    const result = await response.json();

    if (
        result.responseStatus !== 200 ||
        !result.responseData?.translatedText
    ) {
        throw new Error("Invalid translation response.");
    }

    const translated = decodeTranslationEntities(
        result.responseData.translatedText
    ).trim();

    if (
        !translated ||
        translated.toLowerCase().includes("google traduc") ||
        translated.toLowerCase().includes("mymemory")
    ) {
        throw new Error("Invalid translation returned.");
    }

    return translated;
}

async function translateText(text, sourceLanguage, targetLanguage) {
    if (!text || typeof text !== "string") {
        return text || "";
    }

    if (sourceLanguage === targetLanguage) {
        return text;
    }

    if (
        !["pt", "en"].includes(sourceLanguage) ||
        !["pt", "en"].includes(targetLanguage)
    ) {
        return text;
    }

    if (text.trim().length <= 3) {
        return text;
    }

    const cacheKey = createTranslationCacheKey(
        sourceLanguage,
        targetLanguage,
        text
    );

    const cached = readTranslationCache(cacheKey);

    if (cached !== null) {
        return cached;
    }

    try {
        const chunks = splitTranslationText(text);
        const translatedChunks = [];

        for (const chunk of chunks) {
            if (!chunk.trim()) {
                translatedChunks.push(chunk);
                continue;
            }

            const translated = await requestMyMemoryTranslation(
                chunk,
                sourceLanguage,
                targetLanguage
            );

            translatedChunks.push(translated);
        }

        const result = translatedChunks.join("");

        if (!result.trim()) {
            return text;
        }

        saveTranslationCache(cacheKey, result);

        return result;

    } catch (error) {
        console.warn(
            "Automatic translation failed. Original text preserved:",
            error
        );

        return text;
    }
}

async function getLocalizedContent(data, field, targetLanguage, sourceLanguage) {
    const original = data?.[field] || "";

    if (!original) return "";

    if (sourceLanguage === targetLanguage) {
        return original;
    }

    return translateText(
        original,
        sourceLanguage,
        targetLanguage
    );
}

/* =========================
   SEASONAL THEMES
========================= */

function updateSeasonalTheme() {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    let theme = "green";

    if (month === 9) theme = "orange";

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
        themeColorMeta.setAttribute(
            "content",
            themeColors[theme]
        );
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
        section.classList.toggle(
            "active",
            section.id === pageId
        );
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

    if (pageId === "videos") {
        loadYouTubeVideos();
    }
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

    if (project.name === "Granny Redux") {
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
    if (
        typeof url === "string" &&
        url.trim().toLowerCase() === "never"
    ) {
        const unavailable = document.createElement("span");

        unavailable.className = "download-button disabled";
        unavailable.textContent =
            `${platform} — ${translate("unavailable")}`;

        return unavailable;
    }

    if (!url) {
        const unavailable = document.createElement("span");

        unavailable.className = "download-button disabled";
        unavailable.textContent =
            `${platform} — ${translate("comingSoonDownload")}`;

        return unavailable;
    }

    const link = document.createElement("a");

    link.className = "download-button";
    link.href = url;
    link.textContent =
        `${platform} — ${translate("download")}`;

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
    if (!adminLoginDialog) return;

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
        adminLoginButton.hidden = !!user;
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
    editingUpdateId = null;

    updateError.textContent = "";

    updateForm.reset();

    updateDate.value = getLocalDate();

    if (updateSourceLanguage) {
        updateSourceLanguage.value = "pt";
    }

    updateEditorDialog.showModal();
});

closeUpdateEditor?.addEventListener("click", () => {
    editingUpdateId = null;
    updateEditorDialog.close();
});

updateEditorDialog?.addEventListener("click", event => {
    if (event.target === updateEditorDialog) {
        editingUpdateId = null;
        updateEditorDialog.close();
    }
});

updateEditorDialog?.addEventListener("close", () => {
    editingUpdateId = null;
});

/* =========================
   SAVE UPDATE
========================= */

updateForm?.addEventListener("submit", async event => {
    event.preventDefault();

    updateError.textContent = "";

    if (
        !auth.currentUser ||
        auth.currentUser.uid !== ADMIN_UID
    ) {
        updateError.textContent =
            "Administrator access required.";

        return;
    }

    const title = updateTitle.value.trim();
    const description = updateDescription.value.trim();

    if (!title || !description) {
        updateError.textContent =
            "Preencha o título e a descrição.";

        return;
    }

    const detectedLanguage = detectSourceLanguage(
        `${title} ${description}`,
        updateSourceLanguage?.value || "pt"
    );

    const updateData = {
        title,
        description,
        sourceLanguage: detectedLanguage,
        date: updateDate.value
    };

    try {
        if (editingUpdateId) {
            await updateDoc(
                doc(db, "updates", editingUpdateId),
                updateData
            );

        } else {
            const newOrder = getNewManualOrder(latestUpdates);

            updateData.createdAt = serverTimestamp();

            if (newOrder !== null) {
                updateData.manualOrder = newOrder;
            }

            await addDoc(
                collection(db, "updates"),
                updateData
            );
        }

        editingUpdateId = null;

        updateForm.reset();
        updateEditorDialog.close();

    } catch (error) {
        console.error("Update save error:", error);

        updateError.textContent =
            "Could not save. Check Firebase permissions.";
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

    const date = new Date(
        year,
        month - 1,
        day,
        12
    );

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

async function renderFirestoreUpdates() {
    if (!updatesList) return;

    const renderVersion = ++updatesRenderVersion;
    const targetLanguage = language;

    updatesList
        .querySelectorAll("[data-firestore-update]")
        .forEach(element => element.remove());

    const orderedUpdates = sortByManualOrder(latestUpdates);

    for (const update of orderedUpdates) {
        if (renderVersion !== updatesRenderVersion) return;

        const article = document.createElement("article");

        article.className = "update";
        article.dataset.firestoreUpdate = "true";

        const time = document.createElement("time");

        time.textContent = update.dateLabelKey
            ? translations[language][update.dateLabelKey]
            : formatUpdateDate(update.date);

        const title = document.createElement("h3");

        title.textContent = update.title || "";

        const description = document.createElement("p");

        description.textContent = update.description || "";

        article.append(time, title, description);

        try {
            commentsFeature.renderComments(
                "updates",
                update.id,
                article
            );
        } catch (error) {
            console.error("Update comments error:", error);
        }

        const itemIndex = orderedUpdates.findIndex(
            item => item.id === update.id
        );

        createReorderControls(
            "updates",
            orderedUpdates,
            itemIndex,
            article
        );

        if (isAdmin) {
            const editButton = document.createElement("button");

            editButton.type = "button";
            editButton.className = "edit-button";

            editButton.textContent =
                language === "pt" ? "Editar" : "Edit";

            editButton.addEventListener("click", () => {
                editingUpdateId = update.id;

                updateError.textContent = "";

                updateTitle.value = update.title || "";
                updateDescription.value = update.description || "";
                updateDate.value = update.date || getLocalDate();

                if (updateSourceLanguage) {
                    updateSourceLanguage.value =
                        detectContentLanguage(update);
                }

                updateEditorDialog.showModal();
            });

            article.appendChild(editButton);
        }

        if (isAdmin) {
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-button";

            deleteButton.textContent =
                language === "pt" ? "Excluir" : "Delete";

            deleteButton.addEventListener("click", async () => {
                const confirmed = confirm(
                    language === "pt"
                        ? "Tem certeza de que deseja excluir esta atualização?"
                        : "Are you sure you want to delete this update?"
                );

                if (!confirmed) return;

                try {
                    await deleteDoc(
                        doc(db, "updates", update.id)
                    );

                } catch (error) {
                    console.error(
                        "Update deletion error:",
                        error
                    );

                    alert(
                        language === "pt"
                            ? "Não foi possível excluir esta atualização."
                            : "Could not delete this update."
                    );
                }
            });

            article.appendChild(deleteButton);
        }

        updatesList.appendChild(article);

        const sourceLanguage = detectContentLanguage(update);

        if (sourceLanguage !== targetLanguage) {
            try {
                const [
                    translatedTitle,
                    translatedDescription
                ] = await Promise.all([
                    getLocalizedContent(
                        update,
                        "title",
                        targetLanguage,
                        sourceLanguage
                    ),
                    getLocalizedContent(
                        update,
                        "description",
                        targetLanguage,
                        sourceLanguage
                    )
                ]);

                if (
                    renderVersion !== updatesRenderVersion ||
                    targetLanguage !== language
                ) {
                    return;
                }

                title.textContent = translatedTitle;
                description.textContent = translatedDescription;

            } catch (error) {
                console.error(
                    "Update translation error:",
                    error
                );
            }
        }
    }
}

const updatesQuery = query(
    collection(db, "updates"),
    orderBy("createdAt", "desc")
);

onSnapshot(
    updatesQuery,
    snapshot => {
        latestUpdates = sortByManualOrder(
            snapshot.docs.map(document => ({
                id: document.id,
                ...document.data()
            }))
        );

        renderFirestoreUpdates();
    },
    error => {
        console.error(
            "Could not load updates:",
            error
        );
    }
);

/* =========================
   POSTS: IMAGE SETTINGS
========================= */

const allowedImageTypes = [
    "image/png",
    "image/jpeg",
    "image/webp"
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/* =========================
   POSTS: OPEN EDITOR
========================= */

createPostButton?.addEventListener("click", () => {
    if (!isAdmin) return;

    editingPostId = null;
    editingPostImageUrl = "";

    postError.textContent = "";

    postForm.reset();

    if (postSourceLanguage) {
        postSourceLanguage.value = "pt";
    }

    postImagePreview.hidden = true;
    postImagePreview.removeAttribute("src");

    if (postPreviewURL) {
        URL.revokeObjectURL(postPreviewURL);
        postPreviewURL = null;
    }

    publishPostButton.textContent = translate("publishPost");

    postEditorDialog.showModal();
});

/* =========================
   POSTS: CANCEL
========================= */

cancelPostButton?.addEventListener("click", () => {
    editingPostId = null;
    editingPostImageUrl = "";

    postEditorDialog.close();
});

postEditorDialog?.addEventListener("click", event => {
    if (event.target === postEditorDialog) {
        editingPostId = null;
        editingPostImageUrl = "";

        postEditorDialog.close();
    }
});

postEditorDialog?.addEventListener("close", () => {
    editingPostId = null;
    editingPostImageUrl = "";
});

/* =========================
   POSTS: IMAGE PREVIEW
========================= */

postImage?.addEventListener("change", () => {
    const file = postImage.files[0];

    postError.textContent = "";

    if (postPreviewURL) {
        URL.revokeObjectURL(postPreviewURL);
        postPreviewURL = null;
    }

    if (!file) {
        if (editingPostImageUrl) {
            postImagePreview.src = editingPostImageUrl;
            postImagePreview.hidden = false;
        } else {
            postImagePreview.hidden = true;
            postImagePreview.removeAttribute("src");
        }

        return;
    }

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
   POSTS: SAVE
========================= */

postForm?.addEventListener("submit", async event => {
    event.preventDefault();

    postError.textContent = "";

    const user = auth.currentUser;

    if (!user || user.uid !== ADMIN_UID) {
        postError.textContent =
            translate("postPermissionError");

        return;
    }

    const title = postTitle.value.trim();
    const description = postDescription.value.trim();
    const imageFile = postImage.files[0];

    if (!title || !description) {
        postError.textContent =
            "Preencha o título e a descrição.";

        return;
    }

    if (
        imageFile &&
        !allowedImageTypes.includes(imageFile.type)
    ) {
        postError.textContent =
            translate("postImageError");

        return;
    }

    if (
        imageFile &&
        imageFile.size > MAX_IMAGE_SIZE
    ) {
        postError.textContent =
            translate("postSizeError");

        return;
    }

    const detectedLanguage = detectSourceLanguage(
        `${title} ${description}`,
        postSourceLanguage?.value || "pt"
    );

    const wasEditing = !!editingPostId;

    publishPostButton.disabled = true;

    publishPostButton.textContent =
        wasEditing
            ? (language === "pt" ? "Salvando..." : "Saving...")
            : translate("publishingPost");

    try {
        let imageUrl = editingPostImageUrl;

        if (imageFile) {
            imageUrl = await uploadPostImage(imageFile);
        }

        const postData = {
            title,
            description,
            sourceLanguage: detectedLanguage,
            imageUrl
        };

        if (editingPostId) {
            await updateDoc(
                doc(db, "posts", editingPostId),
                postData
            );

        } else {
            const newOrder = getNewManualOrder(
                latestPosts,
                post => post.data()
            );

            postData.date = getLocalDate();
            postData.createdAt = serverTimestamp();
            postData.uid = user.uid;
            postData.author = user.uid;

            if (newOrder !== null) {
                postData.manualOrder = newOrder;
            }

            const postReference = await addDoc(
                collection(db, "posts"),
                postData
            );

            console.log(
                "Post published successfully:",
                postReference.id
            );
        }

        editingPostId = null;
        editingPostImageUrl = "";

        postForm.reset();

        postImagePreview.hidden = true;
        postImagePreview.removeAttribute("src");

        if (postPreviewURL) {
            URL.revokeObjectURL(postPreviewURL);
            postPreviewURL = null;
        }

        postEditorDialog.close();

    } catch (error) {
        console.error("Post save error:", error);

        postError.textContent =
            "Error: " +
            (error.code || error.message || "Unknown error");

    } finally {
        publishPostButton.disabled = false;

        publishPostButton.textContent =
            translate("publishPost");
    }
});

/* =========================
   POSTS: RENDER
========================= */

async function renderPosts(posts) {
    if (!postsList) return;

    const renderVersion = ++postsRenderVersion;
    const targetLanguage = language;

    postsList.replaceChildren();

    if (posts.length === 0) {
        const empty = document.createElement("p");

        empty.className = "empty";
        empty.textContent = translate("noPosts");

        postsList.appendChild(empty);

        return;
    }

    const orderedPosts = sortByManualOrder(
        posts,
        post => post.data()
    );

    for (const post of orderedPosts) {
        if (renderVersion !== postsRenderVersion) return;

        const data = post.data();

        const card = document.createElement("article");

        card.className = "post-card update";
        card.dataset.postId = post.id;

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

        try {
            commentsFeature.renderComments(
                "posts",
                post.id,
                card
            );
        } catch (error) {
            console.error("Post comments error:", error);
        }

        const itemIndex = orderedPosts.findIndex(
            item => item.id === post.id
        );

        createReorderControls(
            "posts",
            orderedPosts,
            itemIndex,
            card
        );

        if (isAdmin) {
            const editButton = document.createElement("button");

            editButton.type = "button";
            editButton.className = "edit-button";

            editButton.textContent =
                language === "pt" ? "Editar" : "Edit";

            editButton.addEventListener("click", () => {
                editingPostId = post.id;
                editingPostImageUrl = data.imageUrl || "";

                postError.textContent = "";

                postForm.reset();

                postTitle.value = data.title || "";
                postDescription.value = data.description || "";

                if (postSourceLanguage) {
                    postSourceLanguage.value =
                        detectContentLanguage(data);
                }

                if (postPreviewURL) {
                    URL.revokeObjectURL(postPreviewURL);
                    postPreviewURL = null;
                }

                if (data.imageUrl) {
                    postImagePreview.src = data.imageUrl;
                    postImagePreview.hidden = false;
                } else {
                    postImagePreview.hidden = true;
                    postImagePreview.removeAttribute("src");
                }

                publishPostButton.textContent =
                    language === "pt"
                        ? "Salvar alterações"
                        : "Save changes";

                postEditorDialog.showModal();
            });

            card.appendChild(editButton);
        }

        if (isAdmin) {
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-button";

            deleteButton.textContent =
                language === "pt" ? "Excluir" : "Delete";

            deleteButton.addEventListener("click", async () => {
                const confirmed = confirm(
                    language === "pt"
                        ? "Tem certeza de que deseja excluir este post?"
                        : "Are you sure you want to delete this post?"
                );

                if (!confirmed) return;

                deleteButton.disabled = true;

                try {
                    await deleteDoc(
                        doc(db, "posts", post.id)
                    );

                } catch (error) {
                    console.error(
                        "Post deletion error:",
                        error
                    );

                    alert(
                        language === "pt"
                            ? "Não foi possível excluir este post."
                            : "Could not delete this post. Check Firebase permissions."
                    );

                    deleteButton.disabled = false;
                }
            });

            card.appendChild(deleteButton);
        }

        postsList.appendChild(card);

        const sourceLanguage = detectContentLanguage(data);

        if (sourceLanguage !== targetLanguage) {
            try {
                const [
                    translatedTitle,
                    translatedDescription
                ] = await Promise.all([
                    getLocalizedContent(
                        data,
                        "title",
                        targetLanguage,
                        sourceLanguage
                    ),
                    getLocalizedContent(
                        data,
                        "description",
                        targetLanguage,
                        sourceLanguage
                    )
                ]);

                if (
                    renderVersion !== postsRenderVersion ||
                    targetLanguage !== language
                ) {
                    return;
                }

                title.textContent = translatedTitle;
                description.textContent = translatedDescription;

            } catch (error) {
                console.error(
                    "Post translation error:",
                    error
                );
            }
        }
    }
}

function renderLatestPosts() {
    renderPosts(latestPosts);
}

/* =========================
   POSTS: FIRESTORE LISTENER
========================= */

onSnapshot(
    collection(db, "posts"),
    snapshot => {
        latestPosts = [...snapshot.docs].sort((a, b) => {
            const dataA = a.data();
            const dataB = b.data();

            const orderA = typeof dataA.manualOrder === "number"
                ? dataA.manualOrder
                : Infinity;

            const orderB = typeof dataB.manualOrder === "number"
                ? dataB.manualOrder
                : Infinity;

            if (orderA !== orderB) {
                return orderA - orderB;
            }

            const dateA = dataA.createdAt?.toMillis?.() || 0;
            const dateB = dataB.createdAt?.toMillis?.() || 0;

            return dateB - dateA;
        });

        console.log("MR GREEN: Posts encontrados:", latestPosts.length);

        console.table(latestPosts.map(post => ({
            id: post.id,
            title: post.data().title
        })));

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

function applyStaticTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;

        const translated = translations[language][key];

        if (translated !== undefined) {
            element.textContent = translated;
        }
    });

    document.querySelectorAll("time[data-date]").forEach(time => {
        time.textContent = formatUpdateDate(
            time.dataset.date
        );
    });

    if (postTitle) {
        postTitle.placeholder =
            translate("postTitlePlaceholder");
    }

    if (postDescription) {
        postDescription.placeholder =
            translate("postDescriptionPlaceholder");
    }

    if (publishPostButton) {
        publishPostButton.textContent =
            translate("publishPost");
    }
}

function changeLanguage(nextLanguage) {
    if (!["pt", "en"].includes(nextLanguage)) return;

    language = nextLanguage;

    try {
        localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            language
        );

    } catch (error) {
        console.warn(
            "Could not save language preference:",
            error
        );
    }

    document.documentElement.lang =
        language === "pt" ? "pt-BR" : "en";

    if (languageSelect) {
        languageSelect.value = language;
    }

    applyStaticTranslations();

    if (youtubeVideosGrid) {
        youtubeVideosGrid
            .querySelectorAll(".youtube-watch-button")
            .forEach(button => {
                button.textContent = translate("watchVideo");
            });
    }

    if (loadMoreVideosButton) {
        loadMoreVideosButton.textContent = translate("loadMoreVideos");
    }

    if (youtubeVideosStatus && !youtubeVideosLoaded) {
        youtubeVideosStatus.textContent = translate("loadingVideos");
    }

    renderProjects();
    renderFirestoreUpdates();
    renderLatestPosts();

    commentsFeature.refreshLanguage();

    if (
        currentProjectIndex !== null &&
        dialog?.open
    ) {
        openProject(currentProjectIndex);
    }
}

languageSelect?.addEventListener("change", () => {
    changeLanguage(languageSelect.value);
});

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
   YOUTUBE VIDEOS
========================= */

const YOUTUBE_API_KEY = "AIzaSyBfT1s6OAn3z88udnCjPjOGFP335ysFQLI";
const YOUTUBE_CHANNEL_HANDLE = "@mrgreennotebook";

const youtubeVideosGrid = document.getElementById("youtubeVideosGrid");
const youtubeVideosStatus = document.getElementById("youtubeVideosStatus");
const loadMoreVideosButton = document.getElementById("loadMoreVideosButton");

let youtubeUploadsPlaylist = null;
let youtubeNextPageToken = null;
let youtubeVideosLoaded = false;
let youtubeVideosLoading = false;

function setYouTubeStatus(message) {
    if (youtubeVideosStatus) {
        youtubeVideosStatus.textContent = message;
    }
}

async function getYouTubeUploadsPlaylist() {
    const url = new URL("https://www.googleapis.com/youtube/v3/channels");

    url.search = new URLSearchParams({
        part: "contentDetails",
        forHandle: YOUTUBE_CHANNEL_HANDLE,
        key: YOUTUBE_API_KEY
    });

    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error?.message || "YouTube API error.");
    }

    const channel = result.items?.[0];

    if (!channel) {
        throw new Error("YouTube channel not found.");
    }

    return channel.contentDetails.relatedPlaylists.uploads;
}

function createYouTubeVideoCard(video) {
    const snippet = video.snippet;
    const videoId = snippet?.resourceId?.videoId;

    if (!videoId) return null;

    const card = document.createElement("article");
    card.className = "youtube-video-card";

    const thumbnailLink = document.createElement("a");
    thumbnailLink.href = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
    thumbnailLink.target = "_blank";
    thumbnailLink.rel = "noopener noreferrer";
    thumbnailLink.className = "youtube-thumbnail-link";

    const thumbnail = document.createElement("img");
    thumbnail.src = snippet.thumbnails?.high?.url ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    thumbnail.alt = snippet.title || "YouTube video";
    thumbnail.loading = "lazy";

    thumbnail.onerror = () => {
        thumbnail.onerror = null;
        thumbnail.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    };

    thumbnailLink.appendChild(thumbnail);

    const content = document.createElement("div");
    content.className = "youtube-video-content";

    const title = document.createElement("h3");
    title.textContent = snippet.title || "Untitled video";

    const watchButton = document.createElement("a");
    watchButton.className = "youtube-watch-button";
    watchButton.href = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
    watchButton.target = "_blank";
    watchButton.rel = "noopener noreferrer";
    watchButton.textContent = translate("watchVideo");

    content.append(title, watchButton);
    card.append(thumbnailLink, content);

    return card;
}

async function loadYouTubeVideos() {
    if (!youtubeVideosGrid || youtubeVideosLoading) return;

    if (youtubeVideosLoaded && !youtubeNextPageToken) return;

    youtubeVideosLoading = true;

    setYouTubeStatus(translate("loadingVideos"));

    if (loadMoreVideosButton) {
        loadMoreVideosButton.disabled = true;
    }

    try {
        if (!youtubeUploadsPlaylist) {
            youtubeUploadsPlaylist = await getYouTubeUploadsPlaylist();
        }

        const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");

        const params = {
            part: "snippet",
            playlistId: youtubeUploadsPlaylist,
            maxResults: "50",
            key: YOUTUBE_API_KEY
        };

        if (youtubeNextPageToken) {
            params.pageToken = youtubeNextPageToken;
        }

        url.search = new URLSearchParams(params);

        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || "YouTube API error.");
        }

        const videos = result.items || [];

        videos.forEach(video => {
            const card = createYouTubeVideoCard(video);

            if (card) {
                youtubeVideosGrid.appendChild(card);
            }
        });

        youtubeNextPageToken = result.nextPageToken || null;
        youtubeVideosLoaded = true;

        if (loadMoreVideosButton) {
            loadMoreVideosButton.hidden = !youtubeNextPageToken;
        }

        if (youtubeVideosGrid.children.length === 0) {
            setYouTubeStatus(translate("noVideos"));
        } else {
            setYouTubeStatus("");
        }

    } catch (error) {
        console.error("YouTube videos error:", error);
        setYouTubeStatus(translate("videosError"));

        if (loadMoreVideosButton) {
            loadMoreVideosButton.hidden = true;
        }

    } finally {
        youtubeVideosLoading = false;

        if (loadMoreVideosButton) {
            loadMoreVideosButton.disabled = false;
        }
    }
}

loadMoreVideosButton?.addEventListener("click", loadYouTubeVideos);

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
        !languageSelect ||
        !closeDialogButton
    ) {
        console.error(
            "MR GREEN: A required HTML element is missing."
        );

        return;
    }

    languageSelect.value = language;

    document.documentElement.lang =
        language === "pt" ? "pt-BR" : "en";

    applyStaticTranslations();

    showPage(getPageFromHash(), false);

    renderProjects();
    renderFirestoreUpdates();
    renderLatestPosts();

    console.log(
        "MR GREEN: Website loaded successfully!"
    );
}

// =========================================
// SEASONAL STUDIO ICON
// =========================================

function updateStudioIcon() {
    const theme = document.documentElement.dataset.theme;

    const icons = {
        orange: "icon2.png",
        christmas: "icon3.png",
        newyear: "icon4.png"
    };

    const icon = icons[theme] || "icon.png";

    // Header logo
    document.querySelectorAll(".brand-mark img").forEach(img => {
        img.src = icon;
    });

    // Favicon
    const favicon = document.querySelector('link[rel="icon"]');

    if (favicon) {
        favicon.href = icon;
    }
}

// Atualiza ao carregar
updateStudioIcon();

// Detecta mudanças de tema
const iconObserver = new MutationObserver(updateStudioIcon);

iconObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
});

initializeWebsite();