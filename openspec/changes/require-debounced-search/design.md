# Design

## Context

The home page and `/products` both render `ProductsPageContent`. Its search already separates immediate input state from `useDebounce` output and passes only the latter to the products React Query hook. The shared debounce hook defaults to 300ms and cancels pending timers. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:** Use the shared debounce default consistently and avoid redundant URL writes during search synchronization.

**Non-Goals:** Change matching rules, add search controls, or modify backend contracts.

## Decisions

- Reuse the existing `useDebounce` default in route orchestration instead of repeating a delay at each call site. Adding another search hook or dependency would duplicate the existing behavior.
- Keep input state immediate and use only the debounced value for the domain query and URL. Presentational search components remain controlled; data access remains in domain hooks through the BFF.
- Skip history replacement when the requested parameter value already matches the URL. This avoids unnecessary URL synchronization without changing navigation semantics.
- Strengthen the existing search end-to-end check on `/` with controlled time and observed requests. This checks the actual home page rather than only the standalone debounce utility.

## Risks / Trade-offs

- A 300ms pause delays results while preserving immediate typing feedback. Existing results remain visible through React Query placeholder data.
- Existing debounce timers must still be canceled on edits and unmount; preserve the existing hook cleanup.
