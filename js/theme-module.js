// Theme Management Module
window.ThemeModule = {
    // Available themes
    availableThemes: {
        'dark': 'Default dark theme',
        'light': 'Clean light theme'
    },

    // Secret themes (hidden until easter is unlocked)
    secretThemes: {
        'catppuccin': 'Catppuccin Mocha - cozy and warm',
        'dracula': 'Dracula theme - elegant purple',
        'gruvbox': 'Gruvbox - Retro groove colors',
        'nord': 'Nord - Arctic, north-bluish color palette',
        'tokyo-night': 'Tokyo Night - A clean, dark theme',
        'synthwave': 'Synthwave \'84 - Neon cyberpunk vibes',
        'matrix': 'Matrix - Green on black hacker aesthetic'
    },

    // Hidden light variants (accessible via theme-name light)
    lightVariants: {
        'catppuccin-light': 'Catppuccin Latte - warm and bright',
        'dracula-light': 'Dracula Light - elegant pastels',
        'gruvbox-light': 'Gruvbox Light - warm retro brightness',
        'nord-light': 'Nord Light - bright arctic colors',
        'tokyo-light': 'Tokyo Light - bright neon city',
        'synthwave-light': 'Synthwave Light - Retro neon on bright',
        'matrix-light': 'Matrix Light - Green terminal on white'
    },

    // Get all available themes (including secret ones if unlocked)
    getAllThemes(easterUnlocked = false) {
        if (easterUnlocked) {
            return { ...this.availableThemes, ...this.secretThemes, ...this.lightVariants };
        }
        return this.availableThemes;
    },

    // Get themes for listing (excludes light variants)
    getListableThemes(easterUnlocked = false) {
        if (easterUnlocked) {
            return { ...this.availableThemes, ...this.secretThemes };
        }
        return this.availableThemes;
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

        // Handle "theme-name light" syntax
        if (args.length === 2 && args[1].toLowerCase() === 'light') {
            const baseTheme = args[0].toLowerCase();
            const lightVariant = `${baseTheme}-light`;
            
            if (this.lightVariants[lightVariant]) {
                terminal.currentTheme = lightVariant;
                this.applyTheme(lightVariant);
                
                let message = `Theme switched to <span class="highlight">${lightVariant}</span>`;
                message += this.getThemeMessage(lightVariant);
                terminal.addToHistory(null, message);
                return;
            } else {
                terminal.addToHistory(null, `Light variant not available for theme: <span class="highlight">${baseTheme}</span>`, true);
                return;
            }
        }
        
        if (this.getAllThemes(terminal.easterUnlocked)[requestedTheme]) {
            terminal.currentTheme = requestedTheme;
            this.applyTheme(requestedTheme);
            
            let message = `Theme switched to <span class="highlight">${requestedTheme}</span>`;
            message += this.getThemeMessage(requestedTheme);
            
            terminal.addToHistory(null, message);
        } else {
            terminal.addToHistory(null, `Unknown theme: <span class="highlight">${requestedTheme}</span>. Use <span class="highlight">theme list</span> to see available themes.`, true);
        }
    },

    // Get theme-specific message
    getThemeMessage(theme) {
        switch(theme) {
            case 'catppuccin':
                return ' ☕ Cozy and warm!';
            case 'catppuccin-light':
                return ' ☕ Warm and bright!';
            case 'dracula':
                return ' 🧛 Elegant and mysterious!';
            case 'dracula-light':
                return ' 🧛 Elegant pastels!';
            case 'gruvbox':
                return ' 🍂 Retro groove vibes!';
            case 'gruvbox-light':
                return ' 🍂 Warm retro brightness!';
            case 'nord':
                return ' ❄️ Arctic and clean!';
            case 'nord-light':
                return ' ❄️ Bright arctic colors!';
            case 'tokyo-night':
                return ' 🌃 Neon city nights!';
            case 'tokyo-light':
                return ' 🌃 Bright neon city!';
            case 'synthwave':
                return ' 🌈 Neon cyberpunk vibes!';
            case 'synthwave-light':
                return ' 🌈 Retro neon on bright!';
            case 'matrix':
                return ' 💊 Welcome to the Matrix!';
            case 'matrix-light':
                return ' 💊 Matrix in daylight mode!';
            case 'light':
                return ' ☀️ Easy on the eyes!';
            case 'dark':
                return ' 🌙 Back to the dark side!';
            default:
                return '';
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
        const themesToShow = this.getListableThemes(terminal.easterUnlocked);
        const output = document.createElement('div');
        output.innerHTML = `
            <h3>Available Themes</h3>
            <div class="help-section">
                ${Object.entries(themesToShow).map(([theme, description]) => `
                    <div class="help-command">
                        <span class="help-command-name">${theme}</span>
                        <span class="help-command-desc">${description}</span>
                    </div>
                `).join('')}
            </div>
            <p>Use <span class="highlight">theme [name]</span> to switch themes.</p>
            <p>Use <span class="highlight">theme [name] light</span> for light variants.</p>
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