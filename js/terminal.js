// Core Terminal Class
class InteractiveTerminal {
    constructor() {
        this.input = document.getElementById('terminal-input');
        this.history = document.getElementById('terminal-history');
        this.autocomplete = document.getElementById('autocomplete');
        this.currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
        this.currentMode = localStorage.getItem('portfolio-mode') || 'cli';
        
        // Load command history from localStorage
        this.commandHistory = JSON.parse(localStorage.getItem('portfolio-command-history') || '[]');
        this.historyIndex = this.commandHistory.length;
        this.currentSuggestion = '';
        this.isNavigatingHistory = false;
        
        // Blog system
        this.blogPosts = [];
        this.blogConfig = null;
        
        // Easter egg flag
        this.easterUnlocked = localStorage.getItem('portfolio-easter-unlocked') === 'true';
        
        // Initialize commands from modules
        this.commands = {};
        this.initializeCommands();
        
        this.init();
    }

    initializeCommands() {
        // Core commands
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
            'cv': {
                description: 'Display my CV/resume',
                action: () => this.showContent('cv'),
                hidden: true
            },
            'resume': {
                description: 'Display my CV/resume',
                action: () => this.showContent('cv')
            },
            'clear': {
                description: 'Clear the terminal',
                action: (args) => this.clearTerminal(args),
                hidden: true
            },
            'reset': {
                description: 'Reset terminal to default state',
                action: () => this.resetTerminal()
            },
            'history': {
                description: 'Show command history',
                action: (args) => this.showHistory(args)
            }
        };

