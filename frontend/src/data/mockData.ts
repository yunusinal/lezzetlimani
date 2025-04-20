import { Restaurant, CuisineType, CampaignBanner } from '../types';

export const cuisineTypes: CuisineType[] = [
  {
    id: '1',
    name: 'Döner',
    image: '/images/cuisine-doner.jpg'
  },
  {
    id: '2',
    name: 'Pizza',
    image: '/images/cuisine-pizza.jpg'
  },
  {
    id: '3',
    name: 'Burger',
    image: '/images/cuisine-burger.jpg'
  },
  {
    id: '4',
    name: 'Çiğ Köfte',
    image: '/images/cuisine-cig-kofte.jpg'
  },
  {
    id: '5',
    name: 'Pide & Lahmacun',
    image: '/images/cuisine-pide.jpg'
  },
  {
    id: '6',
    name: 'Tost & Sandviç',
    image: '/images/cuisine-tost.jpg'
  }
];

export const campaignBanners: CampaignBanner[] = [
  {
    id: '1',
    title: '50TL, 75TL ve 100TL İndirim',
    description: 'Belirli restoranlardan yapacağınız siparişlerde geçerli indirimler',
    image: '/lovable-uploads/7c3f265b-c603-405e-9723-cf0d57342c25.png',
    link: '/campaigns/discount',
    backgroundColor: '#FFECF0'
  },
  {
    id: '3',
    title: '+5.50 Bedava Çiğ Köfte',
    description: 'Belirli restoranlardan yapacağınız siparişlerde bedava çiğ köfte',
    image: '/images/campaign3.jpg',
    link: '/campaigns/free-cigkofte',
    backgroundColor: '#E8FFF0'
  },
  {
    id: '4',
    title: 'Tüm Siparişe %20 İndirim',
    description: 'Belirli restoranlardan yapacağınız siparişlerde %20 indirim',
    image: '/images/campaign4.jpg',
    link: '/campaigns/discount-twenty',
    backgroundColor: '#F0F0FF'
  }
];

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Donas Döner',
    logo: '/images/logos/res-donasdoner.png',
    coverImage: '/images/logos/res-donasdoner.png',
    cuisineType: ['Döner'],
    rating: 4.2,
    reviewCount: 1250,
    deliveryTime: 25,
    deliveryFee: 0,
    minOrderAmount: 150,
    distance: 1.8,
    priceRange: 2,
    isPromoted: true,
    isFavorite: false,
    description: 'Özel baharatlarla marine edilmiş tavuk ve et döner çeşitleri',
    image: '/images/logos/res-donasdoner.png',
    ratingCount: 1250,
    cuisine: ['Döner'],
    menu: [],
    address: 'Atatürk Mah. İstiklal Cad. No:123, Ataşehir, İstanbul',
    discount: {
      type: 'percentage',
      value: 25,
      minOrderAmount: 200
    },
    categories: [
      {
        id: 'c1',
        name: 'Yemeksepeti Özel Menüler',
        items: [
          {
            id: 'm1',
            name: 'Donas Mega Menü',
            description: 'Özel soslu tavuk döner dürüm (120 gr.) + patates kızartması + coleslaw salata + ayran',
            image: '/images/items/donas-special-menu.jpg',
            price: 185,
            discountedPrice: 165,
            isPopular: true,
            category: 'Yemeksepeti Özel Menüler'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Ekrem Coşkun Döner',
    logo: '/images/logos/res-ekremcoskun.jpg',
    coverImage: '/images/logos/res-ekremcoskun.jpg',
    cuisineType: ['Döner'],
    rating: 4.5,
    reviewCount: 2800,
    deliveryTime: 30,
    deliveryFee: 0,
    minOrderAmount: 200,
    distance: 2.1,
    priceRange: 3,
    isPromoted: true,
    isFavorite: true,
    description: '40 yıllık lezzet, geleneksel döner ustalarından',
    image: '/images/logos/res-ekremcoskun.jpg',
    ratingCount: 2800,
    cuisine: ['Döner'],
    menu: [],
    address: 'Barbaros Mah. Begonya Sok. No:45, Kadıköy, İstanbul',
    categories: [
      {
        id: 'c1',
        name: 'Öne Çıkan Lezzetler',
        items: [
          {
            id: 'm1',
            name: 'Ekrem Usta Special İskender',
            description: 'Özel domates soslu, tereyağlı, yoğurtlu iskender (200 gr.)',
            image: '/images/items/ec-iskender.jpg',
            price: 220,
            isPopular: true,
            category: 'Öne Çıkan Lezzetler'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Komagene Etsiz Çiğ Köfte',
    logo: '/images/logos/res-komagene.jpg',
    coverImage: '/images/logos/res-komagene.jpg',
    cuisineType: ['Çiğ Köfte'],
    rating: 4.3,
    reviewCount: 3500,
    deliveryTime: 20,
    deliveryFee: 0,
    minOrderAmount: 120,
    distance: 1.2,
    priceRange: 1,
    isPromoted: true,
    isFavorite: false,
    description: 'Özel tarif etsiz çiğ köfte, meze ve dürüm çeşitleri',
    image: '/images/logos/res-komagene.jpg',
    ratingCount: 3500,
    cuisine: ['Çiğ Köfte'],
    menu: [],
    address: 'Bağdat Cad. No:78, Maltepe, İstanbul',
    categories: [
      {
        id: 'c1',
        name: 'Çok Satan Ürünler',
        items: [
          {
            id: 'm1',
            name: 'Bol Malzeme Dürüm Menü',
            description: 'Etsiz çiğ köfte dürüm + Turşu + Acılı ezme + Ayran',
            image: '/images/items/cig-kofte-menu.jpg',
            price: 89.90,
            isPopular: true,
            category: 'Çok Satan Ürünler'
          }
        ]
      }
    ]
  },
  {
    id: '4',
    name: "McDonald's",
    logo: 'https://logo.clearbit.com/mcdonalds.com',
    coverImage: 'https://logo.clearbit.com/mcdonalds.com',
    cuisineType: ['Burger'],
    rating: 4.4,
    reviewCount: 5200,
    deliveryTime: 25,
    deliveryFee: 0,
    minOrderAmount: 150,
    distance: 1.5,
    priceRange: 3,
    isPromoted: true,
    isFavorite: true,
    description: 'Dünyaca ünlü burgerler, taze ve sıcak patates kızartması',
    image: 'https://logo.clearbit.com/mcdonalds.com',
    ratingCount: 5200,
    cuisine: ['Burger'],
    menu: [],
    address: 'Bağdat Cad. No:156, Kadıköy, İstanbul',
    categories: [
      {
        id: 'c1',
        name: 'Fırsat Menüleri',
        items: [
          {
            id: 'm1',
            name: 'Big Mac Fırsat Menüsü',
            description: 'Big Mac + Büyük Boy Patates + Büyük Boy İçecek + 4\'lü Nugget',
            image: 'https://source.unsplash.com/featured/?bigmac',
            price: 225,
            discountedPrice: 199,
            isPopular: true,
            category: 'Fırsat Menüleri'
          }
        ]
      }
    ]
  },
  {
    id: '5',
    name: "Domino's Pizza",
    logo: 'https://logo.clearbit.com/dominos.com',
    coverImage: 'https://images.unsplash.com/photo-1544067963-8a045010edcd',
    cuisineType: ['Pizza'],
    rating: 4.1,
    reviewCount: 4200,
    deliveryTime: 30,
    deliveryFee: 0,
    minOrderAmount: 150,
    distance: 2.0,
    priceRange: 3,
    isPromoted: true,
    isFavorite: false,
    description: 'Özel hamur ve taze malzemelerle hazırlanan enfes pizzalar',
    image: 'https://logo.clearbit.com/dominos.com',
    ratingCount: 4200,
    cuisine: ['Pizza'],
    menu: [],
    address: 'Fenerbahçe Mah. Fener Cad. No:89, Kadıköy, İstanbul',
    categories: [
      {
        id: 'c1',
        name: 'Süper İkili Fırsatlar',
        items: [
          {
            id: 'm1',
            name: '2 Orta Boy Pizza',
            description: 'Dilediğiniz 2 orta boy pizza + Coca-Cola (1 L)',
            image: 'https://source.unsplash.com/featured/?pizzas',
            price: 280,
            discountedPrice: 249,
            isPopular: true,
            category: 'Süper İkili Fırsatlar'
          }
        ]
      }
    ]
  },
  {
    id: '6',
    name: 'Meşhur Ayvalık Tostu',
    logo: '/images/logos/res-ayvaliktost.png',
    coverImage: '/images/logos/res-ayvaliktost.png',
    cuisineType: ['Tost & Sandviç'],
    rating: 4.6,
    reviewCount: 1800,
    deliveryTime: 20,
    deliveryFee: 0,
    minOrderAmount: 100,
    distance: 0.8,
    priceRange: 1,
    isPromoted: true,
    isFavorite: true,
    description: 'Özel kaşar peyniri ve sucuk ile hazırlanan enfes Ayvalık tostu',
    image: '/images/logos/res-ayvaliktost.png',
    ratingCount: 1800,
    cuisine: ['Tost & Sandviç'],
    menu: [],
    address: 'Caddebostan Mah. Bağdat Cad. No:223, Kadıköy, İstanbul',
    categories: [
      {
        id: 'c1',
        name: 'Tost Çeşitleri',
        items: [
          {
            id: 'm1',
            name: 'Mega Ayvalık Tostu',
            description: 'Özel kaşar, sucuk, sosis, domates, turşu (2 kişilik)',
            image: '/images/items/mega-ayvalik-tost.jpg',
            price: 120,
            isPopular: true,
            category: 'Tost Çeşitleri'
          }
        ]
      }
    ]
  },
  {
    id: '7',
    name: 'İso Burger House',
    logo: '/images/logos/res-isoburger.jpg',
    coverImage: '/images/logos/res-isoburger.jpg',
    cuisineType: ['Burger'],
    rating: 4.7,
    reviewCount: 2100,
    deliveryTime: 35,
    deliveryFee: 0,
    minOrderAmount: 120,
    distance: 1.7,
    priceRange: 2,
    isPromoted: true,
    isFavorite: true,
    description: '%100 dana eti ile hazırlanan el yapımı gurme burgerler',
    image: '/images/logos/res-isoburger.jpg',
    ratingCount: 2100,
    cuisine: ['Burger'],
    menu: [],
    address: 'Suadiye Mah. Plaj Yolu Sok. No:34, Kadıköy, İstanbul',
    categories: [
      {
        id: 'c1',
        name: 'Özel Menüler',
        items: [
          {
            id: 'm1',
            name: 'İso Special Burger Menü',
            description: '200 gr dana eti, karamelize soğan, özel sos + Taze patates kızartması + İçecek',
            image: '/images/items/iso-special.jpg',
            price: 195,
            discountedPrice: 175,
            isPopular: true,
            category: 'Özel Menüler'
          }
        ]
      }
    ]
  },
  {
    id: '8',
    name: 'Pidem Pide & Lahmacun',
    logo: '/images/logos/res-pidem.png',
    coverImage: '/images/logos/res-pidem.png',
    cuisineType: ['Pide & Lahmacun'],
    rating: 4.4,
    reviewCount: 2800,
    deliveryTime: 35,
    deliveryFee: 0,
    minOrderAmount: 130,
    distance: 2.2,
    priceRange: 2,
    isPromoted: true,
    isFavorite: true,
    description: 'Odun fırınında pişen geleneksel pide ve lahmacun çeşitleri',
    image: '/images/logos/res-pidem.png',
    ratingCount: 2800,
    cuisine: ['Pide & Lahmacun'],
    menu: [],
    address: 'Göztepe Mah. Tütüncü Mehmet Efendi Cad. No:112, Kadıköy, İstanbul',
    categories: [
      {
        id: 'c1',
        name: 'Fırından',
        items: [
          {
            id: 'm1',
            name: 'Karışık Pide',
            description: 'Kuşbaşı, kaşar, sucuk, biber ve mantar ile',
            image: '/images/items/karisik-pide.jpg',
            price: 160,
            isPopular: true,
            category: 'Fırından'
          }
        ]
      }
    ]
  }
];
