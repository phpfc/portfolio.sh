// Email Contact Module
window.EmailModule = {
    // Email service configuration
    config: {
        serviceId: 'service_portfolio', // You'll need to set this up with EmailJS
        templateId: 'template_contact',
        publicKey: 'your_public_key_here'
    },

    // Initialize EmailJS (you'll need to include EmailJS script in HTML)
    init() {
        // Only initialize EmailJS if it's available and configured
        if (typeof emailjs !== 'undefined' && 
            this.config.publicKey !== 'your_public_key_here') {
            emailjs.init(this.config.publicKey);
        }
    },

    // Get email-related commands
    getCommands(terminal) {
        return {
            'mail': {
                description: 'Send an email message',
                action: (args) => this.handleMail(terminal, args)
            },
            'contact': {
                description: 'Open interactive contact form',
                action: () => this.showContactForm(terminal)
            },
            'email': {
                description: 'Alias for mail command',
                action: (args) => this.handleMail(terminal, args)
            }
        };
    },

    // Handle mail command
    handleMail(terminal, args) {
        if (!args || args.length === 0) {
            terminal.addToHistory(null, `
                <div class="help-section">
                    <h3>Mail Command Usage:</h3>
                    <p><span class="highlight">mail</span> - Start interactive email composer</p>
                    <p><span class="highlight">mail "Subject" "Message"</span> - Quick email</p>
                    <p><span class="highlight">mail --help</span> - Show this help</p>
                </div>
            `);
            return;
        }

        if (args[0] === '--help') {
            this.showMailHelp(terminal);
            return;
        }

        // Quick email format: mail "subject" "message"
        if (args.length >= 2) {
            const subject = args[0].replace(/"/g, '');
            const message = args.slice(1).join(' ').replace(/"/g, '');
            this.sendQuickEmail(terminal, subject, message);
        } else {
            // Interactive mode
            this.startInteractiveEmail(terminal);
        }
    },

    // Show contact form
    showContactForm(terminal) {
        const formHtml = `
            <div class="contact-form">
                <h3>📧 Contact Form</h3>
                <p>Send me a message directly through the terminal:</p>
                
                <div class="form-group">
                    <label>Your Name:</label>
                    <input type="text" id="contact-name" placeholder="Enter your name" />
                </div>
                
                <div class="form-group">
                    <label>Your Email:</label>
                    <input type="email" id="contact-email" placeholder="your.email@example.com" />
                </div>
                
                <div class="form-group">
                    <label>Subject:</label>
                    <input type="text" id="contact-subject" placeholder="What's this about?" />
                </div>
                
                <div class="form-group">
                    <label>Message:</label>
                    <textarea id="contact-message" rows="4" placeholder="Your message here..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button onclick="EmailModule.submitContactForm()" class="btn-primary">Send Message</button>
                    <button onclick="EmailModule.cancelContactForm()" class="btn-secondary">Cancel</button>
                </div>
                
                <p class="form-note">
                    <span class="highlight">Tip:</span> You can also use <span class="highlight">mail "subject" "message"</span> for quick emails
                </p>
            </div>
        `;

        const output = document.createElement('div');
        output.className = 'output';
        output.innerHTML = formHtml;
        terminal.addToHistory(null, output);

        // Focus first input
        setTimeout(() => {
            const nameInput = document.getElementById('contact-name');
            if (nameInput) nameInput.focus();
        }, 100);
    },

    // Submit contact form
    submitContactForm() {
        const name = document.getElementById('contact-name')?.value.trim();
        const email = document.getElementById('contact-email')?.value.trim();
        const subject = document.getElementById('contact-subject')?.value.trim();
        const message = document.getElementById('contact-message')?.value.trim();

        // Validation
        if (!name || !email || !subject || !message) {
            this.showFormError('Please fill in all fields.');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showFormError('Please enter a valid email address.');
            return;
        }

        // Show sending status
        this.showFormStatus('Sending message...', 'info');

        // Send email
        this.sendEmail({
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        }).then(() => {
            this.showFormStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
            this.clearForm();
        }).catch((error) => {
            console.warn('Email service not configured:', error.message);
            this.showFormStatus('📧 Email service not set up yet. Please contact me directly at: pedrofranca-tech@proton.me', 'info');
        });
    },

    // Cancel contact form
    cancelContactForm() {
        window.terminal.addToHistory(null, 'Contact form cancelled.');
    },

    // Send quick email
    sendQuickEmail(terminal, subject, message) {
        terminal.addToHistory(null, `
            <div class="email-composer">
                <h3>📧 Quick Email</h3>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
                <p>Please provide your email address to send:</p>
                <input type="email" id="quick-email-sender" placeholder="your.email@example.com" />
                <button onclick="EmailModule.sendQuickEmailWithSender('${subject}', '${message}')" class="btn-primary">Send</button>
                <button onclick="window.terminal.addToHistory(null, 'Email cancelled.')" class="btn-secondary">Cancel</button>
            </div>
        `);

        setTimeout(() => {
            const emailInput = document.getElementById('quick-email-sender');
            if (emailInput) emailInput.focus();
        }, 100);
    },

    // Send quick email with sender
    sendQuickEmailWithSender(subject, message) {
        const senderEmail = document.getElementById('quick-email-sender')?.value.trim();
        
        if (!senderEmail || !this.isValidEmail(senderEmail)) {
            this.showFormError('Please enter a valid email address.');
            return;
        }

        window.terminal.addToHistory(null, 'Sending email...', false);

        this.sendEmail({
            from_name: 'Portfolio Visitor',
            from_email: senderEmail,
            subject: subject,
            message: message
        }).then(() => {
            window.terminal.addToHistory(null, '✅ Email sent successfully! Thanks for reaching out.');
        }).catch((error) => {
            console.warn('Email service not configured:', error.message);
            window.terminal.addToHistory(null, '📧 Email service not set up yet. Please contact me directly at: pedrofranca-tech@proton.me');
        });
    },

    // Interactive email composer
    startInteractiveEmail(terminal) {
        terminal.addToHistory(null, `
            <div class="interactive-email">
                <h3>📧 Interactive Email Composer</h3>
                <p>Let's compose an email step by step. Type your responses after each prompt:</p>
                <p><span class="highlight">Note:</span> Use 'cancel' at any time to abort.</p>
            </div>
        `);

        // Start the interactive flow
        this.emailState = { step: 'name' };
        this.showEmailPrompt(terminal, 'What\'s your name?');
    },

    // Show email prompt
    showEmailPrompt(terminal, prompt) {
        terminal.addToHistory(null, `<p class="email-prompt">📝 ${prompt}</p>`);
        
        // Override the next command to handle email input
        terminal._originalExecuteCommand = terminal.executeCommand;
        terminal.executeCommand = () => this.handleEmailInput(terminal);
    },

    // Handle email input during interactive mode
    handleEmailInput(terminal) {
        const input = terminal.input.value.trim();
        
        if (input.toLowerCase() === 'cancel') {
            this.cancelInteractiveEmail(terminal);
            return;
        }

        switch (this.emailState.step) {
            case 'name':
                this.emailState.name = input;
                this.emailState.step = 'email';
                terminal.addToHistory(input);
                this.showEmailPrompt(terminal, 'What\'s your email address?');
                break;
                
            case 'email':
                if (!this.isValidEmail(input)) {
                    terminal.addToHistory(input);
                    terminal.addToHistory(null, '❌ Please enter a valid email address.', true);
                    this.showEmailPrompt(terminal, 'What\'s your email address?');
                    break;
                }
                this.emailState.email = input;
                this.emailState.step = 'subject';
                terminal.addToHistory(input);
                this.showEmailPrompt(terminal, 'What\'s the subject of your email?');
                break;
                
            case 'subject':
                this.emailState.subject = input;
                this.emailState.step = 'message';
                terminal.addToHistory(input);
                this.showEmailPrompt(terminal, 'Type your message (type "send" when finished):');
                break;
                
            case 'message':
                if (input.toLowerCase() === 'send') {
                    terminal.addToHistory(input);
                    this.finishInteractiveEmail(terminal);
                } else {
                    this.emailState.message = (this.emailState.message || '') + input + '\n';
                    terminal.addToHistory(input);
                    this.showEmailPrompt(terminal, 'Continue your message (type "send" when finished):');
                }
                break;
        }

        terminal.input.value = '';
    },

    // Finish interactive email
    finishInteractiveEmail(terminal) {
        terminal.addToHistory(null, 'Sending your email...');
        
        this.sendEmail({
            from_name: this.emailState.name,
            from_email: this.emailState.email,
            subject: this.emailState.subject,
            message: this.emailState.message.trim()
        }).then(() => {
            terminal.addToHistory(null, '✅ Email sent successfully! Thanks for reaching out.');
        }).catch((error) => {
            console.warn('Email service not configured:', error.message);
            terminal.addToHistory(null, '📧 Email service not set up yet. Please contact me directly at: pedrofranca-tech@proton.me');
        }).finally(() => {
            this.restoreTerminalMode(terminal);
        });
    },

    // Cancel interactive email
    cancelInteractiveEmail(terminal) {
        terminal.addToHistory('cancel');
        terminal.addToHistory(null, 'Email composition cancelled.');
        this.restoreTerminalMode(terminal);
    },

    // Restore normal terminal mode
    restoreTerminalMode(terminal) {
        terminal.executeCommand = terminal._originalExecuteCommand;
        delete terminal._originalExecuteCommand;
        this.emailState = null;
    },

    // Send email using EmailJS
    async sendEmail(templateParams) {
        if (typeof emailjs === 'undefined') {
            // Fallback: show email details for manual sending
            throw new Error('Email service not available. Please email me directly at: pedrofranca-tech@proton.me');
        }

        // Check if EmailJS is properly configured
        if (!this.config.serviceId || this.config.serviceId === 'service_portfolio' || 
            !this.config.templateId || this.config.templateId === 'template_contact' ||
            !this.config.publicKey || this.config.publicKey === 'your_public_key_here') {
            throw new Error('Email service not configured. Please email me directly at: pedrofranca-tech@proton.me');
        }

        try {
            const response = await emailjs.send(
                this.config.serviceId,
                this.config.templateId,
                templateParams
            );
            return response;
        } catch (error) {
            throw new Error('Failed to send email. Please email me directly at: pedrofranca-tech@proton.me');
        }
    },

    // Utility functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    showFormError(message) {
        this.showFormStatus(`❌ ${message}`, 'error');
    },

    showFormStatus(message, type) {
        // Remove existing status
        const existingStatus = document.querySelector('.form-status');
        if (existingStatus) {
            existingStatus.remove();
        }

        // Add new status
        const status = document.createElement('div');
        status.className = `form-status ${type}`;
        status.innerHTML = message;
        
        const form = document.querySelector('.contact-form');
        if (form) {
            form.appendChild(status);
        }
    },

    clearForm() {
        const inputs = ['contact-name', 'contact-email', 'contact-subject', 'contact-message'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
    },

    showMailHelp(terminal) {
        terminal.addToHistory(null, `
            <div class="help-section">
                <h3>📧 Mail Command Help</h3>
                
                <h4>Usage:</h4>
                <div class="help-commands">
                    <div class="help-command">
                        <span class="help-command-name">mail</span>
                        <span class="help-command-desc">Start interactive email composer</span>
                    </div>
                    <div class="help-command">
                        <span class="help-command-name">mail "subject" "message"</span>
                        <span class="help-command-desc">Send quick email with subject and message</span>
                    </div>
                    <div class="help-command">
                        <span class="help-command-name">contact</span>
                        <span class="help-command-desc">Open visual contact form</span>
                    </div>
                </div>
                
                <h4>Examples:</h4>
                <p><span class="highlight">mail</span> - Start step-by-step email composer</p>
                <p><span class="highlight">mail "Job Inquiry" "Hi, I'm interested in discussing opportunities..."</span></p>
                <p><span class="highlight">contact</span> - Open contact form</p>
                
                <p><strong>Note:</strong> All emails are sent directly to pedrofranca-tech@proton.me</p>
            </div>
        `);
    }
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    EmailModule.init();
});