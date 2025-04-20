import { useState, useEffect } from 'react';
import { Restaurant } from '@/types';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Restaurant[]>([]);

    // Sayfa yüklendiğinde localStorage'dan favorileri al
    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    // Favori ekleme/çıkarma fonksiyonu
    const toggleFavorite = (restaurant: Restaurant) => {
        setFavorites(prevFavorites => {
            const isExist = prevFavorites.some(fav => fav.id === restaurant.id);
            let newFavorites;

            if (isExist) {
                newFavorites = prevFavorites.filter(fav => fav.id !== restaurant.id);
            } else {
                newFavorites = [...prevFavorites, restaurant];
            }

            // localStorage'a kaydet
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    // Favori kontrolü
    const isFavorite = (restaurantId: string) => {
        return favorites.some(fav => fav.id === restaurantId);
    };

    return {
        favorites,
        toggleFavorite,
        isFavorite
    };
}; 