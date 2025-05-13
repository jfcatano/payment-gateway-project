import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CartSheet from "@/features/cart/components/CartSheet";
import cartReducer from "@/store/slices/cartSlice";
import { CartItem, Product } from "@/types";

type ProductState = {
  items: Product[]
}

// Mock implementation of ResizeObserver (ShadCN UI uses it)
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock components from ShadCN UI
vi.mock("@/components/ui/sheet", () => ({
    Sheet: ({ children }: any) => (
        <div data-testid="mock-sheet">{children}</div>
    ),
    SheetContent: ({ children }: any) => (
        <div data-testid="mock-sheet-content">{children}</div>
    ),
    SheetHeader: ({ children }: any) => (
        <div data-testid="mock-sheet-header">{children}</div>
    ),
    SheetTitle: ({ children }: any) => (
        <div data-testid="mock-sheet-title">{children}</div>
    ),
    SheetTrigger: ({ children }: any) => (
        <div data-testid="mock-sheet-trigger">{children}</div>
    ),
    SheetFooter: ({ children }: any) => (
        <div data-testid="mock-sheet-footer">{children}</div>
    ),
    SheetClose: ({ children }: any) => (
        <div data-testid="mock-sheet-close">{children}</div>
    ),
}));

// Fix: Improved ScrollArea mock with Root export
vi.mock("@radix-ui/react-scroll-area", () => ({
  ScrollArea: ({ children }: any) => <div data-testid="mock-scroll-area">{children}</div>,
  ScrollBar: ({ children }: any) => <div data-testid="mock-scroll-bar">{children}</div>,
  Root: ({ children }: any) => <div data-testid="mock-scroll-root">{children}</div>,
}));

// Also mock the UI scroll-area component which likely uses Radix under the hood
vi.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: any) => <div data-testid="mock-ui-scroll-area">{children}</div>,
  ScrollBar: ({ children }: any) => <div data-testid="mock-ui-scroll-bar">{children}</div>,
}));

// Store mock
const createMockStore = (initialCartState: { items?: Record<string, CartItem>} = {}, productsData: Product[] = []) => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            products: (state: ProductState = { items: productsData }) => state,
        },
        preloadedState: {
            cart: {
                items: {},
                ...initialCartState,
            },
            products: {
                items: productsData,
            },
        },
    });
};

describe("CartSheet", () => {
    const mockOnProceedToCheckout = vi.fn();

    const productId = "1";
    const mockProduct: Product = {
        id: productId,
        name: "Test Product",
        description: "Testing description",
        category: "all",
        price: 1000,
        stock: 5,
        imageUrl: "test.jpg",
    };

    // Global config for all tests - install ResizeObserver mock
    beforeAll(() => {
      // Save the original implementation of ResizeObserver if it exists
      global._originalResizeObserver = global.ResizeObserver;
      // Configure the mock ResizeObserver
      global.ResizeObserver = ResizeObserverMock;
  });

  // Restore the original ResizeObserver implementation after all tests
  afterAll(() => {
      global.ResizeObserver = global._originalResizeObserver;
  });

    // Global setup for all tests
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (initialCartState = {}, productsData = []) => {
        const store = createMockStore(initialCartState, productsData);
        console.log("Store state:", store.getState());

        return render(
            <Provider store={store}>
                {/* <Sheet open={true} onOpenChange={vi.fn()}> */}
                <CartSheet onProceedToCheckout={mockOnProceedToCheckout} />
                {/* </Sheet> */}
            </Provider>
        );
    };

    it("should display message when cart is empty", () => {
        renderComponent();
        expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    });

    it("should show products when the cart has items", () => {
        const initialState = {
            items: {
                [productId]: {
                    product_id: productId,
                    name: "Test Product",
                    price: 1000,
                    quantity: 1,
                    stock: 5,
                    imageUrl: "test.jpg",
                },
            },
        };

        renderComponent(initialState, [mockProduct]);

        // Add a debug to see what is being rendered
        console.log(screen.debug());

        expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    describe("Interactions with products", () => {
        const initialState = {
            items: {
                [productId]: {
                    product_id: productId,
                    name: "Test Product",
                    price: 1000,
                    quantity: 1,
                    stock: 5,
                    imageUrl: "test.jpg",
                },
            },
        };

        it("should increase the amount of the product", async () => {
            renderComponent(initialState, [mockProduct]);
            const increaseButton = screen.getByTestId('plus-button');
            // const increaseButton = screen.getByRole("button", {
            //     name: /plus/i,
            // });
            await userEvent.click(increaseButton);
            expect(screen.getByText("2")).toBeInTheDocument();
        });

        it("should decrease the quantity of the product", async () => {
            renderComponent(
                {
                    items: {
                        [productId]: {
                            // ...initialState.items["1"],
                            product_id: productId,
                            quantity: 2,
                        },
                    },
                },
                [mockProduct]
            );

            const decreaseButton = screen.getByTestId('minus-button')
            // const decreaseButton = screen.getByRole("button", {
            //     name: /minus/i,
            // });
            await userEvent.click(decreaseButton);
            expect(screen.getByText("1")).toBeInTheDocument();
        });

        it("should remove a product from the cart", async () => {
            renderComponent(initialState, [mockProduct]);
            
            const removeButton = screen.getByTestId('delete-button')
            // const removeButton = screen.getByRole("button", { name: /trash/i });
            await userEvent.click(removeButton);
            expect(screen.queryByText("Test Product")).not.toBeInTheDocument();
        });
    });

    describe("Total calculations", () => {
        const initialState = {
            items: {
                [productId]: {
                    product_id: productId,
                    quantity: 2,
                },
            },
        };

        it("should show the correct subtotal", () => {
          renderComponent(initialState, [mockProduct]);
            expect(screen.getByText("$ 2.000")).toBeInTheDocument();
        });

        it("should show the correct TAX", () => {
          renderComponent(initialState, [mockProduct]);
            expect(screen.getByText("$ 380")).toBeInTheDocument(); // 19% de 2000
        });
    });

    it("should call onProceedToCheckout when clicking the payment button", async () => {
        renderComponent({
          items: {
            [productId]: {
              product_id: productId,
              quantity: 1,
            },
          },
        }, [mockProduct]);

        const checkoutButton = screen.getByText("Proceed to payment");
        await userEvent.click(checkoutButton);
        expect(mockOnProceedToCheckout).toHaveBeenCalled();
    });
});
