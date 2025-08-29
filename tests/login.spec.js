import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { getSauceCreds } from '../utils/env.js';

test('Login with valid credentials navigates to inventory page', async ({ page }) => {
  const login = new LoginPage(page);
  const { username, password } = getSauceCreds();

  await login.goto();
  await login.login(username, password);
});
