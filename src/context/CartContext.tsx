"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type CartItem = { id: number; nama_produk: string; harga: number; jumlah: number; };
// tambahkan optional is_active karena response API punya field ini
type MetodePembayaran = { id: number; nama_metode: string; is_active?: boolean; };

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'jumlah'>) => void;
  removeFromCart: (itemId: number, removeOne?: boolean) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // State & fungsi untuk checkout
  nama: string; setNama: (nama: string) => void;
  nomorWa: string; setNomorWa: (nomorWa: string) => void;
  catatan: string; setCatatan: (catatan: string) => void;
  metodeId: string; setMetodeId: (id: string) => void;
  metodeList: MetodePembayaran[];
  handleCheckout: () => Promise<void>;
  isCheckingOut: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();

  // State untuk data checkout
  const [nama, setNama] = useState("");
  const [nomorWa, setNomorWa] = useState("");
  const [catatan, setCatatan] = useState("");
  const [metodeId, setMetodeId] = useState("");
  const [metodeList, setMetodeList] = useState<MetodePembayaran[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Ambil data dari Local Storage dan API saat pertama kali dimuat
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCartItems(JSON.parse(storedCart) as CartItem[]);

    const savedNama = localStorage.getItem('customer_nama');
    if (savedNama) setNama(savedNama);
    
    const savedNomorWa = localStorage.getItem('customer_nomor_wa');
    if (savedNomorWa) setNomorWa(savedNomorWa);

    const fetchMetode = async () => {
      try {
        const response = await fetch('/api/metode-pembayaran');
        if (response.ok) {
          // cast ke tipe yang benar sehingga kita tidak perlu pakai "any"
          const data = (await response.json()) as Array<MetodePembayaran & { is_active?: boolean }>;
          // filter berdasarkan is_active (optional)
          setMetodeList(data.filter((metode) => metode.is_active));
        } else {
          // jika response bukan ok, kosongkan atau biarkan default
          setMetodeList([]);
        }
      } catch (err: unknown) {
        // hindari implicit any pada catch
        if (err instanceof Error) {
          console.error("Gagal fetch metode pembayaran:", err.message);
        } else {
          console.error("Gagal fetch metode pembayaran:", err);
        }
      }
    };
    fetchMetode();
  }, []);
  
  // Simpan keranjang ke Local Storage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

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
    openCart(); 
  };
  
  const removeFromCart = (itemId: number, removeOne: boolean = false) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      if (existingItem && existingItem.jumlah > 1 && removeOne) {
        return prevItems.map(item => item.id === itemId ? { ...item, jumlah: item.jumlah - 1 } : item);
      } else {
        return prevItems.filter(item => item.id !== itemId);
      }
    });
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    localStorage.setItem('customer_nama', nama);
    localStorage.setItem('customer_nomor_wa', nomorWa);
    const totalHarga = cartItems.reduce((total, item) => total + item.harga * item.jumlah, 0);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, nama_pelanggan: nama, nomor_wa: nomorWa, total_harga: totalHarga, metode_pembayaran_id: parseInt(metodeId), catatan_pelanggan: catatan, tipe_pesanan: 'ONLINE', }),
      });
      if (!response.ok) throw new Error("Gagal membuat pesanan.");
      
      const createdOrder = await response.json();
      setCartItems([]); // Kosongkan keranjang
      closeCart();
      router.push(`/pesanan/${createdOrder.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error updating order status:", err.message);
      } else {
        console.error("Error updating order status:", err);
      }
      alert("Terjadi kesalahan saat checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isCartOpen, openCart, closeCart, nama, setNama, nomorWa, setNomorWa, catatan, setCatatan, metodeId, setMetodeId, metodeList, handleCheckout, isCheckingOut }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
};
