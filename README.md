# SauceDemo — Playwright (JavaScript)

This repository provides a maintainable Playwright test suite for **Swag Labs (SauceDemo)**. It uses plain **JavaScript (ESM)**, follows the **Page Object Model (POM)** design pattern, and supports configuration through `.env`. The suite covers core user flows and is designed to be simple to extend.

---

## 🚀 Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Install browsers
npx playwright install

# 3. Run all tests (headless)
npm test

# 4. View report
npm run report
```

---

## Scenarios Covered
1. **Login** with valid credentials and land on the **Products** page.
2. **Add two specific products** and verify the cart **badge = 2**.
3. **Checkout** with basic details and confirm **“Checkout: Complete!”**.
4. **Sort by Price (low → high)** and validate ascending order of prices.

---

## Step-by-Step Guide

### 0) Prerequisites
- **Node.js 18+** (`node -v`)
- Internet connection (tests run against `https://www.saucedemo.com`)

### 1) Get the Project
- Clone or unzip this repository.
- Open it in your preferred editor/terminal.

### 2) Install Dependencies & Browsers
```bash
npm install
npx playwright install
```
- `npm install` fetches required packages.
- `npx playwright install` downloads Chromium, Firefox, and WebKit.

### 3) Configure Environment (Optional)
Copy the template and adjust if necessary:
```bash
cp .env.example .env
```
Default values:
```
BASE_URL=https://www.saucedemo.com
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
```
> **Note:** We use `SAUCE_USERNAME` instead of `USERNAME` to avoid conflicts with Windows system variables.

### 4) Run Tests
- **Headless (CI style):**
  ```bash
  npm test
  ```
- **Headed (watch browser):**
  ```bash
  npx playwright test --headed
  ```
- **Visual runner:**
  ```bash
  npm run test:ui
  ```

### 5) View Reports
```bash
npm run report
```
This opens Playwright’s HTML report. Failures include links to **trace**, **screenshot**, and **video**.

### 6) Allure Report

#### A) Setup (One-time)
Install the dependencies:
```bash
npm install -D allure-playwright
sudo npm install -g allure-commandline --save-dev
```

#### B) Generate and View Report
1. **Run tests:**
   ```bash
   npx playwright test
   ```
   → Creates an `allure-results` folder with raw data.

2. **Generate report:**
   ```bash
   allure generate allure-results -o allure-report --clean
   ```

3. **Open report:**
   ```bash
   allure open allure-report
   ```

---

## Project Layout
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
├─ utils/                 # Test data & helpers
│  ├─ testData.js        # Product names, checkout info
│  ├─ assertions.js      # Assertions (e.g., ascending check)
│  └─ env.js             # Env variable reader
├─ playwright.config.js   # Config (parallel, reporter, timeouts)
├─ .env.example
├─ .editorconfig
├─ .gitignore
└─ package.json
```

---

## Design Choices
- **Thin POM:** Each page only exposes what tests need.
- **Stable selectors:** Using `data-test` mapped to Playwright’s `getByTestId`.
- **No arbitrary waits:** Assertions wait for final visible states.
- **Externalized test data:** Stored in `utils/testData.js`.
- **Artifacts:** Failures keep trace, screenshot, and video.

---

## Running Specific Tests
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

## Adding a New Test
Example:
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

  // additional steps + expectations
});
```

---

## Configuration Notes
- `playwright.config.js`:
  - `use.testIdAttribute = 'data-test'`
  - Parallel projects (Chromium/Firefox/WebKit)
  - Traces, screenshots, and videos on failure
- `.env` values:
  - `BASE_URL` → SauceDemo by default
  - `SAUCE_USERNAME` / `SAUCE_PASSWORD` → demo creds

> To force `.env` override system vars, add `dotenv.config({ override: true })` in `playwright.config.js`.

---

## What to Commit / Ignore
✅ Commit:
- `pages/`, `tests/`, `utils/`
- `playwright.config.js`, `package.json`, `package-lock.json`
- `.env.example`, `.gitignore`, `.editorconfig`, `README.md`

🚫 Ignore (already in `.gitignore`):
- `node_modules/`, `playwright-report/`, `test-results/`, `.env`, `.vs/`

---

## Troubleshooting
- **Timeout for `getByTestId('username')`:**
  - Ensure `testIdAttribute` is set.
  - Reinstall browsers: `npx playwright install`
- **Username field autofills with Windows login:**
  - Use `SAUCE_USERNAME`/`SAUCE_PASSWORD`
  - Or add `dotenv.config({ override: true })`
- **Browsers not found / tests fail to launch:**
  - Run `npx playwright install`
- **Report/trace not opening:**
  - Run `npm run report` or `npx playwright show-trace test-results/**/trace.zip`
- **Behind proxy/firewall:**
  - Use `--headed` mode to verify page loads.
  - Allowlist `saucedemo.com`.
