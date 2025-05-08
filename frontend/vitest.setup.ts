// import '@testing-library/jest-dom';

import '@testing-library/jest-dom';
// import { vi } from 'vitest';

// Configuración global para testing-library
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Extender expects de Vitest con matchers de testing-library
expect.extend(matchers);

// Limpiar después de cada test automáticamente
afterEach(() => {
  cleanup();
});

// // Mock para objetos globales que no estén disponibles en el entorno de pruebas
// global.IntersectionObserver = class IntersectionObserver {
//   constructor() {}
//   observe() { return null; }
//   unobserve() { return null; }
//   disconnect() { return null; }
// };

// // Mock para Intl si es necesario
// if (!global.Intl) {
//   global.Intl = {
//     NumberFormat: vi.fn().mockImplementation(() => ({
//       format: vi.fn().mockImplementation(number => `$${number.toLocaleString('es-CO')}`)
//     }))
//   };
// }

console.log('setupTests cargado correctamente');