# Spec Delta

## Purpose

Governs the product list display, responsive multi-breakpoint layout, asynchronous loading and error states, and debounced search box filtering for finding products easily.

## ADDED Requirements

### Requirement: Responsive Product Catalog Grid Display
The system SHALL display the catalog of products in a responsive grid layout showing each product's image placeholder/preview, name, formatted price in `NT$`, quantity selector, and "Add to Cart" action button across mobile, tablet, and desktop viewports.

#### Scenario: Rendering product catalog on desktop and mobile viewports
- **WHEN** the product catalog finishes loading the 8 store products
- **THEN** the system renders a 4-column grid on desktop (`>=1024px`), a 2-column grid on tablet (`>=640px`), and a 1-column grid on mobile (`<640px`) without horizontal overflow

#### Scenario: Displaying individual product details
- **WHEN** a product card is rendered in the catalog
- **THEN** it displays the product title, formatted price (`NT$ <price>`), visual image area, quantity multiple input/stepper (defaulting to `1`), and an "Add to Cart" button

### Requirement: Asynchronous Loading and Error Recovery States
The system SHALL display visual loading skeletons while product data is being fetched and present an actionable error state with a retry control if the product request fails.

#### Scenario: Product list loading state
- **WHEN** the product catalog query is in a pending state (simulated 1500ms API latency)
- **THEN** the system displays product card skeletons in the grid layout until data resolves

#### Scenario: Product list fetch failure
- **WHEN** the product catalog API request fails with an error
- **THEN** the system displays an error message and a "Retry" button that re-triggers the product query when clicked

### Requirement: Debounced Product Search Box
The system SHALL provide a search input box that filters displayed products by keyword (case-insensitive substring match on product name) with debounce protection and a clear-search action.

#### Scenario: Filtering products by keyword in search box
- **WHEN** a user types a keyword (e.g., `無限` or `耳機` or `USB`) into the search box and pauses for the debounce interval (300ms)
- **THEN** the product grid updates to display only products whose names match the keyword

#### Scenario: Search keyword matches no products
- **WHEN** a user enters a search keyword that matches zero products
- **THEN** the system displays an empty search result state with a button to clear the search query and restore the full product list

#### Scenario: Clearing the search input
- **WHEN** a user clicks the clear button inside the search box or deletes the search text
- **THEN** the system resets the filter and displays all catalog products

### Requirement: Preserve the Original Storefront Visual Design
The system MUST preserve the layout, typography, colors, cards, image placeholders, and cart drawer of `docs/index.html`. Required search and quantity controls SHALL extend this layout without a hero, editorial branding, decorative product illustrations, or a footer. Responsive behavior and mandatory shopping features MUST remain available.

#### Scenario: Comparing the storefront with the original HTML
- **WHEN** the original HTML and the migrated application are viewed at the same desktop viewport after the catalog loads
- **THEN** their header, grid geometry, image area, colors, typography, and card styling match, allowing for the required search, quantity controls, dialogs, notifications, and formatted totals

#### Scenario: Adapting the original layout to mobile
- **WHEN** the application is viewed below 640px wide
- **THEN** the product grid uses one column, the search wraps within the header, and the cart drawer fits the viewport without horizontal overflow
