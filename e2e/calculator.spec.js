import { test, expect } from '@playwright/test';

test.describe('Pruebas E2E: Calculadora de Propinas y División Equitativa', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

    test('debe cargar la página con estado inicial en cero y botón reiniciar deshabilitado', async ({ page }) => {
    await expect(page.locator('#total-tip-display')).toContainText('0.00');
    await expect(page.locator('#total-bill-display')).toContainText('0.00');
    await expect(page.locator('#person-share-display')).toContainText('0.00');
    await expect(page.locator('#btn-reset')).toBeDisabled();
  });

  test('debe calcular propina estándar del 15% para una cuenta de $100 con 2 personas', async ({ page }) => {
    // 1. Ingresar cuenta: $100
    await page.locator('#bill-amount').fill('100');

    // 2. Clic en botón de propina 15%
    await page.locator('button.btn-tip', { hasText: '15%' }).click();

    // 3. Ingresar 2 personas
    await page.locator('#people-count').fill('2');

    // 4. Verificar resultados calculados
    await expect(page.locator('#total-tip-display')).toContainText('15.00');
    await expect(page.locator('#total-bill-display')).toContainText('115.00');
    await expect(page.locator('#person-share-display')).toContainText('57.50');
    await expect(page.locator('#btn-reset')).toBeEnabled();
  });

  test('debe calcular correctamente usando propina personalizada (Custom Tip)', async ({ page }) => {
    await page.locator('#bill-amount').fill('200');
    
    // Ingresar 25% de propina personalizada
    await page.locator('#custom-tip').fill('25');
    await page.locator('#people-count').fill('4');

    // Total propina: $50, Total cuenta: $250, Por persona: $62.50
    await expect(page.locator('#total-tip-display')).toContainText('50.00');
    await expect(page.locator('#total-bill-display')).toContainText('250.00');
    await expect(page.locator('#person-share-display')).toContainText('62.50');
  });

    test('debe mostrar mensaje de error en rojo y evitar división si comensales es 0', async ({ page }) => {
    await page.locator('#bill-amount').fill('100');
    await page.locator('button.btn-tip', { hasText: '10%' }).click();
    
    // Provocar error de división por cero
    const peopleInput = page.locator('#people-count');
    await peopleInput.fill('0');

    const peopleError = page.locator('#people-error');
    await expect(peopleError).toBeVisible();
    await expect(page.locator('#person-share-display')).toContainText('0.00');
  });

    test('debe reiniciar todos los campos al presionar Reiniciar Calculadora', async ({ page }) => {
    const billInput = page.locator('#bill-amount');
    const customTip = page.locator('#custom-tip');
    const peopleInput = page.locator('#people-count');
    const resetBtn = page.locator('#btn-reset');

    // 1. Ingresar valores para habilitar la calculadora
    await billInput.fill('150');
    await page.locator('.btn-tip').filter({ hasText: '15%' }).click();
    await peopleInput.fill('3');

    // 2. Asegurar que el botón Reset se habilitó y hacer clic
    await expect(resetBtn).toBeEnabled();
    await resetBtn.click();

    // 3. Validar estado reiniciado
    await expect(billInput).toHaveValue('');
    await expect(customTip).toHaveValue('');
    await expect(peopleInput).toHaveValue('1');
    await expect(resetBtn).toBeDisabled();

    // 4. Validar que los montos vuelven a cero (tolerante a DOP RD$0.00)
    await expect(page.locator('#total-tip-display')).toContainText('0.00');
    await expect(page.locator('#total-bill-display')).toContainText('0.00');
    await expect(page.locator('#person-share-display')).toContainText('0.00');
  });

  test('debe alternar entre Modo Claro y Modo Oscuro al pulsar el botón de tema', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    const html = page.locator('html');

    // Clic 1: Cambiar a Modo Oscuro
    await themeToggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Clic 2: Volver a Modo Claro (script.js remueve el atributo data-theme)
    await themeToggle.click();
    await expect(html).not.toHaveAttribute('data-theme', 'dark');
  });

});
