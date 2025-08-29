import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { defaultCheckoutInfo } from '../utils/testData.js';
import { getSauceCreds } from '../utils/env.js';

test('Complete checkout with valid details and verify completion page', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const { username, password } = getSauceCreds();

  await login.goto();
  await login.login(username, password);

  await inventory.addProducts(['Sauce Labs Backpack']);
  await inventory.openCart();

  await cart.checkout();
  await checkout.fillInformation(defaultCheckoutInfo);
  await checkout.finish();
  await checkout.expectComplete();
});
