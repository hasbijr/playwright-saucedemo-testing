# Saucedemo Testing using Playwright 

This repository contains automated tests for the checkout flow of the [Saucedemo](https://www.saucedemo.com/) website using [Playwright](https://playwright.dev/).

## Project Structure

This automation framework uses the **Page Object Model (POM)** design pattern for better maintainability and code reusability.

*   `tests/`: Contains the test specification files (currently focusing on `checkout.spec.ts`).
*   `pages/`: Contains the Page Object classes representing different pages of the application.
    *   `LoginPage.ts`
    *   `InventoryPage.ts`
    *   `CartPage.ts`
    *   `CheckoutInfoPage.ts`
    *   `CheckoutOverviewPage.ts`
    *   `CheckoutCompletePage.ts`
*   `playwright.config.ts`: Playwright configuration file.

## Test Coverage (Checkout Flow)

The automated tests handle the following scenarios:

**Successful Checkout Flows**
*   Checking out a single item as a standard user.
*   Sorting items by price and checking out the cheapest and most expensive items.
*   Adding items, removing one from the cart, and checking out the remaining items.
*   Validating that a problem user fails the checkout process due to a known bug (missing last name).
*   Verifying that the subtotal, tax, and total price calculations are correct on the overview page.

**Checkout Validation Flows (Negative Tests)**
*   Attempting checkout with a missing First Name.
*   Attempting checkout with a missing Last Name.
*   Attempting checkout with a missing Postal Code.
*   Validating that navigating to checkout with an empty cart correctly reaches the checkout info step.
*   Validating that the default sort order remains for an "error user" because the sorting feature fails.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hasbijr/playwright-saucedemo-testing.git
    cd playwright-saucedemo-testing
    ```

2.  **Install Dependencies:**
    This project requires Node.js. Install the required Node modules using npm:
    ```bash
    npm install
    ```

3.  **Install Playwright Browsers:**
    ```bash
    npx playwright install
    ```

## Running the Tests

To run the checkout tests:

```bash
npx playwright test tests/checkout.spec.ts 
```

To run tests in UI mode (headed mode):

```bash
npx playwright test tests/checkout.spec.ts --headed
```

## Viewing Test Reports

After running the tests, Playwright automatically generates an HTML report. You can view it by running:

```bash
npx playwright show-report
```
