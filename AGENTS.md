<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Site content (sections, guides, glossary, nav) lives in `src/data/*`; pages render from it — edit data, not pages, to change copy.
- Wallpaper math is pure in `src/features/wallpaper-calculator/calculate.ts` (covered by tests); the UI only parses inputs and displays results.
- Shared chrome (Header/Footer/PageHeader/Logo) is in `src/components/site` and mounted in `__root.tsx`; each topic section is a thin route file using `SectionPage`.
- Unified content model lives in `src/content/` (types, taxonomy, entries, urls, validate); entities link only by typed IDs, URLs come from `urlFor()`, and `validateContent()` (tested) must stay error-free — one article = one URL, attached to many categories via `categories`.
- Drafts (`status: "draft"`) never appear in sitemap, search or listings; published entries require SEO title/description.
- Articles live in `src/content/articles.ts`, materials in `src/content/materials.ts`, the image library in `src/content/images.ts`; categories get their pages from `taxonomy.ts` via `/kvartiry/$category` and `/doma/$category` — add data, not routes.
- Every route's head comes from `pageHead()` in `src/lib/seo.ts` (canonical, OG, JSON-LD) so metadata stays uniform; sitemap URLs come from `src/lib/sitemap.ts`.
- New calculators = pure formula in `src/features/calculators/formulas.ts` (tested) + entry in `configs.ts` + published `calc:` entry; inputs never embed invented consumption norms.
- Monetization (`src/monetization/`) is off by default; offers without an `erid` never render, so no fake partners can leak into the UI.
- Links built from `urlFor()` strings use `HrefLink`, keeping URL construction in one place.
- House tools live in `src/features/house/` (model → geometry → estimate, pure and tested); routes `/doma/konfigurator|smeta|proekty` only render them. Estimate lines carry quantities only; a price renders only via `isDisplayablePrice()` (status `verified` + source + region + date) and `PRICES_ENABLED` stays false until such prices exist — no demo prices ever reach users.
- Local saving stores only house parameters (`dk.house-config.v1`), never contacts or device data; leads stay disabled until a vetted backend exists.
- Partner program research lives in `docs/partners-ru.md`; offers enter `PARTNER_OFFERS` only with an erid.
- Optional third-party scripts (analytics, ads) load only via `src/lib/analytics.ts` after consent from `src/lib/consent.ts`; IDs come from VITE_* env so the site works with none set.
- Regions (`src/data/regions.ts`) and legal docs (`src/data/legal.ts`) are data-driven; a region is indexed/sitemapped only when `isRegionIndexable` (published + sourced content), so no thin SEO pages ship.
- Brand colour lives only in the `src/styles.css` tokens (`--header`, `--primary`, `--brand-bright`, `--graphite`); chrome and controls use semantic classes (`bg-header`, `bg-primary`, `aria-pressed:bg-primary`) and never hardcoded greys, so re-skinning touches one file.
