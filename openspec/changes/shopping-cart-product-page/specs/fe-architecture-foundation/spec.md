# Spec Delta

## Purpose

Defines the mandatory Next.js App Router frontend architectural boundaries, BFF proxy routing, domain data-fetching layer, and shared schema/type validation contracts for the shopping cart application.

## ADDED Requirements

### Requirement: Server Component Route Entrypoint with Suspense Boundary
The route entrypoint MUST be a Server Component that acts solely as a thin `Suspense` wrapper rendering the route's main Client Component with a skeleton fallback, containing zero direct API calls or state management.

#### Scenario: Initial route render with Suspense fallback
- **WHEN** a user navigates to the product display page route
- **THEN** the Server Component renders a `Suspense` boundary with a page skeleton fallback until the client orchestrator component is hydrated

### Requirement: Client Orchestrator and Route-Private Component Isolation
The route orchestrator component MUST manage page-level state, custom hook invocations, and modal/drawer visibility, while delegating route-specific presentational UI to private components and shared primitives to global UI components.

#### Scenario: Component layer separation
- **WHEN** route-specific UI elements (product grid, search bar, cart drawer, confirmation dialogs) are rendered
- **THEN** they receive state and callbacks via props from the route orchestrator without executing direct HTTP requests

### Requirement: Domain Data Fetching via React Query and Internal BFF Proxy
All client data fetching and mutations MUST execute through domain-scoped hooks backed by a centralized HTTP client that routes requests through the internal BFF proxy endpoint using flat constant keys and router paths.

#### Scenario: Fetching product catalog through BFF proxy
- **WHEN** the product catalog hook queries the product list
- **THEN** the request is dispatched through the shared client to `/api/proxy/products` using registered constant router paths and cache keys

#### Scenario: Submitting checkout request through BFF proxy
- **WHEN** the checkout mutation hook is triggered with validated cart items
- **THEN** the payload is sent via POST to `/api/proxy/checkout` and unwraps the standardized response payload

### Requirement: Shared Type Definitions and Schema Validation
All API response contracts MUST be strictly typed without `any`, and user inputs (search query parameters, item quantity updates, and checkout payloads) MUST be validated against shared schemas.

#### Scenario: Validating quantity update payload
- **WHEN** a user submits a custom numeric quantity update or checkout payload
- **THEN** the system validates the input against the shared schema and rejects non-integer or invalid values before state mutation
