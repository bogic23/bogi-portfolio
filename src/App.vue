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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Navigation from '@/components/Navigation.vue'
import FooterSection from '@/components/FooterSection.vue'

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

onMounted(() => {
  window.addEventListener('mousemove', moveCursor, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })
  rafId = requestAnimationFrame(animateCursorRing)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', moveCursor)
  window.removeEventListener('scroll', handleScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>
