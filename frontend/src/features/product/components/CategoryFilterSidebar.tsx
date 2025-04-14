import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { AppDispatch } from '@/store/store';
import { selectUniqueCategories, selectSelectedCategory } from '@/store/slices/productsSlice';
import { setCategoryFilter } from '@/store/slices/filterSlice';
import { ListFilter } from 'lucide-react';

const CategoryFilterSidebar: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const categories = useSelector(selectUniqueCategories);
    const selectedCategory = useSelector(selectSelectedCategory);

    const handleCategoryClick = (category: string) => {
        dispatch(setCategoryFilter(category));
    };

    return (
        <aside className="w-full md:w-64 p-4 border-r sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"> {/* Sticky sidebar */}
             <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                 <ListFilter className="h-5 w-5" />
                 Categories
             </h2>
            <div className="flex flex-col space-y-2">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'secondary' : 'ghost'}
                        onClick={() => handleCategoryClick(category)}
                        className="justify-start"
                    >
                        {category === 'all' ? 'Todas' : category}
                    </Button>
                ))}
            </div>
        </aside>
    );
};

export default CategoryFilterSidebar;