# Spec Delta

## Purpose

Manages shopping cart state, slide-over drawer presentation, toast notifications on item addition, total cart quantity and price calculation, multi-quantity updates, and item removal confirmation dialogs.

## ADDED Requirements

### Requirement: Add Item to Cart with User Notification
The system SHALL add a selected product (with single or multiple quantity) to the shopping cart—incrementing the existing line item's quantity if already present—and MUST display a toast notification confirming the added product and quantity.

#### Scenario: Adding a new product to the cart
- **WHEN** a user clicks "Add to Cart" on a product not currently in the cart (with quantity `N >= 1`)
- **THEN** the system adds the product with quantity `N` to the cart and displays a toast notification showing the product name and quantity added

#### Scenario: Adding an existing product to the cart
- **WHEN** a user clicks "Add to Cart" with quantity `N` for a product that already exists in the cart with quantity `M`
- **THEN** the system updates that cart item's quantity to `M + N` and displays a toast notification confirming the updated quantity

### Requirement: Total Quantity and Total Price Calculation
The system SHALL continuously compute and display the total quantity of all items in the shopping cart (`sum of each item's quantity`) and the total monetary amount (`sum of price * quantity` in `NT$`).

#### Scenario: Updating total cart quantity badge and summary
- **WHEN** the cart contains Product A (quantity `2`, price `NT$ 2,999`) and Product B (quantity `3`, price `NT$ 899`)
- **THEN** the header cart badge and cart drawer summary display a total quantity of `5` items and a total price of `NT$ 8,695`

#### Scenario: Empty shopping cart display
- **WHEN** the shopping cart has `0` items
- **THEN** the header cart badge displays `0`, the cart drawer displays an empty-cart message, and the checkout button is disabled

### Requirement: Update Cart Item Quantity by Multiples and Steppers
The system SHALL allow users to update any cart item's quantity both by single-step buttons (`+1` / `-1`) and by multiples via direct numeric input or batch increments without losing rapid consecutive updates.

#### Scenario: Updating cart item quantity directly by multiples via numeric input
- **WHEN** a user edits a cart item's quantity input field from `1` to `5`
- **THEN** the system immediately updates the item's quantity to `5` and recalculates the item subtotal, total cart quantity, and total price

#### Scenario: Rapid or batch quantity increments
- **WHEN** a user rapidly clicks increment controls or adds multiple quantities (`+N`) in quick succession
- **THEN** every increment is applied atomically using functional state updates so the final quantity equals the exact sum of all increments

### Requirement: Confirmation Dialog Before Removing Item from Shopping Cart
The system MUST open a confirmation dialog window whenever a user initiates removing an item from the shopping cart (either via the item delete button or by reducing its quantity to `0`), and SHALL only remove the item after explicit user confirmation.

#### Scenario: Confirming item removal via delete button
- **WHEN** a user clicks the remove button on a cart item and clicks "Confirm" in the removal confirmation dialog
- **THEN** the system removes the item from the shopping cart, closes the dialog, and recalculates total quantity and total price

#### Scenario: Canceling item removal when reducing quantity to zero
- **WHEN** a user decrements a cart item's quantity from `1` to `0` (or enters `0`) and clicks "Cancel" in the confirmation dialog
- **THEN** the system closes the dialog and preserves the cart item in the shopping cart with its previous valid quantity (`>= 1`)

### Requirement: Shopping Cart Slide-Over Drawer Interaction
The system SHALL display the shopping cart inside a slide-over drawer that opens via the header cart button and closes via the close button, `Escape` key, or clicking the backdrop overlay.

#### Scenario: Opening and closing the cart drawer
- **WHEN** a user clicks the header cart button and subsequently clicks outside the drawer on the backdrop overlay
- **THEN** the cart drawer slides open to show current cart items and then smoothly closes when the backdrop is clicked
