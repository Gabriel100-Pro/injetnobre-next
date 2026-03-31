'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// --- Tipos ---
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  boxType?: string;
  image?: string;
  imageAlt?: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

// --- Constantes ---
const CART_KEY = 'injetnobre_cart_v1';

// --- Helpers ---
function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.map((item: Partial<CartItem>) => ({
      id: item.id || Date.now().toString(36),
      name: item.name || 'Produto',
      price: Number(item.price) || 0,
      quantity: Math.max(1, Number(item.quantity) || 1),
      boxType: typeof item.boxType === 'string' ? item.boxType : undefined,
      image: typeof item.image === 'string' ? item.image : undefined,
      imageAlt: typeof item.imageAlt === 'string' ? item.imageAlt : 'Imagem do produto',
    }));
  } catch {
    return [];
  }
}

// --- Context ---
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Carrega do localStorage na montagem
  useEffect(() => {
    setItems(loadCartFromStorage());
  }, []);

  // Salva no localStorage sempre que items mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items]);

  // Bloqueia scroll quando carrinho está aberto
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }, [isOpen]);

  const addItem = useCallback((newItem: Omit<CartItem, 'id'>) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.name === newItem.name && i.boxType === newItem.boxType
      );
      if (existing) {
        return prev.map(i =>
          i.id === existing.id
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, { ...newItem, id: Date.now().toString(36) }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, removeItem, clearCart, isOpen, openCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
}
