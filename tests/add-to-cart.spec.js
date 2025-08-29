import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { cartProducts } from '../utils/testData.js';
import { getSauceCreds } from '../utils/env.js';

test('Add two specific products and verify cart badge count', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const { username, password } = getSauceCreds();

  await login.goto();
  await login.login(username, password);

  await inventory.addProducts(cartProducts);
  await expect.poll(async () => inventory.getCartCount()).toBe(2);
});
