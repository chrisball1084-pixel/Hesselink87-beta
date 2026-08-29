# Claude Code instructions — Hesselink87 Beta

Read `docs/PROJECT.md` before making changes.

## Sources of truth

- Technical truth: current repository + `docs/PROJECT.md`
- Product truth: Notion page `Hesselink87 Beta — Product Hub` (the page formerly named `Hesselink87 App updates` is now `Hesselink87 Beta — Arbeitsarchiv` and is history only)
- Historical implementation details: `CHANGELOG.md` and older Notion implementation pages, only when needed

## Standard command

When the user says **`Notion Sync durchführen`**:

1. Read this file and `docs/PROJECT.md`.
2. Read only the active Notion Product Hub areas: `CURRENT STATE`, `INBOX`, `OPEN`, `WAITING FOR ME`, and relevant `PRODUCT DECISIONS`.
3. Verify every new item against the current Beta code before assuming it is still valid.
4. Separate bugs, features, improvements, questions and product decisions.
5. Implement only clearly defined changes; do not invent training/product rules.
6. Preserve training history, migrations and backup compatibility.
7. Run relevant tests.
8. Update `docs/PROJECT.md` only for durable technical changes.
9. Update Notion: clear processed Inbox items, update Open/Waiting/Current State, add a compact Changelog entry.
10. Report what changed, tests run and remaining user decisions.

## Guardrails

- Do not use the legacy `Hesselink87` repository as the default implementation target.
- Do not read the full historical changelog by default.
- Do not introduce secrets into Git or Notion.
- Do not refactor unrelated working code during a focused change.
- Do not allow dashboard recommendations or deload logic to silently mutate the user's training plan unless explicitly specified.
