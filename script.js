
// TRANSLATIONS

const translations = {

    pt: {
        navHome: 'Início',
        navMods: 'Mods',
        navRemakes: 'Remakes',
        navGames: 'Jogos',
        navUpdates: 'Atualizações',
        navAbout: 'Sobre',

        heroEyebrow: 'ESTÚDIO INDEPENDENTE • DESDE 2026',
        heroText: 'Um universo de jogos, mods e remakes. Explore nossos projetos, acompanhe novidades e descubra o que está sendo desenvolvido.',
        explore: 'EXPLORAR PROJETOS',
        aboutButton: 'CONHECER O ESTÚDIO',

        featured: 'Projetos em destaque',
        featuredSub: 'Uma seleção dos nossos projetos.',

        modsTitle: 'Mods',
        modsIntro: 'Modificações, novas ideias e experiências diferentes para jogos.',

        remakesTitle: 'Remakes',
        remakesIntro: 'Projetos inspirados em jogos que marcaram época, recriados com ideias e identidade próprias.',

        gamesTitle: 'Jogos',
        gamesIntro: 'Conheça os jogos originais desenvolvidos pelo estúdio.',

        updatesTitle: 'Atualizações',
        updatesIntro: 'Novidades, anúncios e registros do desenvolvimento.',

        updateOneTitle: 'O site do Mr Green Notebook Studios foi criado!',
        updateOneText: 'Esta é a primeira versão do portal. Em breve, mais projetos e novidades serão adicionados.',

        updateTwoTitle: 'Mais novidades chegando',
        updateTwoText: 'Acompanhe esta página para conhecer os próximos lançamentos.',

        comingSoon: 'EM BREVE',

        aboutTitle: 'Sobre o estúdio',
        aboutHeading: 'Criatividade em cada projeto.',
        aboutText: 'Mr Green Notebook Studios é um espaço independente para criar jogos, mods e remakes. Este site reúne os projetos em um só lugar e será atualizado conforme novas experiências forem desenvolvidas.',

        contactHeading: 'Contato e comunidade',
        contactText: 'Adicione aqui seus links oficiais, como YouTube, Roblox ou outras redes. Não coloque informações pessoais privadas.',

        rights: 'Todos os direitos reservados.',
        footer: 'Feito com criatividade.',

        soon: 'EM DESENVOLVIMENTO',
        placeholder: 'Projeto de exemplo — edite as informações no código.',
        empty: 'Nenhum projeto adicionado aqui ainda.',

        downloadTitle: 'Download Links:',
        download: 'Download',
        comingSoonDownload: 'Em breve'
    },

    en: {
        navHome: 'Home',
        navMods: 'Mods',
        navRemakes: 'Remakes',
        navGames: 'Games',
        navUpdates: 'Updates',
        navAbout: 'About',

        heroEyebrow: 'INDEPENDENT STUDIO • SINCE 2026',
        heroText: 'A universe of games, mods and remakes. Explore our projects, follow the news and discover what is being developed.',
        explore: 'EXPLORE PROJECTS',
        aboutButton: 'ABOUT THE STUDIO',

        featured: 'Featured projects',
        featuredSub: 'A selection of our projects.',

        modsTitle: 'Mods',
        modsIntro: 'Modifications, new ideas and different experiences for games.',

        remakesTitle: 'Remakes',
        remakesIntro: 'Projects inspired by memorable games, recreated with original ideas and identity.',

        gamesTitle: 'Games',
        gamesIntro: 'Discover original games developed by the studio.',

        updatesTitle: 'Updates',
        updatesIntro: 'News, announcements and development logs.',

        updateOneTitle: 'The Mr Green Notebook Studios website was created!',
        updateOneText: 'This is the first version of the portal. More projects and news will be added soon.',

        updateTwoTitle: 'More news coming soon',
        updateTwoText: 'Check this page to discover upcoming releases.',

        comingSoon: 'COMING SOON',

        aboutTitle: 'About the studio',
        aboutHeading: 'Creativity in every project.',
        aboutText: 'Mr Green Notebook Studios is an independent space for creating games, mods and remakes. This website brings the projects together and will be updated as new experiences are developed.',

        contactHeading: 'Contact and community',
        contactText: 'Add your official links here, such as YouTube, Roblox or other social networks. Do not publish private personal information.',

        rights: 'All rights reserved.',
        footer: 'Made with creativity.',

        soon: 'IN DEVELOPMENT',
        placeholder: 'Example project — edit the information in the code.',
        empty: 'No projects added here yet.',

        downloadTitle: 'Download Links:',
        download: 'Download',
        comingSoonDownload: 'Coming Soon'
    }

};


