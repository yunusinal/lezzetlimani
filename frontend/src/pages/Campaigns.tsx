import { useQuery } from '@tanstack/react-query';
import { BadgePercent } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getCampaigns } from '@/services/campaignService';
import CampaignCard from '@/components/campaign/CampaignCard';

const Campaigns = () => {
  // Fetch campaigns using React Query
  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: getCampaigns
  });
  
  const saveCampaign = (id: string) => {
    toast.success("Kampanya kaydedildi! Favoriler sayfasından ulaşabilirsiniz.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <BadgePercent className="mr-2 text-brand-red h-8 w-8" />
            Kampanyalar
          </h1>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="text-center py-10">Kampanyalar yükleniyor...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">
                Kampanyalar yüklenirken bir hata oluştu.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(campaign => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onSave={() => saveCampaign(campaign.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
        </Tabs>
        
        <Separator className="my-8" />
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Sık Sorulan Sorular</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Kampanyalardan nasıl yararlanabilirim?</h3>
              <p className="text-gray-600">Kampanya detayında belirtilen koşullara uygun sipariş verip kampnya kodunu girmeniz yeterlidir.</p>
            </div>
            <div>
              <h3 className="font-medium">Birden fazla kampanyadan aynı anda yararlanabilir miyim?</h3>
              <p className="text-gray-600">Hayır, bir siparişte yalnızca bir kampanyadan yararlanabilirsiniz.</p>
            </div>
            <div>
              <h3 className="font-medium">Kampanya süreleri ne kadardır?</h3>
              <p className="text-gray-600">Her kampanyanın süresi detaylarında belirtilmiştir. Kampanyalar sınırlı süreli olabilir.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Campaigns;
