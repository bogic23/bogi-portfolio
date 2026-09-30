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
            Abednego Bogi
          </span>
        </div>

        <!-- Auth area -->
        <div class="flex items-center space-x-1">
          <template v-if="authStore.user">
            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin"
              title="Dashboard"
              aria-label="Open admin dashboard"
              class="w-10 h-10 flex items-center justify-center rounded-full glass-effect text-gray-400 hover:text-luxury-gold hover:border-luxury-gold/40 transition-all duration-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  stroke-linecap="round" stroke-linejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
            </RouterLink>
            <span class="hidden sm:block px-3 py-2 text-xs text-gray-500 truncate max-w-40">
              {{ authStore.user.displayName || authStore.user.email }}
            </span>
            <button
              @click="handleLogout"
              title="Logout"
              aria-label="Log out"
              class="w-10 h-10 flex items-center justify-center rounded-full glass-effect text-gray-400 hover:text-red-400 hover:border-red-400/40 transition-all duration-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
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
      </div>
    </div>
  </nav>

  <!-- Floating expandable section menu -->
  <div class="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
    <!-- Backdrop to close on outside click -->
    <div
      v-if="fabOpen"
      class="fixed inset-0 -z-10"
      @click="fabOpen = false"
      aria-hidden="true"
    ></div>

    <!-- Expanded links -->
    <transition-group
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-3 scale-95"
    >
      <template v-if="fabOpen">
        <button
          v-for="(item, index) in menuItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="fab-item group flex items-center gap-3 pl-4 pr-2 py-2 rounded-full glass-dark shadow-lg"
          :style="{ transitionDelay: `${(menuItems.length - 1 - index) * 40}ms` }"
        >
          <span
            class="text-sm font-medium transition-colors duration-200"
            :class="activeSection === item.id ? 'text-luxury-gold' : 'text-gray-300 group-hover:text-white'"
          >
            {{ item.label }}
          </span>
          <span
            class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
            :class="activeSection === item.id
              ? 'bg-luxury-gold text-luxury-darker'
              : 'bg-white/5 border border-white/10 text-gray-400 group-hover:border-luxury-gold/40 group-hover:text-luxury-gold'"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <span
            v-if="activeSection === item.id"
            class="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-luxury-gold"
            aria-hidden="true"
          ></span>
        </button>
      </template>
    </transition-group>

    <!-- Main toggle button -->
    <button
      @click="fabOpen = !fabOpen"
      class="fab-toggle w-14 h-14 rounded-full flex items-center justify-center text-luxury-darker focus:outline-none"
      :aria-expanded="fabOpen"
      aria-label="Toggle navigation menu"
    >
      <svg
        class="w-6 h-6 transition-transform duration-300"
        :class="fabOpen ? 'rotate-45' : ''"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          :d="fabOpen
            ? 'M6 18L18 6M6 6l12 12'
            : 'M4 6h16M4 12h16M4 18h16'"
        />
      </svg>
    </button>
  </div>
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
const fabOpen = ref(false)

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
  fabOpen.value = false
}

async function handleLogout() {
  await authStore.logout()
  fabOpen.value = false
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

function handleKeydown(e) {
  if (e.key === 'Escape') fabOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
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

.fab-toggle {
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  background-size: 200% auto;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.35), 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: background-position 0.5s ease, box-shadow 0.3s ease, transform 0.2s ease;
}

.fab-toggle:hover {
  background-position: right center;
  box-shadow: 0 8px 40px rgba(212, 175, 55, 0.55), 0 4px 16px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.fab-toggle:active {
  transform: translateY(0) scale(0.96);
}

.fab-item {
  position: relative;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
}

.fab-item:hover {
  transform: translateX(-4px);
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15), 0 4px 16px rgba(0, 0, 0, 0.4);
  border-color: rgba(212, 175, 55, 0.25);
}
</style>
