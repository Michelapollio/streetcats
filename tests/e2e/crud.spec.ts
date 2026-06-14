import { test, expect } from "@playwright/test";

test.describe("Operazioni CRUD - Gestione Avvistamenti", () => {
  // Pre-condizione: Effettua il login prima di ogni test CRUD
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    await emailInput.fill("test@example.com");
    await expect(emailInput).toHaveValue("test@example.com");
    await passwordInput.fill("password123");
    await expect(passwordInput).toHaveValue("password123");

    await page.getByRole("button", { name: /entra/i }).click();
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
  });

  test("Test 6: Dovrebbe permettere l'inserimento di un nuovo gatto con descrizione formattata", async ({
    page,
  }) => {
    await page.goto("/addcat");

    await page
      .locator('[formControlName="title"]')
      .fill("Gatto Rosso del Porto");
    await page
      .locator('[formControlName="description"]')
      .fill(
        "Avvistato vicino al molo. È molto **affamato**. Nota: ha un *collarino blu*.",
      );

    // Aspetta una tile Leaflet
    const tile = page.locator(".leaflet-tile");
    await tile.first().waitFor({ state: "visible" });

    // Clicca la tile
    const box = await tile.first().boundingBox();
    if (!box) throw new Error("Tile non trovata, mappa non renderizzata.");

    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

    await page.waitForTimeout(300);

    // Ora il bottone deve essere abilitato
    const confirmBtn = page.locator(".btn-confirm");
    await expect(confirmBtn).toBeEnabled();

    await confirmBtn.click();

    await expect(page).toHaveURL("/dashboard");
  });

  test("Test 7: Non dovrebbe permettere l'invio se il titolo è mancante", async ({
    page,
  }) => {
    await page.goto("/addcat");

    // Compiliamo solo la descrizione
    await page
      .locator('[formControlName="description"]')
      .fill("Descrizione senza titolo");

    // Pulsante di submit
    const submitBtn = page.locator(".btn-save");

    // Deve essere disabilitato
    await expect(submitBtn).toBeDisabled();
  });

  test("Test 8: Dovrebbe permettere l'inserimento di un nuovo commento", async ({
    page,
  }) => {
    // Vai alla pagina di un gatto esistente
    await page.goto("/dashboard");
    await page.goto("/cat-details/12f5d4cb-3117-4fdd-96be-3172ef2a5530");

    const comments = page.locator(".comments-list .comment-item");
    const initialCount = await comments.count();

    await page
      .locator('input[placeholder="Add a comment..."]')
      .fill("Bellissimo gatto, l'ho visto anche io!");
    await page.locator(".btn-post").click();

    await expect(comments).toHaveCount(initialCount);

    const lastComment = comments.nth(initialCount);
    await expect(lastComment).toContainText(
      "Bellissimo gatto, l'ho visto anche io!",
    );
  });

  test("Test 9: Non dovrebbe permettere l'invio di un commento vuoto", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await page.goto("/cat-details/12f5d4cb-3117-4fdd-96be-3172ef2a5530");

    // Pulsante Post
    const postBtn = page.locator(".btn-post");

    // Deve essere disabilitato se il campo è vuoto
    await expect(postBtn).toBeDisabled();
  });
});
