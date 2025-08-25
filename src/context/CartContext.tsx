"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type CartItem = {
  id: number;
  nama_produk: string;
  harga: number;
  jumlah: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'jumlah'>) => void;
  removeFromCart: (itemId: number, removeOne?: boolean) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemToAdd: Omit<CartItem, 'jumlah'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemToAdd.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemToAdd.id ? { ...item, jumlah: item.jumlah + 1 } : item
        );
      }
      return [...prevItems, { ...itemToAdd, jumlah: 1 }];
    });
  };

  const removeFromCart = (itemId: number, removeOne: boolean = false) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      if (existingItem && existingItem.jumlah > 1 && removeOne) {
        // Kurangi jumlah jika item lebih dari 1
        return prevItems.map(item =>
          item.id === itemId ? { ...item, jumlah: item.jumlah - 1 } : item
        );
      } else {
        // Hapus item sepenuhnya dari keranjang
        return prevItems.filter(item => item.id !== itemId);
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};