import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { isAscending } from '../utils/assertions.js';
import { getSauceCreds } from '../utils/env.js';

test('Sort products by Price (low to high) and verify ascending order', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const { username, password } = getSauceCreds();

  await login.goto();
  await login.login(username, password);

  await inventory.sortLowToHigh();
  const prices = await inventory.getPrices();
  expect(prices.length).toBeGreaterThan(0);
  expect(isAscending(prices)).toBeTruthy();
});
