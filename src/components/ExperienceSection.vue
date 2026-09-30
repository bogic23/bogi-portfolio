<template>
  <section id="experience" class="py-28 relative overflow-hidden">
    <!-- Background accent -->
    <div class="absolute top-0 left-0 w-80 h-80 bg-luxury-gold/4 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

    <div class="container mx-auto px-6">
      <!-- Section Header -->
      <div ref="headerRef" class="section-header reveal-hidden">
        <div class="section-tag"><span>⬡</span> Career</div>
        <h2 class="text-4xl md:text-5xl font-display font-bold mb-4">
          Work <span class="gold-gradient">Experience</span>
        </h2>
        <div class="section-divider"></div>
        <p class="text-gray-500 mt-5 max-w-2xl mx-auto">
          My professional journey through the tech industry
        </p>
      </div>

      <!-- Timeline -->
      <div class="max-w-4xl mx-auto relative" ref="timelineRef">
        <!-- Animated timeline line -->
        <div class="timeline-line absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2" aria-hidden="true">
          <div class="timeline-line-fill h-full w-full"></div>
        </div>

        <div class="space-y-10 md:space-y-14">
          <div
            v-for="(exp, index) in experiences"
            :key="exp.id"
            class="exp-card reveal-hidden relative flex flex-col md:flex-row items-start"
            :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
            :style="{ transitionDelay: `${index * 120}ms` }"
          >
            <!-- Timeline dot -->
            <div class="timeline-dot absolute left-4 md:left-1/2 top-6 z-10 md:-translate-x-1/2">
              <div class="dot-inner">
                <span class="dot-pulse"></span>
              </div>
            </div>

            <!-- Card -->
            <div
              class="w-[calc(100%-3rem)] md:w-5/12 ml-12 md:ml-0 group"
              :class="index % 2 === 0 ? 'md:pr-10' : 'md:pl-10'"
            >
              <div class="exp-inner glass-effect rounded-2xl p-6 transition-all duration-400 group-hover:border-luxury-gold/25 group-hover:shadow-gold-md">
                <!-- Period badge -->
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/15 text-luxury-gold text-xs font-semibold rounded-full mb-4">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ exp.period }}
                </span>

                <h3 class="text-xl font-display font-semibold mb-1 transition-colors duration-300 group-hover:text-luxury-gold">
                  {{ exp.role }}
                </h3>
                <p class="text-luxury-gold text-sm font-medium mb-3 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  {{ exp.company }}
                </p>
                <p class="text-gray-500 text-sm mb-4 leading-relaxed">{{ exp.description }}</p>

                <!-- Achievements -->
                <ul class="space-y-2">
                  <li
                    v-for="achievement in exp.achievements"
                    :key="achievement"
                    class="flex items-start gap-2 text-sm text-gray-400"
                  >
                    <svg class="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Spacer -->
            <div class="hidden md:block w-5/12"></div>
          </div>
        </div>
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
const { experiences } = storeToRefs(store)
const { reveal } = useScrollReveal()

const headerRef   = ref(null)
const timelineRef = ref(null)

onMounted(() => {
  reveal(headerRef.value)

  // Reveal exp cards + animate timeline line on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate timeline line
        const line = entry.target.querySelector('.timeline-line-fill')
        if (line) line.classList.add('is-drawn')

        // Stagger cards
        const cards = entry.target.querySelectorAll('.exp-card')
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('is-visible'), i * 150)
        })
        observer.disconnect()
      }
    })
  }, { threshold: 0.05 })

  if (timelineRef.value) observer.observe(timelineRef.value)
})
</script>

<style scoped>
/* Timeline line */
.timeline-line {
  overflow: hidden;
}
.timeline-line-fill {
  background: linear-gradient(180deg, #d4af37, #cd7f32 60%, transparent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 2s cubic-bezier(0.16,1,0.3,1);
}
.timeline-line-fill.is-drawn {
  transform: scaleY(1);
}

/* Timeline dot */
.timeline-dot {
  display: flex;
  align-items: center;
  justify-content: center;
}
.dot-inner {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #d4af37;
  border: 3px solid #050505;
  box-shadow: 0 0 0 1px rgba(212,175,55,0.4);
  z-index: 10;
}
.dot-pulse {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1px solid rgba(212,175,55,0.4);
  animation: dotPulse 2s ease-out infinite;
}
@keyframes dotPulse {
  0%   { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
}

/* Entry card animation */
.exp-card {
  opacity: 0;
  transform: translateY(24px);
  filter: blur(2px);
  transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1),
              transform 0.7s cubic-bezier(0.16,1,0.3,1),
              filter 0.7s cubic-bezier(0.16,1,0.3,1);
}
.exp-card.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

.exp-inner {
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.exp-inner:hover {
  transform: translateY(-3px);
}
</style>
