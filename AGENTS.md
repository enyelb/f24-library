# AGENTS.md

Angular 21 multi-package workspace (`@f24` design-system libs) built with **pnpm 10** (`packageManager` field — do not use npm/yarn). No CI; verify locally with build/test commands.

## Structure

- `projects/<lib>` — 16 standalone Angular libraries (`core`, `layout`, `forms`, `forms-v2`, `filters`, `data`, `api`, `alerts`, `notification`, `buttons`, `table`, `list`, `splide`, `timeline`, `preview`, `functions`), all published-consumed as `@f24/<lib>`.
- `projects/docs` — ng-doc documentation site (the main consumer app).
- `projects/ct` — scratch/test harness app (`ng serve ct --port 4300`).
- `schematics/` — **separate pnpm package** (`@f24/schematics`, own lockfile + `node_modules`; run `pnpm install` and `pnpm build` inside it, output goes to `schematics/dist`). Read `schematics/AGENTS.MD` before touching `schematics/src/ast/*` — it defines strict layering (find → create → update) and Spanish JSDoc conventions.

## Critical quirk: `@f24/*` resolves to `dist/`

Root and library `tsconfig.lib.json` map `@f24/*` → `dist/*`. Libraries import each other (e.g. `forms` → `core`, `filters`, `layout`, `notification`), so:

- Building lib X requires its `@f24/*` dependencies already built (`ng build <dep>` first, X's own `dist` must exist).
- After changing a lib's public API, rebuild that lib before building/typechecking consumers.
- `pnpm build:all` builds only the older set (alerts api data filters forms functions layout notification). Newer libs (core, buttons, table, list, splide, timeline, preview, forms-v2) must be built individually: `ng build <lib>`.
- **Exception:** the docs app overrides paths in `projects/docs/tsconfig.app.json` to `projects/*/src/public-api.ts`, so `ng serve docs` picks up lib source edits live — but new exports must be re-added to that lib's `public-api.ts`.

## Commands

There is no `defaultProject` in `angular.json` — always pass the project name (`ng build`, `ng test`). The root `build`/`test`/`start` README scripts are boilerplate and will fail or serve nothing useful.

- `pnpm start:docs` — ng-doc dev server on :4600 (slow first run: ng-doc generates `projects/docs/ng-doc/**` + `@ng-doc/generated` route code there; that folder is git-ignored, never edit it).
- `pnpm start:ct` — ct app on :4300 (resolves `@f24/*` from dist → build libs first).
- `ng build <lib>` / `ng test <lib>` / `ng serve docs|ct`.
- Single spec: `ng test <lib> --include path/to/file.spec.ts`.
- Test runners are mixed: libs `buttons`, `core`, `table`, `list`, `splide`, `timeline` (and docs/ct) use `@angular/build:unit-test` (vitest, supports `--watch`); the rest use `@angular/build:karma` (needs Chrome; headless: `ng test <lib> --watch=false --browsers=ChromeHeadless`).

## Adding docs for a component

Page lives in `projects/docs/src/app/components/f24-<name>/`: `ng-doc.page.ts` (`NgDocPage` + `demos` + `playgrounds`), `index.md`, `demos/*.demo.ts`. Follow `projects/docs/AGENT.MD` (Spanish prompt): required sections include Inputs/Outputs table and a CSS customization section using `--f24-*` variables. Scaffold via `ng g @ng-doc/builder:page`.

## Conventions

- Prettier config is in `package.json` (printWidth 100, single quotes, `angular` parser for `*.html`); `.editorconfig`: 2-space indent, single quotes in TS.
- Component generator default style is `scss`; selector prefix `f24` for libs, `app` for apps.
- TS is fully strict incl. `strictTemplates`, `noPropertyAccessFromIndexSignature`, `typeCheckHostBindings` — template/type errors are common failure points.
- Commit messages and some code comments/JSDoc are in Spanish; match the local file's language when editing it.
