
import { Link } from 'react-router-dom';
import { CuisineType } from '@/types';

interface CuisineCardProps {
  cuisine: CuisineType;
}

const CuisineCard = ({ cuisine }: CuisineCardProps) => {
  return (
    <Link to={`/restaurants?cuisine=${cuisine.id}`} className="block text-center">
      <div className="rounded-full overflow-hidden w-20 h-20 md:w-24 md:h-24 mx-auto mb-2 border border-gray-200">
        <img 
          src={cuisine.image || 'https://placehold.co/80x80'} 
          alt={cuisine.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-sm font-medium line-clamp-2">{cuisine.name}</span>
    </Link>
  );
};

export default CuisineCard;
