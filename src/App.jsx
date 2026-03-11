import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, StoreProvider, useStore } from "./store";
import { PageTransition } from "./components/PageTransition";
import { HeroScene } from "./components/HeroScene";
import { Reveal } from "./components/Reveal";
import { SectionIntro } from "./components/SectionIntro";
import { QuickViewModal } from "./components/QuickViewModal";

const money = (value) => `$${value.toFixed(2)}`;

const categories = [
  {
    title: "Women",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    caption: "Strong silhouettes and soft luxury."
  },
  {
    title: "Men",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    caption: "Relaxed tailoring with premium weight."
  },
  {
    title: "Streetwear",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    caption: "Volume, graphic attitude, and cleaner edge."
  },
  {
    title: "Accessories",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    caption: "Quiet details that complete the wardrobe."
  }
];

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return null;
}

function AppShell() {
  const location = useLocation();
  const [quickViewId, setQuickViewId] = useState(null);
  const [showDemoBanner, setShowDemoBanner] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return localStorage.getItem("atelier-demo-banner-dismissed") !== "true";
    } catch {
      return true;
    }
  });

  const dismissBanner = () => {
    setShowDemoBanner(false);
    try {
      localStorage.setItem("atelier-demo-banner-dismissed", "true");
    } catch {
      // ignore
    }
  };

  return (
    <>
      <ScrollToTop />
      <AnimatePresence>
        {showDemoBanner && (
          <motion.div
            className="demo-banner"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="container demo-banner-inner">
              <div className="demo-banner-copy">
                <span className="demo-pill">Demo</span>
                <p>
                  This is a front-end Demo Shop experience. All flows, carts and
                  logins are for presentation only.
                </p>
              </div>
              <button
                type="button"
                className="ghost-btn demo-banner-close"
                onClick={dismissBanner}
                aria-label="Dismiss demo notice"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage onQuickView={setQuickViewId} />} />
          <Route path="/shop" element={<ShopPage onQuickView={setQuickViewId} />} />
          <Route path="/product/:id" element={<ProductPage onQuickView={setQuickViewId} />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage onQuickView={setQuickViewId} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/lookbook" element={<LookbookPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage onQuickView={setQuickViewId} />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <QuickViewModal productId={quickViewId} onClose={() => setQuickViewId(null)} />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </StoreProvider>
  );
}

function PageShell({ children }) {
  return <PageTransition className="page">{children}</PageTransition>;
}

function Navbar() {
  const { cartCount, wishlist, user, logout } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => {
      setScrolled(window.scrollY > 24);
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container nav-inner">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark">D</span>
          <span>Demo Shop</span>
        </Link>

        <nav className="nav-links desktop-only">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/new-arrivals">New Arrivals</NavLink>
          <NavLink to="/lookbook">Lookbook</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="nav-actions desktop-only">
          <NavLink to="/wishlist" className="icon-pill">
            Wishlist <span>{wishlist.length}</span>
          </NavLink>
          <NavLink to="/cart" className="icon-pill">
            Cart <span>{cartCount}</span>
          </NavLink>
          {user ? (
            <>
              <NavLink to="/account" className="icon-pill">
                {user.name}
              </NavLink>
              <button className="ghost-btn" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="cta-link underline-link">
              Sign in
            </NavLink>
          )}
        </div>

        <button
          type="button"
          className="mobile-toggle mobile-only"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu mobile-only"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <NavLink to="/" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/shop" onClick={closeMenu}>
              Shop
            </NavLink>
            <NavLink to="/new-arrivals" onClick={closeMenu}>
              New Arrivals
            </NavLink>
            <NavLink to="/lookbook" onClick={closeMenu}>
              Lookbook
            </NavLink>
            <NavLink to="/about" onClick={closeMenu}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={closeMenu}>
              Contact
            </NavLink>
            <NavLink to="/wishlist" onClick={closeMenu}>
              Wishlist ({wishlist.length})
            </NavLink>
            <NavLink to="/cart" onClick={closeMenu}>
              Cart ({cartCount})
            </NavLink>
            {user ? (
              <>
                <NavLink to="/account" onClick={closeMenu}>
                  Account
                </NavLink>
                <button
                  className="mobile-logout"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={closeMenu}>
                Sign in
              </NavLink>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">D</span>
            <span>Demo Shop</span>
          </div>
          <p className="muted">
            Premium modern fashion with an editorial ecommerce experience.
          </p>
        </div>

        <div>
          <h4>Navigate</h4>
          <div className="footer-links">
            <Link to="/shop">Shop</Link>
            <Link to="/new-arrivals">New Arrivals</Link>
            <Link to="/lookbook">Lookbook</Link>
            <Link to="/about">About</Link>
          </div>
        </div>

        <div>
          <h4>Help</h4>
          <div className="footer-links">
            <Link to="/contact">Contact</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/login">Account</Link>
          </div>
        </div>

        <div>
          <h4>Newsletter</h4>
          <p className="muted">Get drops, edits, and private release notices.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" />
            <button className="primary-btn" type="submit">
              Join
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}

function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.id);

  const handleQuickView = () => {
    if (onQuickView) {
      onQuickView(product.id);
    }
  };

  return (
    <Reveal className="product-card">
      <Link to={`/product/${product.id}`} className="product-media">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          className="product-image primary"
        />
        {product.image2 && (
          <img
            src={product.image2}
            alt={product.imageAlt}
            loading="lazy"
            className="product-image secondary"
          />
        )}
        <span className="product-tag">{product.tag}</span>
      </Link>

      <div className="product-copy">
        <div className="product-topline">
          <div>
            <h3>{product.title}</h3>
            <p className="muted">{product.category}</p>
          </div>
          <strong>{money(product.price)}</strong>
        </div>

        <p className="muted">{product.description}</p>

        <div className="product-actions">
          <button
            className="secondary-btn"
            onClick={() =>
              addToCart(
                product,
                1,
                product.sizes?.[0] || "M",
                product.colors?.[0] || "Black"
              )
            }
          >
            Add to cart
          </button>
          <button className="ghost-btn" onClick={() => toggleWishlist(product.id)}>
            {wished ? "Saved" : "Wishlist"}
          </button>
          <button className="ghost-btn subtle" onClick={handleQuickView}>
            Quick view
          </button>
        </div>
      </div>
    </Reveal>
  );
}

function HomePage({ onQuickView }) {
  const featured = PRODUCTS.filter((p) => p.featured);
  const arrivals = PRODUCTS.filter((p) => p.newArrival).slice(0, 4);

  return (
    <PageShell>
      <HeroScene />

      <section className="marquee-block">
        <div className="marquee-text">
          <span>ESSENTIALS · OUTERWEAR · FOOTWEAR · STREETWEAR · NEW SEASON ·</span>
          <span>ESSENTIALS · OUTERWEAR · FOOTWEAR · STREETWEAR · NEW SEASON ·</span>
          <span>ESSENTIALS · OUTERWEAR · FOOTWEAR · STREETWEAR · NEW SEASON ·</span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionIntro
            eyebrow="Collections"
            title="Built like a campaign, sold like a modern store."
            description="Large image storytelling, premium typography, and direct paths into high-intent shopping."
          />

          <div className="collection-grid">
            {categories.map((item) => (
              <Reveal key={item.title} className="collection-card">
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="collection-overlay" />
                <div className="collection-copy">
                  <h3>{item.title}</h3>
                  <p>{item.caption}</p>
                  <Link to={`/shop?category=${encodeURIComponent(item.title)}`}>
                    View edit
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section split-section">
        <div className="container split-grid">
          <Reveal className="split-copy">
            <span className="eyebrow">Story section</span>
            <h2>Huge typography, calm color, stronger visual rhythm.</h2>
            <p className="muted">
              This starter is intentionally art-directed instead of feeling like a
              generic ecommerce template. The homepage sells atmosphere first,
              then products, then conversion.
            </p>
            <p className="muted">
              Use these blocks as the base of a launch page: long-form imagery,
              strong type, and clear paths back to the catalog.
            </p>
            <Link to="/about" className="secondary-btn">
              Read the brand story
            </Link>
          </Reveal>

          <Reveal className="split-media">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80"
              alt="Editorial fashion block"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      <section className="section statement-section">
        <div className="container">
          <Reveal className="statement-card">
            <span className="eyebrow">Editorial block</span>
            <h2>
              “Move less like a template. Feel more like a fashion launch.”
            </h2>
            <p className="muted">
              This build is calibrated for cinematic front-ends: oversized headlines,
              generous breathing room, and soft motion that stays out of the way of
              the clothes.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section dark-panel-section">
        <div className="container">
          <SectionIntro
            eyebrow="Featured"
            title="Selected pieces"
            description="Refined cards with direct purchase actions and room to scale into a bigger catalog."
            align="center"
          />
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section editorial-banner">
        <div className="container editorial-banner-inner">
          <Reveal className="editorial-banner-media">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80"
              alt="Panoramic fashion scene"
              loading="lazy"
            />
            <div className="editorial-banner-overlay" />
          </Reveal>
          <Reveal className="editorial-banner-copy">
            <span className="eyebrow">Interlude</span>
            <h2>Quiet luxury, sharper rhythm.</h2>
            <p className="muted">
              A wide cinematic moment between product grids&mdash;designed to slow the
              scroll and reset attention on story before the next edit.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionIntro
            eyebrow="New season"
            title="Fresh arrivals"
            description="Newer silhouettes, lighter stories, faster entry to product detail pages."
          />
          <div className="product-grid">
            {arrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section lookbook-teaser">
        <div className="container teaser-grid">
          <Reveal className="teaser-media">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80"
              alt="Lookbook teaser"
            />
          </Reveal>

          <Reveal className="teaser-copy">
            <span className="eyebrow">Lookbook</span>
            <h2>Campaign mood with shopping intent.</h2>
            <p className="muted">
              Blend image-led narratives with real purchasing flow. That is the
              best place to keep the site beautiful without sacrificing conversion.
            </p>
            <Link to="/lookbook" className="primary-btn">
              Open lookbook
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

function ShopPage({ onQuickView }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "All";
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const categoryList = useMemo(
    () => ["All", ...new Set(PRODUCTS.map((p) => p.category))],
    []
  );

  const filtered = useMemo(() => {
    let items = [...PRODUCTS];

    if (categoryFromUrl !== "All") {
      items = items.filter((item) => item.category === categoryFromUrl);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.tag.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term)
      );
    }

    switch (sort) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        items.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
        break;
      default:
        items.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return items;
  }, [categoryFromUrl, search, sort]);

  return (
    <PageShell>
      <section className="page-hero compact">
        <div className="container">
          <span className="eyebrow">Shop</span>
          <h1>Discover the collection</h1>
          <p className="muted">
            Filter by category, search product names, and sort the catalog.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filters-bar">
            <div className="filter-row">
              {categoryList.map((item) => (
                <button
                  key={item}
                  className={`filter-chip ${categoryFromUrl === item ? "active" : ""}`}
                  onClick={() => setSearchParams(item === "All" ? {} : { category: item })}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="filter-tools">
              <input
                className="input"
                type="text"
                placeholder="Search pieces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="newest">New arrivals</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>

          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <h3>No products found</h3>
              <p className="muted">Try another category or search term.</p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function ProductPage({ onQuickView }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const product = PRODUCTS.find((item) => item.id === Number(id));

  const [size, setSize] = useState(product?.sizes?.[0] || "M");
  const [color, setColor] = useState(product?.colors?.[0] || "Black");
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <PageShell>
        <section className="section">
          <div className="container empty-state">
            <h2>Product not found</h2>
            <button className="primary-btn" onClick={() => navigate("/shop")}>
              Back to shop
            </button>
          </div>
        </section>
      </PageShell>
    );
  }

  const related = PRODUCTS.filter(
    (item) => item.category === product.category && item.id !== product.id
  ).slice(0, 3);

  return (
    <PageShell>
      <section className="section">
        <div className="container product-detail">
          <Reveal className="product-gallery">
            <img src={product.image} alt={product.imageAlt} />
          </Reveal>

          <Reveal className="product-panel">
            <span className="eyebrow">{product.tag}</span>
            <h1>{product.title}</h1>
            <div className="price-row">
              <strong>{money(product.price)}</strong>
              <span className="old-price">{money(product.oldPrice)}</span>
            </div>

            <p className="muted">{product.description}</p>
            <p className="product-story">{product.story}</p>

            <div className="selector-group">
              <label>Size</label>
              <div className="selector-row">
                {product.sizes.map((item) => (
                  <button
                    key={item}
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
                <button onClick={() => setQty((prev) => Math.max(1, prev - 1))}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty((prev) => prev + 1)}>+</button>
              </div>
            </div>

            <div className="product-actions wide">
              <button
                className="primary-btn"
                onClick={() => addToCart(product, qty, size, color)}
              >
                Add to cart
              </button>
              <button className="secondary-btn" onClick={() => toggleWishlist(product.id)}>
                {wishlist.includes(product.id) ? "Saved to wishlist" : "Add to wishlist"}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section dark-panel-section">
        <div className="container">
          <SectionIntro
            eyebrow="Related"
            title="You may also like"
            description="Additional pieces from the same visual universe."
          />
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function NewArrivalsPage({ onQuickView }) {
  const arrivals = PRODUCTS.filter((item) => item.newArrival);

  return (
    <PageShell>
      <section className="page-hero compact">
        <div className="container">
          <span className="eyebrow">New arrivals</span>
          <h1>Fresh pieces. Same premium direction.</h1>
          <p className="muted">This page focuses new products into a cleaner flow.</p>
        </div>
      </section>

      <section className="section">
        <div className="container product-grid">
          {arrivals.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function WishlistPage({ onQuickView }) {
  const { wishlist } = useStore();
  const items = PRODUCTS.filter((item) => wishlist.includes(item.id));

  return (
    <PageShell>
      <section className="page-hero compact">
        <div className="container">
          <span className="eyebrow">Wishlist</span>
          <h1>Saved for later</h1>
          <p className="muted">Quietly collect your favorites before checkout.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <div className="empty-state">
              <h3>Your wishlist is empty</h3>
              <p className="muted">Save a few pieces to find them faster later.</p>
              <Link to="/shop" className="primary-btn">
                Browse shop
              </Link>
            </div>
          ) : (
            <div className="product-grid">
              {items.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function CartPage() {
  const { cart, cartTotal, updateQty, removeFromCart } = useStore();

  return (
    <PageShell>
      <section className="page-hero compact">
        <div className="container">
          <span className="eyebrow">Cart</span>
          <h1>Your selected pieces</h1>
          <p className="muted">Review sizes, colors, and quantities before checkout.</p>
        </div>
      </section>

      <section className="section">
        <div className="container cart-layout">
          <div className="cart-list">
            {cart.length === 0 ? (
              <div className="empty-state">
                <h3>Your cart is empty</h3>
                <p className="muted">Start with the collection and build your look.</p>
                <Link to="/shop" className="primary-btn">
                  Continue shopping
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.itemKey} className="cart-item">
                  <img src={item.image} alt={item.title} />
                  <div className="cart-copy">
                    <h3>{item.title}</h3>
                    <p className="muted">
                      Size {item.size} · Color {item.color}
                    </p>
                    <strong>{money(item.price)}</strong>
                  </div>
                  <div className="cart-controls">
                    <div className="qty-box">
                      <button onClick={() => updateQty(item.itemKey, item.qty - 1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.itemKey, item.qty + 1)}>+</button>
                    </div>
                    <button className="ghost-btn" onClick={() => removeFromCart(item.itemKey)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="summary-card">
            <h3>Order summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{money(cartTotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>{cart.length ? "Free" : "$0.00"}</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>{money(cartTotal)}</strong>
            </div>
            <Link to="/checkout" className={`primary-btn ${cart.length ? "" : "disabled-link"}`}>
              Proceed to checkout
            </Link>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, user, clearCart, setLastOrder } = useStore();
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    country: "",
    cardName: "",
    cardNumber: "",
    exp: "",
    cvv: ""
  });

  const submit = (e) => {
    e.preventDefault();
    if (!cart.length) return;

    const order = {
      number: `ORD-${String(Date.now()).slice(-6)}`,
      total: cartTotal,
      items: cart.length,
      customer: form.fullName || "Client",
      createdAt: new Date().toLocaleString()
    };

    setLastOrder(order);
    clearCart();
    navigate("/order-confirmation");
  };

  return (
    <PageShell>
      <section className="page-hero compact">
        <div className="container">
          <span className="eyebrow">Checkout</span>
          <h1>Secure your order</h1>
          <p className="muted">Demo checkout flow ready for future backend integration.</p>
        </div>
      </section>

      <section className="section">
        <div className="container checkout-layout">
          <form className="checkout-form" onSubmit={submit}>
            <div className="form-card">
              <h3>Shipping details</h3>
              <div className="form-grid">
                <input
                  className="input"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
                <input
                  className="input"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <input
                  className="input wide"
                  placeholder="Street address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-card">
              <h3>Payment</h3>
              <div className="form-grid">
                <input
                  className="input"
                  placeholder="Name on card"
                  value={form.cardName}
                  onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                  required
                />
                <input
                  className="input wide"
                  placeholder="Card number"
                  value={form.cardNumber}
                  onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="MM/YY"
                  value={form.exp}
                  onChange={(e) => setForm({ ...form, exp: e.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="CVV"
                  value={form.cvv}
                  onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                  required
                />
              </div>
            </div>

            <button className="primary-btn" type="submit" disabled={!cart.length}>
              Place order
            </button>
          </form>

          <aside className="summary-card">
            <h3>Summary</h3>
            {cart.map((item) => (
              <div className="summary-line" key={item.itemKey}>
                <span>
                  {item.title} × {item.qty}
                </span>
                <strong>{money(item.price * item.qty)}</strong>
              </div>
            ))}
            <div className="summary-row total">
              <span>Total</span>
              <strong>{money(cartTotal)}</strong>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function OrderConfirmationPage() {
  const { lastOrder } = useStore();

  return (
    <PageShell>
      <section className="section">
        <div className="container confirmation-card">
          <span className="eyebrow">Order confirmed</span>
          <h1>Thank you for your purchase.</h1>
          <p className="muted">
            Your demo order was created successfully. This page is ready to connect
            later to a real backend and payment provider.
          </p>

          <div className="summary-card slim">
            <div className="summary-row">
              <span>Order number</span>
              <strong>{lastOrder?.number || "ORD-DEMO"}</strong>
            </div>
            <div className="summary-row">
              <span>Customer</span>
              <strong>{lastOrder?.customer || "Client"}</strong>
            </div>
            <div className="summary-row">
              <span>Items</span>
              <strong>{lastOrder?.items || 0}</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>{money(lastOrder?.total || 0)}</strong>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/shop" className="primary-btn">
              Continue shopping
            </Link>
            <Link to="/account" className="secondary-btn">
              Go to account
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function AboutPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>Premium fashion, clearer composition, quieter confidence.</h1>
          <p className="muted hero-narrow">
            Demo Shop is a fictional brand concept built to show how a modern
            fashion website can feel editorial without losing ecommerce clarity.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split-grid reverse">
          <Reveal className="split-media">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80"
              alt="Brand image"
            />
          </Reveal>
          <Reveal className="split-copy">
            <span className="eyebrow">Craft</span>
            <h2>Made for a more cinematic front-end direction.</h2>
            <p className="muted">
              The purpose of this build is to give you a premium starting point
              with a strong visual hierarchy, smooth motion support, product flow,
              wishlist, cart, and checkout structure.
            </p>
            <p className="muted">
              From here, Cursor can push the site into more advanced storytelling:
              sticky scenes, animated image transitions, WebGL touches, smooth scrolling,
              and richer campaign pages.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container principles-grid">
          <Reveal className="principle-card">
            <span className="eyebrow small">Principle I</span>
            <h3>Craft</h3>
            <p className="muted">
              Quiet, intentional layouts with a focus on texture, light, and the way
              garments occupy space on screen.
            </p>
          </Reveal>
          <Reveal className="principle-card" delay={0.05}>
            <span className="eyebrow small">Principle II</span>
            <h3>Movement</h3>
            <p className="muted">
              Motion that feels like camera work rather than UI tricks&mdash;subtle,
              directional, and always in service of the story.
            </p>
          </Reveal>
          <Reveal className="principle-card" delay={0.1}>
            <span className="eyebrow small">Principle III</span>
            <h3>Modern Form</h3>
            <p className="muted">
              A system of cards, panels, and typography tuned for luxury brands,
              ready to be customized without becoming generic.
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

function LookbookPage() {
  const shots = [
    {
      src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80",
      label: "Edit I",
      title: "Soft structure, strong silhouettes."
    },
    {
      src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80",
      label: "Edit II",
      title: "Layered tailoring in motion."
    },
    {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80",
      label: "Edit III",
      title: "Evening light and satin volume."
    },
    {
      src: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80",
      label: "Edit IV",
      title: "Wide denim and quiet streets."
    }
  ];

  return (
    <PageShell>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Lookbook</span>
          <h1>Campaign mood in a shopping-ready environment.</h1>
          <p className="muted hero-narrow">
            A lookbook page lets you stay visually bold while still guiding the user
            into product discovery.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionIntro
            eyebrow="Season edit"
            title="A sequence of scenes instead of a static grid."
            description="Use the lookbook to choreograph how outfits, fabrics, and silhouettes enter the frame. Each image can anchor into real product edits."
          />
        </div>
      </section>

      <section className="section">
        <div className="container lookbook-grid">
          {shots.map((shot, index) => (
            <Reveal
              key={shot.src}
              className={`lookbook-card ${index === 0 ? "large" : ""}`}
            >
              <img src={shot.src} alt={shot.title} loading="lazy" />
              <div className="lookbook-copy">
                <span className="eyebrow">{shot.label}</span>
                <h3>{shot.title}</h3>
                <Link to="/shop" className="underline-link">
                  Shop the edit
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useStore();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate("/account");
  };

  return (
    <PageShell>
      <section className="section auth-section">
        <div className="container auth-grid">
          <Reveal className="auth-copy">
            <span className="eyebrow">Account</span>
            <h1>Sign in to continue your fashion journey.</h1>
            <p className="muted">
              This is a front-end demo login. Later you can connect it to a real
              authentication service.
            </p>
          </Reveal>

          <Reveal className="auth-card">
            <h3>Welcome back</h3>
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="primary-btn" type="submit" onClick={submit}>
              Sign in
            </button>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

function AccountPage() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  return (
    <PageShell>
      <section className="section">
        <div className="container">
          {user ? (
            <Reveal className="account-card">
              <span className="eyebrow">Account</span>
              <h1>Hello, {user.name}</h1>
              <p className="muted">
                Email: {user.email} · Demo environment (no real purchases)
              </p>
              <div className="hero-actions">
                <Link to="/wishlist" className="secondary-btn">
                  Open wishlist
                </Link>
                <Link to="/cart" className="secondary-btn">
                  Open cart
                </Link>
                <button
                  className="primary-btn"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Log out
                </button>
              </div>
            </Reveal>
          ) : (
            <div className="empty-state">
              <h2>You are not signed in</h2>
              <Link to="/login" className="primary-btn">
                Go to login
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function ContactPage() {
  return (
    <PageShell>
      <section className="page-hero compact">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>Support, inquiries, and private styling requests.</h1>
          <p className="muted">
            Keep this page simple now, then expand it later into a full help center.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-card">
              <h3>Send a message</h3>
              <div className="form-grid">
                <input className="input" placeholder="Name" />
                <input className="input" placeholder="Email" />
                <input className="input wide" placeholder="Subject" />
                <textarea className="input wide textarea" placeholder="Message" rows="6" />
              </div>
            </div>
            <button className="primary-btn" type="submit">
              Submit
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function NotFoundPage() {
  return (
    <PageShell>
      <section className="section">
        <div className="container empty-state">
          <span className="eyebrow">404</span>
          <h1>Page not found</h1>
          <p className="muted">The page you tried to open does not exist.</p>
          <Link to="/" className="primary-btn">
            Back home
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

