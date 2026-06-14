import { test, expect } from '@playwright/test';

test.describe('Autenticazione - Registrazione Nuovo Utente', () => {

  // Eseguiamo prima di ogni test la navigazione alla pagina di registrazione
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/register'); // Adatta la rotta se diversa
  });

  test('Test 10: Dovrebbe permettere la registrazione con dati validi e reindirizzare al login/dashboard', async ({ page }) => {
    // 1. Act: Compilazione del form usando i tuoi placeholder esatti
    await page.getByPlaceholder('user123').fill('michela_pollio');
    await page.getByPlaceholder('nome@esempio.com').fill('michela.nuova@test.it');
    
    // Abbiamo due placeholder identici per le password, usiamo .first() e .last() per distinguerli
    await page.getByPlaceholder('••••••••').first().fill('password123');
    await page.getByPlaceholder('••••••••').last().fill('password123');

    // Il bottone deve essere abilitato ora che il form è valido
    const bottoneRegistrati = page.getByRole('button', { name: 'Registrati' });
    await expect(bottoneRegistrati).toBeEnabled();

    // Invio del form
    await bottoneRegistrati.click();

    // 2. Assert: Verifica il comportamento successivo (es. redirect alla pagina di login)
    await expect(page).toHaveURL(/login/);
  });

 
  test('Test 11: Dovrebbe mostrare un errore se le due password non coincidono', async ({ page }) => {
    await page.getByPlaceholder('user123').fill('michela_pollio');
    await page.getByPlaceholder('nome@esempio.com').fill('michela@test.it');
    
    // Inseriamo due password diverse
    await page.getByPlaceholder('••••••••').first().fill('password123');
    await page.getByPlaceholder('••••••••').last().fill('passwordXYZ');

    // Clicchiamo fuori o tocchiamo il campo per attivare lo stato 'touched' di Angular
    await page.getByPlaceholder('user123').click();

    // Assert: Verifica la comparsa del tuo tag small con la classe error-text
    const erroreMismatch = page.locator('.error-text', { hasText: 'Le password non coincidono.' });
    await expect(erroreMismatch).toBeVisible();

    // Il bottone deve restare disabilitato
    await expect(page.getByRole('button', { name: 'Registrati' })).toBeDisabled();
  });

  
  test('Test 12: Dovrebbe mostrare l\'errore di obbligatorietà se lo username viene toccato ma lasciato vuoto', async ({ page }) => {
    const inputUsername = page.getByPlaceholder('user123');
    
    // Tocchiamo il campo ed entriamo, poi ci spostiamo su un altro campo per simulare il "blur" (touched)
    await inputUsername.focus();
    await page.getByPlaceholder('nome@esempio.com').focus();

    // Assert: Il form deve mostrare il testo di errore specifico impostato nel tuo HTML
    const erroreUsername = page.locator('.error-text', { hasText: 'Lo username è obbligatorio.' });
    await expect(erroreUsername).toBeVisible();

    // Il bottone "Registrati" deve essere bloccato da Angular
    await expect(page.getByRole('button', { name: 'Registrati' })).toBeDisabled();
  });

});