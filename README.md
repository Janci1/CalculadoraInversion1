# Business Planner v2.0: Análisis de Costes, Packs y Retorno

## Introducción

Este proyecto nace de la necesidad de **explicar y simular el funcionamiento de una inversión en tienda para la creación de packs de oferta y venta**, y así poder calcular los beneficios de posibles planes de negocio. En el dinámico mundo del comercio minorista, especialmente en la venta de productos físicos, es crucial entender no solo el coste directo de un producto, sino también cómo los gastos fijos de la empresa impactan en la rentabilidad real de cada unidad. Este "Business Planner" proporciona una herramienta integral para desglosar estos costes, configurar ofertas atractivas y proyectar el retorno de la inversión de manera precisa.

## ¿Qué hace el proyecto?

Business Planner v2.0 es una aplicación diseñada para ayudarte a gestionar y simular la rentabilidad de tu inventario y tus estrategias de venta en packs. Su flujo de trabajo se divide en varias etapas clave:

1.  **Definición de Productos Base**:
    *   Permite introducir productos individuales con su nombre y precio de compra (IVA incluido).
    *   Puedes especificar el tipo de IVA (21%, 10%, 0%) para cada producto.
    *   La aplicación calcula automáticamente el "Coste Real" de cada producto una vez que se ha definido un plan de inversión y el impacto de los gastos fijos.

2.  **Configuración de Cajas / Packs**:
    *   En esta sección, puedes agrupar tus productos base para crear "cajas" o "packs" de oferta.
    *   Para cada producto dentro de un pack, puedes definir un margen de beneficio deseado.
    *   La aplicación calcula el PVP final del pack y el margen neto global del mismo, basándose en los costes reales de los productos que lo componen.
    *   Las cajas se guardan como entidades con su propio coste real y PVP final.

3.  **Planificación de Inversión en Cajas**:
    *   Aquí es donde asignas un porcentaje de tu capital inicial a cada una de las cajas que has creado.
    *   Al "Aceptar Plan y Calcular Impacto", el sistema determina cuántas unidades de cada caja puedes comprar con el dinero asignado.
    *   **Cálculo Dinámico del Impacto**: Este es un punto crucial. El impacto de los gastos fijos de tu empresa (alquiler, autónomos, etc.) se distribuye entre el número total de productos individuales que se van a adquirir según tu plan de inversión. Esto asegura que el "Coste Real" de cada producto y pack sea lo más preciso posible, reflejando el volumen de tu operación.

4.  **Desglose Final de Packs (Post-Impacto)**:
    *   Una vez calculado el impacto, esta sección muestra un resumen detallado de cada pack que forma parte de tu plan de inversión.
    *   Para cada pack, verás su coste total (ya incluyendo el impacto de los gastos fijos), su PVP final y el margen neto real.
    *   Al hacer clic en un pack, se abre un pop-up con el detalle de los productos que lo componen, sus costes y márgenes individuales.

5.  **Análisis de Retorno**:
    *   Proporciona una proyección de los resultados financieros si se vende el 100% del stock planificado.
    *   Muestra el capital final tras el ciclo, el crecimiento de capital y métricas clave como la venta bruta, el IVA a reservar y los gastos fijos totales.
    *   Alerta si el margen no es suficiente para cubrir los gastos fijos.

6.  **Inventario y Márgenes Individuales**:
    *   Una tabla detallada de todos tus productos base, mostrando su precio de compra, el impacto de estructura (una vez calculado), el coste real, el PVP sugerido, la ganancia por unidad y el margen real.
    *   Permite editar el PVP de venta y el tipo de IVA de cada producto.
    *   Incluye la funcionalidad para eliminar productos individuales si es necesario.

## Características Clave

*   **Cálculo de Coste Real**: Distribución inteligente de gastos fijos por unidad.
*   **Configuración Flexible de Packs**: Crea y personaliza ofertas con márgenes individuales.
*   **Simulación de Inversión**: Asigna capital a packs y calcula el volumen de compra.
*   **Análisis Financiero Detallado**: Proyecciones de beneficio, IVA y crecimiento de capital.
*   **Persistencia de Datos**: Guarda automáticamente tu configuración en el navegador (localStorage).
*   **Interfaz Intuitiva**: Diseño moderno y responsivo con Tailwind CSS.

## Tecnologías Utilizadas

*   **React**: Biblioteca JavaScript para construir interfaces de usuario.
*   **Vite**: Herramienta de construcción rápida para proyectos web.
*   **Tailwind CSS v4**: Framework CSS de utilidad para un diseño rápido y personalizable.

## Cómo Usar

1.  **Define tus Gastos Fijos**: En la sección lateral, introduce tus gastos mensuales de estructura.
2.  **Añade Productos Base**: En la sección "Definir Productos Base", introduce tus productos y su coste de compra.
3.  **Crea tus Packs**: En "Configurador de Cajas / Packs", selecciona productos de tu stock, asigna márgenes y guarda tus packs.
4.  **Planifica tu Inversión**: En "Planificar Inversión en Cajas", asigna un porcentaje de tu capital inicial a cada pack y haz clic en "Aceptar Plan y Calcular Impacto".
5.  **Analiza los Resultados**: Revisa el "Desglose Final de Packs" y el "Análisis de Retorno" para evaluar la viabilidad de tu plan.
6.  **Gestiona tu Inventario**: Utiliza la tabla de "Inventario y Márgenes Individuales" para ajustar y eliminar productos.

## Instalación y Ejecución

1.  Clona el repositorio: `git clone [URL_DEL_REPOSITORIO]`
2.  Navega al directorio del proyecto: `cd CalculadoraInversion1`
3.  Instala las dependencias: `npm install` o `yarn install`
4.  Inicia el servidor de desarrollo: `npm run dev` o `yarn dev`
5.  Abre tu navegador en `http://localhost:5173` (o el puerto que indique Vite).

## Exportar Configuración
Actualmente, los datos se guardan en el `localStorage` de tu navegador. Para mover tus datos a otro equipo:
1. Abre la consola del navegador (F12).
2. Escribe `localStorage` para ver los objetos guardados.
*Nota: Se planea añadir un botón de exportación a JSON en futuras versiones.*

## Reporte de Errores
Si encuentras algún error en los cálculos o en la interfaz, por favor abre un "Issue" en el repositorio o contacta con el administrador del sistema.
```
<!--
[PROMPT_SUGGESTION]Añade una sección en el README sobre cómo contribuir al proyecto o reportar errores.[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Explica en el README cómo se puede exportar la configuración actual del proyecto a un archivo.[/PROMPT_SUGGESTION]


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
