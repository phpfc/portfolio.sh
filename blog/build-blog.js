#!/usr/bin/env node

/**
 * Static Blog Generator
 * Converts markdown posts to HTML using the template
 */

const fs = require('fs');
const path = require('path');

// Simple markdown parser (basic support)
function parseMarkdown(md) {
    let html = md;

    // Remove the first H1 (title is already in the header)
    html = html.replace(/^# .*$/m, '');

    // Protect code blocks by replacing them with placeholders
    const codeBlocks = [];
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
        codeBlocks.push(`<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`);
        return placeholder;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Paragraphs (split by double newline)
    const paragraphs = html.split('\n\n');
    html = paragraphs.map(p => {
        p = p.trim();
        if (!p) return '';
        // Don't wrap code block placeholders, headers, or HTML tags
        if (p.startsWith('___CODE_BLOCK_') ||
            p.startsWith('<h') ||
            p.startsWith('<pre') ||
            p.startsWith('<ul') ||
            p.startsWith('<ol')) {
            return p;
        }
        // Replace single newlines with <br> within paragraphs
        p = p.replace(/\n/g, '<br>');
        return `<p>${p}</p>`;
    }).join('\n');

    // Restore code blocks
    codeBlocks.forEach((block, index) => {
        html = html.replace(`___CODE_BLOCK_${index}___`, block);
    });

    return html;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { metadata: {}, content };
    }

    const frontmatterText = match[1];
    const bodyContent = match[2];

    const metadata = {};
    frontmatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            // Remove quotes
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            // Parse arrays (tags)
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1)
                    .split(',')
                    .map(v => v.trim().replace(/["']/g, ''));
            }

            metadata[key] = value;
        }
    });

    return { metadata, content: bodyContent };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function buildPost(markdownFile, outputFile, template) {
    console.log(`Building: ${markdownFile} -> ${outputFile}`);

    // Read markdown file
    const mdContent = fs.readFileSync(markdownFile, 'utf-8');

    // Parse frontmatter
    const { metadata, content } = parseFrontmatter(mdContent);

    // Convert markdown to HTML
    const htmlContent = parseMarkdown(content);

    // Format tags
    const tagsHtml = Array.isArray(metadata.tags)
        ? metadata.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')
        : '';

    // Replace template placeholders
    let html = template
        .replace(/\{\{TITLE\}\}/g, metadata.title || 'Untitled')
        .replace(/\{\{DESCRIPTION\}\}/g, metadata.description || '')
        .replace(/\{\{DATE\}\}/g, metadata.date || '')
        .replace(/\{\{DATE_FORMATTED\}\}/g, formatDate(metadata.date || new Date()))
        .replace(/\{\{TAGS\}\}/g, tagsHtml)
        .replace(/\{\{CONTENT\}\}/g, htmlContent);

    // Write HTML file
    fs.writeFileSync(outputFile, html);
    console.log(`✓ Generated: ${outputFile}`);
}

function main() {
    const postsDir = path.join(__dirname, 'posts');
    const templatePath = path.join(__dirname, 'post-template.html');

    // Read template
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Get all markdown files
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') && f !== 'example-draft.md');

    console.log(`\nBuilding ${files.length} blog posts...\n`);

    files.forEach(file => {
        const mdPath = path.join(postsDir, file);
        const htmlFileName = file.replace('.md', '.html');
        const htmlPath = path.join(postsDir, htmlFileName);

        buildPost(mdPath, htmlPath, template);
    });

    console.log(`\n✓ All posts built successfully!\n`);
}

main();
