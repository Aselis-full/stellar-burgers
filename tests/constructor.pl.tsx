import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('простые проверки конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });
  });
  test('ингредиенты из HAR-файла', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('ingredients-list')).toBeVisible();
  });
  test('ингредиент добавляется в конструктор', async ({ page }) => {
    await page.goto('/');
    const emptyPlaceholder = page.getByTestId('empty-placeholder');
    const ingredientsList = page.getByTestId('placeholder');
    await expect(emptyPlaceholder).toBeVisible();
    const ingredientCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    const addButton = ingredientCard.getByRole('button', { name: 'Добавить' });
    await addButton.click();
    await expect(emptyPlaceholder).toBeHidden();
    const added = ingredientsList.getByText(
      'Биокотлета из марсианской Магнолии'
    );
    await expect(added).toBeVisible();
  });
  test('открытие и закрытие описания ингредиента', async ({ page }) => {
    const harDir = path.join(process.cwd(), 'tests', 'hars');
    const harPath = path.join(harDir, 'ingredients.har');
    const harRaw = fs.readFileSync(harPath, 'utf8');
    const harData = JSON.parse(harRaw);

    const ingredientEntry = harData.log.entries.find(
      (entry: any) =>
        entry.request.url.includes('/api/ingredients') &&
        entry.response.status === 200
    );
    const contentFileName = ingredientEntry.response.content._file;
    const contentFilePath = path.join(harDir, contentFileName);
    const contentRaw = fs.readFileSync(contentFilePath, 'utf8');
    const apiResponse = JSON.parse(contentRaw);
    const ingredientsList = apiResponse.data || apiResponse;
    const bun = ingredientsList.find(
      (item: any) => item.name === 'Краторная булка N-200i'
    );

    await page.goto('/');
    const ingredientCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });
    await expect(ingredientCard).toBeVisible();
    await ingredientCard.click();
    await page.waitForURL('**/ingredients/**');
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    const details = modal.getByTestId('ingredient-details');

    await expect(details).toBeVisible();
    await expect(details.locator('img')).toHaveAttribute(
      'src',
      bun.image_large
    );
    await expect(details.locator('h3')).toHaveText(bun.name);
    const calories = details
      .locator('li', { hasText: 'Калории, ккал' })
      .locator('p.text_type_digits-default');
    const proteins = details
      .locator('li', { hasText: 'Белки, г' })
      .locator('p.text_type_digits-default');
    const fat = details
      .locator('li', { hasText: 'Жиры, г' })
      .locator('p.text_type_digits-default');
    const carbohydrates = details
      .locator('li', { hasText: 'Углеводы, г' })
      .locator('p.text_type_digits-default');
    await expect(calories).toHaveText(String(bun.calories));
    await expect(proteins).toHaveText(String(bun.proteins));
    await expect(fat).toHaveText(String(bun.fat));
    await expect(carbohydrates).toHaveText(String(bun.carbohydrates));

    const closeButton = modal.getByRole('button');
    await closeButton.click();
    await expect(modal).toBeHidden();
    await page.waitForURL('/');
  });
});

test('тест процесса создания заказа', async ({ context, page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/ingredients',
    update: false
  });
  await page.routeFromHAR('./tests/hars/user.har', {
    url: '**/auth/user',
    update: false
  });
  await page.routeFromHAR('./tests/hars/order.har', {
    url: '**/orders',
    update: false
  });
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer super-secret-auth-token',
      domain: 'localhost',
      path: '/'
    }
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer super-secret-auth-token');
    localStorage.setItem('refreshToken', 'Bearer super-secret-refresh-token');
  });
  await page.goto('/');
  const upBun = page.getByTestId('up-bun');
  const downBun = page.getByTestId('down-bun');
  const ingredientsList = page.getByTestId('placeholder');
  const ingredientBunCard = page
    .locator('li')
    .filter({ hasText: 'Флюоресцентная булка R2-D3' });
  const addBunButton = ingredientBunCard.getByRole('button', {
    name: 'Добавить'
  });
  await addBunButton.click();
  const ingredientMainCard = page
    .locator('li')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
  const addMainButton = ingredientMainCard.getByRole('button', {
    name: 'Добавить'
  });
  await addMainButton.click();
  const addedUpBun = upBun.getByText('Флюоресцентная булка R2-D3');
  const addedMain = ingredientsList.getByText(
    'Биокотлета из марсианской Магнолии'
  );
  const addedDownBun = downBun.getByText('Флюоресцентная булка R2-D3');
  await expect(addedUpBun).toBeVisible();
  await expect(addedMain).toBeVisible();
  await expect(addedDownBun).toBeVisible();
  const submitButton = page.getByRole('button', {
    name: 'Оформить заказ'
  });
  await submitButton.click();
  const modal = page.getByTestId('modal');
  await expect(modal).toBeVisible();
  const orderNumber = page.getByTestId('order-number');
  await expect(orderNumber).toBeVisible({ timeout: 10000 });
  await expect(orderNumber).toHaveText('108261');
  await expect(addedUpBun).toBeHidden();
  await expect(addedMain).toBeHidden();
  await expect(addedDownBun).toBeHidden();
});
