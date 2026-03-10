import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore, PRODUCTS } from "../store";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.97 }
};

export function QuickViewModal({ productId, onClose }) {
  const product = useMemo(
    () => PRODUCTS.find((item) => item.id === productId),
    [productId]
  );

  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [size, setSize] = useState(product?.sizes?.[0] || "M");
  const [color, setColor] = useState(product?.colors?.[0] || "Black");
  const [qty, setQty] = useState(1);

  const isOpen = Boolean(productId && product);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes?.[0] || "M");
    setColor(product.colors?.[0] || "Black");
    setQty(1);
  }, [product]);

  const wished = product ? wishlist.includes(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty, size, color);
    onClose?.();
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product.id);
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          className="quickview-backdrop"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
          aria-label={`Quick view for ${product.title}`}
        >
          <motion.div
            className="quickview-modal"
            variants={modalVariants}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <button
              className="quickview-close"
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
            >
              ✕
            </button>

            <div className="quickview-grid">
              <div className="quickview-media">
                <img src={product.image} alt={product.imageAlt} />
              </div>

              <div className="quickview-content">
                <span className="eyebrow">{product.tag}</span>
                <h2>{product.title}</h2>
                <div className="price-row">
                  <strong>${product.price.toFixed(2)}</strong>
                  <span className="old-price">${product.oldPrice.toFixed(2)}</span>
                </div>
                <p className="muted quickview-description">{product.description}</p>

                <div className="selector-group">
                  <label>Size</label>
                  <div className="selector-row">
                    {product.sizes.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`selector-pill ${size === item ? "active" : ""}`}
                        onClick={() => setSize(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="selector-group">
                  <label>Color</label>
                  <div className="selector-row">
                    {product.colors.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`selector-pill ${color === item ? "active" : ""}`}
                        onClick={() => setColor(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="qty-row">
                  <label>Quantity</label>
                  <div className="qty-box">
                    <button
                      type="button"
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    >
                      -
                    </button>
                    <span>{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="product-actions wide quickview-actions">
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={handleAddToCart}
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleToggleWishlist}
                  >
                    {wished ? "Saved to wishlist" : "Add to wishlist"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

