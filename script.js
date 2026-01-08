// Interactive Terminal Portfolio
class InteractiveTerminal {
    constructor() {
        this.input = document.getElementById('terminal-input');
        this.history = document.getElementById('terminal-history');
        this.autocomplete = document.getElementById('autocomplete');
        this.currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
        this.currentMode = localStorage.getItem('portfolio-mode') || 'cli';
        
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentSuggestion = '';
        
        // Blog system
        this.blogPosts = [];
        this.blogConfig = null;
        
        // Available commands
        this.commands = {
            'help': {
                description: 'Show available commands',
                action: () => this.showHelp()
            },
            'about': {
                description: 'Show information about me',
                action: () => this.showContent('about')
            },
            'projects': {
                description: 'Display my projects',
                action: () => this.showContent('projects')
            },
            'blog': {
                description: 'Show blog posts',
                action: (args) => this.handleBlog(args)
            },
            'cv': {
                description: 'Display my CV/resume',
                action: () => this.showContent('cv')
            },
            'resume': {
                description: 'Alias for cv command',
                action: () => this.showContent('cv')
            },
            'ls': {
                description: 'List available sections',
                action: () => this.listSections()
            },
            'clear': {
                description: 'Clear the terminal',
                action: () => this.clearTerminal()
            },
            'theme': {
                description: 'Toggle between dark and light theme',
                action: (args) => this.handleTheme(args)
            },
            'contact': {
                description: 'Show contact information',
                action: () => this.showContact()
            },
            'whoami': {
                description: 'Display user information',
                action: () => this.whoami()
            },
            'pwd': {
                description: 'Print working directory',
                action: () => this.pwd()
            },
            'date': {
                description: 'Show current date and time',
                action: () => this.showDate()
            },
            'echo': {
                description: 'Display a line of text',
                action: (args) => this.echo(args)
            },
            'gui': {
                description: 'Switch to graphical user interface mode',
                action: () => this.switchToGUI()
            },
            'cli': {
                description: 'Switch to command line interface mode',
                action: () => this.switchToCLI()
            },
            'mode': {
                description: 'Toggle between GUI and CLI modes',
                action: () => this.toggleMode()
            },
            'neofetch': {
                description: 'Display system information (easter egg)',
                action: () => this.neofetch(),
                hidden: true
            },
            'easter': {
                description: 'Show hidden easter eggs and commands',
                action: () => this.showEasterEggs(),
                hidden: true
            }
        };
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
        this.showInitialSuggestion();
        this.loadBlogConfig();
        
        // Restore GUI mode if it was previously active - show immediately
        if (this.currentMode === 'gui') {
            this.showGUIMode(true); // Show immediately without delay
        }
        // Auto-trigger GUI mode on mobile devices (but respect saved preference)
        else if (this.isMobileDevice() && this.currentMode === 'cli') {
            setTimeout(() => {
                this.showGUIMode();
            }, 1000); // Small delay to let the terminal load first
        }
    }
    
    bindEvents() {
        // Input handling
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
        
        // Focus input when clicking anywhere in terminal
        document.addEventListener('click', () => {
            this.input.focus();
        });
        
        // Prevent losing focus
        this.input.addEventListener('blur', () => {
            setTimeout(() => {
                const guiOverlay = document.getElementById('gui-overlay');
                if (!guiOverlay || guiOverlay.style.display === 'none') {
                    this.input.focus();
                }
            }, 10);
        });
    }
    
    showInitialSuggestion() {
        if (this.input.value === '') {
            this.showAutocomplete('help');
        }
    }
    
    handleInput(e) {
        const value = e.target.value;
        this.updateAutocomplete(value);
    }
    