        // Add commands from modules
        // if (window.EmailModule) {
        //     Object.assign(this.commands, window.EmailModule.getCommands(this));
        // }
        if (window.BlogModule) {
            Object.assign(this.commands, window.BlogModule.getCommands(this));
        }
        if (window.GUIModule) {
            Object.assign(this.commands, window.GUIModule.getCommands(this));
        }
        if (window.UtilsModule) {
            Object.assign(this.commands, window.UtilsModule.getCommands(this));
        }
        if (window.ThemeModule) {
            Object.assign(this.commands, window.ThemeModule.getCommands(this));
        }
    }

    init() {
        this.setupEventListeners();
        this.applyTheme(this.currentTheme);
        this.loadBlogConfig();
        this.input.focus();
        
        // Welcome section (whoami) always shows on page refresh
        const welcomeSection = document.querySelector('.welcome-section');
        if (welcomeSection) {
            welcomeSection.style.display = 'block';
        }
        
        // Handle help message visibility based on localStorage
        const helpCleared = localStorage.getItem('portfolio-help-cleared') === 'true';
        const helpMessages = document.querySelectorAll('.help-message');
        helpMessages.forEach(msg => {
            if (helpCleared) {
                msg.style.display = 'none';
            }
        });
        
        // Restore GUI mode if it was previously active
        if (this.currentMode === 'gui' && window.GUIModule) {
            window.GUIModule.showGUIMode(this, true); // Show immediately without delay
        }
        
        // Show initial suggestion (always)
        this.showInitialSuggestion();
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.input.addEventListener('input', (e) => this.handleInput(e));
        
        // Re-enable autocomplete when user clicks on input
        this.input.addEventListener('click', () => {
            if (this.input.value === '') {
                this.updateAutocomplete('');
            }
        });
        
        // Global keydown for GUI mode
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
        
        // Focus input when clicking anywhere in terminal
        document.addEventListener('click', () => {
            if (this.currentMode === 'cli') {
                setTimeout(() => {
                    const guiOverlay = document.getElementById('gui-overlay');
                    if (!guiOverlay || guiOverlay.style.display === 'none') {
                        this.input.focus();
                    }
                }, 0);
            }
        });
    }

    showInitialSuggestion() {
        // Always show help suggestion on empty input
        if (this.input.value === '') {
            setTimeout(() => {
                if (this.autocomplete) {
                    this.currentSuggestion = 'help';
                    this.autocomplete.textContent = 'help';
                    this.autocomplete.style.display = 'inline';
                    this.autocomplete.style.left = '0px';
                }
            }, 100);
        }
    }

    handleKeyDown(e) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Tab':
                e.preventDefault();
                this.handleAutocomplete();
                break;
            case 'Escape':
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
                if (window.GUIModule) {
                    window.GUIModule.switchToCLI(this);
                }
            }
        }
        
        // Handle Escape to quit GUI mode
        if (e.key === 'Escape') {
            const guiOverlay = document.getElementById('gui-overlay');
            if (guiOverlay && guiOverlay.style.display !== 'none') {
                e.preventDefault();
                if (window.GUIModule) {
                    window.GUIModule.switchToCLI(this);
                }
            }
        }
    }

    handleInput(e) {
        const value = e.target.value;
        // Re-enable autocomplete when user starts typing (not from history navigation)
        this.updateAutocomplete(value);
    }

    updateAutocomplete(input) {
        if (!input) {
            // Always show help suggestion when input is empty
            this.currentSuggestion = 'help';
            this.autocomplete.textContent = 'help';
            this.autocomplete.style.display = 'inline';
            this.autocomplete.style.left = '0px';
            return;
        }

        // Handle theme autocomplete
        if (input.startsWith('theme ') && window.ThemeModule) {
            const themeArg = input.substring(6);
            let availableThemes = Object.keys(window.ThemeModule.getListableThemes(this.easterUnlocked));
            
            // If easter is unlocked, prioritize 'list' as the first suggestion
            if (this.easterUnlocked) {
                availableThemes = ['list', ...availableThemes];
            }
            
            const matches = availableThemes.filter(theme => theme.startsWith(themeArg));
            
            if (matches.length > 0 && matches[0] !== themeArg) {
                this.showAutocomplete(`theme ${matches[0]}`);
                return;
            }
        }

        // Special case: if user types just "theme" and easter is unlocked, suggest "theme list"
        if (input === 'theme' && this.easterUnlocked) {
            this.showAutocomplete('theme list');
            return;
        }

        // Handle blog autocomplete
        if (input.startsWith('blog ')) {
            const blogArg = input.substring(5);
            const availableBlogCommands = ['list', 'read'];
            const matches = availableBlogCommands.filter(cmd => cmd.startsWith(blogArg));
            
            if (matches.length > 0 && matches[0] !== blogArg) {
                this.showAutocomplete(`blog ${matches[0]}`);
                return;
            }

            // Handle blog read autocomplete
            if (input.startsWith('blog read ') && this.blogConfig) {
                const slugArg = input.substring(10);
                const slugMatches = this.blogConfig.posts
                    .map(post => post.slug)
                    .filter(slug => slug.startsWith(slugArg));
                
                if (slugMatches.length > 0 && slugMatches[0] !== slugArg) {
                    this.showAutocomplete(`blog read ${slugMatches[0]}`);
                    return;
                }
            }
        }

        // General command autocomplete
        const availableCommands = Object.keys(this.commands).filter(cmd => {
            const command = this.commands[cmd];
            // Show hidden commands only if easter is unlocked
            return !command.hidden || this.easterUnlocked;
        });
        
        const matches = availableCommands.filter(cmd => cmd.startsWith(input.toLowerCase()));
        
        if (matches.length > 0 && matches[0] !== input) {
            this.showAutocomplete(matches[0]);
        } else {
            this.clearAutocomplete();
        }
    }

    showAutocomplete(suggestion) {
        this.currentSuggestion = suggestion;
        
        if (this.input.value === '') {
            // Show full suggestion when input is empty
            this.autocomplete.textContent = suggestion;
            this.autocomplete.style.left = '0px';
        } else {
            // Show completion part when user is typing
            const inputValue = this.input.value.toLowerCase();
            if (suggestion.toLowerCase().startsWith(inputValue)) {
                this.autocomplete.textContent = suggestion.substring(inputValue.length);
                // Position after the typed text
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                context.font = getComputedStyle(this.input).font;
                const textWidth = context.measureText(this.input.value).width;
                this.autocomplete.style.left = textWidth + 'px';
            } else {
                this.autocomplete.textContent = suggestion;
                this.autocomplete.style.left = '0px';
            }
        }
        
        this.autocomplete.style.display = 'inline';
    }

    clearAutocomplete() {
        this.currentSuggestion = '';
        this.autocomplete.textContent = '';
        this.autocomplete.style.display = 'none';
    }

    handleAutocomplete() {
        if (this.currentSuggestion) {
            this.input.value = this.currentSuggestion;
            this.clearAutocomplete();
        }
    }

    async executeCommand() {
        const input = this.input.value.trim();
        if (!input) return;

        this.commandHistory.push(input);
        this.historyIndex = this.commandHistory.length;
        
        // Save command history to localStorage (keep last 100 commands)
        const historyToSave = this.commandHistory.slice(-100);
        localStorage.setItem('portfolio-command-history', JSON.stringify(historyToSave));
        this.commandHistory = historyToSave;

        const [command, ...args] = input.split(' ');
        const cmd = this.commands[command.toLowerCase()];

        this.addToHistory(input);

        if (cmd) {
            try {
                // Show loading for async commands
                if (command === 'blog') {
                    const loadingDiv = document.createElement('div');
                    loadingDiv.innerHTML = '<p style="opacity: 0.6;">Loading blog posts...</p>';
                    loadingDiv.className = 'loading-indicator';
                    this.addToHistory(null, loadingDiv);
                }
                
                const output = await cmd.action(args);
                
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
                this.addToHistory(null, `Error executing command: ${error.message}`, true);
            }
        } else {
            this.addToHistory(null, `Command not found: ${command}. Type 'help' for available commands.`, true);
        }

        this.input.value = '';
        this.clearAutocomplete();
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.historyIndex += direction;
        
        // Clear autocomplete during history navigation to prevent visual overlap
        this.clearAutocomplete();
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            // Don't show autocomplete immediately after clearing to empty
            // User needs to start typing or click to re-enable it
            return;
        }

        this.input.value = this.commandHistory[this.historyIndex] || '';
        // Don't show autocomplete for history items to avoid visual interference
    }

    addToHistory(command, output, isError = false) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        if (command) {
            const commandLine = document.createElement('div');
            commandLine.className = 'command-line';
            commandLine.innerHTML = `
                <span class="prompt">phfranca@portfolio:~$</span>
                <span class="command">${command}</span>
            `;
            historyItem.appendChild(commandLine);
        }

        if (output) {
            if (output.classList && output.classList.contains('output')) {
                historyItem.appendChild(output);
            } else {
                const outputDiv = document.createElement('div');
                outputDiv.className = `history-output ${isError ? 'error' : ''}`;
                
                if (typeof output === 'string') {
                    outputDiv.innerHTML = output;
                } else if (output && output.nodeType === Node.ELEMENT_NODE) {
                    outputDiv.appendChild(output);
                } else {
                    // Handle other types (null, undefined, etc.)
                    outputDiv.innerHTML = String(output || '');
                }
                
                historyItem.appendChild(outputDiv);
            }
        }

        this.history.appendChild(historyItem);
        this.scrollToBottom();
    }

    scrollToBottom() {
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 10);
    }

    showHelp() {
        const visibleCommands = Object.entries(this.commands).filter(([cmd, info]) => !info.hidden);
        
        // Define logical order for commands
        const commandOrder = [
            'help', 'about', 'projects', 'cv', 'resume', 'blog', 
            'mail', 'contact', 'theme', 'gui', 'cli', 'mode',
            'clear', 'history', 'reset', 'download'
        ];
        
        // Sort commands by the defined order, putting unlisted commands at the end
        const sortedCommands = visibleCommands.sort(([a], [b]) => {
            const indexA = commandOrder.indexOf(a);
            const indexB = commandOrder.indexOf(b);
            
            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
        
        const helpOutput = document.createElement('div');
        helpOutput.className = 'output';
        helpOutput.innerHTML = `
            <h3>Available Commands:</h3>
            <div class="help-commands">
                ${sortedCommands.map(([cmd, info]) => `
                    <div class="help-command">
                        <span class="help-command-name">${cmd}</span>
                        <span class="help-command-desc">${info.description}</span>
                    </div>
                `).join('')}
            </div>
            <p>Use <span class="highlight">command --help</span> for detailed information about specific commands.</p>
        `;
        
        this.addToHistory(null, helpOutput);
    }

    showContent(section) {
        const content = document.getElementById(`${section}-content`);
        if (content) {
            const output = document.createElement('div');
            output.className = 'output';
            
            // Handle contact section dynamically to avoid duplication
            if (section === 'about') {
                let aboutHTML = content.innerHTML;
                // Replace the contact section with dynamic content
                const contactHTML = window.UtilsModule.getContactHTML(false);
                aboutHTML = aboutHTML.replace(
                    /<h3>Contact<\/h3>[\s\S]*?(?=<\/div>|$)/,
                    `<h3>Contact</h3>${contactHTML}`
                );
                output.innerHTML = aboutHTML;
            } else {
                output.innerHTML = content.innerHTML;
            }
            
            this.addToHistory(null, output);
        } else {
            this.addToHistory(null, `Section '${section}' not found.`, true);
        }
    }

    clearTerminal(args) {
        // Handle arguments
        if (args && args.length > 0) {
            if (args[0] === 'welcome' || args[0] === '-w') {
                // Restore welcome section
                const welcomeSection = document.querySelector('.welcome-section');
                if (welcomeSection) {
                    welcomeSection.style.display = 'block';
                    this.addToHistory(null, 'Welcome section restored.');
                } else {
                    this.addToHistory(null, 'Welcome section not found.', true);
                }
                return;
            } else {
                this.addToHistory(null, `clear: unknown argument '${args[0]}'. Usage: clear [welcome]`, true);
                return;
            }
        }

        // Clear terminal history
        this.history.innerHTML = '';
        
        // Clear welcome section for this session only (not persistent)
        const welcomeSection = document.querySelector('.welcome-section');
        if (welcomeSection) {
            welcomeSection.style.display = 'none';
        }
        
        // Hide help message persistently
        const helpMessages = document.querySelectorAll('.help-message');
        helpMessages.forEach(msg => {
            msg.style.display = 'none';
        });
        localStorage.setItem('portfolio-help-cleared', 'true');
    }

    resetTerminal() {
        // Clear all portfolio-related localStorage
        const keysToRemove = [
            'portfolio-theme',
            'portfolio-mode', 
            'portfolio-command-history',
            'portfolio-help-cleared',
            'portfolio-easter-unlocked'
        ];
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Reset terminal state
        this.currentTheme = 'dark';
        this.currentMode = 'cli';
        this.commandHistory = [];
        this.historyIndex = 0;
        this.easterUnlocked = false;
        
        // Apply default theme
        this.applyTheme('dark');
        
        // Clear terminal history
        this.history.innerHTML = '';
        
        // Hide GUI if active
        const guiOverlay = document.getElementById('gui-overlay');
        if (guiOverlay) {
            guiOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Show welcome section
        const welcomeSection = document.querySelector('.welcome-section');
        if (welcomeSection) {
            welcomeSection.style.display = 'block';
        }
        
        // Show help messages
        const helpMessages = document.querySelectorAll('.help-message');
        helpMessages.forEach(msg => {
            msg.style.display = 'block';
        });
        
        this.addToHistory(null, 'Terminal reset to default state. Theme, history, and settings cleared.');
    }

    resetHelp() {
        localStorage.removeItem('portfolio-help-cleared');
        this.addToHistory(null, 'Help suggestion reset. Refresh page to see it again.');
    }

    showHistory(args) {
        if (args && args.length > 0) {
            if (args[0] === 'clear' || args[0] === '-c') {
                // Clear command history
                this.commandHistory = [];
                this.historyIndex = 0;
                localStorage.removeItem('portfolio-command-history');
                this.addToHistory(null, 'Command history cleared.');
                return;
            } else {
                this.addToHistory(null, `history: unknown argument '${args[0]}'. Usage: history [-c|clear]`, true);
                return;
            }
        }

        if (this.commandHistory.length === 0) {
            this.addToHistory(null, 'No command history available.');
            return;
        }

        const output = document.createElement('div');
        output.className = 'output';
        
        let historyHtml = '<h3>Command History</h3><div class="history-list">';
        this.commandHistory.forEach((cmd, index) => {
            historyHtml += `<div class="history-entry"><span class="history-number">${index + 1}</span> ${cmd}</div>`;
        });
        historyHtml += '</div>';
        historyHtml += `<p>Total commands: ${this.commandHistory.length} | Use <span class="highlight">history clear</span> to clear history</p>`;
        
        output.innerHTML = historyHtml;
        this.addToHistory(null, output);
    }

    // Theme methods (delegated to ThemeModule)
    applyTheme(theme) {
        if (window.ThemeModule) {
            window.ThemeModule.applyTheme(theme);
            this.currentTheme = theme;
        }
    }

    handleTheme(args) {
        if (window.ThemeModule) {
            window.ThemeModule.handleTheme(this, args);
        }
    }

    // Blog methods (delegated to BlogModule)
    async loadBlogConfig() {
        if (window.BlogModule) {
            await window.BlogModule.loadBlogConfig(this);
        }
    }

    // Download resume method
    downloadResume() {
        if (window.UtilsModule) {
            window.UtilsModule.downloadResume(this);
        }
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new InteractiveTerminal();
    
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
    ║  • mail - Send me an email           ║
    ║  • theme - Change appearance         ║
    ║  • gui - Switch to visual mode       ║
    ║                                      ║
    ║  🥚 Try 'easter' for hidden gems!   ║
    ║                                      ║
    ║  Use Tab for autocomplete!           ║
    ║  Use ↑/↓ for command history!        ║
    ╚══════════════════════════════════════╝
    `);
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
        if (input && window.terminal && window.terminal.currentMode === 'cli') {
            input.focus();
        }
    }
});