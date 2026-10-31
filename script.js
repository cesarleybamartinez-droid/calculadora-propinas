/**
 * ==============================================================================
 * PROYECTO 01: CALCULADORA DE PROPINAS Y DIVISIÓN DE CUENTAS EQUITATIVAS
 * Arquitectura: Separación de Estado, Lógica Pura y Capa de Presentación (DOM)
 * Versión: Blindada contra errores y desbordamientos (Hardened)
 * ==============================================================================
 */

// =============================================================================
// 1. ESTADO DE LA APLICACIÓN (Single Source of Truth)
// =============================================================================
import {
    MAX_BILL,
    currencyFormatter,
    calculateTipAmount,
    calculateTotalBill,
    calculatePersonShare
} from './calculator.js';

const state = {
    bill: 0,            // Monto de la cuenta base
    tipPercentage: 0,   // Porcentaje de propina seleccionado (ej. 15 para 15%)
    people: 1           // Número de comensales (mínimo 1)
};

// =============================================================================
// 2. CACHÉ DE ELEMENTOS DEL DOM
// ============================================================================= 
const billInput = document.getElementById('bill-amount');
const customTipInput = document.getElementById('custom-tip');
const peopleInput = document.getElementById('people-count');
const peopleError = document.getElementById('people-error');
const tipButtons = document.querySelectorAll('.btn-tip');

// Elementos de salida
const totalTipDisplay = document.getElementById('total-tip-display');
const totalBillDisplay = document.getElementById('total-bill-display');
const personShareDisplay = document.getElementById('person-share-display');
const resetBtn = document.getElementById('btn-reset');

// =============================================================================
// 3. CONTROLADOR Y ACTUALIZACIÓN DE LA VISTA (UI Render)
// =============================================================================

function updateUi() {
    const tipAmount = calculateTipAmount(state.bill, state.tipPercentage);
    const totalBill = calculateTotalBill(state.bill, tipAmount);
    const personShare = calculatePersonShare(totalBill, state.people);

    totalTipDisplay.textContent = currencyFormatter.format(tipAmount);
    totalBillDisplay.textContent = currencyFormatter.format(totalBill);
    personShareDisplay.textContent = currencyFormatter.format(personShare);

    const hasUserData = state.bill > 0 || state.tipPercentage > 0 || state.people > 1;
    resetBtn.disabled = !hasUserData;
}

function clearActiveTipButtons() {
    tipButtons.forEach(button => {
        button.classList.remove('active-tip');
    });
}

// =============================================================================
// 4. MANEJADORES DE EVENTOS (Event Handlers Blindados)
// =============================================================================

// Bloquear teclas no numéricas (e, E, -, +) para evitar notación científica o negativos
[billInput, customTipInput, peopleInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (['e', 'E', '-', '+'].includes(e.key)) {
            e.preventDefault();
        }
    });
});

// A. Escucha del monto de la cuenta con límite máximo
billInput.addEventListener('input', (event) => {
    const rawValue = parseFloat(event.target.value);
    // Acotamos a un máximo de 10 millones y evitamos negativos
    state.bill = isNaN(rawValue) || rawValue <= 0 ? 0 : Math.min(rawValue, MAX_BILL);
    updateUi();
});

// B. Escucha de los botones rápidos de propina (5%, 10%, 15%, 20%)
tipButtons.forEach(button => {
    button.addEventListener('click', () => {
        clearActiveTipButtons();
        button.classList.add('active-tip');
        customTipInput.value = '';
        state.tipPercentage = parseFloat(button.dataset.tip);
        updateUi();
    });
});

// C. Escucha de propina personalizada con tope máximo del 100%
customTipInput.addEventListener('input', (event) => {
    clearActiveTipButtons();
    const rawValue = parseFloat(event.target.value);
    // Impedimos que introduzcan porcentajes mayores a 100% o negativos
    state.tipPercentage = isNaN(rawValue) || rawValue <= 0 ? 0 : Math.min(100, rawValue);
    updateUi();
});

// D. Escucha del número de personas con validación de enteros estrictos
peopleInput.addEventListener('input', (event) => {
    const rawValue = parseFloat(event.target.value);

    // Debe ser un número válido, mayor a cero Y entero (no decimales como 2.5)
    if (isNaN(rawValue) || rawValue <= 0 || !Number.isInteger(rawValue)) {
        state.people = 0;
        peopleInput.style.borderColor = 'var(--clr-error)';
        peopleError.textContent = 'Debe ser un número entero (mín. 1)';
    } else {
        state.people = rawValue;
        peopleInput.style.borderColor = 'transparent';
        peopleError.textContent = '';
    }

    updateUi();
});

// E. Escucha del botón de reinicio
resetBtn.addEventListener('click', () => {
    state.bill = 0;
    state.tipPercentage = 0;
    state.people = 1;

    billInput.value = '';
    customTipInput.value = '';
    peopleInput.value = '1';
    peopleInput.style.borderColor = 'transparent';
    peopleError.textContent = '';
    
    clearActiveTipButtons();
    updateUi();
});

// =============================================================================
// 5. GESTIÓN DEL TEMA (MODO CLARO / OSCURO) CON PERSISTENCIA
// =============================================================================

const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '\u2600\uFE0F'; // Sol para volver al modo claro
        themeToggleBtn.setAttribute('aria-label', 'Cambiar a modo claro');
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.textContent = '\u{1F319}'; // Luna para modo oscuro
        themeToggleBtn.setAttribute('aria-label', 'Cambiar a modo oscuro');
    }
    localStorage.setItem('theme-preference', theme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(systemPrefersDark ? 'dark' : 'light');
    }
}

themeToggleBtn.addEventListener('click', () => {
    const isCurrentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isCurrentlyDark ? 'light' : 'dark';
    applyTheme(newTheme);
});

initTheme();
