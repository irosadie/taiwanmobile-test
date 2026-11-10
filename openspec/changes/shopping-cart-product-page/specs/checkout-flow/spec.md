# Spec Delta

## Purpose

Defines the checkout confirmation dialog workflow, order summary review, simulated asynchronous checkout processing with loading indicators, and post-checkout cart reset behavior.

## ADDED Requirements

### Requirement: Checkout Confirmation Dialog Window
The system MUST display a checkout confirmation dialog window when a user clicks the "Checkout" button on a non-empty shopping cart, summarizing the items, total item quantity, and total payable amount in `NT$` before executing the checkout.

#### Scenario: Opening checkout confirmation dialog
- **WHEN** a user with at least `1` item in the shopping cart clicks the "Checkout" button
- **THEN** the system opens the checkout confirmation dialog listing each item's name, quantity, subtotal, total cart quantity, and total amount (`NT$`), along with "Cancel" and "Confirm Checkout" actions

#### Scenario: Canceling checkout from confirmation dialog
- **WHEN** a user clicks "Cancel" inside the checkout confirmation dialog
- **THEN** the system closes the checkout confirmation dialog without clearing the shopping cart or submitting the order

### Requirement: Simulated Asynchronous Checkout Execution and Loading State
The system SHALL process confirmed checkouts asynchronously (simulating a 2000ms transaction), disabling action buttons and displaying a loading indicator until the checkout completes.

#### Scenario: Confirming and completing simulated checkout
- **WHEN** a user clicks "Confirm Checkout" inside the checkout confirmation dialog
- **THEN** the confirm button displays a loading state and disables duplicate clicks during processing, and upon completion, the system clears the shopping cart to `0` items, closes the dialog and cart drawer, and displays a checkout success notification

#### Scenario: Handling checkout failure
- **WHEN** the checkout request fails with an error
- **THEN** the system keeps the cart items intact, re-enables the dialog controls, and displays an error notification to the user
