import '@testing-library/jest-dom';
// import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// vi.mock('@radix-ui/react-dialog');

// Limpia después de cada prueba
afterEach(() => {
  cleanup();
});