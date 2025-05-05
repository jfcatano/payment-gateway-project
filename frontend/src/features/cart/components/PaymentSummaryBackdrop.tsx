import React from "react";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/store/store";
import {
    selectCartTotal,
    selectDetailedCartItems,
    selectTotalTax,
} from "@/store/slices/cartSlice";
import { DeliveryInfo, CreditCardInfo } from "@/components/global/Layout";

interface PaymentSummaryProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirmPayment: () => void;
    deliveryInfo: DeliveryInfo;
    ccInfo: CreditCardInfo;
}

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Default values for fees (This can be from config or backend)
// const BASE_FEE = 1000;
const SHIPPING_FEE = 5000;

const PaymentSummaryBackdrop: React.FC<PaymentSummaryProps> = ({
    isOpen,
    onOpenChange,
    deliveryInfo,
    ccInfo,
}) => {
    const cartTotal = useAppSelector(selectCartTotal);
    const cartTaxes = useAppSelector(selectTotalTax);
    const cartItems = useAppSelector(selectDetailedCartItems);
    const grandTotal = cartTotal + cartTaxes + SHIPPING_FEE;

    const PUBLIC_KEY = import.meta.env.VITE_PAYMENT_GATEWAY_PUBLIC_KEY;
    const REDIRECT_URL = import.meta.env.VITE_PAYMENT_GATEWAY_REDIRECT_URL;
    const CHECKOUT_URL = import.meta.env.VITE_PAYMENT_GATEWAY_CHECKOUT_URL;
    const API_URL = import.meta.env.VITE_API_URL;

    // Currency formatter
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);

    const redirectToPaymentGateway = (params: Record<string, string>) => {
        const form = document.createElement("form");
        form.method = "GET";
        form.action = CHECKOUT_URL;

        Object.entries(params).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    };

    const handleConfirmPayment = async () => {
        const response = await fetch(
            `${API_URL}/v1/transactions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    products: cartItems.map((item) => ({
                        name: item.name,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price
                    })),

                    amount: grandTotal,
                    base_fee: 1000,
                    delivery_fee: 1000,
                    customer: {
                        email: deliveryInfo.email,
                        name: deliveryInfo.name,
                        // phoneNumber: "3001234567",
                        // legalId: "123456789",
                        // legalIdType: "CC"
                        addressLine1: "Dirección en caso de querer agregarla",
                        addressLine2: "",
                        city: "Medellín",
                        country: "COLOMBIA",
                    },
                }),
            }
        );

        if (response.ok) {
            const { transaction_data } = await response.json();

            
            console.log(REDIRECT_URL)
            console.log(transaction_data);
            const { signature, reference, amount_in_cents, currency } =
                transaction_data;
            redirectToPaymentGateway({
              "redirect-url": REDIRECT_URL,
              "signature:integrity": signature,
              reference,
              "amount-in-cents": amount_in_cents,
              currency,
              "public-key": PUBLIC_KEY,
              "customer-data:full-name": deliveryInfo.name,
            });
        } else {
            console.error("Error creating the transaction.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Order Summary</DialogTitle>
                    <DialogDescription>
                        Please verify the details before confirming payment.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    {/* Products summary */}
                    <div>
                        <h4 className="font-medium mb-2">Products:</h4>
                        <div className="max-h-32 overflow-y-auto text-sm space-y-1 pr-2">
                            {cartItems.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="flex justify-between"
                                >
                                    <span>
                                        {item.name} x {item.quantity}
                                    </span>
                                    <span>
                                        {formatCurrency(
                                            item.price * item.quantity
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    {/* Cost Summary */}
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Products subtotal:</span>
                            <span>{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Base fee:</span>
                            <span>{formatCurrency(cartTaxes)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping fee:</span>
                            <span>{formatCurrency(SHIPPING_FEE)}</span>
                        </div>
                    </div>
                    <Separator />
                    {/* Total */}
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total to pay:</span>
                        <span>{formatCurrency(grandTotal)}</span>
                    </div>
                    <Separator />
                    {/* Delivery and payment information */}
                    <div className="text-sm space-y-2">
                        <div>
                            <h4 className="font-medium mb-1">Send to:</h4>
                            <p className="text-muted-foreground">
                                {deliveryInfo.name}
                            </p>
                            <p className="text-muted-foreground">
                                {deliveryInfo.address}, {deliveryInfo.city}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">
                                Payment method:
                            </h4>
                            <p className="text-muted-foreground">
                                Credit card ending in{" "}
                                {ccInfo.number.slice(-4)}
                            </p>
                            <p className="text-muted-foreground">Expiry date: {ccInfo.expiry}</p>
                        </div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-between gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleConfirmPayment}>
                        Pay now {formatCurrency(grandTotal)}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentSummaryBackdrop;
