import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchProducts, selectAllProducts, selectProductsStatus, selectProductsError } from '@/store/slices/productsSlice';
import { selectSelectedCategory } from '@/store/slices/filterSlice';
import CategoryFilterSidebar from '@/features/product/components/CategoryFilterSidebar';
import ProductList from '@/features/product/components/ProductList';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";

import { Product } from '@/types';

// Skeleton component for ProductCard
const ProductCardSkeleton: React.FC = () => (
    <Card className="flex flex-col">
        <CardHeader>
            <Skeleton className="w-full h-32 rounded-md mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
            <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
             <Skeleton className="h-4 w-5/6" /> {/* Description line 2 */}
        </CardHeader>
         <CardContent className="flex-grow">
            <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-1/3" /> {/* Price */}
                <Skeleton className="h-4 w-1/4" /> {/* Stock */}
            </div>
             <Skeleton className="h-3 w-1/2" /> {/* Category */}
        </CardContent>
        <CardFooter>
             <Skeleton className="h-10 w-full" /> {/* Button */}
        </CardFooter>
    </Card>
);


const ProductCatalogPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const selectedCategory = useSelector(selectSelectedCategory);

  useEffect(() => {
    // Load products only if they haven't been loaded before
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Filter products based on the selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((product: Product) => product.category === selectedCategory);

  let content;

  if (status === 'loading') {
    // Show skeletons while loading
    content = (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
             {[...Array(8)].map((_, index) => <ProductCardSkeleton key={index} />)}
         </div>
    )
  } else if (status === 'succeeded') {
    content = <ProductList products={filteredProducts} />;
  } else if (status === 'failed') {
    content = <p className="text-center text-red-600 col-span-full mt-10">Error: {error}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 container mx-auto mt-4">
        {/* Sidebar */}
        <div className="hidden md:block"> {/* Hide on small screens */}
            <CategoryFilterSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {content}
        </main>
      </div>
    </div>
  );
};

export default ProductCatalogPage;