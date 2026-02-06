# Blog System

Simple static blog generator that converts markdown posts to HTML.

## Adding a New Blog Post

1. **Create a markdown file** in `posts/` with frontmatter:

```markdown
---
title: "Your Post Title"
description: "Brief description for preview"
date: "2025-01-15"
tags: ["Tag1", "Tag2", "Tag3"]
published: true
---

# Your Post Title

Your content here...
```

2. **Build the blog posts**:

```bash
cd blog
node build-blog.js
```

This generates HTML files for all posts in `posts/`.

3. **Update the blog list** (optional):

- Edit `blog-list.js` to add the post to the index page
- Edit `../index.html` to add the post to the home page writing section

## File Structure

```
blog/
├── build-blog.js          # Blog generator script
├── post-template.html     # HTML template for posts
├── blog.css              # Blog-specific styles
├── index.html            # Blog listing page
├── blog-list.js          # Dynamic blog list loader
└── posts/
    ├── your-post.md      # Markdown source
    └── your-post.html    # Generated HTML
```

## Markdown Support

The generator supports:

- Headers (# ## ###)
- Bold (**text**)
- Italic (*text*)
- Code blocks (```lang ... ```)
- Inline code (`code`)
- Links ([text](url))
- Paragraphs

## Deployment

The generated HTML files are static and can be deployed anywhere:

- Netlify
- Vercel
- GitHub Pages
- Any static hosting

No build step needed for production - just deploy the files.
