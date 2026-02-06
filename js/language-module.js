// Language Management Module
window.LanguageModule = {
    // Available languages
    availableLanguages: {
        'en': 'English',
        'pt': 'Português'
    },

    // Current language
    currentLanguage: 'en',

    // Translation data
    translations: {
        'en': {
            // Navigation
            'nav.about': 'About',
            'nav.experience': 'Experience',
            'nav.projects': 'Projects',
            'nav.writing': 'Writing',
            'nav.contact': 'Contact',

            // Hero Section
            'hero.title': 'Pedro Henrique França',
            'hero.subtitle': 'Software Developer',
            'hero.description': 'Building maintainable systems with attention to architecture and engineering fundamentals. Focused on mobile and backend development.',

            // About Section
            'about.title': 'About',
            'about.p1': 'Full Stack Developer passionate about software architecture and engineering fundamentals. I value maintainable code, good design principles, and understanding the "why" behind technical decisions.',
            'about.p2': 'My focus is on backend and mobile development, though I work across the full stack. I think about long-term impact and approach problems with care and attention to detail.',
            'about.p3': 'Naturally curious — I enjoy exploring system design, architecture patterns, and deepening my understanding of computer science fundamentals. Always learning and improving.',
            'about.skills-title': 'Technologies I work with',
            'about.github-title': 'GitHub Activity',
            'about.github.repos': 'repos',
            'about.github.stars': 'stars',
            'about.github.commits': 'commits',

            // Experience Section
            'experience.title': 'Experience',
            'experience.current': 'Present',
            'experience.topinvest.title': 'Junior Full Stack Developer',
            'experience.topinvest.company': 'TopInvest (Grupo PRIMO)',
            'experience.topinvest.date': 'August 2024 - Present',
            'experience.topinvest.description': 'Working across 5 production systems serving tens of thousands of MAU, gaining practical experience maintaining and improving products at scale.',
            'experience.topinvest.mobile-arch': 'Mobile Architecture & Stack Unification',
            'experience.topinvest.mobile-1': 'Contributed to the migration from Flutter to React Native to unify the mobile stack and reduce technical debt',
            'experience.topinvest.mobile-2': 'Built the proof of concept and proposal showing workflow gains while preserving deployment compatibility',
            'experience.topinvest.mobile-3': 'Helped design and implement a new mobile client focused on maintainability and developer experience',
            'experience.topinvest.mobile-4': 'Collaborated with multiple business units to address offline video and content-protection challenges',
            'experience.topinvest.multitenant': 'Multi-Tenant Architecture Transformation',
            'experience.topinvest.multitenant-1': 'Participated in designing and implementing a zero-downtime multi-tenant system',
            'experience.topinvest.multitenant-2': 'Learned how to support new clients on a shared codebase and infrastructure',
            'experience.topinvest.auth': 'Vendor-Independent Authentication',
            'experience.topinvest.auth-1': 'Helped build a flexible authentication system decoupled from cloud providers',
            'experience.topinvest.auth-2': 'Implemented secure admin impersonation and DRM improvements',
            'experience.topinvest.legacy': 'Legacy System Modernization',
            'experience.topinvest.legacy-1': 'Updated the authentication flow in a CodeIgniter legacy application to unify users across company products and support SSO',
            'experience.topinvest.legacy-2': 'Gained experience working with older codebases and incremental modernization',
            'experience.topinvest.practices': 'Engineering Practices',
            'experience.topinvest.practices-1': 'Participated in code reviews for maintainability, performance, and security',
            'experience.topinvest.practices-2': 'Wrote tests and documentation',
            'experience.topinvest.practices-3': 'Created architecture diagrams for alignment',
            'experience.topinvest.practices-4': 'Monitored production with Grafana',
            'experience.topinvest.practices-5': 'Advocated for improved developer experience and sustainable solutions',

            'experience.fcode.title': 'Full Stack Intern',
            'experience.fcode.company': 'FCODE',
            'experience.fcode.date': 'August 2023 - March 2024',
            'experience.fcode.item-1': 'Developed RESTful APIs and modeled relational databases',
            'experience.fcode.item-2': 'Created responsive web interfaces with focus on usability',
            'experience.fcode.item-3': 'Implemented third-party API integrations and payment systems',
            'experience.fcode.item-4': 'Worked with PHP/CodeIgniter, jQuery, and Bootstrap',

            'experience.education.title': 'Education',
            'experience.education.degree': 'Bachelor\'s in Software Engineering',
            'experience.education.institution': 'University of Caxias do Sul',
            'experience.education.date': 'March 2023 - August 2028 (in progress)',

            // Projects Section
            'projects.title': 'Projects',
            'projects.cleanser.title': 'Cleanser',
            'projects.cleanser.subtitle': 'macOS Storage Cleanup Tool',
            'projects.cleanser.desc-1': 'High-performance CLI tool that helps macOS users reclaim storage space by intelligently identifying and removing unnecessary files. Features dynamic pattern-based discovery to detect cache directories, build artifacts, and duplicate files across the filesystem using parallel SHA-256 hashing.',
            'projects.cleanser.desc-2': 'Implemented smart caching system, risk-based cleanup levels (Safe/Moderate/Risky), and configurable scan depths to balance thoroughness with performance. Published as a Homebrew package with comprehensive CI/CD pipelines.',
            'projects.cleanser.link-code': 'View Code →',
            'projects.cleanser.link-install': 'Install →',
            'projects.cymatic.title': 'Cymatic',
            'projects.cymatic.subtitle': 'Real-time Audiovisual Synthesizer',
            'projects.cymatic.desc-1': 'Browser-based audiovisual synthesis system inspired by cymatics — the study of visible sound vibrations. The application generates synchronized audio and visual patterns where the graphics directly represent the harmonic content being played.',
            'projects.cymatic.desc-2': 'Real-time audio synthesis with configurable harmonic layers using musical intervals. WebGL2 fragment shader implementing physics-based cymatic field equations with frame-perfect audio-visual synchronization. Built with immutable state architecture and pub-sub pattern for reactive updates.',
            'projects.cymatic.link': 'Launch App →',

            // Writing Section
            'writing.title': 'Writing',
            'writing.intro': 'Thoughts on software architecture, system design, and engineering practices.',
            'writing.view-all': 'View all posts →',
            'writing.cymatic.date': 'January 15, 2025',
            'writing.cymatic.title': 'Building Cymatic: Where Music Theory Meets WebGL',
            'writing.cymatic.excerpt': 'From music teacher to developer: building a browser-based audiovisual synthesizer that visualizes the science of sound. Exploring cymatics, harmonic ratios, and real-time audio-visual synchronization.',
            'writing.mobile.date': 'December 15, 2024',
            'writing.mobile.title': 'Mobile Stack Unification: Flutter to React Native',
            'writing.mobile.excerpt': 'The technical and strategic reasoning behind our mobile stack unification. From proof of concept to company-wide adoption, including challenges with offline video access and DRM implementation.',
            'writing.auth.date': 'November 20, 2024',
            'writing.auth.title': 'Building Vendor-Independent Authentication Systems',
            'writing.auth.excerpt': 'Designing authentication architecture that avoids vendor lock-in. How to build fallback systems that make provider migration painless, featuring AWS Cognito, JWT, and security best practices.',

            // Contact Section
            'contact.title': 'Get in Touch',
            'contact.text': 'I\'m always interested in discussing software architecture, system design, or potential collaborations.',

            // Footer
            'footer.text': '© 2025 Pedro Henrique França. Built with care.'
        },
        'pt': {
            // Navigation
            'nav.about': 'Sobre',
            'nav.experience': 'Experiência',
            'nav.projects': 'Projetos',
            'nav.writing': 'Escrita',
            'nav.contact': 'Contato',

            // Hero Section
            'hero.title': 'Pedro Henrique França',
            'hero.subtitle': 'Desenvolvedor de Software',
            'hero.description': 'Construindo sistemas sustentáveis com atenção à arquitetura e fundamentos de engenharia. Focado em desenvolvimento mobile e backend.',

            // About Section
            'about.title': 'Sobre',
            'about.p1': 'Desenvolvedor Full Stack apaixonado por arquitetura de software e fundamentos de engenharia. Valorizo código sustentável, bons princípios de design e entender o "porquê" por trás das decisões técnicas.',
            'about.p2': 'Meu foco é desenvolvimento backend e mobile, embora trabalhe em toda a stack. Penso no impacto a longo prazo e abordo problemas com cuidado e atenção aos detalhes.',
            'about.p3': 'Naturalmente curioso — gosto de explorar design de sistemas, padrões de arquitetura e aprofundar minha compreensão dos fundamentos de ciência da computação. Sempre aprendendo e evoluindo.',
            'about.skills-title': 'Tecnologias que utilizo',
            'about.github-title': 'Atividade no GitHub',
            'about.github.repos': 'repos',
            'about.github.stars': 'estrelas',
            'about.github.commits': 'commits',

            // Experience Section
            'experience.title': 'Experiência',
            'experience.current': 'Atualmente',
            'experience.topinvest.title': 'Desenvolvedor Full Stack Júnior',
            'experience.topinvest.company': 'TopInvest (Grupo PRIMO)',
            'experience.topinvest.date': 'Agosto 2024 - Atualmente',
            'experience.topinvest.description': 'Trabalhando em 5 sistemas em produção servindo dezenas de milhares de usuários ativos mensais, ganhando experiência prática mantendo e melhorando produtos em escala.',
            'experience.topinvest.mobile-arch': 'Arquitetura Mobile & Unificação de Stack',
            'experience.topinvest.mobile-1': 'Contribuí para a migração de Flutter para React Native para unificar a stack mobile e reduzir dívida técnica',
            'experience.topinvest.mobile-2': 'Construí a prova de conceito e proposta mostrando ganhos de workflow preservando compatibilidade de deploy',
            'experience.topinvest.mobile-3': 'Ajudei a projetar e implementar um novo cliente mobile focado em manutenibilidade e experiência do desenvolvedor',
            'experience.topinvest.mobile-4': 'Colaborei com múltiplas unidades de negócio para resolver desafios de vídeo offline e proteção de conteúdo',
            'experience.topinvest.multitenant': 'Transformação de Arquitetura Multi-Tenant',
            'experience.topinvest.multitenant-1': 'Participei no design e implementação de um sistema multi-tenant com zero downtime',
            'experience.topinvest.multitenant-2': 'Aprendi como suportar novos clientes em uma base de código e infraestrutura compartilhada',
            'experience.topinvest.auth': 'Autenticação Independente de Fornecedor',
            'experience.topinvest.auth-1': 'Ajudei a construir um sistema de autenticação flexível desacoplado de provedores de nuvem',
            'experience.topinvest.auth-2': 'Implementei personificação segura de admin e melhorias de DRM',
            'experience.topinvest.legacy': 'Modernização de Sistema Legado',
            'experience.topinvest.legacy-1': 'Atualizei o fluxo de autenticação em uma aplicação legada CodeIgniter para unificar usuários entre produtos da empresa e suportar SSO',
            'experience.topinvest.legacy-2': 'Ganhei experiência trabalhando com bases de código antigas e modernização incremental',
            'experience.topinvest.practices': 'Práticas de Engenharia',
            'experience.topinvest.practices-1': 'Participei em revisões de código para manutenibilidade, performance e segurança',
            'experience.topinvest.practices-2': 'Escrevi testes e documentação',
            'experience.topinvest.practices-3': 'Criei diagramas de arquitetura para alinhamento',
            'experience.topinvest.practices-4': 'Monitorei produção com Grafana',
            'experience.topinvest.practices-5': 'Defendi melhor experiência do desenvolvedor e soluções sustentáveis',

            'experience.fcode.title': 'Estagiário Full Stack',
            'experience.fcode.company': 'FCODE',
            'experience.fcode.date': 'Agosto 2023 - Março 2024',
            'experience.fcode.item-1': 'Desenvolvi APIs RESTful e modelei bancos de dados relacionais',
            'experience.fcode.item-2': 'Criei interfaces web responsivas com foco em usabilidade',
            'experience.fcode.item-3': 'Implementei integrações com APIs de terceiros e sistemas de pagamento',
            'experience.fcode.item-4': 'Trabalhei com PHP/CodeIgniter, jQuery e Bootstrap',

            'experience.education.title': 'Educação',
            'experience.education.degree': 'Bacharelado em Engenharia de Software',
            'experience.education.institution': 'Universidade de Caxias do Sul',
            'experience.education.date': 'Março 2023 - Agosto 2028 (em andamento)',

            // Projects Section
            'projects.title': 'Projetos',
            'projects.cleanser.title': 'Cleanser',
            'projects.cleanser.subtitle': 'Ferramenta de Limpeza de Armazenamento para macOS',
            'projects.cleanser.desc-1': 'Ferramenta CLI de alta performance que ajuda usuários macOS a recuperar espaço de armazenamento identificando e removendo arquivos desnecessários de forma inteligente. Possui descoberta dinâmica baseada em padrões para detectar diretórios de cache, artefatos de build e arquivos duplicados através do sistema usando hashing SHA-256 paralelo.',
            'projects.cleanser.desc-2': 'Implementou sistema de cache inteligente, níveis de limpeza baseados em risco (Seguro/Moderado/Arriscado) e profundidades de scan configuráveis para balancear minúcia com performance. Publicado como pacote Homebrew com pipelines CI/CD abrangentes.',
            'projects.cleanser.link-code': 'Ver Código →',
            'projects.cleanser.link-install': 'Instalar →',
            'projects.cymatic.title': 'Cymatic',
            'projects.cymatic.subtitle': 'Sintetizador Audiovisual em Tempo Real',
            'projects.cymatic.desc-1': 'Sistema de síntese audiovisual baseado em navegador inspirado em cimática — o estudo de vibrações sonoras visíveis. A aplicação gera padrões de áudio e visuais sincronizados onde os gráficos representam diretamente o conteúdo harmônico sendo tocado.',
            'projects.cymatic.desc-2': 'Síntese de áudio em tempo real com camadas harmônicas configuráveis usando intervalos musicais. Shader de fragmento WebGL2 implementando equações de campo cimático baseadas em física com sincronização áudio-visual perfeita. Construído com arquitetura de estado imutável e padrão pub-sub para atualizações reativas.',
            'projects.cymatic.link': 'Abrir App →',

            // Writing Section
            'writing.title': 'Escrita',
            'writing.intro': 'Reflexões sobre arquitetura de software, design de sistemas e práticas de engenharia.',
            'writing.view-all': 'Ver todos os posts →',
            'writing.cymatic.date': '15 de Janeiro, 2025',
            'writing.cymatic.title': 'Construindo Cymatic: Onde Teoria Musical Encontra WebGL',
            'writing.cymatic.excerpt': 'De professor de música a desenvolvedor: construindo um sintetizador audiovisual no navegador que visualiza a ciência do som. Explorando cimática, proporções harmônicas e sincronização áudio-visual em tempo real.',
            'writing.mobile.date': '15 de Dezembro, 2024',
            'writing.mobile.title': 'Unificação de Stack Mobile: Flutter para React Native',
            'writing.mobile.excerpt': 'O raciocínio técnico e estratégico por trás da nossa unificação de stack mobile. Da prova de conceito à adoção em toda a empresa, incluindo desafios com acesso a vídeo offline e implementação de DRM.',
            'writing.auth.date': '20 de Novembro, 2024',
            'writing.auth.title': 'Construindo Sistemas de Autenticação Independentes de Fornecedor',
            'writing.auth.excerpt': 'Projetando arquitetura de autenticação que evita vendor lock-in. Como construir sistemas de fallback que tornam a migração de provedores indolor, apresentando AWS Cognito, JWT e melhores práticas de segurança.',

            // Contact Section
            'contact.title': 'Entre em Contato',
            'contact.text': 'Estou sempre interessado em discutir arquitetura de software, design de sistemas ou possíveis colaborações.',

            // Footer
            'footer.text': '© 2025 Pedro Henrique França. Feito com carinho.'
        }
    },

    // Initialize language module
    init() {
        // Load saved language from localStorage
        const savedLanguage = localStorage.getItem('portfolio-language');
        if (savedLanguage && this.availableLanguages[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }

        // Apply initial language
        this.applyLanguage(this.currentLanguage);

        // Setup language toggle button
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => this.toggleLanguage());
        }
    },

    // Toggle between languages
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'pt' : 'en';
        this.applyLanguage(this.currentLanguage);
        localStorage.setItem('portfolio-language', this.currentLanguage);
    },

    // Apply language to page
    applyLanguage(language) {
        const translations = this.translations[language];
        if (!translations) return;

        // Update html lang attribute
        document.documentElement.setAttribute('lang', language);

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });

        // Update language toggle button label
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            const label = languageToggle.querySelector('.language-label');
            if (label) {
                label.textContent = language.toUpperCase();
            }
        }
    },

    // Get translation for a key
    translate(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
};
