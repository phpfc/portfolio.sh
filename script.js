// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }
    
    applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        this.currentTheme = theme;
        localStorage.setItem('portfolio-theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }
    
    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.currentTab = 'about';
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showTab(this.currentTab);
    }
    
    bindEvents() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const tabName = item.getAttribute('data-tab');
                this.showTab(tabName);
                this.updateActiveNavItem(item);
            });
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.showTab('about');
                        break;
                    case '2':
                        e.preventDefault();
                        this.showTab('projects');
                        break;
                    case '3':
                        e.preventDefault();
                        this.showTab('blog');
                        break;
                    case '4':
                        e.preventDefault();
                        this.showTab('cv');
                        break;
                }
            }
        });
    }
    
    showTab(tabName) {
        // Hide all tabs
        const allTabs = document.querySelectorAll('.tab-content');
        allTabs.forEach(tab => tab.classList.remove('active'));
        
        // Show selected tab
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
            this.currentTab = tabName;
        }
        
        // Update navigation active state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabName) {
                this.updateActiveNavItem(item);
            }
        });
    }
    
    updateActiveNavItem(activeItem) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        activeItem.classList.add('active');
    }
}

// Terminal Effects
class TerminalEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.addTypingEffect();
        this.addHoverEffects();
    }
    
    addTypingEffect() {
        // Add subtle typing animation to the cursor
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            // Cursor already has CSS animation, but we can add more effects here
            setInterval(() => {
                cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
            }, 500);
        }
    }
    
    addHoverEffects() {
        // Add terminal-like hover effects
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(4px)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
            });
        });
        
        // Add click effects to links
        const links = document.querySelectorAll('.link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add a subtle flash effect
                link.style.opacity = '0.7';
                setTimeout(() => {
                    link.style.opacity = '1';
                }, 150);
            });
        });
    }
}

// Utility Functions
class Utils {
    static formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
    
    static smoothScroll(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const terminalEffects = new TerminalEffects();
    
    // Add some easter eggs
    console.log(`
    ╔══════════════════════════════════════╗
    ║          Welcome to my portfolio!    ║
    ║                                      ║
    ║  Try these keyboard shortcuts:       ║
    ║  • Ctrl/Cmd + 1-4: Navigate tabs    ║
    ║  • Click theme toggle for themes     ║
    ║                                      ║
    ║  Built with ❤️ and terminal vibes   ║
    ╚══════════════════════════════════════╝
    `);
    
    // Add some interactive console commands
    window.portfolio = {
        theme: () => themeManager.toggleTheme(),
        navigate: (tab) => navigationManager.showTab(tab),
        about: () => navigationManager.showTab('about'),
        projects: () => navigationManager.showTab('projects'),
        blog: () => navigationManager.showTab('blog'),
        cv: () => navigationManager.showTab('cv'),
        help: () => {
            console.log(`
Available commands:
• portfolio.theme() - Toggle theme
• portfolio.navigate('tab') - Navigate to tab
• portfolio.about() - Go to about
• portfolio.projects() - Go to projects  
• portfolio.blog() - Go to blog
• portfolio.cv() - Go to CV
            `);
        }
    };
    
    console.log("Type 'portfolio.help()' for available commands!");
});

// Add some performance optimizations
window.addEventListener('load', () => {
    // Preload theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Add smooth transitions after page load
    document.body.style.transition = 'all 0.3s ease';
});

// Handle visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});