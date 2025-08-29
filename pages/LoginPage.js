import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) { 
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username, password) {
    const user = this.page.locator('[data-test="username"], #user-name');
    const pass = this.page.locator('[data-test="password"], #password');
    const btn  = this.page.locator('[data-test="login-button"], #login-button');
    
    await user.waitFor({ state: 'visible' });
    await user.fill(username);
    await pass.fill(password);
    
    await btn.click();

    await this.expectOnInventory();
  }

  async expectOnInventory() {
    await expect(this.page.getByTestId('title')).toHaveText(/Products/i);
  }
}