// PROJECTS
// Add or edit your projects here.


const projects = [

    {
        name: "Baldi's Basics Remagined",
        type: 'mods',
        icon: '📚',
        tag: 'Mod',

        image: 'images/baldi-mods.jpg',

        pc: '',
        mobile: '',

        desc: {
            pt: 'Uma nova experiência de Baldi’s Basics com mods e modificadores.',
            en: 'A new Baldi’s Basics experience with mods and modifiers.'
        }
    },

    {
        name: 'Granny Redux',
        type: 'remakes',
        icon: '🏚️',
        tag: 'Remake',

        image: 'images/granny-remake.jpg',

        pc: '',
        mobile: '',

        desc: {
            pt: 'Um projeto de remake de terror em desenvolvimento.',
            en: 'A horror remake project currently in development.'
        }
    },

    {
        name: 'Momo Horror Game Escape House Reunion',
        type: 'games',
        icon: '👁️',
        tag: 'Game',

        image: 'images/momo-horror.jpg',

        pc: '',
        mobile: '',

        desc: {
            pt: 'Um jogo original de terror desenvolvido pelo estúdio.',
            en: 'An original horror game developed by the studio.'
        }
    }

];


// LANGUAGE

let language = 'pt';


// PROJECT CARD

function projectCard(project, index) {

    const translation = translations[language];

    return `
        <article class="card"
            data-project-index="${index}"
            tabindex="0"
            role="button"
            aria-label="${project.name}">

            <div class="cover">
                <span class="cover-icon">${project.icon}</span>
            </div>

            <div class="card-body">

                <span class="tag">${project.tag}</span>

                <h3>${project.name}</h3>

                <p>${project.desc[language]}</p>

                <div class="card-foot">

                    <span class="status">● ${translation.soon}</span>

                    <button class="project-link view-details" type="button">
    View Details →
</button>

                </div>

            </div>

        </article>
    `;
}


// RENDER PROJECTS

function renderProjects() {

    const featuredGrid = document.getElementById('featuredGrid');

    featuredGrid.innerHTML = projects
        .map((project, index) => projectCard(project, index))
        .join('');

    ['mods', 'remakes', 'games'].forEach(type => {

        const grid = document.getElementById(type + 'Grid');

        const items = projects
            .map((project, index) => ({ project, index }))
            .filter(item => item.project.type === type);

        grid.innerHTML = items.length
            ? items.map(item => projectCard(item.project, item.index)).join('')
            : `<div class="empty">${translations[language].empty}</div>`;

    });

}


// PAGE NAVIGATION

function showPage(id) {

    document.querySelectorAll('.page').forEach(page => {

        page.classList.toggle('active', page.id === id);

    });

    document.querySelectorAll('.nav-btn').forEach(button => {

        button.classList.toggle('active', button.dataset.page === id);

    });

    history.replaceState(null, '', '#' + id);

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}


// NAVIGATION BUTTONS

document.querySelectorAll('.nav-btn').forEach(button => {

    button.addEventListener('click', () => {

        showPage(button.dataset.page);

    });

});


// PROJECT DETAILS MODAL

const projectModal = document.getElementById('projectModal');

const modalThumbnail = document.getElementById('modalThumbnail');

const modalTitle = document.getElementById('modalTitle');

const modalCategory = document.getElementById('modalCategory');

const modalDescription = document.getElementById('modalDescription');

const modalDownloads = document.getElementById('modalDownloads');


// OPEN PROJECT

