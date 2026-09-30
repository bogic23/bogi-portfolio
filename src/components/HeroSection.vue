<template>
  <section id="home" class="min-h-screen flex items-center justify-center relative overflow-hidden">

    <!-- ── Animated Orb Background ── -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Primary orbs -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <!-- Grid overlay -->
      <div class="hero-grid"></div>
      <!-- Particle dots -->
      <canvas ref="particleCanvas" class="absolute inset-0 w-full h-full opacity-40"></canvas>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

        <!-- ── Left Content ── -->
        <div class="flex-1 text-center lg:text-left">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 mb-8 hero-badge">
            <span class="w-2 h-2 rounded-full bg-luxury-gold animate-pulse-gold"></span>
            <span class="text-xs font-semibold tracking-widest uppercase text-luxury-gold">
              Available for work
            </span>
          </div>

          <!-- Heading -->
          <h1 class="text-5xl md:text-6xl xl:text-7xl font-display font-bold mb-5 leading-[1.1] hero-heading">
            <span class="block text-white/90 text-3xl md:text-4xl font-light mb-2 tracking-wide">Hello, I'm</span>
            <span class="gold-gradient block">Alex Chen</span>
          </h1>

          <!-- Typewriter subtitle -->
          <div class="text-xl md:text-2xl text-gray-400 mb-5 font-light h-9 flex items-center justify-center lg:justify-start gap-1 hero-subtitle">
            <span>{{ displayedRole }}</span>
            <span class="typewriter-cursor"></span>
          </div>

          <p class="text-gray-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed hero-desc">
            Crafting exceptional digital experiences with modern technologies.
            Passionate about creating elegant solutions to complex problems.
          </p>

          <!-- CTA buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14 hero-ctas">
            <button class="btn-primary group flex items-center justify-center gap-2" @click="scrollToSection('projects')">
              <span>View My Work</span>
              <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button class="btn-secondary group flex items-center justify-center gap-2" @click="scrollToSection('contact')">
              <span>Get In Touch</span>
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0 hero-stats">
            <div
              v-for="(stat, i) in stats"
              :key="stat.label"
              class="relative group cursor-default"
              :style="{ animationDelay: `${i * 0.15}s` }"
            >
              <div class="glass-gold rounded-2xl p-4 text-center transition-all duration-300 group-hover:shadow-gold-md">
                <div class="text-2xl md:text-3xl font-bold gold-gradient-static">
                  {{ stat.value }}<span class="text-luxury-gold">+</span>
                </div>
                <div class="text-xs text-gray-500 mt-1 leading-tight">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Right Content — Avatar ── -->
        <div class="flex-1 flex justify-center lg:justify-end hero-avatar">
          <div class="relative">
            <!-- Spinning ring -->
            <div class="absolute inset-0 m-auto w-80 h-80 md:w-[26rem] md:h-[26rem] rounded-full">
              <div class="spinning-ring"></div>
            </div>

            <!-- Avatar image -->
            <div class="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-luxury-gold/20 shadow-gold-lg animate-glow-pulse z-10">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
                alt="Alex Chen"
                class="w-full h-full object-cover no-drag"
              />
              <!-- Shimmer overlay -->
              <div class="avatar-shimmer"></div>
            </div>

            <!-- Floating badges -->
            <div class="floating-badge top-0 -right-4 md:-right-8 animate-float" style="animation-delay:0s">
              <span class="text-2xl">💻</span>
            </div>
            <div class="floating-badge bottom-4 -left-4 md:-left-8 animate-float" style="animation-delay:1.2s">
              <span class="text-2xl">🚀</span>
            </div>
            <div class="floating-badge top-1/2 -right-2 md:-right-6 -translate-y-1/2 animate-float" style="animation-delay:2.1s">
              <span class="text-2xl">✨</span>
            </div>

            <!-- Experience badge -->
            <div class="absolute -bottom-6 -left-4 md:-left-10 glass-gold rounded-2xl px-5 py-3 animate-float shadow-gold-sm" style="animation-delay:0.5s">
              <div class="text-2xl font-bold gold-gradient-static leading-none">5+</div>
              <div class="text-xs text-gray-400 mt-0.5">Years Exp.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" @click="scrollToSection('about')">
      <span class="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
      <div class="scroll-mouse">
        <div class="scroll-wheel"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ── Typewriter ──────────────────────────────
const roles = [
  'Full-Stack Developer',
  'UI/UX Enthusiast',
  'Vue.js Specialist',
  'Problem Solver',
  'Open Source Contributor',
]

