<template>
  <div class="fixed inset-0 z-[200] bg-luxury-darker flex flex-col items-center justify-center">
    <!-- Ambient glow -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none"
      aria-hidden="true"
    ></div>

    <!-- Logo -->
    <div class="loader-ring relative w-20 h-20 mb-8">
      <div
        class="absolute inset-0 rounded-full bg-gradient-to-br from-luxury-gold to-luxury-bronze flex items-center justify-center"
      >
        <span class="text-luxury-darker font-bold text-2xl">AC</span>
      </div>
    </div>

    <p class="font-display text-2xl font-bold gold-gradient-static tracking-wide">Abednego Bogi</p>
    <p class="text-gray-600 text-xs tracking-[0.3em] uppercase mt-3">
      Portfolio<span class="loading-dots" aria-hidden="true"></span>
    </p>

    <!-- Progress bar -->
    <div
      class="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden mt-8"
      role="progressbar"
      aria-label="Loading page"
    >
      <div class="loader-bar h-full w-1/3 rounded-full"></div>
    </div>
  </div>
</template>

<style scoped>
.loader-ring::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #d4af37, #f4d03f, #cd7f32, transparent 70%, #d4af37);
  animation: loader-spin 1.4s linear infinite;
  z-index: -1;
}

@keyframes loader-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loader-bar {
  background: linear-gradient(90deg, #d4af37, #f4d03f, #d4af37);
  background-size: 200% auto;
  animation:
    loader-slide 1.2s ease-in-out infinite,
    loader-shimmer 2s linear infinite;
}

@keyframes loader-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(300%);
  }
}

@keyframes loader-shimmer {
  from {
    background-position: 200% center;
  }
  to {
    background-position: -200% center;
  }
}

.loading-dots::after {
  content: '';
  animation: loader-dots 1.2s steps(4) infinite;
}

@keyframes loader-dots {
  0% {
    content: '';
  }
  25% {
    content: '.';
  }
  50% {
    content: '..';
  }
  75% {
    content: '...';
  }
}
</style>
