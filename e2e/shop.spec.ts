import { test, expect } from '@playwright/test';

const first = '無線藍牙耳機';
async function openShop(page: import('@playwright/test').Page) {
  await page.goto('/products');
  await expect(page.getByRole('button', { name: `加入購物車 ${first}`, exact: true })).toBeVisible();
}
async function add(page: import('@playwright/test').Page, quantity = 1) {
  await page.getByRole('spinbutton', { name: `${first} 選購數量`, exact: true }).fill(String(quantity));
  await page.getByRole('button', { name: `加入購物車 ${first}`, exact: true }).click();
}
async function openCart(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /開啟購物車/ }).click();
}
test('multiple quantities, notifications, atomic increments and removal confirmation', async ({ page }) => {
  await openShop(page);
  await add(page, 3);
  await expect(page.getByText(`已加入 ${first} × 3`, { exact: true })).toBeVisible();
  await add(page, 2);
  await expect(page.getByRole('button', { name: '開啟購物車，共 5 件商品' })).toBeVisible();
  await openCart(page);
  const input = page.getByRole('spinbutton', { name: `${first} 購物車數量`, exact: true });
  await expect(input).toHaveValue('5');
  await input.fill('10'); await input.press('Enter');
  await expect(page.getByTestId('cart-item-1')).toContainText('29,990');
  await page.getByRole('button', { name: `增加 ${first} 數量`, exact: true }).click({ clickCount: 3 });
  await expect(input).toHaveValue('13');
  await input.fill('1.5'); await input.press('Enter'); await expect(input).toHaveValue('13');
  await input.fill('100'); await input.press('Enter'); await expect(input).toHaveValue('13');
  await input.fill(''); await input.press('Enter'); await expect(input).toHaveValue('13');
  await input.fill('0'); await input.press('Enter');
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await page.getByRole('alertdialog').getByRole('button', { name: '取消', exact: true }).click();
  await expect(input).toHaveValue('13');
  await page.getByRole('button', { name: `移除 ${first}`, exact: true }).click();
  await page.getByRole('button', { name: '確認移除', exact: true }).click();
  await expect(page.getByText('購物車還是空的')).toBeVisible();
  await expect(page.getByRole('button', { name: /^結帳$/ })).toBeDisabled();
});

test('checkout cancellation, pending lock, success and reset', async ({ page }) => {
  await openShop(page); await add(page, 2);
  await page.getByRole('button', { name: '加入購物車 無線滑鼠', exact: true }).click();
  await openCart(page);
  await page.getByRole('button', { name: /^結帳$/ }).click();
  const dialog = page.getByRole('dialog', { name: '確認結帳', exact: true });
  await expect(dialog).toContainText('共 3 件商品'); await expect(dialog).toContainText('6,897');
  await dialog.getByRole('button', { name: '取消', exact: true }).click();
  await expect(page.getByTestId('cart-item-1')).toBeVisible();
  await page.getByRole('button', { name: /^結帳$/ }).click();
  await dialog.getByRole('button', { name: '確認結帳', exact: true }).click();
  await expect(dialog.getByRole('button', { name: '處理中…', exact: true })).toBeDisabled();
  await page.keyboard.press('Escape'); await expect(dialog).toBeVisible();
  await expect(dialog).toBeHidden({ timeout: 10000 });
  await expect(page.getByText('結帳成功！感謝您的購買。', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '開啟購物車，共 0 件商品' })).toBeVisible();
});

test('checkout failure preserves cart and allows retry', async ({ page }) => {
  await openShop(page); await add(page); await openCart(page);
  await page.route('**/api/proxy/checkout', route => route.fulfill({ status: 500, json: { error: 'Test failure' } }));
  await page.getByRole('button', { name: /^結帳$/ }).click();
  const dialog = page.getByRole('dialog', { name: '確認結帳', exact: true });
  await dialog.getByRole('button', { name: '確認結帳', exact: true }).click();
  await expect(page.getByText('結帳失敗，購物車已保留，請再試一次。', { exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: '確認結帳', exact: true })).toBeEnabled();
  await expect(dialog).toContainText(first);
});

test('search debounce, URL synchronization and empty result recovery', async ({ page }) => {
  await openShop(page);
  const search = page.getByRole('searchbox');
  await search.fill('usb');
  await expect(page.getByRole('button', { name: /加入購物車/ })).toHaveCount(1);
  await expect(page).toHaveURL(/search=usb/);
  await expect(page.getByRole('button', { name: '加入購物車 USB隨身碟', exact: true })).toBeVisible();
  await search.fill('no-result');
  await expect(page.getByRole('button', { name: /加入購物車/ })).toHaveCount(0);
  await search.fill('');
  await expect(page.getByRole('button', { name: /加入購物車/ })).toHaveCount(8);
});

test('catalog failure and retry', async ({ page }) => {
  await page.route('**/api/proxy/products*', route => route.fulfill({ status: 500, json: { error: 'Test failure' } }));
  await page.goto('/products');
  const retry = page.getByRole('button', { name: /重新|重試/ });
  await expect(retry).toBeVisible({ timeout: 15000 });
  await page.unroute('**/api/proxy/products*');
  await retry.click();
  await expect(page.getByRole('button', { name: /加入購物車/ })).toHaveCount(8);
});

test('responsive grid has 1/2/4 columns without horizontal overflow', async ({ page }) => {
  await openShop(page);
  for (const [width, columns] of [[375, 1], [768, 2], [1280, 4]]) {
    await page.setViewportSize({ width, height: 900 });
    const grid = page.getByRole('button', { name: `加入購物車 ${first}`, exact: true }).locator('xpath=ancestor::div[contains(@class,"grid")][1]');
    await expect(grid).toHaveCSS('display', 'grid');
    expect(await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(columns);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
