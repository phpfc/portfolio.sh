#!/bin/bash

# Simple script to create a new blog post

if [ $# -eq 0 ]; then
    echo "Usage: ./new-post.sh \"Post Title\""
    echo "Example: ./new-post.sh \"My New Blog Post\""
    exit 1
fi

TITLE="$1"
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
DATE=$(date +%Y-%m-%d)
FILENAME="posts/${SLUG}.md"

# Check if file already exists
if [ -f "$FILENAME" ]; then
    echo "Error: File $FILENAME already exists!"
    exit 1
fi

# Create the markdown file with frontmatter
cat > "$FILENAME" << EOF
---
title: "$TITLE"
description: "Brief description of the post"
date: "$DATE"
tags: ["tag1", "tag2"]
published: false
---

# $TITLE

Your content here...

## Section 1

Write your content using markdown.

### Subsection

- Use bullet points
- For lists
- And organization

\`\`\`javascript
// Code blocks work great
function example() {
    console.log("Hello, world!");
}
\`\`\`

## Conclusion

Wrap up your thoughts here.
EOF

echo "Created new blog post: $FILENAME"
echo "Don't forget to:"
echo "1. Edit the description and tags in the frontmatter"
echo "2. Write your content"
echo "3. Set published: true when ready"
echo "4. Add the post to config.json:"
echo "   {"
echo "     \"slug\": \"$SLUG\","
echo "     \"file\": \"${SLUG}.md\""
echo "   }"