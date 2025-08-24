"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Definisikan bentuk dari item di keranjang
type CartItem = {
  id: number;
  nama_produk: string;
  harga: number;
  jumlah: number;
};

// Definisikan apa saja yang akan disediakan oleh Context
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'jumlah'>) => void;
  // Nanti kita akan tambah fungsi lain seperti removeFromCart, dll.
};

// Buat Context-nya
const CartContext = createContext<CartContextType | undefined>(undefined);

// Buat komponen Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Efek untuk memuat data dari Local Storage saat pertama kali dibuka
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Efek untuk menyimpan data ke Local Storage setiap kali keranjang berubah
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemToAdd: Omit<CartItem, 'jumlah'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemToAdd.id);
      if (existingItem) {
        // Jika item sudah ada, tambah jumlahnya
        return prevItems.map(item =>
          item.id === itemToAdd.id ? { ...item, jumlah: item.jumlah + 1 } : item
        );
      }
      // Jika item baru, tambahkan ke keranjang dengan jumlah 1
      return [...prevItems, { ...itemToAdd, jumlah: 1 }];
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Buat custom hook agar lebih mudah digunakan
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};