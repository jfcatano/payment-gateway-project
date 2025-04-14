import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types';
import { AppDispatch } from '@/store/store';
import { addItem } from '@/store/slices/cartSlice';
import { ShoppingCart, PackageX } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const dispatch: AppDispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addItem(product));
    };

     // Price formatter in COP
    const formattedPrice = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(product.price);

    const hasStock = product.stock > 0;

    return (
        <Card className="flex flex-col">
            <CardHeader>
                {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md mb-4" // Image style
                    />
                )}
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="h-10 overflow-hidden text-ellipsis">
                   {product.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"> {/* Flex-grow to push footer */}
                 <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-semibold">{formattedPrice}</p>
                    {hasStock ? (
                         <p className="text-sm text-green-600">Stock: {product.stock}</p>
                    ) : (
                         <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                             <PackageX className="h-4 w-4"/> Out of stock
                         </p>
                    )}

                 </div>
                 <p className="text-xs text-muted-foreground">Category: {product.category}</p>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleAddToCart} disabled={!hasStock}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {hasStock ? 'Add to cart' : 'Out of stock'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;