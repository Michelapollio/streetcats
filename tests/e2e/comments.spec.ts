import { test, expect } from "@playwright/test";

test.describe("Feedback e Community - Commenti", () => {
  test("Test4: Dovrebbe permettere a un utente loggato di lasciare un commento", async ({
    page,
  }) => {
    // 1. Login preliminare via API per evitare flakiness UI
    const resp = await page.request.post(
      "http://localhost:3000/api/auth/login",
      {
        data: { email: "test@example.com", password: "password123" },
      },
    );
    const body = await resp.json();
    // Naviga alla root per avere lo stesso origin prima di usare localStorage
    await page.goto("/dashboard");
    await page.evaluate(
      ({ token, user }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("auth-user", JSON.stringify(user));
      },
      { token: body.token, user: body.user },
    );

    // 2. Naviga al dettaglio di un gatto esistente
    await page.goto("/cat-details/12f5d4cb-3117-4fdd-96be-3172ef2a5530");

    // 3. Scrivi il commento nel form
    // Aspetta che la sezione commenti sia caricata e il campo sia visibile
    await page.waitForSelector(".comments-card");
    const commentInput = page.getByPlaceholder("Add a comment...");
    const commentText =
      "Che bel gattone! Sembra molto docile, spero trovi casa.";
    await expect(commentInput).toBeVisible({ timeout: 10000 });
    await commentInput.fill(commentText);

    // 4. Invia (il bottone si chiama "Post")
    await page.getByRole("button", { name: /Post/i }).click();

    // 5. Assert: Verifica che il commento appaia immediatamente nella lista
    const commentList = page.locator(".comments-list");
    await expect(commentList).toContainText("Che bel gattone!");
  });

  test("Test 5: Dovrebbe disabilitare il pulsante Post se l'input contiene solo spazi o è vuoto", async ({
    page,
  }) => {
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

    // 2. Vai al dettaglio
    await page.goto("/dashboard");
    await page.goto("/cat-details/12f5d4cb-3117-4fdd-96be-3172ef2a5530");

    const bottonePost = page.getByRole("button", { name: "Post" });

    // Scenario A: Input vuoto all'inizio -> Il bottone deve essere disabilitato
    await expect(bottonePost).toBeDisabled();

    // Scenario B: Inseriamo solo spazi vuoti -> .trim() fallisce -> Resta disabilitato
    const inputCommento = page.getByPlaceholder("Add a comment...");
    await inputCommento.fill("     "); // 5 spazi
    await expect(bottonePost).toBeDisabled();
  });
});
