import { test, expect } from '@playwright/test';

test.describe('Autenticazione - StreetCats', () => {
  test('Login di successo', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('email').fill('test@example.com');
    await page.getByPlaceholder('password').fill('password123');
    await page.getByRole('button', { name: 'Accedi' }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(page.getByText('Benvenuto')).toBeVisible();
  });

  test('Login fallito - credenziali errate mostra messaggio di errore', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('email').fill('wrong@example.com');
    await page.getByPlaceholder('password').fill('wrongpass');
    await page.getByRole('button', { name: 'Accedi' }).click();

    await expect(page.locator('text=Credenziali non valide')).toBeVisible();
  });

  test('Logout rimuove token e reindirizza alla pagina di login', async ({ page }) => {
    // Effettuiamo il login prima di testare il logout
    await page.goto('/login');
    await page.getByPlaceholder('email').fill('test@example.com');
    await page.getByPlaceholder('password').fill('password123');
    await page.getByRole('button', { name: 'Accedi' }).click();

    await expect(page).toHaveURL(/\/home$/);

    // Clicchiamo su Logout
    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/login$/);

    // Verifichiamo che il token (o session) sia stato rimosso da localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });
});
