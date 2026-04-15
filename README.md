# Waste Booking Flow Assessment

This repository implements a realistic UK waste booking flow with deterministic API fixtures, branching logic, UI states, and end-to-end automation.

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:4173`.

> Note: Local development requires Node 18+ for Vite support. If your environment uses an older Node version, use Docker instead.

## Docker

Start the application in a container with the single command:

```bash
docker compose up --build
```

Then open `http://localhost:4174`.

## Project structure

- `server/` - Express API with deterministic postcode fixtures and skip pricing.
- `src/` - React booking flow UI.
- `automation/` - Playwright E2E tests.
- `manual-tests.md` - 35+ manual test cases.
- `bug-reports.md` - documented bugs with severity and reproduction.
- `ui/` - screenshot and evidence folder.

## Application features

- Postcode lookup with UK validation.
- Address selection from 12+ results for `SW1A 1AA`.
- Empty lookup state for `EC1A 1BB`.
- Simulated latency for `M1 1AE`.
- Initial `500` error for `BS1 4DJ` then success on retry.
- General, heavy, and plasterboard waste paths.
- Plasterboard handling options.
- Skip selection with mixed enabled/disabled states and heavy-waste disabled sizes.
- Review summary with price breakdown, service fee, VAT, and booking confirmation.
- Prevents double submit during booking.

## Testing

### Automated tests

```bash
npm test
```

### Automated tests in Docker

If the app is running in Docker on `http://localhost:4174`, use the helper script:

```bash
docker run --rm -v C:\Users\javed\Documents\WasteMgnt:/app -v wastemgnt_node_modules:/app/node_modules -w /app mcr.microsoft.com/playwright:v1.59.1-jammy sh /app/docker-playwright-test.sh
```

This command:
- installs dependencies inside the container
- downloads Chromium for Playwright
- runs the Playwright suite against the Docker-hosted app

### Manual evidence

- UI screenshots are stored in `ui/screenshots`.
- The `manual-tests.md` and `bug-reports.md` files contain structured assessment evidence.

## Automation strategy

The Playwright suite uses stable `data-testid` selectors and deterministic backend fixtures. The two flows cover general waste and heavy waste, validating lookup, branching, skip availability, review, and confirmation.
