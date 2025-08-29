export class CartPage{constructor(page){this.page=page;}async checkout(){await this.page.getByTestId('checkout').click();}}
