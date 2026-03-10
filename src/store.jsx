import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const StoreContext = createContext(null);

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
};

export const PRODUCTS = [
  {
    id: 1,
    title: "Structured Wool Coat",
    category: "Women",
    price: 189,
    oldPrice: 239,
    colors: ["Black", "Stone", "Olive"],
    sizes: ["XS", "S", "M", "L"],
    tag: "Outerwear",
    featured: true,
    newArrival: true,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Premium women coat",
    description:
      "A sharp, tailored coat designed for modern city wear with clean structure and elevated texture.",
    story:
      "Built for cool evenings, layered mornings, and editorial silhouettes with timeless lines."
  },
  {
    id: 2,
    title: "Minimal Street Hoodie",
    category: "Men",
    price: 89,
    oldPrice: 109,
    colors: ["Black", "Ash", "Bone"],
    sizes: ["S", "M", "L", "XL"],
    tag: "Essentials",
    featured: true,
    newArrival: false,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Minimal hoodie",
    description:
      "Heavyweight premium hoodie with a relaxed shape and clean finishing for a refined street look.",
    story:
      "Soft inside, structured outside. Designed to carry volume without losing polish."
  },
  {
    id: 3,
    title: "Tailored Tech Trousers",
    category: "Men",
    price: 104,
    oldPrice: 129,
    colors: ["Charcoal", "Black"],
    sizes: ["S", "M", "L", "XL"],
    tag: "Bottoms",
    featured: true,
    newArrival: true,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1529333166433-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Tailored trousers",
    description:
      "Technical comfort with a refined cut. A hybrid trouser made for movement and presentation.",
    story:
      "This piece bridges luxury tailoring and everyday flexibility."
  },
  {
    id: 4,
    title: "Leather Edge Sneakers",
    category: "Footwear",
    price: 149,
    oldPrice: 179,
    colors: ["White", "Black"],
    sizes: ["39", "40", "41", "42", "43"],
    tag: "Footwear",
    featured: true,
    newArrival: true,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Modern sneakers",
    description:
      "A sleek luxury sneaker with clean paneling and a quiet statement silhouette.",
    story:
      "Engineered to sit between sport and premium casual dressing."
  },
  {
    id: 5,
    title: "Flow Satin Shirt",
    category: "Women",
    price: 94,
    oldPrice: 118,
    colors: ["Ivory", "Midnight", "Taupe"],
    sizes: ["XS", "S", "M", "L"],
    tag: "Tops",
    featured: false,
    newArrival: true,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Elegant satin shirt",
    description:
      "Fluid drape, sharp collar, and a polished sheen for a soft-luxury aesthetic.",
    story:
      "Made to transition from work to evening with zero effort."
  },
  {
    id: 6,
    title: "Signature Cargo Jacket",
    category: "Men",
    price: 132,
    oldPrice: 159,
    colors: ["Sand", "Black", "Moss"],
    sizes: ["S", "M", "L", "XL"],
    tag: "Outerwear",
    featured: false,
    newArrival: false,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Cargo jacket",
    description:
      "Utility details elevated through better structure, better fabric, and better proportions.",
    story:
      "A field-inspired jacket reworked for premium urban styling."
  },
  {
    id: 7,
    title: "Contour Knit Dress",
    category: "Women",
    price: 119,
    oldPrice: 139,
    colors: ["Graphite", "Cream"],
    sizes: ["XS", "S", "M", "L"],
    tag: "Dresses",
    featured: false,
    newArrival: true,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1458530970867-aaa3700e966d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Modern knit dress",
    description:
      "A body-skimming knit dress with subtle texture and understated sophistication.",
    story:
      "Minimal lines, strong presence, and effortless movement."
  },
  {
    id: 8,
    title: "Layered Crossbody Bag",
    category: "Accessories",
    price: 79,
    oldPrice: 95,
    colors: ["Black", "Stone"],
    sizes: ["One Size"],
    tag: "Accessories",
    featured: false,
    newArrival: false,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Crossbody bag",
    description:
      "Compact silhouette with premium hardware and a versatile day-to-night profile.",
    story:
      "A clean accessory designed to finish a modern wardrobe without noise."
  },
  {
    id: 9,
    title: "Oversized Graphic Tee",
    category: "Streetwear",
    price: 58,
    oldPrice: 68,
    colors: ["White", "Black", "Washed Grey"],
    sizes: ["S", "M", "L", "XL"],
    tag: "Streetwear",
    featured: false,
    newArrival: true,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Oversized tee",
    description:
      "Loose premium fit with bold placement graphics and a clean fashion-forward cut.",
    story:
      "A staple made expressive through scale and simplicity."
  },
  {
    id: 10,
    title: "Wide Leg Denim",
    category: "Women",
    price: 88,
    oldPrice: 109,
    colors: ["Indigo", "Washed Black"],
    sizes: ["24", "26", "28", "30", "32"],
    tag: "Denim",
    featured: false,
    newArrival: false,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Wide leg denim",
    description:
      "Soft structure and a wider fall create a strong silhouette with everyday comfort.",
    story:
      "Classic denim reframed through proportion and cleaner visual weight."
  },
  {
    id: 11,
    title: "Cropped Puffer Vest",
    category: "Women",
    price: 111,
    oldPrice: 136,
    colors: ["Black", "Silver"],
    sizes: ["XS", "S", "M", "L"],
    tag: "Outerwear",
    featured: false,
    newArrival: true,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Puffer vest",
    description:
      "An architectural cropped vest made to layer over knitwear, shirting, or fitted basics.",
    story:
      "Designed for shape, warmth, and contrast in a premium seasonal wardrobe."
  },
  {
    id: 12,
    title: "Monochrome Runner",
    category: "Footwear",
    price: 138,
    oldPrice: 165,
    colors: ["Onyx", "Sand"],
    sizes: ["39", "40", "41", "42", "43"],
    tag: "Footwear",
    featured: false,
    newArrival: true,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
    image2:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Modern runner",
    description:
      "A streamlined runner with a fashion-first profile and subtle technical influence.",
    story:
      "Built to move with a lighter visual footprint and premium everyday comfort."
  }
];

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => readStorage("fashion-cart", []));
  const [wishlist, setWishlist] = useState(() => readStorage("fashion-wishlist", []));
  const [user, setUser] = useState(() => readStorage("fashion-user", null));
  const [lastOrder, setLastOrder] = useState(() =>
    readStorage("fashion-last-order", null)
  );

  useEffect(() => writeStorage("fashion-cart", cart), [cart]);
  useEffect(() => writeStorage("fashion-wishlist", wishlist), [wishlist]);
  useEffect(() => writeStorage("fashion-user", user), [user]);
  useEffect(() => writeStorage("fashion-last-order", lastOrder), [lastOrder]);

  const addToCart = (product, qty = 1, size, color) => {
    const selectedSize = size || product.sizes?.[0] || "M";
    const selectedColor = color || product.colors?.[0] || "Black";
    const itemKey = `${product.id}-${selectedSize}-${selectedColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.itemKey === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.itemKey === itemKey
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }

      return [
        ...prev,
        {
          itemKey,
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          size: selectedSize,
          color: selectedColor,
          qty
        }
      ];
    });
  };

  const updateQty = (itemKey, qty) => {
    if (qty <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.itemKey === itemKey ? { ...item, qty } : item))
    );
  };

  const removeFromCart = (itemKey) => {
    setCart((prev) => prev.filter((item) => item.itemKey !== itemKey));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const login = (email) => {
    const name = email?.split("@")?.[0] || "Client";
    setUser({
      name: `${name.charAt(0).toUpperCase() + name.slice(1)} (Demo)`,
      email,
      demo: true
    });
  };

  const logout = () => setUser(null);

  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cart]
  );

  const value = {
    cart,
    wishlist,
    user,
    lastOrder,
    setLastOrder,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    login,
    logout,
    cartCount,
    cartTotal
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return value;
};

