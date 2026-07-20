# Writing posts

Drop a markdown file anywhere under `assets/` and it becomes a post. The URL and
its category come from the path:

```
assets/<category>/<subtopic>/my-post.md   →  /posts/<category>/<subtopic>/my-post/
assets/blogs/my-post.md                   →  /posts/blogs/my-post/
```

`cv`, `robotics`, and `blogs` have nav pages; subtopics (`3dgs`, `vla`, …) are
grouped on category pages. Files named `README.md` are ignored.

## Frontmatter

```yaml
---
title: "Post title"            # required
date: 2026-07-20               # required
description: "One-liner shown in lists and as the abstract."
tags: [3dgs, rendering]        # optional
pdf: ./slides.pdf              # optional — makes this a PDF post (embedded viewer)
draft: true                    # optional — hides the post everywhere
---
```

## Images, videos, PDFs

Keep media next to the markdown file.

- **Images**: relative paths — `![alt](./fig1.png)`. Optimized automatically at
  build time. An italic-only line right after an image is styled as its caption:

  ```markdown
  ![Reprojection error](./fig1.png)

  *Figure 1. Reprojection error over iterations.*
  ```

- **Videos**: raw HTML with an absolute `/assets/...` path (files under
  `assets/` are served as-is at `/assets/...`):

  ```html
  <video src="/assets/robotics/vla/demo.mp4" controls muted playsinline></video>
  ```

- **Math**: `$...$` inline, `$$...$$` display (KaTeX).

## Local preview

```bash
cd ../web-app && npm run dev
```
