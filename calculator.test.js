import { describe, it, expect } from 'vitest';
import {
    calculateTipAmount,
    calculateTotalBill,
    calculatePersonShare,
    formatCurrency,
    MAX_BILL
} from './calculator.js';

describe('Suite de Pruebas Unitarias: Calculadora de Propinas', () => {

    describe('calculateTipAmount (Cálculo de Propina)', () => {
        it('debe calcular correctamente porcentajes estándar (15% de $100 = $15)', () => {
            expect(calculateTipAmount(100, 15)).toBe(15);
            expect(calculateTipAmount(50, 10)).toBe(5);
            expect(calculateTipAmount(200, 20)).toBe(40);
        });

        it('debe calcular propinas con decimales correctamente', () => {
            expect(calculateTipAmount(85.50, 18)).toBeCloseTo(15.39, 2);
        });

        it('debe retornar 0 si la cuenta es 0 o negativa', () => {
            expect(calculateTipAmount(0, 15)).toBe(0);
            expect(calculateTipAmount(-50, 15)).toBe(0);
        });

        it('debe retornar 0 si el porcentaje de propina es 0 o negativo', () => {
            expect(calculateTipAmount(100, 0)).toBe(0);
            expect(calculateTipAmount(100, -10)).toBe(0);
        });

        it('debe protegerse contra valores no numéricos o infinitos', () => {
            expect(calculateTipAmount(Infinity, 15)).toBe(0);
            expect(calculateTipAmount(100, NaN)).toBe(0);
        });
    });

    describe('calculateTotalBill (Cuenta Total con Propina)', () => {
        it('debe sumar la cuenta base y la propina ($100 + $15 = $115)', () => {
            expect(calculateTotalBill(100, 15)).toBe(115);
        });

        it('debe retornar 0 si la cuenta base es 0 o negativa', () => {
            expect(calculateTotalBill(0, 10)).toBe(0);
            expect(calculateTotalBill(-100, 15)).toBe(0);
        });
    });

    describe('calculatePersonShare (División Equitativa por Persona)', () => {
        it('debe dividir la cuenta total equitativamente entre comensales ($115 / 2 = $57.50)', () => {
            expect(calculatePersonShare(115, 2)).toBe(57.5);
            expect(calculatePersonShare(100, 4)).toBe(25);
        });

        it('debe retornar 0 y evitar división por cero si comensales es 0', () => {
            expect(calculatePersonShare(100, 0)).toBe(0);
        });

        it('debe retornar 0 si el número de personas es negativo', () => {
            expect(calculatePersonShare(100, -3)).toBe(0);
        });

        it('debe retornar 0 si la cuenta total es 0', () => {
            expect(calculatePersonShare(0, 2)).toBe(0);
        });
    });

    describe('formatCurrency (Formato Monetario Dominicano DOP)', () => {
        it('debe formatear números como moneda dominicana estándar', () => {
            expect(formatCurrency(57.5)).toBe('RD$57.50');
            expect(formatCurrency(0)).toBe('RD$0.00');
            expect(formatCurrency(1250)).toBe('RD$1,250.00');
        });

        it('debe retornar $0.00 para valores negativos o inválidos', () => {
            expect(formatCurrency(-15)).toBe('RD$0.00');
            expect(formatCurrency(NaN)).toBe('RD$0.00');
        });
    });

});
