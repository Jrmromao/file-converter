// Premium animation variants for Framer Motion

export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
}

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
}

export const hoverScale = {
  whileHover: { scale: 1.05, y: -2 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2, ease: "easeOut" }
}

export const floatingAnimation = {
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(59, 130, 246, 0.3)",
      "0 0 40px rgba(59, 130, 246, 0.5)",
      "0 0 20px rgba(59, 130, 246, 0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const slideUpModal = {
  initial: { opacity: 0, y: 100, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 100, scale: 0.9 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
}

export const morphButton = {
  whileHover: {
    borderRadius: "24px",
    transition: { duration: 0.3, ease: "easeOut" }
  },
  whileTap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
}

export const progressFill = (value: number) => ({
  initial: { width: 0 },
  animate: { width: `${value}%` },
  transition: { duration: 1, ease: "easeOut" }
})

export const typewriter = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

export const typewriterChar = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

export const magneticHover = {
  whileHover: {
    scale: 1.1,
    rotate: [0, -1, 1, 0],
    transition: { duration: 0.3 }
  }
}

export const liquidButton = {
  whileHover: {
    borderRadius: ["12px", "20px", "12px"],
    transition: { duration: 0.6, repeat: Infinity }
  }
}

export const glowPulse = {
  animate: {
    filter: [
      "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))",
      "drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))",
      "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}
