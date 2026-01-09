// Blog Module
window.BlogModule = {
    // Get blog-related commands
    getCommands(terminal) {
        return {
            'blog': {
                description: 'Show blog posts',
                action: (args) => this.handleBlog(terminal, args)
            }
        };
    },

    // Handle blog command
    async handleBlog(terminal, args) {
        if (!terminal.blogConfig) {
            terminal.addToHistory(null, 'Blog system not initialized. Please try again in a moment...', true);
            // Try to reload config
            await this.loadBlogConfig(terminal);
            if (!terminal.blogConfig) {
                terminal.addToHistory(null, 'Failed to load blog configuration. Make sure you\'re accessing via HTTP server (http://localhost:8000)', true);
                return;
            }
        }
        
        if (args.length === 0) {
            // Show blog post list
            await this.showBlogList(terminal);
        } else if (args[0] === 'read' && args[1]) {
            // Read specific post
            await this.showBlogPost(terminal, args[1]);
        } else if (args[0] === 'list') {
            // Show blog post list (alias)
            await this.showBlogList(terminal);
        } else {
            // Show help for blog command
            this.showBlogHelp(terminal);
        }
    },

    // Load blog configuration
    async loadBlogConfig(terminal) {
        try {
            const response = await fetch('blog/config.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            terminal.blogConfig = await response.json();
        } catch (error) {
            console.warn('Failed to load blog config:', error);
            // Fallback: create a default config with the posts we know exist
            terminal.blogConfig = {
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
    },

    // Show blog post list
    async showBlogList(terminal) {
        const output = document.createElement('div');
        
        if (terminal.blogConfig.posts.length === 0) {
            output.innerHTML = '<p>No blog posts available yet.</p>';
            terminal.addToHistory(null, output);
            return;
        }
        
        let postsHtml = '<h3>Blog Posts</h3><div class="blog-list">';
        
        for (const post of terminal.blogConfig.posts) {
            try {
                const metadata = await this.loadPostMetadata(post.file);
                if (metadata && (metadata.published || metadata.status === 'coming-soon')) {
                    const isComingSoon = metadata.status === 'coming-soon';
                    postsHtml += `
                        <article class="blog-post-item ${isComingSoon ? 'coming-soon' : ''}">
                            <h4>
                                ${isComingSoon ? 
                                    `<span class="coming-soon-title">${metadata.title} <span class="coming-soon-badge">Coming Soon</span></span>` :
                                    `<span class="link" onclick="BlogModule.showBlogPost(terminal, '${post.slug}')" style="cursor: pointer;">${metadata.title}</span>`
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
        terminal.addToHistory(null, output);
    },

    // Show specific blog post
    async showBlogPost(terminal, slug) {
        const post = terminal.blogConfig.posts.find(p => p.slug === slug);
        if (!post) {
            terminal.addToHistory(null, `Blog post '${slug}' not found. Use <span class="highlight">blog list</span> to see available posts.`, true);
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
                terminal.addToHistory(null, output);
                return;
            }
            
            const content = await this.loadBlogPost(post.file);
            const output = document.createElement('div');
            output.className = 'blog-post-content';
            output.innerHTML = content;
            terminal.addToHistory(null, output);
        } catch (error) {
            terminal.addToHistory(null, `Failed to load blog post: ${error.message}`, true);
        }
    },

    // Load post metadata from frontmatter
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
    },

    // Load and parse blog post content
    async loadBlogPost(filename) {
        const response = await fetch(`blog/posts/${filename}`);
        const content = await response.text();
        
        // Remove frontmatter
        const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        
        // Parse markdown to HTML
        const html = marked.parse(contentWithoutFrontmatter);
        
        return html;
    },

    // Show blog help
    showBlogHelp(terminal) {
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
        terminal.addToHistory(null, output);
    }
};