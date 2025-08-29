import { expect } from '@playwright/test';

export class InventoryPage {
  constructor(page){
    this.page=page;
    this.cartLink=page.getByTestId('shopping-cart-link');
    this.cartBadge=page.locator('.shopping_cart_badge');
    this.sortSelect=page.getByTestId('product-sort-container');
  }
  async addProductByName(name){
    const item=this.page.locator('.inventory_item').filter({hasText:name});
    await expect(item).toBeVisible();
    await item.getByRole('button',{name:/add to cart/i}).click();
  }
  async addProducts(names){for(const n of names){await this.addProductByName(n);}}
  async getCartCount(){
    if(await this.cartBadge.count()===0) return 0;
    const txt=await this.cartBadge.first().innerText();
    return Number(txt);
  }
  async openCart(){await this.cartLink.click();}
  async sortLowToHigh(){await this.sortSelect.selectOption('lohi');}
  async getPrices(){
    const priceTexts=await this.page.locator('.inventory_item_price').allInnerTexts();
    return priceTexts.map(t=>Number(t.replace(/[^\d.]/g,'')));
  }
}
