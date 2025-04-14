import React from 'react';
import { useSelector } from 'react-redux';
import { ShoppingCart, Package, Menu } from 'lucide-react';
import { ShoppingCart, Package, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { selectCartItemCount } from '@/store/slices/cartSlice';
import { Link, NavLink } from 'react-router-dom';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import CartSheet from '@/features/cart/components/CartSheet';

interface HeaderProps {
  onProceedToCheckout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProceedToCheckout }) => {
  const cartItemCount = useSelector(selectCartItemCount);

  return (
    <>
      <header className="sticky top-0 z-10 w-full bg-background shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-current hover:text-primary transition-colors">
            <Package className="h-6 w-6" />
            <span className="font-bold text-lg">MyShop</span>
          </Link>

          {/* Desktop Nav */}
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
              }
            >
              Catalog
            </NavLink>
            <NavLink
              to="/my-transactions"
              className={({ isActive }) =>
                `font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
              }
            >
              My Purchases
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
              }
            >
              Catalog
            </NavLink>
            <NavLink
              to="/my-transactions"
              className={({ isActive }) =>
                `font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
              }
            >
              My Purchases
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 py-4 px-6">
                <nav className="flex flex-col gap-4">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
                    }
                  >
                    Catalog
                  </NavLink>
                  <NavLink
                    to="/my-transactions"
                    className={({ isActive }) =>
                      `font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
                    }
                  >
                    My Purchases
                  </NavLink>
                </nav>
              </SheetContent>
            </Sheet>

          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 py-4 px-6">
                <nav className="flex flex-col gap-4">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
                    }
                  >
                    Catalog
                  </NavLink>
                  <NavLink
                    to="/my-transactions"
                    className={({ isActive }) =>
                      `font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
                    }
                  >
                    My Purchases
                  </NavLink>
                </nav>
              </SheetContent>
            </Sheet>

          {/* Cart button */}
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-1 text-xs">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Ver carrito</span>
            </Button>
          </SheetTrigger>

        </div>
      </header>
      <Separator />
    </>
  );
};

export default Header;

