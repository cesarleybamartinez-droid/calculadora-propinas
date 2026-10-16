# 💰 Calculadora de Propinas & División de Cuentas Equitativas

Aplicación web responsiva diseñada para calcular propinas sugeridas y dividir el total de una cuenta entre comensales en tiempo real, garantizando precisión matemática y prevención de errores de entrada.

Desarrollada como parte de mi formación en ingeniería frontend utilizando tecnologías web estándar sin dependencias externas.

---

## 📋 Adquisición de Requerimientos y Análisis del Sistema

### 1. Declaración del Problema
Cuando un grupo de personas acude a un restaurante o comparte un servicio comercial, calcular la propina adecuada según la calidad del servicio recibido y dividir el monto exacto entre los comensales suele generar fricciones, errores de cálculo manual o demoras al pagar. Se requiere una herramienta ágil, accesible y que responda en tiempo real sin recargar la página.

### 2. Requerimientos Funcionales (RF)
* **RF-01 (Monto Base):** El sistema debe permitir ingresar el monto total de la cuenta con precisión de hasta dos decimales.
* **RF-02 (Propinas Rápidas):** El sistema debe ofrecer porcentajes de propina estándar predefinidos (5%, 10%, 15%, 20%) seleccionables con un solo clic.
* **RF-03 (Propina Personalizada):** El sistema debe permitir ingresar un porcentaje de propina personalizado libre (0% a 100%).
* **RF-04 (Control de Comensales):** El sistema debe permitir ingresar el número de personas entre las cuales se dividirá la cuenta (entero positivo mayor o igual a 1).
* **RF-05 (Cálculo en Tiempo Real):** El sistema debe calcular y renderizar en pantalla inmediatamente sin recargar la página:
  * Monto total de la propina sugerida.
  * Monto total de la cuenta con propina incluida.
  * Cuota individual equitativa por persona.
* **RF-06 (Reinicio de Estado):** El sistema debe incluir una acción de reinicio (*Reset*) que restablezca todos los campos y valores a su estado inicial, manteniéndose deshabilitada si no hay datos ingresados.

### 3. Requerimientos No Funcionales (RNF)
* **RNF-01 (Arquitectura y Desacoplamiento):** Separación estricta de responsabilidades (HTML5 para estructura semántica, CSS3 para presentación y JavaScript puro para lógica de negocio y control del DOM).
* **RNF-02 (Robustez y Validación):** La aplicación no debe generar resultados `NaN` o `Infinity` bajo ninguna circunstancia (entradas vacías, valores negativos o intentos de división por cero).
* **RNF-03 (Accesibilidad Web - a11y):** Formulario accesible con etiquetas `<label>` explícitamente vinculadas a sus `<input>`, elementos `<fieldset>` para opciones agrupadas y contrastes de color conformes a la pauta WCAG AA.
* **RNF-04 (Diseño Responsivo - Mobile First):** La interfaz debe adaptarse de forma fluida desde dispositivos móviles pequeños (320px) hasta pantallas de escritorio de alta resolución sin provocar desbordamientos horizontales.

### 4. Modelo Matemático del Sistema
$$\text{Monto Propina} = \text{Monto Base} \times \left(\frac{\text{Porcentaje Propina}}{100}\right)$$

$$\text{Total General} = \text{Monto Base} + \text{Monto Propina}$$

$$\text{Cuota Individual} = \frac{\text{Total General}}{\text{Número de Personas}}$$

---

## 🚀 Características Implementadas

- **Cálculo reactivo en tiempo real:** Eventos `input` y `click` que recalculan las métricas al instante.
- **Formateo financiero profesional:** Uso nativo de la API `Intl.NumberFormat` con formato de moneda internacional (`USD`).
- **Manejo elegante de errores:** Borde de advertencia y mensaje dinámico si el número de personas es menor a 1.
- **Diseño Mobile-First con CSS Grid y Flexbox:** Distribución vertical en teléfonos y dos paneles paralelos simétricos en pantallas medianas y grandes.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Semántica pura (`header`, `main`, `section`, `fieldset`, `legend`, `dl`, `dt`, `dd`, `data-* attributes`).
- **CSS3:** Variables nativas (`:root`), Flexbox, CSS Grid, media queries responsivas y diseño adaptativo.
- **Vanilla JavaScript (ES6+):** Programación modular procedural, funciones puras, inmutabilidad y manipulación controlada del DOM.

---

## 📐 Decisiones de Arquitectura de Software

1. **Estado Centralizado (*Single Source of Truth*):**  
   Toda la lógica de la aplicación se alimenta de un objeto en memoria (`state`), evitando la mala práctica de consultar y parsear cadenas del DOM de manera dispersa.
2. **Funciones Puras e Independientes:**  
   Las rutinas de cálculo matemático (`calculateTipAmount`, `calculateTotalBill`, `calculatePersonShare`) son funciones puras sin efectos secundarios sobre la interfaz, lo cual facilita la escalabilidad y la futura implementación de pruebas unitarias automatizadas.

---

## 🧪 Pruebas de Calidad (QA Testing)

| Caso de Prueba | Entrada | Resultado Esperado | Estado |
| :--- | :--- | :--- | :---: |
| **Cálculo Estándar** | Cuenta: `$100`, Propina: `15%`, Personas: `2` | Propina: `$15.00` \| Total: `$115.00` \| Por persona: `$57.50` | ✅ Superado |
| **Propina Libre** | Cuenta: `$200`, Propina libre: `25%`, Personas: `4` | Por persona: `$62.50` (desmarca botones rápidos) | ✅ Superado |
| **Límite (División por cero)** | Personas: `0` o vacío | Mensaje de advertencia, borde rojo y resultado `$0.00` (sin `Infinity`) | ✅ Superado |
| **Reinicio Completo** | Clic en botón "Reiniciar Calculadora" | Campos en blanco, personas en `1` y botón deshabilitado | ✅ Superado |

---

## 👤 Autor

Desarrollado con rigor de ingeniería por **Cesar Leyba Martinez**
