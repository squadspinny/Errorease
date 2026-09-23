<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# ErrorEase - One-File-Per-Article CMS

ErrorEase features a scalable, zero-boilerplate **one-file-per-article content management system**.

## Core Concept: One Article = One TypeScript File

Every troubleshooting article lives inside its own standalone file in:
```text
src/articles/
├── fix-windows-update-error-0x80070057.ts
├── critical-process-died-bsod-windows-11-fix.ts
├── dns-probe-finished-no-internet-repair.ts
...
└── _template.ts
```

The system automatically handles:
- **Article Discovery**: Automatically loaded via Vite `import.meta.glob`.
- **Clean Simple Routing**:
  - Articles: `/:slug` (e.g. `/dns-probe-finished-no-internet-repair`)
  - Categories: `/:slug` (e.g. `/windows`, `/browsers`, `/network-dns`)
  - Static Pages: `/:slug` (e.g. `/about`, `/contact`, `/sitemap`)
- **Homepage Integration**: Automatically lists newly added articles.
- **Category Filtering**: Automatically aggregates articles by category.
- **Search Engine**: Searches titles, excerpts, error codes, tags, and full content.
- **Related Articles**: Automatically calculated by category/tags without broken links.
- **Dynamic Sitemap**: Discovered articles are automatically included in `/sitemap` and XML with clean URLs.
- **Clean Deletion**: Deleting an article file instantly removes it everywhere and safely returns a 404 page.

---

## Content Management Workflows

### 1. Create a New Article
1. Copy `src/articles/_template.ts` to `src/articles/<your-article-slug>.ts` (e.g., `src/articles/windows-11-wifi-fix.ts`).
2. Update the slug, title, category, and `content: [...]` array.
3. Save the file.
4. The article is instantly live across the entire website!

### 2. Edit an Article
Open the corresponding file in `src/articles/<slug>.ts`, edit any text or property, and save.

### 3. Restructure Sections
Rearrange items inside the `content: [...]` array. The generic renderer displays sections in the exact order specified:
- `heading` (H2, H3, H4)
- `paragraph`
- `steps` (Numbered troubleshooting steps)
- `list` (Ordered or unordered lists)
- `code` (Syntax-highlighted code blocks with Copy buttons)
- `warning`, `info`, `tip`, `success`, `note`
- `image` (Responsive image with optional caption)
- `link` (Internal or external resource links)
- `faqs` (Interactive accordion Q&A)

### 4. Delete an Article
Delete its file in `src/articles/`. It is immediately removed from the homepage, categories, search, related suggestions, and sitemap. Its URL safely resolves to the 404 Not Found screen.

---

## Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

