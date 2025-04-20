import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '@/types';

interface AuthContextType {
    currentUser: User | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    addAddress: (address: Omit<Address, 'id'>) => void;
    updateAddress: (address: Address) => void;
    removeAddress: (addressId: string) => void;
    setDefaultAddress: (addressId: string) => void;
}

// Demo kullanıcı verisi
const demoUser: User = {
    id: 'user1',
    name: 'Yunus inal',
    email: 'yunus@gmail.com',
    phone: '0555 123 4567',
    password: '123456',
    addresses: [
        {
            id: 'addr1',
            title: 'Ev',
            fullAddress: 'Bahçelievler Mah. 1587 Sok. No:5',
            city: 'İstanbul',
            district: 'Bahçelievler',
            postalCode: '34000',
            isDefault: true
        }
    ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Sayfa yüklendiğinde localStorage'dan kullanıcı verilerini al
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
        }
    }, []);

    // Kullanıcı verilerini güncellediğimizde localStorage'a kaydet
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }, [currentUser]);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Gerçek bir uygulamada API çağrısı yapılır
        // Demo amaçlı basit bir kontrol:
        if (email === 'yunus@gmail.com' && password === '123456') {
            setCurrentUser(demoUser);
            setIsLoggedIn(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('currentUser');
    };

    const updateUser = (userData: Partial<User>) => {
        if (currentUser) {
            setCurrentUser({ ...currentUser, ...userData });
        }
    };

    const addAddress = (address: Omit<Address, 'id'>) => {
        if (currentUser) {
            const newAddress: Address = {
                ...address,
                id: `addr${Date.now()}` // Basit bir ID oluşturma
            };

            // Eğer bu ilk adres ise, varsayılan olarak işaretle
            if (currentUser.addresses.length === 0) {
                newAddress.isDefault = true;
            }

            setCurrentUser({
                ...currentUser,
                addresses: [...currentUser.addresses, newAddress]
            });
        }
    };

    const updateAddress = (address: Address) => {
        if (currentUser) {
            const updatedAddresses = currentUser.addresses.map(addr =>
                addr.id === address.id ? address : addr
            );

            setCurrentUser({
                ...currentUser,
                addresses: updatedAddresses
            });
        }
    };

    const removeAddress = (addressId: string) => {
        if (currentUser) {
            const filteredAddresses = currentUser.addresses.filter(addr => addr.id !== addressId);

            // Silinen adres varsayılan ise ve başka adresler varsa, ilk adresi varsayılan yap
            if (
                currentUser.addresses.find(addr => addr.id === addressId)?.isDefault &&
                filteredAddresses.length > 0
            ) {
                filteredAddresses[0].isDefault = true;
            }

            setCurrentUser({
                ...currentUser,
                addresses: filteredAddresses
            });
        }
    };

    const setDefaultAddress = (addressId: string) => {
        if (currentUser) {
            const updatedAddresses = currentUser.addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId
            }));

            setCurrentUser({
                ...currentUser,
                addresses: updatedAddresses
            });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isLoggedIn,
                login,
                logout,
                updateUser,
                addAddress,
                updateAddress,
                removeAddress,
                setDefaultAddress
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 