/**
 * calculator.js - Lógica de Negocio Pura (Pure Business Logic)
 * Funciones matemáticas y de formateo monetario sin efectos secundarios en el DOM.
 */

// Límite máximo de cuenta para evitar desbordamientos aritméticos (1000 Millones)
export const MAX_BILL = 10000000000;

/**
 * Formateador oficial de moneda internacional (Intl API)
 */
export const currencyFormatter = new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

/**
 * Calcula el monto total de la propina en base a la cuenta y el porcentaje.
 */
export function calculateTipAmount(bill, percentage) {
    if (bill <= 0 || percentage <= 0 || !isFinite(bill) || isNaN(percentage)) return 0;
    return (bill * percentage) / 100;
}

/**
 * Calcula la cuenta total sumando el monto base y la propina calculada.
 */
export function calculateTotalBill(bill, tipAmount) {
    if (bill <= 0 || !isFinite(bill)) return 0;
    const tip = Math.max(0, tipAmount || 0);
    return bill + tip;
}

/**
 * Divide el total de la cuenta equitativamente entre el número de comensales.
 */
export function calculatePersonShare(totalBill, peopleCount) {
    if (peopleCount <= 0 || isNaN(peopleCount) || !isFinite(totalBill) || totalBill <= 0) return 0;
    return totalBill / peopleCount;
}

/**
 * Formatea un número como divisa estándar en DOP ($0.00).
 */
export function formatCurrency(amount) {
    if (isNaN(amount) || !isFinite(amount) || amount < 0) return 'RD$0.00';
    return currencyFormatter.format(amount);
}
