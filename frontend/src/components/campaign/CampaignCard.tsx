
import { useState } from 'react';
import { Calendar, Clock, Gift, Heart, ShoppingBag, Tag, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Campaign } from '@/types';

interface CampaignCardProps {
  campaign: Campaign;
  onSave: () => void;
}

const CampaignCard = ({ campaign, onSave }: CampaignCardProps) => {
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    setSaved(!saved);
    onSave();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Create gradient background with the campaign color
  const cardStyle = {
    background: `linear-gradient(to right, ${campaign.backgroundColor || '#FFFFFF'}, white)`,
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <img 
            src={campaign.image} 
            alt={campaign.title} 
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 opacity-90"
            style={cardStyle}
          ></div>
          <div className="absolute top-3 right-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white h-8 w-8 rounded-full"
              onClick={handleSave}
            >
              <Heart 
                className={`h-4 w-4 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
              />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            {campaign.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="mr-2 capitalize bg-white/80 text-gray-800"
              >
                {tag.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="h-4 w-4 mr-1.5" />
          <span>Son Tarih: {formatDate(campaign.endDate)}</span>
        </div>
        
        {campaign.code && (
          <div className="flex items-center justify-between mt-4 bg-gray-100 p-2 rounded">
            <div className="flex items-center">
              <Ticket className="h-4 w-4 mr-1.5 text-brand-red" />
              <span className="font-medium">{campaign.code}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4 pt-3 flex justify-between">
        {campaign.restaurants.length > 0 ? (
          <Badge variant="outline" className="font-normal">
            <ShoppingBag className="h-3 w-3 mr-1" />
            {campaign.restaurants.length} restoranda geçerli
          </Badge>
        ) : (
          <Badge variant="outline" className="font-normal">
            <ShoppingBag className="h-3 w-3 mr-1" />
            Tüm restoranlarda geçerli
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
