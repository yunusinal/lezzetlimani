
import { Campaign } from '@/types';

// Mock campaign data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Sepette %20 İndirim',
    description: 'Seçili restoranlarda geçerli, minimum sipariş tutarı 150 TL',
    image: ' ',
    backgroundColor: '#FFF4E6',
    endDate: '2025-05-01',
    tags: ['indirim'],
    code: 'YEMEK20',
    minOrderAmount: 150,
    discountType: 'percentage',
    discountValue: 20,
    restaurants: ['1', '3', '5']
  },
  {
    id: '2',
    title: 'Yeni Üyelere Özel 100 TL İndirim',
    description: 'İlk siparişinizde minimum 200 TL alışverişte geçerli',
    image: ' ',
    backgroundColor: '#E8FFF0',
    endDate: '2025-06-15',
    tags: ['indirim', 'yeni-üye'],
    code: 'HOSGELDIN100',
    minOrderAmount: 200,
    discountType: 'fixed',
    discountValue: 100,
    restaurants: []
  },
  {
    id: '3',
    title: '2 Porsiyon Döner + 1 Ayran Hediye',
    description: 'Donas Döner\'de geçerli. Sadece 150 TL',
    image: '/images/campaign3.jpg',
    backgroundColor: '#F0F0FF',
    endDate: '2025-05-20',
    tags: ['2+1', 'hediye', 'özel-menü'],
    code: 'DONAS2P1',
    restaurants: ['1']
  },
  {
    id: '4',
    title: 'Ücretsiz Teslimat Fırsatı',
    description: '100 TL ve üzeri siparişlerde geçerli',
    image: '/images/campaign4.jpg',
    backgroundColor: '#FFECF0',
    endDate: '2025-04-30',
    tags: ['indirim'],
    code: 'TESLIMATSIZ',
    minOrderAmount: 100,
    restaurants: []
  },
  {
    id: '5',
    title: 'Çiğköfte Alana Ayran Bedava',
    description: 'Komagene\'de 2 porsiyon çiğköfte siparişine özel',
    image: '/images/cuisine-cig-kofte.jpg',
    backgroundColor: '#E8FFF0',
    endDate: '2025-05-15',
    tags: ['hediye'],
    code: 'CIGKOFTE2',
    minOrderAmount: 80,
    restaurants: ['3']
  },
  {
    id: '6',
    title: 'Hafta Sonu Özel %15 İndirim',
    description: 'Cumartesi ve Pazar günleri tüm siparişlerde geçerli',
    image: '/images/cuisine-burger.jpg',
    backgroundColor: '#FFF4E6',
    endDate: '2025-06-30',
    tags: ['indirim'],
    code: 'HAFTASONU15',
    discountType: 'percentage',
    discountValue: 15,
    restaurants: []
  },
  {
    id: '7',
    title: 'Pizza + İçecek Menüsü',
    description: 'Orta boy pizza + 1 litrelik içecek 120 TL',
    image: '/images/cuisine-pizza.jpg',
    backgroundColor: '#FFECF0',
    endDate: '2025-05-10',
    tags: ['özel-menü'],
    code: 'PIZZAMENU',
    restaurants: ['4', '7']
  },
  {
    id: '8',
    title: 'Kebap Çeşitleri %25 İndirim',
    description: 'Tüm kebap çeşitlerinde geçerli fırsat',
    image: '/images/cuisine-kebap.jpg',
    backgroundColor: '#F0F0FF',
    endDate: '2025-04-25',

    tags: ['indirim'],
    code: 'KEBAP25',
    discountType: 'percentage', 
    discountValue: 25,
    restaurants: ['2', '6', '8']
  }
];

// Function to fetch campaigns
export const getCampaigns = async (): Promise<Campaign[]> => {
  // Simulating API call with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCampaigns);
    }, 500);
  });
};

// Function to get a campaign by id
export const getCampaignById = async (id: string): Promise<Campaign | undefined> => {
  // Simulating API call with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      const campaign = mockCampaigns.find(c => c.id === id);
      resolve(campaign);
    }, 300);
  });
};
