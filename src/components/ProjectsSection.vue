<template>
  <section id="projects" class="py-28 relative overflow-hidden">
    <!-- Background accent -->
    <div class="absolute top-1/2 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" aria-hidden="true"></div>

    <div class="container mx-auto px-6">
      <!-- Section Header -->
      <div ref="headerRef" class="section-header reveal-hidden">
        <div class="section-tag"><span>⬡</span> Portfolio</div>
        <h2 class="text-4xl md:text-5xl font-display font-bold mb-4">
          Featured <span class="gold-gradient">Projects</span>
        </h2>
        <div class="section-divider"></div>
        <p class="text-gray-500 mt-5 max-w-2xl mx-auto">
          A selection of projects that showcase my skills and passion for development
        </p>
      </div>

      <!-- Projects Grid -->
      <div ref="gridRef" class="grid md:grid-cols-2 gap-8">
        <div
          v-for="(project, index) in projects"
          :key="project.id"
          class="project-card reveal-hidden group glass-effect rounded-3xl overflow-hidden"
          :style="{ transitionDelay: `${index * 100}ms` }"
          @mousemove="onCardTilt($event, index)"
          @mouseleave="resetCardTilt(index)"
          :ref="el => { if (el) cardRefs[index] = el }"
        >
          <!-- Image -->
          <div class="relative h-56 md:h-64 overflow-hidden">
            <img
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 no-drag"
              loading="lazy"
            />
            <!-- Gradient overlay always visible -->
            <div class="absolute inset-0 bg-gradient-to-t from-luxury-darker/90 via-luxury-darker/20 to-transparent"></div>

            <!-- Featured badge -->
            <div v-if="project.featured" class="absolute top-4 left-4">
              <span class="flex items-center gap-1.5 px-3 py-1 bg-luxury-gold text-luxury-darker text-xs font-bold rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-luxury-darker animate-pulse"></span>
                Featured
              </span>
            </div>

            <!-- Hover overlay with actions -->
            <div class="absolute inset-0 bg-luxury-darker/70 opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center gap-5 backdrop-blur-sm">
              <a
                :href="project.github"
                class="action-btn"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`GitHub for ${project.title}`"
                @click.stop
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                :href="project.demo"
                class="action-btn action-btn-primary"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Live demo for ${project.title}`"
                @click.stop
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Info -->
          <div class="p-6">
            <h3 class="text-xl font-display font-semibold mb-2 transition-colors duration-300 group-hover:text-luxury-gold">
              {{ project.title }}
            </h3>
            <p class="text-gray-500 text-sm mb-4 leading-relaxed">
              {{ project.description }}
            </p>

            <!-- Tech stack -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in project.tech"
                :key="tech"
                class="px-3 py-1 bg-luxury-gold/8 border border-luxury-gold/15 text-luxury-gold text-xs rounded-full font-medium transition-all duration-200 hover:bg-luxury-gold/15"
              >
                {{ tech }}
              </span>
            </div>

            <!-- Bottom link row -->
            <div class="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
              <a :href="project.github" target="_blank" class="text-xs text-gray-600 hover:text-luxury-gold transition-colors duration-200 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Source
              </a>
              <a :href="project.demo" target="_blank" class="text-xs text-luxury-gold hover:text-luxury-gold-light transition-colors duration-200 flex items-center gap-1 group/link">
                Live Demo
                <svg class="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- View More -->
      <div ref="footerRef" class="text-center mt-14 reveal-hidden">
        <button class="btn-secondary group flex items-center gap-2 mx-auto">
          <span>View All Projects</span>
          <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { storeToRefs } from 'pinia'
import { useScrollReveal } from '@/composables/useScrollReveal'

const store = usePortfolioStore()
const { projects } = storeToRefs(store)
const { reveal } = useScrollReveal()

const headerRef = ref(null)
const gridRef   = ref(null)
const footerRef = ref(null)
const cardRefs  = ref([])

// 3D tilt on project cards
function onCardTilt(e, index) {
  const card = cardRefs.value[index]
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width  - 0.5
  const y = (e.clientY - rect.top)  / rect.height - 0.5
  card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px) scale3d(1.01,1.01,1.01)`
}
function resetCardTilt(index) {
  const card = cardRefs.value[index]
  if (card) card.style.transform = ''
}

onMounted(() => {
  reveal(headerRef.value)
  reveal(footerRef.value)

  // Stagger-reveal cards on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.project-card')
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('is-visible'), i * 120)
        })
        observer.disconnect()
      }
    })
  }, { threshold: 0.08 })

  if (gridRef.value) observer.observe(gridRef.value)
})
</script>

<style scoped>
.project-card {
  opacity: 0;
  transform: translateY(30px);
  filter: blur(3px);
  transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1),
              transform 0.7s cubic-bezier(0.16,1,0.3,1),
              filter 0.7s cubic-bezier(0.16,1,0.3,1),
              box-shadow 0.4s ease;
  transform-style: preserve-3d;
  will-change: transform, opacity;
}
.project-card.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
.project-card:hover {
  box-shadow: 0 24px 64px rgba(212,175,55,0.12), 0 8px 24px rgba(0,0,0,0.4);
  border-color: rgba(212,175,55,0.2);
}

.action-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(212,175,55,0.15);
  border: 1px solid rgba(212,175,55,0.3);
  color: #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  transform: translateY(8px);
  opacity: 0;
}
.group:hover .action-btn {
  transform: translateY(0);
  opacity: 1;
  transition-delay: 0.05s;
}
.action-btn:hover {
  background: rgba(212,175,55,0.3);
  box-shadow: 0 0 20px rgba(212,175,55,0.4);
  transform: translateY(-2px) scale(1.1) !important;
}

.action-btn-primary {
  background: #d4af37;
  color: #050505;
  transition-delay: 0.1s;
}
.group:hover .action-btn-primary {
  transition-delay: 0.12s;
}
.action-btn-primary:hover {
  background: #f4d03f !important;
}
</style>
