import { test, expect } from '@playwright/test';

/**
 * CRUD SPEC - STREETCATS
 * Seguendo le "Best Practices" delle slide: 
 * - Utilizzo di Locators robusti (getByRole, getByLabel)
 * - Struttura Arrange-Act-Assert
 */
test.describe('Operazioni CRUD - Gestione Avvistamenti', () => {

  // Pre-condizione: Effettua il login prima di ogni test CRUD
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    // Usiamo getByPlaceholder come suggerito nelle slide 54
    await page.getByPlaceholder('Email').fill('michela@test.it');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: /Accedi|Login/i }).click();
    
    // Verifica che il login sia avvenuto (es. presenza tasto Logout o URL cambiato)
    await expect(page).not.toHaveURL(/\/login/);
  });

  /**
   * TEST 1: CREAZIONE (Happy Path)
   * Verifica l'inserimento di un gatto con Markdown e Mappa
   */
  test('Dovrebbe permettere l\'inserimento di un nuovo gatto con descrizione formattata', async ({ page }) => {
    await page.goto('/add-cat');

    // Compilazione campi testuali
    await page.getByLabel(/Titolo/i).fill('Gatto Rosso del Porto');
    
    // Inserimento Markdown (Traccia: supporto grassetto e corsivo)
    await page.getByLabel(/Descrizione/i).fill(
      'Avvistato vicino al molo. È molto **affamato**. Nota: ha un *collarino blu*.'
    );

    // Interazione con la mappa (selettore generico del contenitore mappa)
    // Clicchiamo al centro del contenitore per simulare il piazzamento del marker
    const mappa = page.locator('#map-input'); 
    await mappa.click();

    // Invio del form
    await page.getByRole('button', { name: /Pubblica|Salva/i }).click();

    // Assert: verifica reindirizzamento alla pagina di dettaglio
    // La traccia dice che dal riepilogo si accede alla pagina di dettaglio
    await expect(page).toHaveURL(/\/cats\/\d+/); 
    
    // Verifica che il Markdown sia stato renderizzato correttamente (tag strong per il grassetto)
    const descrizioneRenderizzata = page.locator('.cat-description');
    await expect(descrizioneRenderizzata.locator('strong')).toContainText('affamato');
  });

  /**
   * TEST 2: VALIDAZIONE (Edge Case)
   * Verifica che il sistema blocchi l'invio senza dati obbligatori
   */
  test('Non dovrebbe permettere l\'invio se il titolo è mancante', async ({ page }) => {
    await page.goto('/add-cat');

    // Compiliamo solo la descrizione lasciando vuoto il titolo
    await page.getByLabel(/Descrizione/i).fill('Descrizione senza titolo');
    
    const submitBtn = page.getByRole('button', { name: /Pubblica|Salva/i });

    // In Angular, se il form è invalido, il bottone dovrebbe essere disabilitato
    await expect(submitBtn).toBeDisabled();
  });

  /**
   * TEST 3: MODIFICA (Update)
   * Verifica la possibilità di aggiornare un avvistamento esistente
   */
  test('Dovrebbe permettere di modificare un avvistamento esistente', async ({ page }) => {
    // Navighiamo alla pagina di modifica di un gatto (ipotizziamo id 1)
    await page.goto('/cats/1/edit');

    // Pulizia e inserimento nuovo titolo
    const titoloInput = page.getByLabel(/Titolo/i);
    await titoloInput.clear();
    await titoloInput.fill('Gatto Rosso (Aggiornato)');

    // Salvataggio
    await page.getByRole('button', { name: /Salva Modifiche|Aggiorna/i }).click();

    // Assert: il titolo deve essere cambiato nella vista dettaglio
    await expect(page.locator('h1')).toContainText('Gatto Rosso (Aggiornato)');
  });

});