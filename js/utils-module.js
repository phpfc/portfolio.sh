// Utility Commands Module
window.UtilsModule = {
    // Get utility commands
    getCommands(terminal) {
        return {
            'contact': {
                description: 'Show contact information',
                action: () => this.showContact(terminal)
            },
            'whoami': {
                description: 'Display user information',
                action: (args) => this.whoami(terminal, args)
            },
            'pwd': {
                description: 'Print working directory',
                action: (args) => this.pwd(terminal, args)
            },
            'date': {
                description: 'Show current date and time',
                action: (args) => this.showDate(terminal, args)
            },
            'echo': {
                description: 'Display a line of text',
                action: (args) => this.echo(terminal, args)
            },
            'ls': {
                description: 'List available sections',
                action: () => this.listSections(terminal)
            },
            'neofetch': {
                description: 'Display system information (easter egg)',
                action: (args) => this.neofetch(terminal, args),
                hidden: true
            },
            'easter': {
                description: 'Show hidden easter eggs and commands',
                action: (args) => this.showEasterEggs(terminal, args),
                hidden: true
            }
        };
    },

    // Show contact information
    showContact(terminal) {
        const output = document.createElement('div');
        output.innerHTML = `
            <h3>Contact Information</h3>
            <p>📧 <a href="mailto:pedrofranca-tech@proton.me" class="link">pedrofranca-tech@proton.me</a></p>
            <p>🐙 <a href="https://github.com/phpfc" class="link" target="_blank">github.com/phpfc</a></p>
            <p>💼 <a href="https://linkedin.com/in/pedro-henrique-pfranca/" class="link" target="_blank">linkedin.com/in/pedro-henrique-pfranca/</a></p>
            <p>📍 Caxias do Sul, RS | 🇧🇷 Brazil</p>
            <p style="margin-top: 15px;">💡 <span class="highlight">Try 'mail' or 'contact' commands to send me a message directly!</span></p>
        `;
        terminal.addToHistory(null, output);
    },

    // Who am I command
    whoami(terminal, args) {
        // Check for unknown arguments
        if (args && args.length > 0) {
            terminal.addToHistory(null, `whoami: unknown argument '${args[0]}'. Usage: whoami`, true);
            return;
        }

        terminal.addToHistory(null, `
            <h3>Pedro Henrique França</h3>
            <p>Full Stack Developer | Software Architecture Enthusiast</p>
            <p>Passionate about maintainable code, system design, and engineering fundamentals.</p>
        `);
    },

    // Print working directory
    pwd(terminal, args) {
        // Check for unknown arguments
        if (args && args.length > 0) {
            terminal.addToHistory(null, `pwd: unknown argument '${args[0]}'. Usage: pwd`, true);
            return;
        }

        terminal.addToHistory(null, '/home/phfranca/portfolio');
    },

    // Show current date
    showDate(terminal, args) {
        // Check for unknown arguments
        if (args && args.length > 0) {
            terminal.addToHistory(null, `date: unknown argument '${args[0]}'. Usage: date`, true);
            return;
        }

        const now = new Date();
        terminal.addToHistory(null, now.toString());
    },

    // Echo command
    echo(terminal, args) {
        const text = args.join(' ');
        terminal.addToHistory(null, text || '');
    },

    // List sections
    listSections(terminal) {
        const output = document.createElement('div');
        output.innerHTML = `
            <h3>Available Sections</h3>
            <div class="help-section">
                <div class="help-command">
                    <span class="help-command-name">about</span>
                    <span class="help-command-desc">Personal information and skills</span>
                </div>
                <div class="help-command">
                    <span class="help-command-name">projects</span>
                    <span class="help-command-desc">My development projects</span>
                </div>
                <div class="help-command">
                    <span class="help-command-name">blog</span>
                    <span class="help-command-desc">Technical articles and posts</span>
                </div>
                <div class="help-command">
                    <span class="help-command-name">cv</span>
                    <span class="help-command-desc">Professional experience and education</span>
                </div>
                <div class="help-command">
                    <span class="help-command-name">contact</span>
                    <span class="help-command-desc">Contact information and links</span>
                </div>
            </div>
            <p>Use any section name as a command to view its content.</p>
        `;
        terminal.addToHistory(null, output);
    },

    // Neofetch easter egg
    neofetch(terminal, args) {
        // Check for unknown arguments
        if (args && args.length > 0) {
            terminal.addToHistory(null, `neofetch: unknown argument '${args[0]}'. Usage: neofetch`, true);
            return;
        }

        const output = document.createElement('div');
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
                        <p><span style="color: var(--text-success);">Theme:</span> ${terminal.currentTheme}</p>
                        <p><span style="color: var(--text-success);">Shell:</span> Interactive Terminal v2.0</p>
                        <p><span style="color: var(--text-success);">Resolution:</span> ${window.screen.width}x${window.screen.height}</p>
                        <p><span style="color: var(--text-success);">Uptime:</span> ${this.getUptime()}</p>
                        <p><span style="color: var(--text-success);">Memory:</span> ${this.getMemoryInfo()}</p>
                        <p><span style="color: var(--text-success);">CPU:</span> ${navigator.hardwareConcurrency || 'Unknown'} cores</p>
                        <p><span style="color: var(--text-success);">Terminal:</span> ${terminal.commandHistory.length} commands executed</p>
                    </div>
                </div>
            </div>
        `;
        terminal.addToHistory(null, output);
    },

    // Show easter eggs
    showEasterEggs(terminal, args) {
        // Check for unknown arguments
        if (args && args.length > 0) {
            terminal.addToHistory(null, `easter: unknown argument '${args[0]}'. Usage: easter`, true);
            return;
        }

        // Unlock hidden commands for autocomplete
        terminal.easterUnlocked = true;
        localStorage.setItem('portfolio-easter-unlocked', 'true');

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
                <p><span class="highlight">mail</span> - Send me an email directly</p>
            </div>
            <div style="margin: 16px 0;">
                <h4 style="color: var(--text-accent); margin-bottom: 8px;">🎮 Interactive Features:</h4>
                <p><span class="highlight">Tab</span> - Autocomplete commands (now includes hidden ones!)</p>
                <p><span class="highlight">↑/↓</span> - Navigate command history</p>
                <p><span class="highlight">gui</span> - Switch to graphical mode</p>
            </div>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.8;">🎉 You found the secret! Hidden commands are now available in autocomplete.</p>
        `;
        terminal.addToHistory(null, output);
    },

    // Utility functions
    getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    },

    getOSInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Unknown';
    },

    getUptime() {
        const now = Date.now();
        const start = performance.timeOrigin;
        const uptime = Math.floor((now - start) / 1000);
        const minutes = Math.floor(uptime / 60);
        const seconds = uptime % 60;
        return `${minutes}m ${seconds}s`;
    },

    getMemoryInfo() {
        if ('memory' in performance) {
            const memory = performance.memory;
            const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
            const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
            return `${used}MB / ${total}MB`;
        }
        return 'Unknown';
    },

    // Download resume function
    downloadResume(terminal) {
        // Direct download of PDF file
        const link = document.createElement('a');
        link.href = 'resume.pdf';
        link.download = 'Pedro_Henrique_Franca_Resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show confirmation message
        terminal.addToHistory(null, `
            <p style="color: var(--text-success);">📄 Resume download started! Check your downloads folder.</p>
        `);
    }
};