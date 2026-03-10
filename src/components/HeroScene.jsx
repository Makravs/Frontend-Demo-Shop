import React from "react";
import { motion } from "framer-motion";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { Link } from "react-router-dom";

export function HeroScene() {
  const progress = useScrollProgress();
  const parallax = progress * -40;
  const textLift = progress * -10;
  const veilOpacity = Math.min(0.6, progress * 0.8);

  return (
    <section className="hero hero-cinematic">
      <div
        className="hero-bg hero-bg-layer"
        style={{ transform: `translateY(${parallax}px)` }}
      >
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=80"
          alt="Editorial fashion campaign background"
        />
      </div>

      <div
        className="hero-overlay hero-overlay-veil"
        style={{ opacity: 0.65 + veilOpacity * 0.35 }}
      />

      <div
        className="container hero-content hero-layered"
        style={{ transform: `translateY(${textLift}px)` }}
      >
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.55, ease: "easeOut" }}
        >
          Modern editorial commerce
        </motion.span>

        <motion.div
          className="hero-heading-block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="jumbo">
            Crafted for presence.
            <br />
            Built for movement.
          </h1>
          <p className="hero-subtitle">
            Demo Shop is a cinematic fashion surface for modern ecommerce&mdash;
            oversized typography, calm luxury, and an interface shaped for story.
          </p>
        </motion.div>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: "easeOut" }}
        >
          <Link to="/shop" className="primary-btn">
            Shop the collection
          </Link>
          <Link to="/lookbook" className="secondary-btn">
            Enter lookbook
          </Link>
        </motion.div>

        <motion.div
          className="hero-floating-card"
          initial={{ opacity: 0, y: 22, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.65, duration: 0.6, ease: "easeOut" }}
        >
          <div className="hero-floating-body">
            <span className="eyebrow small">Season 01 · Demo Shop</span>
            <p className="muted">
              A directional starter built for fashion launches, quiet luxury brands,
              and editorial-forward ecommerce experiments.
            </p>
          </div>
          <div className="hero-floating-meta">
            <div>
              <strong>12</strong>
              <span>Core pieces</span>
            </div>
            <div>
              <strong>Instant</strong>
              <span>Frontend demo</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
        >
          <span className="scroll-indicator-line" />
          <span>Scroll to discover</span>
        </motion.div>
      </div>
    </section>
  );
}

