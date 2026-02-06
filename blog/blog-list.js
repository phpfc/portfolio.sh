/**
 * Blog List - Load and display all blog posts
 */

(async function() {
    'use strict';

    const postsContainer = document.getElementById('blog-posts');
    if (!postsContainer) return;

    // Blog posts metadata (extracted from markdown frontmatter)
    const posts = [
        {
            slug: 'cymatic-audiovisual-synthesizer',
            title: 'Building Cymatic: Where Music Theory Meets WebGL',
            description: 'From music teacher to developer: building a browser-based audiovisual synthesizer that visualizes the science of sound. Exploring cymatics, harmonic ratios, and real-time audio-visual synchronization.',
            date: '2025-01-15',
            tags: ['TypeScript', 'WebGL', 'Audio', 'Music', 'Creative Coding']
        },
        {
            slug: 'mobile-stack-unification',
            title: 'Mobile Stack Unification: Flutter to React Native',
            description: 'The technical and strategic reasoning behind our mobile stack unification. From proof of concept to company-wide adoption, including challenges with offline video access and DRM implementation.',
            date: '2024-12-15',
            tags: ['React Native', 'Flutter', 'Mobile Development', 'Architecture']
        },
        {
            slug: 'vendor-independent-auth',
            title: 'Building Vendor-Independent Authentication Systems',
            description: 'Designing authentication architecture that avoids vendor lock-in. How to build fallback systems that make provider migration painless, featuring AWS Cognito, JWT, and security best practices.',
            date: '2024-11-20',
            tags: ['Authentication', 'AWS', 'Security', 'Architecture']
        }
    ];

    // Render posts
    posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'article-card';

        article.innerHTML = `
            <div class="article-date">${formatDate(post.date)}</div>
            <h3 class="article-title">
                <a href="posts/${post.slug}.html">${post.title}</a>
            </h3>
            <p class="article-excerpt">${post.description}</p>
            <div class="article-tags">
                ${post.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
            </div>
        `;

        postsContainer.appendChild(article);
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
})();
