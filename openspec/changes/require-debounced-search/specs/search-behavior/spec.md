# Spec Delta

## Purpose

Ensures all user-facing free-text searches apply the latest keyword after a consistent pause while keeping input responsive.

## ADDED Requirements

### Requirement: Debounced search execution
Every user-facing free-text search SHALL apply its keyword to results and search requests only after 300ms without input changes. Intermediate pending keywords SHALL be discarded.

#### Scenario: Rapid input changes
- **WHEN** a user types successive keywords less than 300ms apart
- **THEN** the input displays each edit immediately
- **AND** only the final keyword updates results or triggers a search request after 300ms of inactivity

#### Scenario: Clearing search
- **WHEN** a user clears the search field and leaves it empty for 300ms
- **THEN** the search filter resets and the full result set is restored

### Requirement: Search URL synchronization
Search controls that synchronize their keyword with the URL SHALL publish the applied debounced keyword without rewriting an unchanged URL value.

#### Scenario: Search on the home page
- **WHEN** the user edits search on the home page
- **THEN** the search URL parameter retains its previous value during the debounce interval
- **AND** it updates to the latest keyword when the debounce interval completes

#### Scenario: Existing search link
- **WHEN** the user opens a URL containing a search keyword
- **THEN** the input and initial results use that keyword
