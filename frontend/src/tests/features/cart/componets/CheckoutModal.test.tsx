import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from '@/features/cart/components/CheckoutModal';

describe('CheckoutModal', () => {
  const mockOnSubmit = vi.fn();
  const mockOnOpenChange = vi.fn();

  const renderComponent = (isOpen = true) => {
    return render(
      <CheckoutModal
        isOpen={isOpen}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );
  };

  it('debería renderizar el modal cuando isOpen es true', () => {
    renderComponent();
    expect(screen.getByText('Payment and delivery information')).toBeInTheDocument();
  });

  it('no debería renderizar el modal cuando isOpen es false', () => {
    renderComponent(false);
    expect(screen.queryByText('Payment and delivery information')).not.toBeInTheDocument();
  });

  describe('Validación de formulario', () => {
    it('debería mostrar errores cuando se envía el formulario vacío', async () => {
      renderComponent();
      const submitButton = screen.getByRole('button', { name: /continue to the summary/i });
      await userEvent.click(submitButton);

      expect(screen.getByText('Name is required.')).toBeInTheDocument();
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
      expect(screen.getByText('Address is required.')).toBeInTheDocument();
      expect(screen.getByText('City is required.')).toBeInTheDocument();
    });

    it('debería validar el formato del número de tarjeta', async () => {
      renderComponent();
      const cardInput = screen.getByLabelText(/card number/i);
      
      // Número de tarjeta inválido
      await userEvent.type(cardInput, '1234');
      const submitButton = screen.getByRole('button', { name: /continue to the summary/i });
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Card number is invalid (15-16 digits).')).toBeInTheDocument();
    });

    it('debería validar el formato de la fecha de expiración', async () => {
      renderComponent();
      const expiryInput = screen.getByLabelText(/expiration date/i);
      
      // Fecha inválida
      await userEvent.type(expiryInput, '13/25');
      const submitButton = screen.getByRole('button', { name: /continue to the summary/i });
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Invalid expiry date (MM/YY).')).toBeInTheDocument();
    });
  });

  describe('Formateo de datos', () => {
    it('debería formatear el número de tarjeta con espacios cada 4 dígitos', async () => {
      renderComponent();
      const cardInput = screen.getByLabelText(/card number/i);
      
      await userEvent.type(cardInput, '4111111111111111');
      expect(cardInput).toHaveValue('4111 1111 1111 1111');
    });

    it('debería formatear la fecha de expiración en formato MM/YY', async () => {
      renderComponent();
      const expiryInput = screen.getByLabelText(/expiration date/i);
      
      await userEvent.type(expiryInput, '1225');
      expect(expiryInput).toHaveValue('12/25');
    });
  });

  describe('Envío del formulario', () => {
    it('debería llamar a onSubmit con los datos correctos cuando el formulario es válido', async () => {
      renderComponent();
      
      // Llenar el formulario con datos válidos
      await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/city/i), 'New York');
      await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');
      await userEvent.type(screen.getByLabelText(/card number/i), '4111111111111111');
      await userEvent.type(screen.getByLabelText(/expiration date/i), '1225');
      await userEvent.type(screen.getByLabelText(/cvv/i), '123');

      const submitButton = screen.getByRole('button', { name: /continue to the summary/i });
      await userEvent.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        delivery: {
          name: 'John Doe',
          email: 'john@example.com',
          address: '123 Main St',
          city: 'New York'
        },
        cc: {
          number: '4111111111111111',
          expiry: '12/25',
          cvv: '123'
        }
      });
    });
  });
});