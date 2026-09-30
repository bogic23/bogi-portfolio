<template>
  <footer class="relative overflow-hidden pt-12 pb-8">
    <!-- Gradient divider at top -->
    <div class="footer-divider" aria-hidden="true"></div>

    <!-- Subtle background glow -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-luxury-gold/4 blur-3xl pointer-events-none" aria-hidden="true"></div>

    <div class="container mx-auto px-6 relative z-10">
      <!-- Main row -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <!-- Logo -->
        <div
          class="flex items-center space-x-3 cursor-pointer group"
          @click="scrollToTop"
          role="button"
          aria-label="Back to top"
        >
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-luxury-gold to-luxury-bronze flex items-center justify-center shadow-gold-sm group-hover:shadow-gold-md transition-all duration-300 group-hover:scale-105">
            <span class="text-luxury-darker font-bold text-sm">AC</span>
          </div>
          <span class="font-display text-xl font-bold gold-gradient-static">Abednego Bogi</span>
        </div>

        <!-- Nav links -->
        <nav class="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="scrollToSection(item.id)"
            class="text-xs text-gray-600 hover:text-luxury-gold transition-colors duration-200 tracking-wide"
          >
            {{ item.label }}
          </button>
        </nav>

        <!-- Back to top -->
        <button
          @click="scrollToTop"
          class="back-to-top group"
          aria-label="Scroll to top"
          :class="{ 'is-visible': showBackToTop }"
        >
          <svg class="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
          </svg>
        </button>
      </div>

      <!-- Bottom row -->
      <div class="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-gray-600 text-xs">
          © {{ currentYear }} Abednego Bogi. All rights reserved.
        </p>

        <p class="text-gray-700 text-xs flex items-center gap-1.5">
          Crafted with
          <span class="text-red-500/80 animate-pulse">♥</span>
          using Vue.js & Tailwind CSS
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentYear  = new Date().getFullYear()
const showBackToTop = ref(false)

const navItems = [
  { id: 'home',       label: 'Home' },
  { id: 'about',      label: 'About' },
  { id: 'skills',     label: 'Skills' },
  { id: 'projects',   label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact',    label: 'Contact' },
]

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function scrollToSection(id) {
  if (route.name !== 'home') {
    await router.push('/')
    await nextTick()
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function handleScroll() {
  showBackToTop.value = window.scrollY > 400
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.footer-divider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(212,175,55,0.15) 20%,
    rgba(244,208,63,0.4) 50%,
    rgba(212,175,55,0.15) 80%,
    transparent 100%
  );
}

.back-to-top {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212,175,55,0.08);
  border: 1px solid rgba(212,175,55,0.2);
  color: #d4af37;
  transition: all 0.3s ease;
  opacity: 0.5;
}
.back-to-top.is-visible {
  opacity: 1;
}
.back-to-top:hover {
  background: rgba(212,175,55,0.15);
  border-color: rgba(212,175,55,0.4);
  box-shadow: 0 0 20px rgba(212,175,55,0.3);
  transform: translateY(-2px);
}
</style>
