import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) { 
    
    this.page = page;
    this.user = this.page.locator('[data-test="username"], #user-name');
    this.pass = this.page.locator('[data-test="password"], #password');
    this.btn  = this.page.locator('[data-test="login-button"], #login-button'); }

  async goto() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.user.waitFor({ state: 'visible' });
    await this.user.fill(username);
    await this.pass.fill(password);
    
    await this.btn.click();

    await this.expectOnInventory();
  }

  async expectOnInventory() {
    await expect(this.page.getByTestId('title')).toHaveText(/Products/i);
  }
}