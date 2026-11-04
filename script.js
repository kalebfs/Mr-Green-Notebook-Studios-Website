
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
        empty: 'Nenhum projeto adicionado aqui ainda.'
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
        empty: 'No projects added here yet.'
    }

};


// PROJECTS
// Add or edit your projects here.

const projects = [

    {
        name: "Baldi's Basics Mods",
        type: 'mods',
        icon: '📚',
        tag: 'Mod',

        desc: {
            pt: 'Mods e modificadores para criar novas maneiras de jogar.',
            en: 'Mods and modifiers that create new ways to play.'
        }
    },

    {
        name: 'Granny Remake',
        type: 'remakes',
        icon: '🏚️',
        tag: 'Remake',

        desc: {
            pt: 'Um projeto de remake de terror em desenvolvimento.',
            en: 'A horror remake project currently in development.'
        }
    },

    {
        name: 'Momo Horror',
        type: 'games',
        icon: '👁️',
        tag: 'Game',

        desc: {
            pt: 'Um projeto original de terror do estúdio.',
            en: 'An original horror game project by the studio.'
        }
    }

];


// LANGUAGE

let language = 'pt';


// PROJECT CARD

function projectCard(project) {

    const translation = translations[language];

    return `
        <article class="card">

            <div class="cover">
                <span class="cover-icon">${project.icon}</span>
            </div>

            <div class="card-body">

                <span class="tag">${project.tag}</span>

                <h3>${project.name}</h3>

                <p>${project.desc[language]}</p>

                <div class="card-foot">

                    <span class="status">● ${translation.soon}</span>

                </div>

            </div>

        </article>
    `;
}


// RENDER PROJECTS

function renderProjects() {

    const featuredGrid = document.getElementById('featuredGrid');

    featuredGrid.innerHTML = projects.map(projectCard).join('');

    ['mods', 'remakes', 'games'].forEach(type => {

        const grid = document.getElementById(type + 'Grid');

        const items = projects.filter(project => project.type === type);

        grid.innerHTML = items.length
            ? items.map(projectCard).join('')
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


// LANGUAGE BUTTON

document.getElementById('langToggle').addEventListener('click', () => {

    language = language === 'pt' ? 'en' : 'pt';

    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(element => {

        const key = element.dataset.i18n;

        if (translations[language][key]) {

            element.textContent = translations[language][key];

        }

    });

    document.getElementById('langToggle').textContent =
        language === 'pt' ? 'EN' : 'PT';

    renderProjects();

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
