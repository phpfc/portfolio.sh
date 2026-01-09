// Theme Management Module
window.ThemeModule = {
    // Available themes
    availableThemes: {
        'dark': 'Default dark theme',
        'light': 'Clean light theme',
        'catppuccin': 'Catppuccin Mocha - cozy and warm',
        'dracula': 'Dracula theme - elegant purple',
        'gruvbox': 'Gruvbox - Retro groove colors',
        'nord': 'Nord - Arctic, north-bluish color palette',
        'tokyo-night': 'Tokyo Night - A clean, dark theme',
        'synthwave': 'Synthwave \'84 - Neon cyberpunk vibes',
        'matrix': 'Matrix - Green on black hacker aesthetic'
    },

    // Get theme-related commands
    getCommands(terminal) {
        return {
            'theme': {
                description: 'Change terminal theme',
                action: (args) => this.handleTheme(terminal, args)
            }
        };
    },

    // Handle theme command
    handleTheme(terminal, args) {
        if (args.length === 0) {
            // No arguments, toggle between dark and light
            this.toggleTheme(terminal);
            return;
        }

        const requestedTheme = args[0].toLowerCase();
        
        if (requestedTheme === 'list' || requestedTheme === 'ls') {
            // List available themes
            this.listThemes(terminal);
            return;
        }
        
        if (this.availableThemes[requestedTheme]) {
            terminal.currentTheme = requestedTheme;
            this.applyTheme(requestedTheme);
            
            let message = `Theme switched to <span class="highlight">${requestedTheme}</span>`;
            
            switch(requestedTheme) {
                case 'catppuccin':
                    message += ' ☕ Cozy and warm!';
                    break;
                case 'dracula':
                    message += ' 🧛 Elegant and mysterious!';
                    break;
                case 'gruvbox':
                    message += ' 🍂 Retro groove vibes!';
                    break;
                case 'nord':
                    message += ' ❄️ Arctic and clean!';
                    break;
                case 'tokyo-night':
                    message += ' 🌃 Neon city nights!';
                    break;
                case 'synthwave':
                    message += ' 🌈 Neon cyberpunk vibes!';
                    break;
                case 'matrix':
                    message += ' 💊 Welcome to the Matrix!';
                    break;
                case 'light':
                    message += ' ☀️ Easy on the eyes!';
                    break;
                case 'dark':
                    message += ' 🌙 Back to the dark side!';
                    break;
            }
            
            terminal.addToHistory(null, message);
        } else {
            terminal.addToHistory(null, `Unknown theme: <span class="highlight">${requestedTheme}</span>. Use <span class="highlight">theme list</span> to see available themes.`, true);
        }
    },

    // Toggle between dark and light themes
    toggleTheme(terminal) {
        terminal.currentTheme = terminal.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(terminal.currentTheme);
        terminal.addToHistory(null, `Theme switched to <span class="highlight">${terminal.currentTheme}</span> mode.`);
    },

    // List available themes
    listThemes(terminal) {
        const output = document.createElement('div');
        output.innerHTML = `
            <h3>Available Themes</h3>
            <div class="help-section">
                ${Object.entries(this.availableThemes).map(([theme, description]) => `
                    <div class="help-command">
                        <span class="help-command-name">${theme}</span>
                        <span class="help-command-desc">${description}</span>
                    </div>
                `).join('')}
            </div>
            <p>Use <span class="highlight">theme [name]</span> to switch themes.</p>
            <p>Use <span class="highlight">theme</span> without arguments to toggle between dark and light.</p>
        `;
        terminal.addToHistory(null, output);
    },

    // Apply theme
    applyTheme(theme) {
        // Remove any existing theme attributes
        document.documentElement.removeAttribute('data-theme');
        
        // Apply new theme (except for default dark)
        if (theme !== 'dark') {
            document.documentElement.setAttribute('data-theme', theme);
        }
        
        localStorage.setItem('portfolio-theme', theme);
    }
};