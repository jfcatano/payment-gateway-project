import React from "react";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import {
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RootState, AppDispatch } from "@/store/store";
import {
    selectDetailedCartItems,
    selectCartTotal,
    decreaseItemQuantity,
    increaseItemQuantity,
    removeItem,
    selectTotalTax,
} from "@/store/slices/cartSlice";
import { Minus, Plus, Trash2 } from "lucide-react";

import defaultImage from '../../../assets/default-product-image.jpg';

interface CartSheetProps {
    onProceedToCheckout: () => void;
}

// Hook tipado
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const CartSheet: React.FC<CartSheetProps> = ({ onProceedToCheckout }) => {
    const dispatch: AppDispatch = useDispatch();
    const cartItems = useAppSelector(selectDetailedCartItems);
    const cartTotal = useAppSelector(selectCartTotal);
    const totalTaxes = useAppSelector(selectTotalTax)

    // Money formatter
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);

    const handleDecrease = (product_id: string) => {
        dispatch(decreaseItemQuantity(product_id));
    };

    const handleIncrease = (product_id: string, stock: number) => {
        dispatch(increaseItemQuantity({ product_id, stock }));
    };

    const handleRemove = (product_id: string) => {
        dispatch(removeItem(product_id));
    };

    const handleCheckout = () => {
        // TODO: Implementar la lógica para iniciar el checkout
        // Según el flujo de la prueba, esto debería abrir el Modal
        // para pedir datos de Tarjeta de Crédito y Envío (Fuente 6)
        console.log("Iniciar proceso de checkout...");

        onProceedToCheckout();
        // Probablemente quieras cerrar el Sheet aquí si abres un Modal
        // document.getElementById('cart-close-button')?.click(); // Simula click en el botón de cerrar si le pones ID
    };

    return (
        <SheetContent className="flex flex-col w-full sm:max-w-lg">
            {" "}
            {/* Adjust width on large screens */}
            <SheetHeader className="pr-14">
                {" "}
                <SheetTitle>Shopping Cart</SheetTitle>
                <SheetClose
                    asChild
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                >
                </SheetClose>
            </SheetHeader>
            <Separator className="my-4" />
            {cartItems.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-muted-foreground">
                        Your cart is empty.
                    </p>
                </div>
            ) : (
                <>
                    {/* Scroll area for the product list */}
                    <ScrollArea className="flex-1 pr-6">
                        {" "}
                        {/* pr-6 is to compensate for the size of the scroll bar */}
                        <div className="flex flex-col gap-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="flex items-center gap-4"
                                >
                                    <img
                                        src={
                                            item.imageUrl ||
                                            defaultImage
                                        }
                                        alt={item.name}
                                        className="h-16 w-16 rounded object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatCurrency(item.price)}
                                        </p>
                                        {/* Product quantity controllers */}
                                        <div className="flex items-center gap-2 mt-1">
                                            <Button
                                                data-testid='minus-button'
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() =>
                                                    handleDecrease(
                                                        item.product_id
                                                    )
                                                }
                                                disabled={item.quantity <= 1} // Disable the button if the quantity is 1
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-6 text-center">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                data-testid='plus-button'
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() =>
                                                    handleIncrease(
                                                        item.product_id,
                                                        item.stock
                                                    )
                                                }
                                                disabled={
                                                    item.quantity >= item.stock
                                                } // Disable the button if the product is out of stock
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {/* Button to delete products */}
                                    <Button
                                        data-testid="delete-button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() =>
                                            handleRemove(item.product_id)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <Separator className="my-4" />
                    {/* Footer with the total and checkout button */}
                    <SheetFooter>
                        <div className="flex flex-col w-full gap-4">
                            <div className="flex justify-between font-semibold text-lg">
                                <span>IVA (19%):</span>
                                <span>{formatCurrency(totalTaxes)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>
                            <SheetClose asChild>
                                <Button
                                    className="w-full"
                                    onClick={handleCheckout}
                                >
                                    Proceed to payment
                                </Button>
                            </SheetClose>
                        </div>
                    </SheetFooter>
                </>
            )}
        </SheetContent>
    );
};

export default CartSheet;
