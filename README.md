# Swag Labs (SauceDemo) — Playwright (JavaScript)

This repo is a maintainable Playwright suite for Swag Labs. It’s plain **JavaScript (ESM)** with a **Page Object Model** and `.env` config. It implements the four scenarios and stays easy to extend.

## What's covered
1. **Login** with valid credentials and land on **Products**
2. **Add two specific products** and verify the cart **badge = 2**
3. **Checkout** with basic details and reach **“Checkout: Complete!”**
4. **Sort by Price (low → high)** and verify prices are ascending

---

## Step‑by‑step guide

### 0) Prerequisites
- **Node.js 18+** (`node -v`)
- Internet access (tests hit `https://www.saucedemo.com`)

### 1) Get the project
- Clone or unzip this folder.
- Open it in your editor/terminal.

### 2) Install dependencies and browsers
```bash
npm install
npx playwright install
```
> `npm install` gets packages. `npx playwright install` downloads Chromium/Firefox/WebKit.

### 3) Configure environment (optional)
Copy the template and adjust if needed:
```bash
cp .env.example .env
```
Defaults are set for SauceDemo:
```
BASE_URL=https://www.saucedemo.com
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
```
Why `SAUCE_*`? On Windows, `USERNAME` is a built‑in env var (your login). Using `SAUCE_USERNAME` avoids collisions.

### 4) Run the tests
- **Headless (CI style)**
  ```bash
  npm test
  ```
- **Headed (watch the browser)**
  ```bash
  npx playwright test --headed
  ```
- **Visual runner**
  ```bash
  npm run test:ui
  ```

### 5) View the report
```bash
npm run report
```
This opens Playwright’s HTML report. On failure you’ll see links to **trace**, **screenshot**, and **video**.

### 6) Allure Report
```bash
npm run report
```
This is a more detailed and interactive report.

####A) Setup (One-time only)

Before you can generate a report, you need two things:

**Install the Allure reporter package:**

```bash
npm install -D allure-playwright
```

**Install the Allure Commandline tool:** This is needed to generate the final HTML report.

```bash
sudo npm install -g allure-commandline --save-dev
```

####B) Generate and View the Report

Generating the report is a two-step process after running your tests.

**Run your tests:** This will create a folder named allure-results containing the raw test data.

```bash
npx playwright test
```

**Generate the report: ** This command reads the raw data from allure-results and builds the HTML report in a new allure-report folder.

**Open the report: ** This command opens the generated HTML report in your browser.

```bash
allure open allure-report
```

---

## Project layout
```
.
├─ pages/                 # Page Objects
│  ├─ LoginPage.js
│  ├─ InventoryPage.js
│  ├─ CartPage.js
│  └─ CheckoutPage.js
├─ tests/                 # Specs (1:1 with scenarios)
│  ├─ login.spec.js
│  ├─ add-to-cart.spec.js
│  ├─ checkout.spec.js
│  └─ sort.spec.js
├─ utils/                 # Test data & small helpers
│  ├─ testData.js        # product names, checkout info
│  ├─ assertions.js      # ascending check
│  └─ env.js             # reads SAUCE_USERNAME/PASSWORD safely
├─ playwright.config.js   # parallel projects, reporter, timeouts
├─ .env.example
├─ .editorconfig
├─ .gitignore
└─ package.json
```

---

## Design choices
- **Thin POM.** Each page exposes only what tests use—no god‑objects.
- **Stable selectors.** We map Playwright to `data-test` (`testIdAttribute: 'data-test'`), so `getByTestId('username')` hits `data-test="username"`.
- **No arbitrary waits.** Assertions wait for visible titles, counts, and final states.
- **Externalized data.** Products and checkout info live in `utils/testData.js`.
- **Parallel + artifacts.** Runs on Chromium/Firefox/WebKit; failures keep trace, screenshot, and video.

---

## Run just one test / one browser
- Single spec:
  ```bash
  npx playwright test tests/login.spec.js
  ```
- Filter by title:
  ```bash
  npx playwright test -g "ascending order"
  ```
- Only Chromium:
  ```bash
  npx playwright test --project=chromium
  ```

---

## Add a new test quickly
Create a spec in `tests/`, import page objects, and reuse the env helper:
```js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { getSauceCreds } from '../utils/env.js';

test('example flow', async ({ page }) => {
  const login = new LoginPage(page);
  const inv = new InventoryPage(page);

  const { username, password } = getSauceCreds();
  await login.goto();
  await login.login(username, password);

  // your steps + expectations here
});
```

---

## Configuration notes
- **`playwright.config.js`** sets:
  - `use.testIdAttribute = 'data-test'` → `getByTestId()` targets `data-test`
  - Parallel projects (Chromium/Firefox/WebKit)
  - Traces, screenshots, videos **on failure**
- **`.env`** values:
  - `BASE_URL` — defaults to SauceDemo
  - `SAUCE_USERNAME` / `SAUCE_PASSWORD` — demo creds by default

If you insist on `USERNAME`/`PASSWORD`, set `dotenv.config({ override: true })` in `playwright.config.js` so `.env` overrides the OS.

---

## What to commit (and what to ignore)
**Commit:**
- `pages/`, `tests/`, `utils/`
- `playwright.config.js`, `package.json`, `package-lock.json`
- `.env.example`, `.gitignore`, `.editorconfig`, `README.md`

**Ignore** (already in `.gitignore`):
- `node_modules/`, `playwright-report/`, `test-results/`, `.env`, `.vs/`

---

## Troubleshooting
- **Timeout waiting for `getByTestId('username')`:**
  - Ensure the config maps test IDs:
    ```js
    use: { testIdAttribute: 'data-test', /* ... */ }
    ```
  - Reinstall browsers: `npx playwright install`
- **Username field fills with your Windows name instead of `standard_user`:**
  - Use `SAUCE_USERNAME`/`SAUCE_PASSWORD` in `.env` (already provided), or
  - `dotenv.config({ override: true })` in `playwright.config.js`
- **“Browsers not found” / tests won’t launch:**
  - Run `npx playwright install` again
- **Report/trace won’t open:**
  - `npm run report` or `npx playwright show-trace test-results/**/trace.zip`
- **Behind a proxy/firewall:**
  - Try `--headed` to verify page loads. Allowlist `saucedemo.com` if blocked.