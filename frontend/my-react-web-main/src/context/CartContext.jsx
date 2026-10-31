import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { cartKey, id, name, price, image, qty, size, color }
  const [wishlist, setWishlist] = useState([]); // array of product ids
  const [promo, setPromo] = useState(null); // { code, percent }

  function addToCart(product, options = {}) {
    const size = options.size || null;
    const color = options.color || null;
    const cartKey = `${product.id}__${size}__${color}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (existing) {
        return prev.map((i) =>
          i.cartKey === cartKey ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, size, color, cartKey, qty: 1 }];
    });
  }

  function removeFromCart(cartKey) {
    setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
  }

  function clearCart() {
    setItems([]);
    setPromo(null);
  }

  function updateQty(cartKey, qty) {
    if (qty < 1) return removeFromCart(cartKey);
    setItems((prev) => prev.map((i) => (i.cartKey === cartKey ? { ...i, qty } : i)));
  }

  function toggleWishlist(id) {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  }

  function applyPromoCode(code) {
    const normalized = code.trim().toUpperCase();
    if (normalized === "SAVE20") {
      setPromo({ code: normalized, percent: 20 });
      return { success: true, message: "Promo code applied! 20% off." };
    }
    if (normalized === "SAVE10") {
      setPromo({ code: normalized, percent: 10 });
      return { success: true, message: "Promo code applied! 10% off." };
    }
    setPromo(null);
    return { success: false, message: "Invalid promo code." };
  }

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  const discountAmount = useMemo(
    () => (promo ? Math.round(subtotal * (promo.percent / 100)) : 0),
    [subtotal, promo]
  );

  const deliveryFee = items.length > 0 ? 15 : 0;

  const totalPrice = useMemo(
    () => Math.max(0, subtotal - discountAmount + deliveryFee),
    [subtotal, discountAmount, deliveryFee]
  );

  const value = {
    items,
    wishlist,
    addToCart,
    removeFromCart,
    clearCart,
    updateQty,
    toggleWishlist,
    totalItems,
    subtotal,
    promo,
    discountAmount,
    deliveryFee,
    totalPrice,
    applyPromoCode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
