# Changelog

All notable changes to this project are documented in this file.

## [Unreleased] - 2025-10-21

### Added
- Static, strongly-typed BuildVersion client implementing v1 API (`src/app/services/build-version.service.ts`).
- Trimmed TypeScript DTOs used by the client (`src/app/services/build-version.types.ts`).
- BuildVersionList UI component refactor to a reactive view-model using async pipes (`src/app/pages/build-version-list/*`).
- BuildVersionDetailDialog to show get-by-name results or error messages (`src/app/pages/dialogs/build-version-detail-dialog.ts`).
- ThemeService to toggle and persist light/dark themes (`src/app/services/theme.service.ts`).
- Global test setup (`src/test-setup.ts`) to reset localStorage & theme classes between tests.
- Unit tests for the service and component (`*.spec.ts`) including a test that verifies URL encoding for getByName.

### Changed
- Replaced runtime OpenAPI discovery with a static, v1-specific TypeScript client and removed dynamic discovery logic.
- Updated BuildVersionList template and styles to follow Material theme tokens and removed duplicate/nested markup.
- Tests updated and stabilized; removed problematic test imports and wired global setup via test polyfills.

### Removed
- Deprecated alias/re-export files for the older dynamic client and v1 wrappers were removed to avoid confusion.

### Notes
- The types in `build-version.types.ts` are intentionally trimmed for maintainability. If you prefer full autogen types, generate them from the OpenAPI spec and replace or augment the trimmed types.

### Next steps
- Add e2e tests and integrate with CI.
- Consider generating full typed models from OpenAPI during a CI job rather than checking the spec into VCS.
