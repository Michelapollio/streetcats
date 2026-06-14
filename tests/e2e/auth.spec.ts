import { test, expect } from '@playwright/test';

test('Test1: Login di successo', async ({ page }) => {
  await page.goto('/login');

  const emailInput = page.getByLabel('Email');
  const passwordInput = page.getByLabel('Password');

  await emailInput.fill('test@example.com');
  await expect(emailInput).toHaveValue('test@example.com');
  await passwordInput.fill('password123');
  await expect(passwordInput).toHaveValue('password123');

  await page.getByRole('button', { name: /entra/i }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
});

test('Test2: Login fallito con credenziali errate', async ({ page }) => {
  await page.goto('/login/');

  const wrongEmailInput = page.getByLabel('Email');
  const wrongPasswordInput = page.getByLabel('Password');

  await wrongEmailInput.fill('wrong@example.com');
  await expect(wrongEmailInput).toHaveValue('wrong@example.com');
  await wrongPasswordInput.fill('wrongpass');
  await expect(wrongPasswordInput).toHaveValue('wrongpass');

  const [dialog] = await Promise.all([
    page.waitForEvent('dialog'),
    page.getByRole('button', { name: /entra/i }).click(),
  ]);

  expect(dialog.message()).toContain('Si è verificato un errore sul server.');
  await dialog.dismiss();
});

test('Test3: Logout rimuove token e reindirizza al login', async ({ page }) => {
  await page.goto('/login');

  const emailInput = page.getByLabel('Email');
  const passwordInput = page.getByLabel('Password');

  await emailInput.fill('test@example.com');
  await expect(emailInput).toHaveValue('test@example.com');
  await passwordInput.fill('password123');
  await expect(passwordInput).toHaveValue('password123');
  await page.getByRole('button', { name: /entra/i }).click();
  await expect(page).toHaveURL(/dashboard/);

  await page.getByRole('button', { name: /logout/i }).click();

  await expect(page).toHaveURL(/login/);

  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeNull();
});