const displayedRole = ref('')
let roleIndex = 0
let charIndex = 0
let isDeleting = false
let typingTimer = null

function typeRole() {
  const current = roles[roleIndex]
  if (isDeleting) {
    displayedRole.value = current.slice(0, --charIndex)
  } else {
    displayedRole.value = current.slice(0, ++charIndex)
  }

  let delay = isDeleting ? 40 : 80

  if (!isDeleting && charIndex === current.length) {
    delay = 2000
    isDeleting = true
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    roleIndex = (roleIndex + 1) % roles.length
    delay = 400
  }

  typingTimer = setTimeout(typeRole, delay)
}

// ── Stats ──────────────────────────────────
const stats = ref([
  { label: 'Years Experience', value: 5 },
  { label: 'Projects Done', value: 50 },
  { label: 'Happy Clients', value: 30 },
])

// ── Particles ──────────────────────────────
const particleCanvas = ref(null)
let animFrame = null

function initParticles() {
  const canvas = particleCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const PARTICLE_COUNT = 55
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    alpha: Math.random() * 0.5 + 0.2,
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(212,175,55,${p.alpha})`
      ctx.fill()
    })

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(212,175,55,${0.08 * (1 - dist / 100)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    animFrame = requestAnimationFrame(draw)
  }
  draw()
}

// ── Scroll helper ──────────────────────────
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// ── Lifecycle ─────────────────────────────
onMounted(() => {
  typingTimer = setTimeout(typeRole, 600)
  initParticles()
})

onUnmounted(() => {
  clearTimeout(typingTimer)
  if (animFrame) cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
/* ── Orbs ── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}
.orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%);
  top: -10%; left: -5%;
  animation-delay: 0s;
}
.orb-2 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(205,127,50,0.10) 0%, transparent 70%);
  bottom: -15%; right: -10%;
  animation-delay: 3s;
}
.orb-3 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%);
  top: 40%; left: 45%;
  animation-delay: 1.5s;
}

/* ── Grid ── */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}

/* ── Avatar ── */
.spinning-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px dashed rgba(212,175,55,0.25);
  animation: spin 20s linear infinite;
}
.spinning-ring::before {
  content: '';
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  border: 1px dashed rgba(212,175,55,0.15);
  animation: spin 14s linear infinite reverse;
}

.avatar-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 40%,
    rgba(212,175,55,0.08) 50%,
    transparent 60%
  );
  background-size: 200% 200%;
  animation: shimmerSlide 4s ease-in-out infinite;
}

@keyframes shimmerSlide {
  0% { background-position: 200% 200%; }
  100% { background-position: -100% -100%; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* ── Floating badge ── */
.floating-badge {
  position: absolute;
  z-index: 20;
  backdrop-filter: blur(12px);
  background: rgba(212,175,55,0.1);
  border: 1px solid rgba(212,175,55,0.2);
  border-radius: 14px;
  padding: 10px 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

/* ── Badge ── */
.hero-badge {
  padding: 6px 16px;
  background: rgba(212,175,55,0.08);
  border: 1px solid rgba(212,175,55,0.2);
  border-radius: 999px;
  animation: fadeIn 0.6s ease both;
}

/* ── Entry animations ── */
.hero-heading  { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
.hero-subtitle { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.hero-desc     { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
.hero-ctas     { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
.hero-stats    { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
.hero-avatar   { animation: slideLeft 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both; }

@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; filter: blur(4px); }
  to   { transform: translateY(0);    opacity: 1; filter: blur(0); }
}
@keyframes slideLeft {
  from { transform: translateX(60px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Scroll Mouse ── */
.scroll-mouse {
  width: 22px;
  height: 34px;
  border: 2px solid rgba(212,175,55,0.4);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 5px;
}
.scroll-wheel {
  width: 3px;
  height: 6px;
  background: rgba(212,175,55,0.7);
  border-radius: 2px;
  animation: scrollWheel 1.5s ease-in-out infinite;
}

@keyframes scrollWheel {
  0%   { transform: translateY(0); opacity: 1; }
  80%  { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 0; }
}

/* pulse-gold */
@keyframes pulseGold {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(212,175,55,0.4); }
  50%       { opacity: 0.8; transform: scale(1.2); box-shadow: 0 0 0 6px rgba(212,175,55,0); }
}
.animate-pulse-gold {
  animation: pulseGold 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.2), 0 0 0 1px rgba(212,175,55,0.15); }
  50%       { box-shadow: 0 0 60px rgba(212,175,55,0.5), 0 0 0 1px rgba(212,175,55,0.3); }
}
.animate-glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
</style>
