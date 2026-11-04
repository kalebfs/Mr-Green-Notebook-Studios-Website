"use strict";

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
        viewDetails: "Ver detalhes"
    },

    en: {
        navHome: "Home",
        navMods: "Mods",
        navRemakes: "Remakes",
        navGames: "Games",
        navUpdates: "Updates",
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
        pc: "",
        mobile: "",
        desc: {
            pt: "Uma nova experiência de Baldi’s Basics com mods e modificadores.",
            en: "A new Baldi’s Basics experience with mods and modifiers."
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


/* =========================
   PAGE NAVIGATION
========================= */

const validPages = [
    "home",
    "mods",
    "remakes",
    "games",
    "updates",
    "about"
];

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
   PROJECT CARD
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

        image.onerror = () => {
            image.remove();
        };

        cover.appendChild(image);
    }

    const icon = document.createElement("span");
    icon.className = "cover-icon";
    icon.textContent = project.icon;

    cover.appendChild(icon);

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

    const status = document.createElement("span");
    status.className = "status";
    status.textContent = `● ${translations[language].soon}`;

    const details = document.createElement("button");

    details.type = "button";
    details.className = "project-link";
    details.textContent = translations[language].viewDetails;

    details.addEventListener("click", () => {
        openProject(index);
    });

    footer.append(status, details);
    body.append(tag, title, description, footer);
    card.append(cover, body);

    return card;
}


/* =========================
   RENDER PROJECTS
========================= */

function renderGrid(gridId, items) {
    const grid = document.getElementById(gridId);

    if (!grid) {
        console.warn(`Grid not found: ${gridId}`);
        return;
    }

    grid.replaceChildren();

    if (items.length === 0) {
        const empty = document.createElement("div");

        empty.className = "empty";
        empty.textContent = translations[language].empty;

        grid.appendChild(empty);
        return;
    }

    items.forEach(item => {
        const card = createProjectCard(
            item.project,
            item.index
        );

        grid.appendChild(card);
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

function createDownloadButton(platform, icon, url) {
    const text = translations[language];

    if (!url) {
        const unavailable = document.createElement("span");

        unavailable.className = "download-button disabled";
        unavailable.textContent =
            `${icon} ${platform} — ${text.comingSoonDownload}`;

        return unavailable;
    }

    const link = document.createElement("a");

    link.className = "download-button";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${icon} ${platform} — ${text.download}`;

    return link;
}


/* =========================
   OPEN PROJECT
========================= */

function openProject(index) {
    const project = projects[index];

    if (!project || !dialog) {
        return;
    }

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
        createDownloadButton("PC", "💻", project.pc),
        createDownloadButton("Mobile", "📱", project.mobile)
    );

    if (!dialog.open) {
        dialog.showModal();
    }
}


/* =========================
   CLOSE PROJECT
========================= */

function closeProject() {
    if (dialog && dialog.open) {
        dialog.close();
    }

    currentProjectIndex = null;
}

closeDialogButton.addEventListener("click", closeProject);

dialog.addEventListener("click", event => {
    if (event.target === dialog) {
        closeProject();
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

    langToggle.textContent = language === "pt" ? "EN" : "PT";

    renderProjects();

    if (currentProjectIndex !== null && dialog.open) {
        openProject(currentProjectIndex);
    }
}

langToggle.addEventListener("click", changeLanguage);


/* =========================
   NAVIGATION EVENTS
========================= */

document.querySelectorAll("[data-page]").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault();

        const pageId = element.dataset.page;

        showPage(pageId);
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
        console.error("MR GREEN: Um ou mais elementos HTML não foram encontrados.");
        return;
    }

    showPage(getPageFromHash(), false);

    renderProjects();

    console.log("MR GREEN: Website carregado com sucesso!");
}

initializeWebsite();