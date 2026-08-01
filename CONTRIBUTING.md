# Contributing to RezervAZ

Thank you for your interest in contributing to RezervAZ! This document provides guidelines for contributing to the project.

## Ways to Contribute

- **Bug reports** — Use the bug report template
- **Feature requests** — Use the feature request template
- **Code contributions** — Fork, branch, commit, PR
- **Documentation** — Improve README, add guides, fix typos
- **Demo presets** — Add new business type presets
- **Translations** — Add i18n support for AZ/EN/RU

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rezervaz.git
   cd rezervaz
   ```
3. Install dependencies:
   ```bash
   npm.cmd install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Coding Standards

- **TypeScript** — Strict mode enabled, no `any` unless necessary
- **ESLint** — Run `npm.cmd run lint` before committing
- **Prettier** — Code is formatted on save (configured in VS Code)
- **Naming** — Use descriptive names, PascalCase for components, camelCase for functions/variables
- **Components** — Keep components small, single-responsibility
- **Server Actions** — Use for all mutations, colocate with the feature

## Demo Presets

When adding a new demo preset:
1. Add the preset in `src/lib/demo-store.ts`
2. Create a seed file in `supabase/seed-{preset}.sql`
3. Add room images to `public/clients/rooms/` if applicable
4. Update `src/lib/env.ts` to include the new preset
5. Document in README.md

## Commit Messages

Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(laliga): add Şuşa Room to demo preset
fix(booking): prevent double-booking on timezone edge case
docs(readme): update deployment instructions
```

## Pull Request Process

1. Ensure all checks pass:
   ```bash
   npm.cmd run lint
   npm.cmd run build
   ```
2. Update documentation if needed
3. Fill out the PR template completely
4. Request review from maintainers
5. Address feedback promptly

## Code Review Guidelines

- Be respectful and constructive
- Focus on correctness, readability, maintainability
- Check for security implications
- Verify demo presets still work
- Ensure no breaking changes without discussion

## Questions?

Open a discussion or reach out to maintainers.