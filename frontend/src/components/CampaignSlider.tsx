
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CampaignBanner } from '@/types';
import { Button } from '@/components/ui/button';

interface CampaignSliderProps {
  campaigns: CampaignBanner[];
}

const CampaignSlider = ({ campaigns }: CampaignSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % campaigns.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? campaigns.length - 1 : prevIndex - 1
    );
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused, campaigns.length]);
  
  return (
    <div 
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={sliderRef}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {campaigns.map((campaign) => (
          <div 
            key={campaign.id} 
            className="min-w-full h-full flex-shrink-0"
          >
            <Link to={campaign.link} className="block h-full">
              <img 
                src={campaign.image || 'https://placehold.co/1200x300'} 
                alt={campaign.title} 
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        ))}
      </div>
      
      {/* Navigation Buttons */}
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full shadow-md"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full shadow-md"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
      
      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {campaigns.map((_, index) => (
          <button 
            key={index} 
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-brand-red' : 'bg-white/60'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CampaignSlider;