function openProject(index) {

    const project = projects[index];

    if (!project) return;

    modalTitle.textContent = project.name;

    modalCategory.textContent = project.tag.toUpperCase();

    modalDescription.textContent = project.desc[language];

    // THUMBNAIL

    if (project.image) {

        modalThumbnail.src = project.image;
        modalThumbnail.alt = project.name;
        modalThumbnail.style.display = 'block';

    } else {

        modalThumbnail.removeAttribute('src');
        modalThumbnail.style.display = 'none';

    }

    // DOWNLOAD BUTTONS

    modalDownloads.innerHTML = '';

    const translation = translations[language];

    function createDownloadButton(platform, icon, url) {

        if (!url) {

            const unavailable = document.createElement('span');

            unavailable.className = 'download-button disabled';

            unavailable.textContent =
                `${icon} ${platform} — ${translation.comingSoonDownload}`;

            modalDownloads.appendChild(unavailable);

            return;

        }

        const link = document.createElement('a');

        link.className = 'download-button';

        link.href = url;

        link.target = '_blank';

        link.rel = 'noopener noreferrer';

        link.textContent =
            `${icon} ${platform} — ${translation.download}`;

        modalDownloads.appendChild(link);

    }

    createDownloadButton('PC', '💻', project.pc);

    createDownloadButton('Mobile', '📱', project.mobile);

    // SHOW MODAL

    projectModal.classList.add('active');

    document.body.style.overflow = 'hidden';

}


// CLOSE PROJECT

function closeProject() {

    projectModal.classList.remove('active');

    document.body.style.overflow = '';

}


// CLICK ON PROJECT CARDS

document.addEventListener('click', function (event) {

    const button = event.target.closest('.view-details');
    const card = event.target.closest('.card[data-project-index]');

    if (button && card) {
        event.preventDefault();

        const index = Number(card.dataset.projectIndex);

        openProject(index);
    }

});

// KEYBOARD SUPPORT FOR PROJECT CARDS

document.addEventListener('keydown', event => {

    const card = event.target.closest('[data-project-index]');

    if (!card) return;

    if (event.key === 'Enter' || event.key === ' ') {

        event.preventDefault();

        openProject(Number(card.dataset.projectIndex));

    }

});


// CLOSE BUTTON

document.getElementById('closeProjectModal').addEventListener('click', closeProject);


// CLICK OUTSIDE MODAL

projectModal.addEventListener('click', event => {

    if (event.target === projectModal) {

        closeProject();

    }

});


// ESCAPE KEY

document.addEventListener('keydown', event => {

    if (event.key === 'Escape') {

        closeProject();

    }

});


// LANGUAGE BUTTON

document.getElementById('langToggle').addEventListener('click', () => {

    language = language === 'pt' ? 'en' : 'pt';

    document.documentElement.lang =
        language === 'pt' ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(element => {

        const key = element.dataset.i18n;

        if (translations[language][key]) {

            element.textContent = translations[language][key];

        }

    });

    document.getElementById('langToggle').textContent =
        language === 'pt' ? 'EN' : 'PT';

    renderProjects();

    // Update an open project modal

    if (projectModal.classList.contains('active')) {

        const currentProject = projects.find(
            project => project.name === modalTitle.textContent
        );

        if (currentProject) {

            modalDescription.textContent =
                currentProject.desc[language];

            modalCategory.textContent =
                currentProject.tag.toUpperCase();

            modalDownloads.innerHTML = '';

            function createUpdatedButton(platform, icon, url) {

                if (!url) {

                    const unavailable = document.createElement('span');

                    unavailable.className = 'download-button disabled';

                    unavailable.textContent =
                        `${icon} ${platform} — ${translations[language].comingSoonDownload}`;

                    modalDownloads.appendChild(unavailable);

                    return;

                }

                const link = document.createElement('a');

                link.className = 'download-button';

                link.href = url;

                link.target = '_blank';

                link.rel = 'noopener noreferrer';

                link.textContent =
                    `${icon} ${platform} — ${translations[language].download}`;

                modalDownloads.appendChild(link);

            }

            createUpdatedButton('PC', '💻', currentProject.pc);

            createUpdatedButton('Mobile', '📱', currentProject.mobile);

        }

    }

});


// INITIAL PAGE

const initialPage = location.hash.slice(1);

const validPages = [
    'home',
    'mods',
    'remakes',
    'games',
    'updates',
    'about'
];

if (validPages.includes(initialPage)) {

    showPage(initialPage);

}


// INITIAL RENDER

renderProjects();