    handleKeydown(e) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand();
                break;
            case 'Tab':
                e.preventDefault();
                this.acceptAutocomplete();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Escape':
                e.preventDefault();
                this.clearAutocomplete();
                break;
        }
    }
    
    handleGlobalKeydown(e) {
        // Handle Ctrl+C to quit GUI mode
        if (e.ctrlKey && e.key === 'c') {
            const guiOverlay = document.getElementById('gui-overlay');
            if (guiOverlay && guiOverlay.style.display !== 'none') {
                e.preventDefault();
                this.switchToCLI();
            }
        }
        
        // Handle Escape to quit GUI mode
        if (e.key === 'Escape') {
            const guiOverlay = document.getElementById('gui-overlay');
            if (guiOverlay && guiOverlay.style.display !== 'none') {
                e.preventDefault();
                this.switchToCLI();
            }
        }
    }
    
    updateAutocomplete(input) {
        if (!input) {
            this.showAutocomplete('help');
            return;
        }
        
        // Check if it's a theme command with arguments
        const parts = input.split(' ');
        if (parts[0].toLowerCase() === 'theme' && parts.length > 1) {
            const themeArg = parts[1].toLowerCase();
            const availableThemes = ['list', 'catppuccin', 'dracula', 'gruvbox', 'nord', 'tokyo-night', 'synthwave', 'matrix', 'light', 'dark'];
            const matches = availableThemes.filter(theme => theme.startsWith(themeArg));
            
            if (matches.length > 0 && matches[0] !== themeArg) {
                this.showAutocomplete(`theme ${matches[0]}`);
                return;
            }
        }
        
        // Check if it's a blog command with arguments
        if (parts[0].toLowerCase() === 'blog' && parts.length > 1) {
            const blogArg = parts[1].toLowerCase();
            const availableBlogCommands = ['list', 'read'];
            const matches = availableBlogCommands.filter(cmd => cmd.startsWith(blogArg));
            
            if (matches.length > 0 && matches[0] !== blogArg) {
                this.showAutocomplete(`blog ${matches[0]}`);
                return;
            }
            
            // If it's "blog read", suggest post slugs
            if (parts[1].toLowerCase() === 'read' && parts.length > 2 && this.blogConfig) {
                const slugArg = parts[2].toLowerCase();
                const slugMatches = this.blogConfig.posts
                    .map(post => post.slug)
                    .filter(slug => slug.startsWith(slugArg));
                
                if (slugMatches.length > 0 && slugMatches[0] !== slugArg) {
                    this.showAutocomplete(`blog read ${slugMatches[0]}`);
                    return;
                }
            }
        }
        
        const matches = Object.keys(this.commands).filter(cmd => 
            cmd.startsWith(input.toLowerCase())
        );
        
        if (matches.length > 0 && matches[0] !== input) {
            this.showAutocomplete(matches[0]);
        } else {
            this.clearAutocomplete();
        }
    }
    
    showAutocomplete(suggestion) {
        this.currentSuggestion = suggestion;
        this.autocomplete.textContent = suggestion;
        this.autocomplete.classList.add('show');
    }
    
    clearAutocomplete() {
        this.currentSuggestion = '';
        this.autocomplete.textContent = '';
        this.autocomplete.classList.remove('show');
    }
    
    acceptAutocomplete() {
        if (this.currentSuggestion) {
            this.input.value = this.currentSuggestion;
            this.clearAutocomplete();
        }
    }
    
    async executeCommand() {
        const input = this.input.value.trim();
        if (!input) return;
        
        // Add to history
        this.commandHistory.push(input);
        this.historyIndex = this.commandHistory.length;
        
        // Show command in terminal
        this.addToHistory(input, null);
        
        // Parse command and arguments
        const parts = input.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Clear input and autocomplete immediately
        this.input.value = '';
        this.clearAutocomplete();
        this.showInitialSuggestion();
        
        // Execute command
        if (this.commands[command]) {
            try {
                // Show loading for async commands
                if (command === 'blog') {
                    const loadingDiv = document.createElement('div');
                    loadingDiv.innerHTML = '<p style="opacity: 0.6;">Loading blog posts...</p>';
                    loadingDiv.className = 'loading-indicator';
                    this.addToHistory(null, loadingDiv);
                }
                
                const output = await this.commands[command].action(args);
                
                // Remove loading indicator
                if (command === 'blog') {
                    const loadingIndicator = document.querySelector('.loading-indicator');
                    if (loadingIndicator) {
                        loadingIndicator.remove();
                    }
                }
                
                if (output) {
                    this.addToHistory(null, output);
                }
            } catch (error) {
                console.error('Command execution error:', error);
                this.addToHistory(null, `Error executing command: ${error.message}`, true);
            }
        } else {
            this.addToHistory(null, `Command not found: ${command}. Type 'help' for available commands.`, true);
        }
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }
        
        this.input.value = this.commandHistory[this.historyIndex] || '';
        this.clearAutocomplete();
    }
    
    addToHistory(command, output, isError = false) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        if (command) {
            const commandLine = document.createElement('div');
            commandLine.className = 'history-command';
            commandLine.innerHTML = `
                <span class="prompt">phfranca@portfolio:~$</span>
                <span class="command">${command}</span>
            `;
            historyItem.appendChild(commandLine);
        }
        
        if (output) {
            // If it's already a DOM element with output class, add it directly
            if (output.classList && output.classList.contains('output')) {
                historyItem.appendChild(output);
            } else {
                // Otherwise, wrap it in history-output
                const outputDiv = document.createElement('div');
                outputDiv.className = `history-output ${isError ? 'error' : ''}`;
                
                if (typeof output === 'string') {
                    outputDiv.innerHTML = output;
                } else {
                    outputDiv.appendChild(output);
                }
                
                historyItem.appendChild(outputDiv);
            }
        }
        
        this.history.appendChild(historyItem);
    }
    
    scrollToBottom() {
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 100);
    }
    
    // Command implementations
    showHelp() {
        const helpContent = document.createElement('div');
        const visibleCommands = Object.entries(this.commands).filter(([cmd, info]) => !info.hidden);
        
        helpContent.innerHTML = `
            <h3>Available Commands:</h3>
            <div class="help-section">
                ${visibleCommands.map(([cmd, info]) => `
                    <div class="help-command">
                        <span class="help-command-name">${cmd}</span>
                        <span class="help-command-desc">${info.description}</span>
                    </div>
                `).join('')}
            </div>
            <p>Use <span class="highlight">Tab</span> for autocomplete, <span class="highlight">↑/↓</span> for command history.</p>
            <p>Try <span class="highlight">blog</span> to see my latest posts, or <span class="highlight">gui</span> to switch to graphical mode!</p>
        `;
        this.addToHistory(null, helpContent);
    }
    
    showContent(section) {
        const contentElement = document.getElementById(`${section}-content`);
        if (!contentElement) {
            this.addToHistory(null, `Section '${section}' not found.`, true);
            return;
        }
        
        // Clone and append content directly without extra prompt
        const content = contentElement.cloneNode(true);
        content.style.display = 'block';
        content.className = 'output';
        
        this.addToHistory(null, content);
    }
    
    listSections() {
        const output = document.createElement('div');
        output.innerHTML = `
            <div class="file-list">
                <div class="file-item">
                    <span class="file-permissions">drwxr-xr-x</span>
                    <span class="file-name">about/</span>
                    <span class="file-description">Personal information and skills</span>
                </div>
                <div class="file-item">
                    <span class="file-permissions">drwxr-xr-x</span>
                    <span class="file-name">projects/</span>
                    <span class="file-description">My personal projects and work</span>
                </div>
                <div class="file-item">
                    <span class="file-permissions">drwxr-xr-x</span>
                    <span class="file-name">blog/</span>
                    <span class="file-description">Technical articles and thoughts</span>
                </div>
                <div class="file-item">
                    <span class="file-permissions">-rw-r--r--</span>
                    <span class="file-name">cv.pdf</span>
                    <span class="file-description">Professional experience and education</span>
                </div>
            </div>
        `;
        this.addToHistory(null, output);
    }
    
    clearTerminal() {
        this.history.innerHTML = '';
        this.addToHistory(null, '<p>Terminal cleared. Type <span class="highlight">help</span> for available commands.</p>');
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        this.addToHistory(null, `Theme switched to <span class="highlight">${this.currentTheme}</span> mode.`);
    }
    
    handleTheme(args) {
        const availableThemes = {
            'dark': 'Default dark theme',
            'light': 'Clean light theme',
            'catppuccin': 'Catppuccin Mocha - Soothing pastel theme',
            'dracula': 'Dracula - Dark theme with vibrant colors',
            'gruvbox': 'Gruvbox - Retro groove colors',
            'nord': 'Nord - Arctic, north-bluish color palette',
            'tokyo-night': 'Tokyo Night - A clean, dark theme',
            'synthwave': 'Synthwave \'84 - Neon cyberpunk vibes',
            'matrix': 'Matrix - Green on black hacker aesthetic'
        };
        
        if (args.length === 0) {
            // No arguments, toggle between dark and light
            this.toggleTheme();
            return;
        }
        
        const requestedTheme = args[0].toLowerCase();
        
        if (requestedTheme === 'list' || requestedTheme === 'ls') {
            // List available themes
            const output = document.createElement('div');
            output.innerHTML = `
                <h3>Available Themes:</h3>
                <div class="help-section">
                    ${Object.entries(availableThemes).map(([theme, description]) => `
                        <div class="help-command">
                            <span class="help-command-name">${theme}</span>
                            <span class="help-command-desc">${description}</span>
                        </div>
                    `).join('')}
                </div>
                <p>Usage: <span class="highlight">theme [theme-name]</span> or just <span class="highlight">theme</span> to toggle</p>
            `;
            this.addToHistory(null, output);
            return;
        }
        
        if (availableThemes[requestedTheme]) {
            this.currentTheme = requestedTheme;
            this.applyTheme(requestedTheme);
            
            // Add some fun messages for easter egg themes
            let message = `Theme switched to <span class="highlight">${requestedTheme}</span>`;
            
            switch(requestedTheme) {
                case 'catppuccin':
                    message += ' ☕ Cozy and warm!';
                    break;
                case 'dracula':
                    message += ' 🧛‍♂️ Welcome to the dark side!';
                    break;
                case 'gruvbox':
                    message += ' 📼 Retro vibes activated!';
                    break;
                case 'nord':
                    message += ' ❄️ Cool and minimal!';
                    break;
                case 'tokyo-night':
                    message += ' 🌃 Neon lights of Tokyo!';
                    break;
                case 'synthwave':
                    message += ' 🌈 Welcome to the 80s!';
                    break;
                case 'matrix':
                    message += ' 💊 Follow the white rabbit...';
                    break;
                case 'light':
                    message += ' ☀️ Clean and bright!';
                    break;
                case 'dark':
                    message += ' 🌙 Back to the classics!';
                    break;
            }
            
            this.addToHistory(null, message);
        } else {
            this.addToHistory(null, `Unknown theme: <span class="highlight">${requestedTheme}</span>. Use <span class="highlight">theme list</span> to see available themes.`, true);
        }
    }
    
    applyTheme(theme) {
        // Remove any existing theme attributes
        document.documentElement.removeAttribute('data-theme');
        
        // Apply new theme (except for default dark)
        if (theme !== 'dark') {
            document.documentElement.setAttribute('data-theme', theme);
        }
        
        this.currentTheme = theme;
        localStorage.setItem('portfolio-theme', theme);
    }
    
    showContact() {
        const output = document.createElement('div');
        output.innerHTML = `
            <h3>Contact Information</h3>
            <p>📧 <a href="mailto:pedrofranca-tech@proton.me" class="link">pedrofranca-tech@proton.me</a></p>
            <p>🐙 <a href="https://github.com/phpfc" class="link" target="_blank">github.com/phpfc</a></p>
            <p>💼 <a href="https://linkedin.com/in/pedro-henrique-pfranca/" class="link" target="_blank">linkedin.com/in/pedro-henrique-pfranca/</a></p>
            <p>📍 Caxias do Sul, RS | 🇧🇷 Brazil</p>
        `;
        this.addToHistory(null, output);
    }
    
    whoami() {
        this.addToHistory(null, `
            <h3>Pedro Henrique França</h3>
            <p>Full Stack Developer | Software Architecture Enthusiast</p>
            <p>Passionate about maintainable code, system design, and engineering fundamentals.</p>
        `);
    }
    
    pwd() {
        this.addToHistory(null, '/home/phfranca/portfolio');
    }
    
    showDate() {
        const now = new Date();
        this.addToHistory(null, now.toString());
    }
    
    echo(args) {
        const text = args.join(' ');
        this.addToHistory(null, text || '');
    }
    
    // Blog system methods
    async loadBlogConfig() {
        try {
            const response = await fetch('blog/config.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            this.blogConfig = await response.json();
        } catch (error) {
            console.warn('Failed to load blog config:', error);
            // Fallback: create a default config with the posts we know exist
            this.blogConfig = {
                title: "Pedro's Tech Blog",
                description: "Technical articles about software development, architecture, and engineering",
                posts: [
                    {
                        slug: "mobile-stack-unification",
                        file: "mobile-stack-unification.md"
                    },
                    {
                        slug: "vendor-independent-auth", 
                        file: "vendor-independent-auth.md"
                    },
                    {
                        slug: "rust-system-tools",
                        file: "rust-system-tools.md"
                    }
                ]
            };
        }
    }
    
    async handleBlog(args) {
        if (!this.blogConfig) {
            this.addToHistory(null, 'Blog system not initialized. Please try again in a moment...', true);
            // Try to reload config
            await this.loadBlogConfig();
            if (!this.blogConfig) {
                this.addToHistory(null, 'Failed to load blog configuration. Make sure you\'re accessing via HTTP server (http://localhost:8000)', true);
                return;
            }
        }
        
        if (args.length === 0) {
            // Show blog post list
            await this.showBlogList();
        } else if (args[0] === 'read' && args[1]) {
            // Read specific post
            await this.showBlogPost(args[1]);
        } else if (args[0] === 'list') {
            // Show blog post list (alias)
            await this.showBlogList();
        } else {
            // Show help for blog command
            this.showBlogHelp();
        }
    }
    
    async showBlogList() {
        const output = document.createElement('div');
        
        if (this.blogConfig.posts.length === 0) {
            output.innerHTML = '<p>No blog posts available yet.</p>';
            this.addToHistory(null, output);
            return;
        }
        
        let postsHtml = '<h3>Blog Posts</h3><div class="blog-list">';
        
        for (const post of this.blogConfig.posts) {
            try {
                const metadata = await this.loadPostMetadata(post.file);
                if (metadata && (metadata.published || metadata.status === 'coming-soon')) {
                    const isComingSoon = metadata.status === 'coming-soon';
                    postsHtml += `
                        <article class="blog-post-item ${isComingSoon ? 'coming-soon' : ''}">
                            <h4>
                                ${isComingSoon ? 
                                    `<span class="coming-soon-title">${metadata.title} <span class="coming-soon-badge">Coming Soon</span></span>` :
                                    `<span class="link" onclick="terminal.showBlogPost('${post.slug}')" style="cursor: pointer;">${metadata.title}</span>`
                                }
                            </h4>
                            <p class="blog-date">${metadata.date}</p>
                            <p class="blog-description">${metadata.description}</p>
                            <div class="blog-tags">
                                ${metadata.tags ? metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                            </div>
                            ${isComingSoon ? 
                                '<p><span class="coming-soon-text">This post is currently being written...</span></p>' :
                                `<p><span class="highlight">blog read ${post.slug}</span> to read the full post</p>`
                            }
                        </article>
                    `;
                }
            } catch (error) {
                console.warn(`Failed to load metadata for ${post.file}:`, error);
            }
        }
        
        postsHtml += '</div>';
        postsHtml += '<p style="margin-top: 20px;">Use <span class="highlight">blog read [slug]</span> to read a specific post.</p>';
        
        output.innerHTML = postsHtml;
        this.addToHistory(null, output);
    }
    
    async showBlogPost(slug) {
        const post = this.blogConfig.posts.find(p => p.slug === slug);
        if (!post) {
            this.addToHistory(null, `Blog post '${slug}' not found. Use <span class="highlight">blog list</span> to see available posts.`, true);
            return;
        }
        
        try {
            const metadata = await this.loadPostMetadata(post.file);
            
            // Check if post is coming soon
            if (metadata && metadata.status === 'coming-soon') {
                const output = document.createElement('div');
                output.className = 'coming-soon-post';
                output.innerHTML = `
                    <h2>${metadata.title} <span class="coming-soon-badge">Coming Soon</span></h2>
                    <p class="blog-date">${metadata.date}</p>
                    <p>${metadata.description}</p>
                    <div class="blog-tags">
                        ${metadata.tags ? metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                    </div>
                    <p class="coming-soon-message">📝 This post is currently being written. Check back soon!</p>
                `;
                this.addToHistory(null, output);
                return;
            }
            
            const content = await this.loadBlogPost(post.file);
            const output = document.createElement('div');
            output.className = 'blog-post-content';
            output.innerHTML = content;
            this.addToHistory(null, output);
        } catch (error) {
            this.addToHistory(null, `Failed to load blog post: ${error.message}`, true);
        }
    }
    
    async loadPostMetadata(filename) {
        try {
            const response = await fetch(`blog/posts/${filename}`);
            const content = await response.text();
            
            // Parse frontmatter
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (!frontmatterMatch) {
                return null;
            }
            
            const frontmatter = frontmatterMatch[1];
            const metadata = {};
            
            frontmatter.split('\n').forEach(line => {
                const match = line.match(/^(\w+):\s*(.+)$/);
                if (match) {
                    const [, key, value] = match;
                    if (value.startsWith('[') && value.endsWith(']')) {
                        // Parse array
                        metadata[key] = JSON.parse(value);
                    } else if (value.startsWith('"') && value.endsWith('"')) {
                        // Parse string
                        metadata[key] = value.slice(1, -1);
                    } else if (value === 'true' || value === 'false') {
                        // Parse boolean
                        metadata[key] = value === 'true';
                    } else {
                        // Keep as string
                        metadata[key] = value;
                    }
                }
            });
            
            return metadata;
        } catch (error) {
            console.warn(`Failed to load metadata for ${filename}:`, error);
            return null;
        }
    }
    
    async loadBlogPost(filename) {
        const response = await fetch(`blog/posts/${filename}`);
        const content = await response.text();
        
        // Remove frontmatter
        const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        
        // Parse markdown to HTML
        const html = marked.parse(contentWithoutFrontmatter);
        
        return html;
    }
    
    showBlogHelp() {
        const output = document.createElement('div');
        output.innerHTML = `
            <h3>Blog Commands</h3>
            <div class="help-section">
                <div class="help-command">
                    <span class="help-command-name">blog</span>
                    <span class="help-command-desc">List all blog posts</span>
                </div>
                <div class="help-command">
                    <span class="help-command-name">blog list</span>
                    <span class="help-command-desc">List all blog posts (alias)</span>
                </div>
                <div class="help-command">
                    <span class="help-command-name">blog read [slug]</span>
                    <span class="help-command-desc">Read a specific blog post</span>
                </div>
            </div>
        `;
        this.addToHistory(null, output);
    }
    
    // Mode switching methods
    switchToGUI() {
        this.addToHistory(null, 'Switching to <span class="highlight">GUI mode</span>...');
        setTimeout(() => {
            this.showGUIMode(false); // Explicitly use animated version
        }, 500);
    }
    
    switchToCLI() {
        this.hideGUIMode();
        let message = 'Switched back to <span class="highlight">CLI mode</span>. Welcome back to the terminal!';
        
        if (this.isMobileDevice()) {
            message += '<br><small style="opacity: 0.8;">💡 Tip: The GUI mode is optimized for mobile. Visit on desktop for the full terminal experience!</small>';
        }
        
        this.addToHistory(null, message);
    }
    
    toggleMode() {
        const guiOverlay = document.getElementById('gui-overlay');
        if (guiOverlay && guiOverlay.style.display !== 'none') {
            this.switchToCLI();
        } else {
            this.switchToGUI();
        }
    }
    
    showGUIMode(silent = false) {
        let guiOverlay = document.getElementById('gui-overlay');
        
        if (!guiOverlay) {
            guiOverlay = this.createGUIOverlay();
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
        this.currentMode = 'gui';
        localStorage.setItem('portfolio-mode', 'gui');
    }
    
    hideGUIMode() {
        const guiOverlay = document.getElementById('gui-overlay');
        if (guiOverlay) {
            guiOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Save mode preference
        this.currentMode = 'cli';
        localStorage.setItem('portfolio-mode', 'cli');
    }
    
    createGUIOverlay() {
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
                        <button class="gui-theme-toggle" onclick="terminal.toggleTheme()">◐</button>
                        <button class="gui-close" onclick="terminal.switchToCLI()">✕</button>
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
                        ${document.getElementById('about-content').innerHTML}
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
            this.setupGUINavigation();
        }, 100);
        
        return overlay;
    }
    
    setupGUINavigation() {
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
                        await this.loadGUIBlogContent();
                    }
                }
            });
        });
    }
    
    async loadGUIBlogContent() {
        const blogContainer = document.getElementById('gui-blog-content');
        if (!blogContainer || !this.blogConfig) return;
        
        try {
            let blogHtml = '<h2>Blog Posts</h2>';
            
            for (const post of this.blogConfig.posts) {
                const metadata = await this.loadPostMetadata(post.file);
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
                                `<a href="#" class="link" onclick="terminal.showGUIBlogPost('${post.slug}'); return false;">Read more</a>`
                            }
                        </article>
                    `;
                }
            }
            
            blogContainer.innerHTML = blogHtml;
        } catch (error) {
            blogContainer.innerHTML = '<p>Failed to load blog posts.</p>';
        }
    }
    
    async showGUIBlogPost(slug) {
        const post = this.blogConfig.posts.find(p => p.slug === slug);
        if (!post) return;
        
        try {
            const metadata = await this.loadPostMetadata(post.file);
            
            // Check if post is coming soon
            if (metadata && metadata.status === 'coming-soon') {
                const blogContainer = document.getElementById('gui-blog-content');
                blogContainer.innerHTML = `
                    <div class="blog-post-full">
                        <button onclick="terminal.loadGUIBlogContent()" class="back-button">← Back to Blog</button>
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
            
            const content = await this.loadBlogPost(post.file);
            
            const blogContainer = document.getElementById('gui-blog-content');
            blogContainer.innerHTML = `
                <div class="blog-post-full">
                    <button onclick="terminal.loadGUIBlogContent()" class="back-button">← Back to Blog</button>
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
    }
    
    neofetch() {
        const output = document.createElement('div');
        const userAgent = navigator.userAgent;
        const browser = this.getBrowserInfo();
        const os = this.getOSInfo();
        
        output.innerHTML = `
            <div style="display: flex; gap: 20px; align-items: flex-start;">
                <div style="color: var(--text-accent); font-size: 12px; line-height: 1.2;">
<pre>    ██████╗ ██╗  ██╗███████╗
    ██╔══██╗██║  ██║██╔════╝
    ██████╔╝███████║█████╗  
    ██╔═══╝ ██╔══██║██╔══╝  
    ██║     ██║  ██║██║     
    ╚═╝     ╚═╝  ╚═╝╚═╝     </pre>
                </div>
                <div style="flex: 1;">
                    <h3 style="color: var(--text-accent); margin-bottom: 12px;">phfranca@portfolio</h3>
                    <div style="font-size: 13px;">
                        <p><span style="color: var(--text-success);">OS:</span> ${os}</p>
                        <p><span style="color: var(--text-success);">Browser:</span> ${browser}</p>
                        <p><span style="color: var(--text-success);">Theme:</span> ${this.currentTheme}</p>
                        <p><span style="color: var(--text-success);">Shell:</span> Interactive Terminal v1.0</p>
                        <p><span style="color: var(--text-success);">Resolution:</span> ${window.screen.width}x${window.screen.height}</p>
                        <p><span style="color: var(--text-success);">Uptime:</span> ${this.getUptime()}</p>
                        <p><span style="color: var(--text-success);">Memory:</span> ${this.getMemoryInfo()}</p>
                        <p><span style="color: var(--text-success);">CPU:</span> ${navigator.hardwareConcurrency || 'Unknown'} cores</p>
                        <p><span style="color: var(--text-success);">Terminal:</span> ${this.commandHistory.length} commands executed</p>
                    </div>
                </div>
            </div>
        `;
        this.addToHistory(null, output);
    }
    
    getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }
    
    getOSInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Unknown';
    }
    
    getUptime() {
        const now = Date.now();
        const start = performance.timeOrigin;
        const uptime = Math.floor((now - start) / 1000);
        const minutes = Math.floor(uptime / 60);
        const seconds = uptime % 60;
        return `${minutes}m ${seconds}s`;
    }
    
    getMemoryInfo() {
        if ('memory' in performance) {
            const memory = performance.memory;
            const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
            const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
            return `${used}MB / ${total}MB`;
        }
        return 'Unknown';
    }
    
    showEasterEggs() {
        const output = document.createElement('div');
        output.innerHTML = `
            <h3>🥚 Hidden Easter Eggs Discovered!</h3>
            <div style="margin: 16px 0;">
                <h4 style="color: var(--text-accent); margin-bottom: 8px;">🎨 Secret Themes:</h4>
                <p>Use <span class="highlight">theme list</span> to see all available themes with descriptions!</p>
                <p>Try different theme names for surprises...</p>
            </div>
            <div style="margin: 16px 0;">
                <h4 style="color: var(--text-accent); margin-bottom: 8px;">🖥️ Hidden Commands:</h4>
                <p><span class="highlight">neofetch</span> - Display system information</p>
            </div>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.8;">🎉 You found the secret! Enjoy exploring the hidden features.</p>
        `;
        this.addToHistory(null, output);
    }
    
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
    
    downloadResume() {
        // Direct download of PDF file
        const link = document.createElement('a');
        link.href = 'resume.pdf';
        link.download = 'Pedro_Henrique_Franca_Resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show confirmation message
        this.addToHistory(null, `
            <p style="color: var(--text-success);">📄 Resume download started! Check your downloads folder.</p>
        `);
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const terminal = new InteractiveTerminal();
    
    // Add some easter eggs to console
    console.log(`
    ╔══════════════════════════════════════╗
    ║     Interactive Terminal Portfolio   ║
    ║                                      ║
    ║  Available commands:                 ║
    ║  • help - Show all commands          ║
    ║  • about - Personal information      ║
    ║  • projects - My work                ║
    ║  • blog - Technical articles         ║
    ║  • cv - Professional experience      ║
    ║  • theme - Toggle dark/light         ║
    ║                                      ║
    ║  🥚 Try 'easter' for hidden gems!   ║
    ║                                      ║
    ║  Use Tab for autocomplete!           ║
    ║  Use ↑/↓ for command history!        ║
    ╚══════════════════════════════════════╝
    `);
    
    // Make terminal available globally for debugging
    window.terminal = terminal;
});

// Handle visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
        // Refocus input
        const input = document.getElementById('terminal-input');
        if (input) input.focus();
    }
});