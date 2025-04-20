
import React, { ForwardedRef, forwardRef } from 'react';
import MenuItem from './MenuItem';
import { MenuCategory as MenuCategoryType, MenuItem as MenuItemType } from '@/types';

interface MenuCategoryProps {
  category: MenuCategoryType;
  onAddToCart: (item: MenuItemType) => void;
}

const MenuCategory = forwardRef(({ category, onAddToCart }: MenuCategoryProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div ref={ref} className="mb-8">
      <h3 className="text-xl font-bold mb-4">{category.name}</h3>
      <div className="space-y-4">
        {category.items.map(item => (
          <MenuItem 
            key={item.id} 
            item={item} 
            onAddToCart={onAddToCart} 
          />
        ))}
      </div>
    </div>
  );
});

MenuCategory.displayName = 'MenuCategory';

export default MenuCategory;
