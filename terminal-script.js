// Interactive Terminal Portfolio
class InteractiveTerminal {
    constructor() {
        this.input = document.getElementById('terminal-input');
        this.history = document.getElementById('terminal-history');
        this.autocomplete = document.getElementById('autocomplete');
        this.currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
        
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentSuggestion = '';
        
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
                action: () => this.showContent('blog')
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
                action: () => this.toggleTheme()
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
            }
        };
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
        this.showInitialSuggestion();
    }
    
    bindEvents() {
        // Input handling
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Focus input when clicking anywhere in terminal
        document.addEventListener('click', (e) => {
            // Only focus if not in GUI mode
            const guiOverlay = document.getElementById('gui-overlay');
            if (!guiOverlay || guiOverlay.style.display === 'none') {
                this.input.focus();
            }
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
    
    executeCommand() {
        const input = this.input.value.trim();
        if (!input) return;
        
        // Add to history
        this.commandHistory.push(input);
        this.historyIndex = this.commandHistory.length;
        
        // Show command in terminal
        this.addToHistory(input, null, true);
        
        // Parse command and arguments
        const parts = input.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Execute command
        if (this.commands[command]) {
            const output = this.commands[command].action(args);
            if (output) {
                this.addToHistory(null, output);
            }
        } else {
            this.addToHistory(null, `Command not found: ${command}. Type 'help' for available commands.`, false, true);
        }
        
        // Clear input and autocomplete
        this.input.value = '';
        this.clearAutocomplete();
        this.showInitialSuggestion();
        
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
    
    addToHistory(command, output, isCommand = false, isError = false) {
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
        helpContent.innerHTML = `
            <h3>Available Commands:</h3>
            <div class="help-section">
                ${Object.entries(this.commands).map(([cmd, info]) => `
                    <div class="help-command">
                        <span class="help-command-name">${cmd}</span>
                        <span class="help-command-desc">${info.description}</span>
                    </div>
                `).join('')}
            </div>
            <p>Use <span class="highlight">Tab</span> for autocomplete, <span class="highlight">↑/↓</span> for command history.</p>
            <p>Try <span class="highlight">gui</span> to switch to graphical mode!</p>
        `;
        this.addToHistory(null, helpContent);
    }
    
    showContent(section) {
        const contentElement = document.getElementById(`${section}-content`);
        if (!contentElement) {
            this.addToHistory(null, `Section '${section}' not found.`, false, true);
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
    
    applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
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
    
    // Mode switching methods
    switchToGUI() {
        this.addToHistory(null, 'Switching to <span class="highlight">GUI mode</span>...');
        setTimeout(() => {
            this.showGUIMode();
        }, 500);
    }
    
    switchToCLI() {
        this.hideGUIMode();
        this.addToHistory(null, 'Switched back to <span class="highlight">CLI mode</span>. Welcome back to the terminal!');
    }
    
    toggleMode() {
        const guiOverlay = document.getElementById('gui-overlay');
        if (guiOverlay && guiOverlay.style.display !== 'none') {
            this.switchToCLI();
        } else {
            this.switchToGUI();
        }
    }
    
    showGUIMode() {
        let guiOverlay = document.getElementById('gui-overlay');
        
        if (!guiOverlay) {
            guiOverlay = this.createGUIOverlay();
            document.body.appendChild(guiOverlay);
        }
        
        guiOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    hideGUIMode() {
        const guiOverlay = document.getElementById('gui-overlay');
        if (guiOverlay) {
            guiOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
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
                        ${document.getElementById('blog-content').innerHTML}
                    </div>
                    <div id="gui-cv" class="gui-section">
                        ${document.getElementById('cv-content').innerHTML}
                    </div>
                </div>
                
                <div class="gui-footer">
                    <p>Press <code>Ctrl+C</code> or <code>Esc</code> to return to CLI mode • Click ✕ to close</p>
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
            button.addEventListener('click', () => {
                const targetSection = button.getAttribute('data-section');
                
                // Update active nav button
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active section
                sections.forEach(section => section.classList.remove('active'));
                const targetElement = document.getElementById(`gui-${targetSection}`);
                if (targetElement) {
                    targetElement.classList.add('active');
                }
            });
        });
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