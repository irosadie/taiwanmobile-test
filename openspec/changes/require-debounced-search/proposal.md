# Proposal

## Why

Search inputs can trigger repeated filtering or requests while a user is still typing, and the application currently has no app-wide contract requiring a pause before search results update. The product catalog already uses a 300ms debounce, so making that behavior consistent gives existing and future search features a clear standard.

## What Changes

- Require every user-facing free-text search in the application to debounce its query for 300ms after the latest input change before filtering results or issuing a search request.
- Keep the input responsive while typing, and ensure only the latest query is applied after the debounce interval.
- Reuse the existing `useDebounce` utility for client-side search flows.

## Capabilities

### New Capabilities

- `search-behavior`: Consistent debounced behavior for all user-facing free-text searches.

### Modified Capabilities

None.

## Impact

The change applies to search inputs and their client-side filtering or React Query request flows under `apps/web`. The existing product catalog is the current reference implementation and already uses a 300ms debounce. No API contract or backend change is expected.
