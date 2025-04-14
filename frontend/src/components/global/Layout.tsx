import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

import CheckoutModal from '@/features/cart/components/CheckoutModal';
import PaymentSummaryBackdrop from '@/features/cart/components/PaymentSummaryBackdrop';

// Define the types for the form data we will pass
export interface DeliveryInfo {
    name: string;
    email: string;
    address: string;
    city: string;
}
export interface CreditCardInfo {
    number: string;
    expiry: string;
    cvv: string;
}

const Layout: React.FC = () => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSummaryBackdropOpen, setIsSummaryBackdropOpen] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [ccInfo, setCcInfo] = useState<CreditCardInfo | null>(null);

  const handleProceedToCheckout = () => {
    // This function calls from CartSheet
    // Close the CartSheet (implicit when clicking outside or on button)
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutSubmit = (data: { delivery: DeliveryInfo, cc: CreditCardInfo }) => {
    // Esta función se llamará desde CheckoutModal
    setDeliveryInfo(data.delivery);
    setCcInfo(data.cc);
    setIsCheckoutModalOpen(false); // Close the checkout modal
    setIsSummaryBackdropOpen(true); // Open de backdrop resume
  };

  const handleCloseSummary = () => {
      setIsSummaryBackdropOpen(false);
      setDeliveryInfo(null);
      setCcInfo(null);
  }

  const handleFinalPayment = () => {
      // This function will be called from PaymentSummaryBackdrop
      console.log(">>> Iniciando Pago Final <<<");
      console.log("Delivery:", deliveryInfo);
      console.log("CC:", ccInfo); // This is only for testing purpose.
      handleCloseSummary();
  }



  return (
    <div className="flex flex-col min-h-screen">

      <Header onProceedToCheckout={handleProceedToCheckout}/>

      <main className="flex-1 container mx-auto mt-4 px-4 md:px-6">
         <Outlet />
      </main>

      {/* Renders the modals (state controlled) */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onOpenChange={setIsCheckoutModalOpen}
        onSubmit={handleCheckoutSubmit}
      />

       {/* Only renders the backdrop only of we have the required information */}
       {deliveryInfo && ccInfo && (
          <PaymentSummaryBackdrop
              isOpen={isSummaryBackdropOpen}
              onOpenChange={handleCloseSummary}
              onConfirmPayment={handleFinalPayment}
              deliveryInfo={deliveryInfo}
              ccInfo={ccInfo}
          />
       )}

      <footer className="bg-muted text-muted-foreground p-4 text-center mt-auto">
         My Shop © {new Date().getFullYear()}
      </footer>
     

    </div>
  );
};

export default Layout;