import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { CreditCardInfo, DeliveryInfo } from '@/components/global/Layout';
import { FaCcVisa } from 'react-icons/fa';

import mastercardLogo from '@/assets/icons/mc_symbol.svg';

interface CheckoutModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: { delivery: DeliveryInfo, cc: CreditCardInfo }) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onOpenChange, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [ccNumber, setCcNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // This function detects the card type based on the first digit
  useEffect(() => {
      if (ccNumber.startsWith('4')) {
          setCardType('visa');
      } else if (ccNumber.startsWith('5')) {
          setCardType('mastercard');
      } else {
          setCardType(null);
      }
  }, [ccNumber]);

  const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};
      if (!name.trim()) newErrors.name = 'Name is required.';
      if (!email.trim()) newErrors.email = 'Email is required.';
      if (!address.trim()) newErrors.address = 'Address is required.';
      if (!city.trim()) newErrors.city = 'City is required.';
      // Basic validation for credit card number (length and only digits)
      if (!/^\d{15,16}$/.test(ccNumber.replace(/\s/g, ''))) newErrors.ccNumber = 'Card number is invalid (15-16 digits).';
      // Basic validation for expiry date (MM/YY)
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) newErrors.expiry = 'Invaid expiry date (MM/YY).';
      // Basic validation for CVV (3-4 digits)
      if (!/^\d{3,4}$/.test(cvv)) newErrors.cvv = 'Invalid CVV (3-4 digits).';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
        const deliveryData: DeliveryInfo = { name, email, address, city };
        const ccData: CreditCardInfo = { number: ccNumber.replace(/\s/g, ''), expiry, cvv };
        onSubmit({ delivery: deliveryData, cc: ccData });
        // Limpiar formulario al enviar (opcional)
        // setName(''); setAddress(''); /* ... etc */ setCcNumber(''); setExpiry(''); setCvv('');
    }
  };

   // Format card number to show spaces every 4 digits
   const handleCcNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       const value = e.target.value.replace(/\D/g, ''); // This deletes non-digit characters
       const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add spaces every 4 digits
       setCcNumber(formattedValue.slice(0, 19)); // Limits the lenght (16 digits + 3 spaces)
   };

    // Format expiry date to MM/YY
    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        setExpiry(value.slice(0, 5)); // Limit to MM/YY
    };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Payment and delivery information</DialogTitle>
          <DialogDescription>
            Complete your information to finalize the purchase. We use secure test data.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Delivery section */}
            <div>
                 <h3 className="text-lg font-medium mb-3">Delivery information</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                     </div>
                     
                     <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                        <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" required />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                     </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="Your city" required />
                        {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Your delivery address" required />
                        {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                    </div>
                 </div>
            </div>

             <Separator />

            {/* Credit card section */}
            <div>
                 <h3 className="text-lg font-medium mb-3">Credit card information</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                     <div className="sm:col-span-4 relative space-y-2">
                        <Label htmlFor="cc-number">Card number</Label>
                        <div className="relative">
                            <Input
                                id="cc-number"
                                value={ccNumber}
                                onChange={handleCcNumberChange}
                                placeholder="0000 0000 0000 0000"
                                maxLength={19} // 16 digits + 3 spaces
                                required
                            />
                            {/* Show credit card logo */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl">
                                {cardType === 'visa' && <FaCcVisa className="text-blue-800" />}
                                {cardType === 'mastercard' && <img src={mastercardLogo} alt="Mastercard" className="h-6 w-auto" />}
                            </div>
                        </div>
                         {errors.ccNumber && <p className="text-red-500 text-xs">{errors.ccNumber}</p>}
                     </div>
                    <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="expiry">Expiration date (MM/AA)</Label>
                        <Input id="expiry" value={expiry} onChange={handleExpiryChange} placeholder="MM/AA" maxLength={5} required />
                        {errors.expiry && <p className="text-red-500 text-xs">{errors.expiry}</p>}
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" maxLength={4} required />
                        {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
                    </div>
                 </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Continue to the summary</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;