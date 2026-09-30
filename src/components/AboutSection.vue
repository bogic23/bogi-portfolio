<template>
  <section id="about" class="py-28 relative overflow-hidden">
    <!-- Subtle background accent -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

    <div class="container mx-auto px-6">
      <!-- Section Header -->
      <div ref="headerRef" class="section-header reveal-hidden">
        <div class="section-tag">
          <span>⬡</span> Who I Am
        </div>
        <h2 class="text-4xl md:text-5xl font-display font-bold mb-4">
          About <span class="gold-gradient">Me</span>
        </h2>
        <div class="section-divider"></div>
      </div>

      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left — Image card with tilt -->
        <div ref="imageRef" class="reveal-left relative">
          <div
            class="tilt-card glass-effect rounded-3xl p-6 shadow-gold-md"
            @mousemove="onTilt"
            @mouseleave="resetTilt"
          >
            <div class="aspect-square rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800"
                alt="Workspace"
                class="w-full h-full object-cover no-drag transition-transform duration-700 hover:scale-105"
              />
            </div>

            <!-- Corner accent lines -->
            <div class="corner-tl"></div>
            <div class="corner-br"></div>
          </div>

          <!-- Floating stat card -->
          <div class="absolute -bottom-8 -right-4 md:-right-8 glass-gold rounded-2xl px-6 py-4 animate-float shadow-gold-sm z-10">
            <div class="text-3xl font-bold gold-gradient-static leading-none">100%</div>
            <div class="text-xs text-gray-400 mt-1">Client Satisfaction</div>
          </div>

          <!-- Floating tech count -->
          <div class="absolute -top-4 -left-4 md:-left-6 glass-gold rounded-2xl px-5 py-3 animate-float shadow-gold-sm z-10" style="animation-delay:1.8s">
            <div class="text-2xl font-bold gold-gradient-static leading-none">10+</div>
            <div class="text-xs text-gray-400 mt-1">Technologies</div>
          </div>
        </div>

        <!-- Right — Content -->
        <div ref="contentRef" class="reveal-right">
          <h3 class="text-2xl font-display font-semibold mb-5 text-luxury-gold">
            A passionate developer based in San Francisco
          </h3>

          <p class="text-gray-400 mb-5 leading-relaxed">
            I'm a full-stack developer with over 5 years of experience building web applications
            that users love. My journey started with a curiosity about how websites work, and
            it has evolved into a passion for creating seamless digital experiences.
          </p>

          <p class="text-gray-400 mb-8 leading-relaxed">
            I specialize in modern JavaScript frameworks, particularly Vue.js and React,
            and I'm constantly exploring new technologies to stay at the forefront of
            web development. When I'm not coding, you'll find me contributing to open-source
            projects or sharing knowledge with the developer community.
          </p>

          <!-- Info grid -->
          <div class="grid grid-cols-2 gap-4 mb-10">
            <div
              v-for="(info, i) in infoItems"
              :key="info.label"
              ref="infoRefs"
              class="info-item flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group reveal-hidden"
              :style="{ transitionDelay: `${i * 80}ms` }"
            >
              <div class="w-10 h-10 rounded-lg bg-luxury-gold/10 flex items-center justify-center transition-all duration-300 group-hover:bg-luxury-gold/20 group-hover:shadow-gold-sm shrink-0">
                <span>{{ info.icon }}</span>
              </div>
              <div>
                <div class="text-xs text-gray-500">{{ info.label }}</div>
                <div class="font-medium text-sm">{{ info.value }}</div>
              </div>
            </div>
          </div>

          <!-- Animated counters -->
          <div class="grid grid-cols-3 gap-4 mb-10">
            <div
              v-for="(counter, i) in counters"
              :key="counter.label"
              class="text-center p-4 glass-gold rounded-2xl reveal-scale"
              :style="{ transitionDelay: `${i * 100}ms` }"
              ref="counterRefs"
            >
              <div class="text-2xl font-bold gold-gradient-static">{{ counter.display }}<span class="text-luxury-gold text-sm">{{ counter.suffix }}</span></div>
              <div class="text-xs text-gray-500 mt-1">{{ counter.label }}</div>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex flex-wrap gap-4">
            <button class="btn-primary flex items-center gap-2" @click="downloadResume">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Resume</span>
            </button>
            <button class="btn-secondary" @click="scrollToSection('contact')">
              <span>Let's Talk</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { reveal, revealChildren } = useScrollReveal()

const headerRef  = ref(null)
const imageRef   = ref(null)
const contentRef = ref(null)
const infoRefs   = ref([])
const counterRefs = ref([])

const infoItems = [
  { icon: '📍', label: 'Location',   value: 'San Francisco, CA' },
  { icon: '💼', label: 'Experience', value: '5+ Years' },
  { icon: '🎓', label: 'Degree',     value: 'BS Computer Science' },
  { icon: '🌐', label: 'Languages',  value: 'English, Mandarin' },
]

// Animated counters
const counters = ref([
  { label: 'Projects',  target: 50,  display: 0, suffix: '+' },
  { label: 'Clients',   target: 30,  display: 0, suffix: '+' },
  { label: 'Awards',    target: 8,   display: 0, suffix: '' },
])

function animateCounter(counter) {
  const duration = 1600
  const steps = 60
  const increment = counter.target / steps
  let current = 0
  let step = 0
  const timer = setInterval(() => {
    step++
    current = Math.min(Math.round(increment * step), counter.target)
    counter.display = current
    if (step >= steps) clearInterval(timer)
  }, duration / steps)
}

// 3D tilt
const tiltCard = ref(null)
function onTilt(e) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width  - 0.5
  const y = (e.clientY - rect.top)  / rect.height - 0.5
  card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.02,1.02,1.02)`
}
function resetTilt(e) {
  e.currentTarget.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
function downloadResume() {
  alert('Resume download coming soon!')
}

onMounted(() => {
  reveal(headerRef.value)
  reveal(imageRef.value)
  reveal(contentRef.value)

  // Info items — staggered
  infoRefs.value.forEach((el, i) => reveal(el))

  // Counter cards — staggered + trigger count animation when visible
  counterRefs.value.forEach((el, i) => {
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          animateCounter(counters.value[i])
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.3 })
    observer.observe(el)
  })
})
</script>

<style scoped>
.tilt-card {
  transition: transform 0.15s ease-out, box-shadow 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.corner-tl,
.corner-br {
  position: absolute;
  width: 28px;
  height: 28px;
  border-color: rgba(212, 175, 55, 0.5);
  border-style: solid;
}
.corner-tl {
  top: 12px; left: 12px;
  border-width: 2px 0 0 2px;
  border-radius: 4px 0 0 0;
}
.corner-br {
  bottom: 12px; right: 12px;
  border-width: 0 2px 2px 0;
  border-radius: 0 0 4px 0;
}
</style>
