# Clause-Level Dataset

This dataset is derived from the frozen source packages in `data/corpus/*/`.

## Source basis

- X Privacy Policy: `data/corpus/x-privacy`
- Meta/Facebook Privacy Policy: `data/corpus/meta-privacy`
- Instagram Terms of Use: `data/corpus/instagram-terms`
- LGPD relevant legal excerpts: `data/corpus/lgpd-excerpts`

## Derivation flow

1. Official primary URLs were accessed with Playwright.
2. Each source package received metadata, selected raw excerpts, capture notes, and a screenshot.
3. Selected excerpts were segmented into clause-level units.
4. Automatic project categories were applied first using the six-category taxonomy.
5. Manual academic review normalized ambiguous boundaries and assigned final impact.
6. Traceability was preserved through `source_package`, `source_excerpt_id`, and `official_url`.

## Categories

- `data_collection`
- `purpose_use`
- `sharing_third_parties`
- `retention_storage`
- `user_rights`
- `security_incidents`

## Boundary decisions

The platform documents are long and proprietary. The dataset intentionally uses selected official excerpts, not full policy copies. Clause boundaries were chosen when an excerpt contained a single analyzable legal/privacy action: collection, purpose, sharing, retention, rights, or security.

## Files

- `clauses.json`: app-compatible academic records.
- `clauses.csv`: tabular contract for review and validation.
