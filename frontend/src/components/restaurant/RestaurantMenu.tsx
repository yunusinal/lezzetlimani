
import { useRef, useState } from 'react';
import { Search, AlignJustify } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuCategory as MenuCategoryType, MenuItem } from '@/types';
import MenuCategory from './MenuCategory';

interface RestaurantMenuProps {
  categories: MenuCategoryType[];
  onAddToCart: (item: MenuItem) => void;
}

const RestaurantMenu = ({ categories, onAddToCart }: RestaurantMenuProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  );
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = categoryRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredCategories = categories.map(category => {
    if (searchQuery) {
      const filteredItems = category.items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return {
        ...category,
        items: filteredItems
      };
    }
    return category;
  }).filter(category => category.items.length > 0);

  return (
    <div className="mt-4">
      {/* Search */}
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Menüde ara..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
      
      {/* Category Navigation - Horizontal */}
      <div className="hidden md:flex overflow-x-auto space-x-2 py-2 mb-4 border-b">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => scrollToCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      {/* Category Navigation - Dropdown for Mobile */}
      <div className="md:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex justify-between"
            >
              <span>Kategori Seç</span>
              <AlignJustify className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-96">
            <SheetHeader>
              <SheetTitle>Kategoriler</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    scrollToCategory(category.id);
                    const sheetCloseButton = document.querySelector('[data-radix-collection-item]');
                    if (sheetCloseButton instanceof HTMLElement) {
                      sheetCloseButton.click();
                    }
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Categories and Menu Items */}
      {filteredCategories.length > 0 ? (
        filteredCategories.map(category => (
          <MenuCategory 
            key={category.id} 
            category={category}
            onAddToCart={onAddToCart}
            ref={el => categoryRefs.current[category.id] = el}
          />
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Aramanızla eşleşen ürün bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
