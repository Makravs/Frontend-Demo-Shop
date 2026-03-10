import React from "react";
import { motion } from "framer-motion";

const transition = {
  duration: 0.5,
  ease: [0.19, 1, 0.22, 1]
};

const variants = {
  initial: { opacity: 0, y: 22, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 12, scale: 0.995 }
};

export function PageTransition({ children, className = "" }) {
  return (
    <motion.main
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
    >
      {children}
    </motion.main>
  );
}

