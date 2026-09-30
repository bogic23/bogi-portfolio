<template>
  <div class="min-h-screen bg-luxury-darker">
    <!-- Custom Cursor -->
    <div
      class="cursor-dot"
      :style="{ transform: `translate(${cursor.x - 4}px, ${cursor.y - 4}px)` }"
    ></div>
    <div
      class="cursor-ring"
      :style="{ transform: `translate(${cursorRing.x - 20}px, ${cursorRing.y - 20}px)` }"
    ></div>

    <!-- Scroll Progress Bar -->
    <div
      class="scroll-progress"
      :style="{ width: scrollProgress + '%' }"
    ></div>

    <Navigation />
    <RouterView />
    <FooterSection />

    <!-- Initial loading splash -->
    <Transition name="loader-fade">
      <AppLoader v-if="showLoader" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Navigation from '@/components/Navigation.vue'
import FooterSection from '@/components/FooterSection.vue'
import AppLoader from '@/components/AppLoader.vue'
import { useAuthStore } from '@/stores/auth'
import { usePortfolioStore } from '@/stores/portfolio'

const showLoader = ref(true)

const cursor = ref({ x: -100, y: -100 })
const cursorRing = ref({ x: -100, y: -100 })
const scrollProgress = ref(0)

let ringX = -100
let ringY = -100
let rafId = null

function moveCursor(e) {
  cursor.value = { x: e.clientX, y: e.clientY }
}

function animateCursorRing() {
  ringX += (cursor.value.x - ringX) * 0.12
  ringY += (cursor.value.y - ringY) * 0.12
  cursorRing.value = { x: ringX, y: ringY }
  rafId = requestAnimationFrame(animateCursorRing)
}

function handleScroll() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0
}

function waitForPortfolio(portfolioStore) {
  if (portfolioStore.isLoaded) return Promise.resolve()
  return new Promise((resolve) => {
    const stop = watch(
      () => portfolioStore.isLoaded,
      (loaded) => {
        if (loaded) {
          stop()
          resolve()
        }
      }
    )
  })
}

onMounted(async () => {
  window.addEventListener('mousemove', moveCursor, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })
  rafId = requestAnimationFrame(animateCursorRing)

  // Initial splash: wait for auth + portfolio (with a minimum display
  // time for polish and a safety timeout so it can never hang).
  const authStore = useAuthStore()
  const portfolioStore = usePortfolioStore()
  const minDelay = new Promise((r) => setTimeout(r, 1500))
  const safety = new Promise((r) => setTimeout(r, 10000))
  document.documentElement.style.overflow = 'hidden'
  try {
    await Promise.race([
      Promise.all([authStore.awaitReady(), waitForPortfolio(portfolioStore), minDelay]),
      safety,
    ])
  } finally {
    showLoader.value = false
    document.documentElement.style.overflow = ''
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', moveCursor)
  window.removeEventListener('scroll', handleScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.loader-fade-leave-active {
  transition: opacity 0.6s ease;
}
.loader-fade-leave-to {
  opacity: 0;
}
</style>
