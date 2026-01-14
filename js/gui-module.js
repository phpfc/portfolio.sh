// GUI Module for handling graphical interface
window.GUIModule = {
    // Get GUI-related commands
    getCommands(terminal) {
        return {
            'gui': {
                description: 'Switch to graphical user interface mode',
                action: () => this.switchToGUI(terminal)
            },
            'cli': {
                description: 'Switch to command line interface mode',
                action: () => this.switchToCLI(terminal),
                hidden: true
            },
            'mode': {
                description: 'Toggle between GUI and CLI modes',
                action: () => this.toggleMode(terminal),
                hidden: true
            }
        };
    },

    // Switch to GUI mode
    switchToGUI(terminal) {
        terminal.addToHistory(null, 'Switching to <span class="highlight">GUI mode</span>...');
        setTimeout(() => {
            this.showGUIMode(terminal, false); // Explicitly use animated version
        }, 500);
    },

    // Switch to CLI mode
    switchToCLI(terminal) {
        this.hideGUIMode(terminal);
        let message = 'Switched back to <span class="highlight">CLI mode</span>. Welcome back to the terminal!';
        
        if (this.isMobileDevice()) {
            message += '<br><small style="opacity: 0.8;">💡 Tip: The GUI mode is optimized for mobile. Visit on desktop for the full terminal experience!</small>';
        }
        
        terminal.addToHistory(null, message);
    },

    // Toggle between modes
    toggleMode(terminal) {
        const guiOverlay = document.getElementById('gui-overlay');
        if (guiOverlay && guiOverlay.style.display !== 'none') {
            this.switchToCLI(terminal);
        } else {
            this.switchToGUI(terminal);
        }
    },

    // Show GUI mode
    showGUIMode(terminal, silent = false) {
        let guiOverlay = document.getElementById('gui-overlay');
        
        if (!guiOverlay) {
            guiOverlay = this.createGUIOverlay(terminal);
            document.body.appendChild(guiOverlay);
        }
        
        if (silent) {
            // No animation - instant display
            guiOverlay.style.animation = 'none';
            const guiContainer = guiOverlay.querySelector('.gui-container');
            if (guiContainer) {
                guiContainer.style.animation = 'none';
            }
            guiOverlay.style.display = 'flex';
        } else {
            // Normal animated display - restore animations
            guiOverlay.style.animation = '';
            const guiContainer = guiOverlay.querySelector('.gui-container');
            if (guiContainer) {
                guiContainer.style.animation = '';
            }
            guiOverlay.style.display = 'flex';
        }
        
        document.body.style.overflow = 'hidden';
        
        // Save mode preference
        terminal.currentMode = 'gui';
        localStorage.setItem('portfolio-mode', 'gui');
    },

    // Hide GUI mode
    hideGUIMode(terminal) {
        const guiOverlay = document.getElementById('gui-overlay');
        if (guiOverlay) {
            guiOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Save mode preference
        terminal.currentMode = 'cli';
        localStorage.setItem('portfolio-mode', 'cli');
    },

    // Create GUI overlay
    createGUIOverlay(terminal) {
        const overlay = document.createElement('div');
        overlay.id = 'gui-overlay';
        overlay.className = 'gui-overlay';
        
        overlay.innerHTML = `
            <div class="gui-container">
                <div class="gui-header">
                    <div class="gui-title">
                        <h1>Pedro Henrique França</h1>
                        <p>Full Stack Developer | Software Architecture Enthusiast</p>
                    </div>
                    <div class="gui-controls">
                        <button class="gui-theme-toggle" onclick="window.terminal.handleTheme([])">◐</button>
                        <button class="gui-close" onclick="GUIModule.switchToCLI(window.terminal)">✕</button>
                    </div>
                </div>
                
                <div class="gui-navigation">
                    <button class="gui-nav-btn active" data-section="about">About</button>
                    <button class="gui-nav-btn" data-section="projects">Projects</button>
                    <button class="gui-nav-btn" data-section="blog">Blog</button>
                    <button class="gui-nav-btn" data-section="cv">CV</button>
                </div>
                
                <div class="gui-content">
                    <div id="gui-about" class="gui-section active">
                        ${this.getAboutContentWithContact()}
                    </div>
                    <div id="gui-projects" class="gui-section">
                        ${document.getElementById('projects-content').innerHTML}
                    </div>
                    <div id="gui-blog" class="gui-section">
                        <div id="gui-blog-content">Loading blog posts...</div>
                    </div>
                    <div id="gui-cv" class="gui-section">
                        ${document.getElementById('cv-content').innerHTML}
                    </div>
                </div>
                
                <div class="gui-footer">
                    <p>Press <code>Ctrl+C</code> or <code>Esc</code> to return to CLI mode • Click ✕ to close${this.isMobileDevice() ? ' • Auto-opened for mobile' : ''}</p>
                    ${this.isMobileDevice() ? '<p style="margin-top: 8px; font-size: 11px; opacity: 0.8;">💡 <strong>Tip:</strong> Visit on desktop for the full interactive terminal experience!</p>' : ''}
                </div>
            </div>
        `;
        
        // Add navigation functionality
        setTimeout(() => {
            this.setupGUINavigation(terminal);
        }, 100);
        
        return overlay;
    },

    // Get about content with contact info injected
    getAboutContentWithContact() {
        let aboutHTML = document.getElementById('about-content').innerHTML;
        // Replace the contact section placeholder with dynamic content
        const contactHTML = window.UtilsModule.getContactHTML(false);
        aboutHTML = aboutHTML.replace(
            /<h3>Contact<\/h3>[\s\S]*?<!-- Contact information will be injected dynamically -->/,
            `<h3>Contact</h3>${contactHTML}`
        );
        return aboutHTML;
    },

    // Setup GUI navigation
    setupGUINavigation(terminal) {
        const navButtons = document.querySelectorAll('.gui-nav-btn');
        const sections = document.querySelectorAll('.gui-section');
        
        navButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const targetSection = button.getAttribute('data-section');
                
                // Update active nav button
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active section
                sections.forEach(section => section.classList.remove('active'));
                const targetElement = document.getElementById(`gui-${targetSection}`);
                if (targetElement) {
                    targetElement.classList.add('active');
                    
                    // Load blog content dynamically
                    if (targetSection === 'blog') {
                        await this.loadGUIBlogContent(terminal);
                    }
                }
            });
        });
    },

    // Load GUI blog content
    async loadGUIBlogContent(terminal) {
        const blogContainer = document.getElementById('gui-blog-content');
        if (!blogContainer || !terminal.blogConfig) return;
        
        try {
            let blogHtml = '<h2>Blog Posts</h2>';
            
            for (const post of terminal.blogConfig.posts) {
                const metadata = await BlogModule.loadPostMetadata(post.file);
                if (metadata && (metadata.published || metadata.status === 'coming-soon')) {
                    const isComingSoon = metadata.status === 'coming-soon';
                    blogHtml += `
                        <article class="blog-post ${isComingSoon ? 'coming-soon' : ''}">
                            <h3>${metadata.title} ${isComingSoon ? '<span class="coming-soon-badge">Coming Soon</span>' : ''}</h3>
                            <p class="date">${metadata.date}</p>
                            <p>${metadata.description}</p>
                            <div class="blog-tags">
                                ${metadata.tags ? metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                            </div>
                            ${isComingSoon ? 
                                '<p class="coming-soon-text">This post is currently being written...</p>' :
                                `<a href="#" class="link" onclick="GUIModule.showGUIBlogPost(window.terminal, '${post.slug}'); return false;">Read more</a>`
                            }
                        </article>
                    `;
                }
            }
            
            blogContainer.innerHTML = blogHtml;
        } catch (error) {
            blogContainer.innerHTML = '<p>Failed to load blog posts.</p>';
        }
    },

    // Show GUI blog post
    async showGUIBlogPost(terminal, slug) {
        const post = terminal.blogConfig.posts.find(p => p.slug === slug);
        if (!post) return;
        
        try {
            const metadata = await BlogModule.loadPostMetadata(post.file);
            
            // Check if post is coming soon
            if (metadata && metadata.status === 'coming-soon') {
                const blogContainer = document.getElementById('gui-blog-content');
                blogContainer.innerHTML = `
                    <div class="blog-post-full">
                        <button onclick="GUIModule.loadGUIBlogContent(window.terminal)" class="back-button">← Back to Blog</button>
                        <article>
                            <h1>${metadata.title} <span class="coming-soon-badge">Coming Soon</span></h1>
                            <p class="blog-meta">
                                <span class="date">${metadata.date}</span>
                                ${metadata.tags ? `<span class="tags">${metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</span>` : ''}
                            </p>
                            <p>${metadata.description}</p>
                            <p class="coming-soon-message">📝 This post is currently being written. Check back soon!</p>
                        </article>
                    </div>
                `;
                return;
            }
            
            const content = await BlogModule.loadBlogPost(post.file);
            
            const blogContainer = document.getElementById('gui-blog-content');
            blogContainer.innerHTML = `
                <div class="blog-post-full">
                    <button onclick="GUIModule.loadGUIBlogContent(window.terminal)" class="back-button">← Back to Blog</button>
                    <article>
                        <h1>${metadata.title}</h1>
                        <p class="blog-meta">
                            <span class="date">${metadata.date}</span>
                            ${metadata.tags ? `<span class="tags">${metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</span>` : ''}
                        </p>
                        <div class="blog-content">
                            ${content}
                        </div>
                    </article>
                </div>
            `;
        } catch (error) {
            console.error('Failed to load blog post:', error);
        }
    },

    // Check if mobile device
    isMobileDevice() {
        // Check for mobile user agents
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const isMobileUA = mobileRegex.test(navigator.userAgent);
        
        // Check for touch capability
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Check screen size (mobile-like dimensions)
        const isSmallScreen = window.innerWidth <= 768;
        
        // Consider it mobile if it matches UA pattern OR (has touch AND small screen)
        return isMobileUA || (isTouchDevice && isSmallScreen);
    }
};