/**
 * ==============================================================================
 * PROYECTO 01: CALCULADORA DE PROPINAS Y DIVISIÓN DE CUENTAS EQUITATIVAS
 * Arquitectura: Separación de Estado, Lógica Pura y Capa de Presentación (DOM)
 * ==============================================================================
 */
// =============================================================================
// 1. ESTADO DE LA APLICACIÓN (Single Source of Truth)
// Centralizamos los datos en memoria para no depender de consultar el DOM a cada rato.
// =============================================================================
const state = {
    bill: 0,                    // Monto de la cuenta base
    tipPercentage: 0,           // Porcentaje de propina seleccionado (ej. 15 para 15%)
    people: 1,                  // Número de personas a dividir la cuenta (minimo 1)
};

// =============================================================================
// 2. CACHÉ DE ELEMENTOS DEL DOM
// Buscamos los elementos una sola vez y los guardamos en constantes para rendimiento.
// ============================================================================= 
const billInput = document.getElementById('bill-amount');
const customTipInput = document.getElementById('custom-tip');
const peopleInput = document.getElementById('people-count');
const peopleError = document.getElementById('people-error');
const tipButtons = document.querySelectorAll('.btn-tip');

// Elementos de salida (Pantalla de resultados)
const totalTipDisplay = document.getElementById('total-tip-display');
const totalBillDisplay = document.getElementById('total-bill-display');
const personShareDisplay = document.getElementById('person-share-display');
const resetBtn = document.getElementById('btn-reset');

// Formateador oficial de moneda internacional (Intl API)
// Garantiza que los números se muestren como "$1,250.00" de forma profesional.
const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

// =============================================================================
// 3. LÓGICA DE NEGOCIO PURA (Funciones Matemáticas Sin Efectos Secundarios)
// Estas funciones no tocan el DOM; solo reciben números y devuelven cálculos.
// =============================================================================
/**
 * Calcula el monto total en dinero de la propina.
 * @param {number} bill - El monto base de la cuenta.
 * @param {number} percentage - El porcentaje de propina (0 - 100).
 * @returns {number} El monto calculado de la propina.
 */
function calculateTipAmount(bill, percentage) {
    if (bill <= 0 || percentage <= 0) return 0;
    return (bill * percentage) / 100;
}
/**
 * Calcula el monto total general (cuenta base + propina).
 * @param {number} bill - El monto base de la cuenta.
 * @param {number} tipAmount - El monto de la propina.
 * @returns {number} El total general.
 */
function calculateTotalBill(bill, tipAmount) {
    return bill + tipAmount;
}
/**
 * Calcula la cuota individual que debe pagar cada persona.
 * Previene divisiones por cero o numeros negativos.
 * @param {number} totalBill - El monto total general de la cuenta.
 * @param {number} peopleCount - El número de personas a dividir la cuenta.
 * @returns {number} Cuota por persona.
 */
function calculatePersonShare(totalBill, peopleCount) {
    if (peopleCount <= 0 || isNaN(peopleCount)) return 0;
    return totalBill / peopleCount;
}

// =============================================================================
// 4. CONTROLADOR Y ACTUALIZACIÓN DE LA VISTA (UI Render)
// Lee el estado, ejecuta las fórmulas y actualiza la pantalla.
// =============================================================================
function updateUi() {
    // 1. Ejecutar las operaciones matemáticas con el estado actual
    const tipAmount = calculateTipAmount(state.bill, state.tipPercentage)
    const totalBill = calculateTotalBill(state.bill, tipAmount);
    const personShare = calculatePersonShare(totalBill, state.people);

    // 2. Renderizar los resultados formateados en pantalla
    totalTipDisplay.textContent = currencyFormatter.format(tipAmount);
    totalBillDisplay.textContent = currencyFormatter.format(totalBill);
    personShareDisplay.textContent = currencyFormatter.format(personShare);

    // 3. Controlar el estado del botón de Reinicio (Reset)
    // Se habilita solo si el usuario ha introducido algún valor.
    const hasUserData = state.bill > 0 || state.tipPercentage > 0 || state.people > 1;
    resetBtn.disabled = !hasUserData;
}

/**
 * Deselecciona visualmente todos los botones de propina fija.
 */
function clearActiveTipButtons() {
    tipButtons.forEach(button => {
        button.classList.remove('active-tip');
    });
}
// =============================================================================
// 5. MANEJADORES DE EVENTOS (Event Handlers)
// Validamos entradas y actualizamos el estado.
// =============================================================================

// A. Escucha del monto de la cuenta
billInput.addEventListener('input', (event) => {
    const rawValue = parseFloat(event.target.value);
    // Si el campo esta vacio o es invalido, guardamos 0
    state.bill = isNaN(rawValue) || rawValue <= 0 ? 0 : rawValue;
    updateUi();
});

// B. Escucha de los botones rapidos de propina (5%, 10%, 15%, 20%,)
tipButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. Remover selección previa
        clearActiveTipButtons();

        // 2. Marcar visualmente el boton presionado
        button.classList.add('active-tip');

        // 3. Limpiar campo de propina personalizada
        customTipInput.value = '';

        // 4. Actualizar  el estado con el valor del atributo data-tip
        state.tipPercentage = parseFloat(button.dataset.tip);
        updateUi();
    });
});

// C. Escucha del campo de propina personalizado
customTipInput.addEventListener('input', (event) => {
    // Al escribir un porcentaje personalizado, desmarcamos los botones predefinidos.
    clearActiveTipButtons();

    const rawValue = parseFloat(event.target.value);

    // Si el campo esta vacio o es invalido, guardamos 0
    state.tipPercentage = isNaN(rawValue) || rawValue <= 0 ? 0 : rawValue;

    // 4. Actualizar la interfaz de usuario
    updateUi();
});

// D. Escucha de cambios en el número de personas con validacion de reglas de negocio
peopleInput.addEventListener('input', (event) => {
    const rawValue = parseInt(event.target.value, 10);

    // Validacion de reglas de negocio: Numero de personas debe ser minimo 1
    if (isNaN(rawValue) || rawValue <= 0) {
        state.people = 0;
        peopleInput.style.borderColor = 'var(--clr-error)';
        peopleError.textContent = 'Debe ser minimo 1 persona';
    } else {
        state.people = rawValue;
        peopleInput.style.borderColor = 'transparent';
        peopleError.textContent = '';  // Limpiar mensaje de error
    }

    // Actualizar la interfaz de usuario
    updateUi();
});

// E. Escucha del boton de reinicio
resetBtn.addEventListener('click', () => {
    // Restaurar el estado original
    state.bill = 0;
    state.tipPercentage = 0;
    state.people = 1;

    // Limpiar los campos del formulario
    billInput.value = '';
    customTipInput.value = '';
    peopleInput.value = '1';

    // Limpiar estilos de error
    peopleInput.style.borderColor = 'transparent';
    peopleError.textContent = '';
    // 3. Remover clases activas de botones
    clearActiveTipButtons();

    // 4. Actualizar la vista a ceros ($0.00)
    updateUi();
});