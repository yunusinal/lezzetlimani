import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from 'react';
import { cuisineTypes } from '@/data/mockData';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([0, 4]);
  const [deliveryTime, setDeliveryTime] = useState(60);
  const [minRating, setMinRating] = useState(0);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('popular');

  // Filtrelerde herhangi bir değişiklik olduğunda güncelleme yapacak useEffect hook'u
  useEffect(() => {
    handleApplyFilters();
  }, [priceRange, deliveryTime, minRating, selectedCuisines, sortOption]);

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev => {
      if (prev.includes(cuisine)) {
        return prev.filter(c => c !== cuisine);
      } else {
        return [...prev, cuisine];
      }
    });
  };

  const handleApplyFilters = () => {
    onFilterChange({
      priceRange,
      deliveryTime,
      minRating,
      cuisines: selectedCuisines,
      sortOption
    });
  };

  const handleReset = () => {
    setPriceRange([0, 4]);
    setDeliveryTime(60);
    setMinRating(0);
    setSelectedCuisines([]);
    setSortOption('popular');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-bold mb-4">Filtrele</h2>

      {/* Sorting Options */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2">Sıralama</h3>
        <div className="space-y-2">
          {[
            { id: 'popular', label: 'Önerilen (Varsayılan)' },
            { id: 'rating', label: 'Puanı Yüksek' },
            { id: 'delivery', label: 'Teslimat Süresi' },
            { id: 'min_price', label: 'Minimum Tutar' }
          ].map(option => (
            <div key={option.id} className="flex items-center">
              <input
                type="radio"
                id={option.id}
                name="sortOption"
                checked={sortOption === option.id}
                onChange={() => setSortOption(option.id)}
                className="w-4 h-4 text-brand-red focus:ring-brand-red"
              />
              <label htmlFor={option.id} className="ml-2 text-sm">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Time */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-sm font-semibold">Teslimat Süresi</h3>
          <ChevronsUpDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-4">
            <Slider
              value={[deliveryTime]}
              min={10}
              max={90}
              step={5}
              onValueChange={(value) => setDeliveryTime(value[0])}
            />
            <div className="flex justify-between text-sm">
              <span>En fazla {deliveryTime} dakika</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Min Rating */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-sm font-semibold">Minimum Puan</h3>
          <ChevronsUpDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-4">
            <Slider
              value={[minRating]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={(value) => setMinRating(value[0])}
            />
            <div className="flex justify-between text-sm">
              <span>En az {minRating} yıldız</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-sm font-semibold">Fiyat Aralığı</h3>
          <ChevronsUpDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-4">
            <Slider
              value={priceRange}
              min={0}
              max={4}
              step={1}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between text-sm">
              <span>{'₺'.repeat(priceRange[0] || 1)}</span>
              <span>{'₺'.repeat(priceRange[1] || 4)}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Cuisines */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-sm font-semibold">Mutfak</h3>
          <ChevronsUpDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cuisineTypes.map(cuisine => (
              <div key={cuisine.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cuisine-${cuisine.id}`}
                  checked={selectedCuisines.includes(cuisine.name)}
                  onChange={() => handleCuisineToggle(cuisine.name)}
                  className="w-4 h-4 text-brand-red focus:ring-brand-red"
                />
                <label htmlFor={`cuisine-${cuisine.id}`} className="ml-2 text-sm">
                  {cuisine.name}
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleReset}
        >
          Sıfırla
        </Button>
        <Button
          className="flex-1 bg-brand-red text-white hover:bg-brand-red/90"
          onClick={handleApplyFilters}
        >
          Uygula
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
