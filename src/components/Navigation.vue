<template>
  <nav
    class="fixed top-0 w-full z-50 transition-all duration-500"
    :class="scrolled ? 'nav-scrolled py-3' : 'py-6 bg-transparent'"
  >
    <div class="container mx-auto px-6">
      <div class="flex justify-between items-center">

        <!-- Logo -->
        <div
          class="flex items-center space-x-3 group cursor-pointer select-none"
          @click="scrollToSection('home')"
          role="button"
          aria-label="Go to top"
        >
          <div class="logo-ring relative w-11 h-11">
            <div class="logo-inner w-full h-full rounded-full bg-gradient-to-br from-luxury-gold to-luxury-bronze flex items-center justify-center">
              <span class="text-luxury-darker font-bold text-base relative z-10">AC</span>
            </div>
          </div>
          <span class="font-display text-xl font-bold gold-gradient hidden sm:block tracking-wide">
            Alex Chen
          </span>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-1">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="scrollToSection(item.id)"
            class="nav-link relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
            :class="activeSection === item.id
              ? 'text-luxury-gold'
              : 'text-gray-400 hover:text-white'"
          >
            {{ item.label }}
            <!-- Active indicator -->
            <span
              class="nav-indicator absolute inset-x-2 -bottom-0.5 h-px bg-luxury-gold rounded-full transition-all duration-300"
              :class="activeSection === item.id ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"
            ></span>
            <!-- Hover background -->
            <span
              class="absolute inset-0 rounded-lg bg-white/0 hover:bg-white/5 transition-colors duration-300"
              aria-hidden="true"
            ></span>
          </button>

          <!-- Auth area -->
          <template v-if="authStore.user">
            <span class="ml-2 px-3 py-2 text-xs text-gray-500 truncate max-w-40">
              {{ authStore.user.displayName || authStore.user.email }}
            </span>
            <button
              @click="handleLogout"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
            >
              Logout
            </button>
          </template>
          <RouterLink
            v-else
            to="/login"
            class="ml-2 px-5 py-2 rounded-full text-sm font-medium bg-luxury-gold/10 border border-luxury-gold/25 text-luxury-gold hover:bg-luxury-gold/20 transition-all duration-300"
          >
            Login
          </RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg glass-effect text-luxury-gold focus:outline-none transition-transform duration-200 active:scale-95"
          aria-label="Toggle menu"
        >
          <svg
            class="w-5 h-5 transition-transform duration-300"
            :class="mobileMenuOpen ? 'rotate-45' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              :d="mobileMenuOpen
                ? 'M6 18L18 6M6 6l12 12'
                : 'M4 6h16M4 12h16M4 18h16'"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-3 scale-98"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-3 scale-98"
      >
        <div v-if="mobileMenuOpen" class="md:hidden mt-4 glass-dark rounded-2xl overflow-hidden">
          <button
            v-for="(item, index) in menuItems"
            :key="item.id"
            @click="scrollToSection(item.id)"
            class="mobile-item w-full text-left px-6 py-4 text-sm font-medium transition-all duration-200 flex items-center justify-between border-b border-white/5 last:border-0"
            :class="activeSection === item.id
              ? 'text-luxury-gold bg-luxury-gold/5'
              : 'text-gray-400 hover:text-white hover:bg-white/5'"
            :style="{ transitionDelay: mobileMenuOpen ? `${index * 40}ms` : '0ms' }"
          >
            <span>{{ item.label }}</span>
            <span
              v-if="activeSection === item.id"
              class="w-1.5 h-1.5 rounded-full bg-luxury-gold"
            ></span>
          </button>
          <!-- Auth entry -->
          <RouterLink
            v-if="!authStore.user"
            to="/login"
            @click="mobileMenuOpen = false"
            class="mobile-item w-full text-left px-6 py-4 text-sm font-medium text-luxury-gold border-b border-white/5"
          >
            <span>Login / Register</span>
          </RouterLink>
          <button
            v-else
            @click="handleLogout"
            class="mobile-item w-full text-left px-6 py-4 text-sm font-medium text-gray-400"
          >
            <span>Logout ({{ authStore.user.displayName || authStore.user.email }})</span>
          </button>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePortfolioStore } from '@/stores/portfolio'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const store = usePortfolioStore()
const { activeSection } = storeToRefs(store)
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const menuItems = [
  { id: 'home',       label: 'Home' },
  { id: 'about',      label: 'About' },
  { id: 'skills',     label: 'Skills' },
  { id: 'projects',   label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact',    label: 'Contact' },
]

async function scrollToSection(id) {
  if (route.name !== 'home') {
    await router.push('/')
    await nextTick()
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  store.setActiveSection(id)
  mobileMenuOpen.value = false
}

async function handleLogout() {
  await authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}

function handleScroll() {
  scrolled.value = window.scrollY > 50
  for (const item of menuItems) {
    const el = document.getElementById(item.id)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 120 && rect.bottom >= 120) {
        store.setActiveSection(item.id)
        break
      }
    }
  }
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.nav-scrolled {
  background: rgba(5, 5, 5, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);
}

.logo-ring::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #d4af37, #f4d03f, #cd7f32, transparent, #d4af37);
  animation: spin 4s linear infinite;
  z-index: 0;
}
.logo-inner {
  position: relative;
  z-index: 1;
  margin: 2px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.nav-link:hover .nav-indicator {
  opacity: 0.4;
  transform: scaleX(1);
}

.scale-98 {
  --tw-scale-x: 0.98;
  --tw-scale-y: 0.98;
}
</style>
