import { expect } from '@playwright/test';

export class CheckoutPage {
  constructor(page){this.page=page;}
  async fillInformation(info){
    await this.page.getByTestId('firstName').fill(info.firstName);
    await this.page.getByTestId('lastName').fill(info.lastName);
    await this.page.getByTestId('postalCode').fill(info.postalCode);
    await this.page.getByTestId('continue').click();
  }
  async finish(){await this.page.getByTestId('finish').click();}
  async expectComplete(){
    await expect(this.page.getByTestId('title')).toHaveText(/Checkout:\s*Complete!/i);
  }
}
