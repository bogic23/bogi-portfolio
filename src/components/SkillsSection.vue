<template>
  <section id="skills" class="py-28 relative overflow-hidden">
    <!-- Background accent -->
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-luxury-bronze/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

    <div class="container mx-auto px-6">
      <!-- Section Header -->
      <div ref="headerRef" class="section-header reveal-hidden">
        <div class="section-tag"><span>⬡</span> Expertise</div>
        <h2 class="text-4xl md:text-5xl font-display font-bold mb-4">
          My <span class="gold-gradient">Skills</span>
        </h2>
        <div class="section-divider"></div>
        <p class="text-gray-500 mt-5 max-w-2xl mx-auto">
          A comprehensive toolkit of technologies and frameworks I've mastered throughout my career
        </p>
      </div>

      <!-- Category Filter -->
      <div ref="filterRef" class="flex flex-wrap justify-center gap-3 mb-12 reveal-hidden">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="selectCategory(category.value)"
          class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden"
          :class="selectedCategory === category.value
            ? 'bg-luxury-gold text-luxury-darker shadow-gold-sm'
            : 'glass-effect text-gray-400 hover:text-luxury-gold hover:border-luxury-gold/30'"
        >
          {{ category.label }}
          <span
            v-if="selectedCategory === category.value"
            class="absolute inset-0 bg-white/10 animate-pulse-once"
          ></span>
        </button>
      </div>

      <!-- Skills Grid -->
      <div ref="gridRef" class="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        <transition-group name="skill-list" tag="div" class="contents">
          <div
            v-for="skill in filteredSkills"
            :key="skill.name"
            class="skill-card glass-effect rounded-2xl p-6 reveal-hidden"
          >
            <!-- Skill header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-xl transition-all duration-300 group-hover:bg-luxury-gold/20">
                  {{ skill.icon }}
                </div>
                <span class="font-semibold text-base">{{ skill.name }}</span>
              </div>
              <span class="text-luxury-gold font-bold tabular-nums text-sm">
                {{ animatedLevels[skill.name] || 0 }}%
              </span>
            </div>

            <!-- Progress track -->
            <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                class="progress-fill h-full rounded-full relative overflow-hidden"
                :style="{ width: `${animatedLevels[skill.name] || 0}%` }"
              >
                <span class="progress-shimmer"></span>
              </div>
            </div>

            <!-- Skill level label -->
            <div class="flex justify-between mt-2">
              <span class="text-xs text-gray-600">Beginner</span>
              <span class="text-xs text-gray-600">Expert</span>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Additional Skills -->
      <div ref="tagsRef" class="mt-16 text-center reveal-hidden">
        <h3 class="text-lg font-display font-semibold mb-6 text-luxury-gold tracking-wide">
          Other Technologies
        </h3>
        <div class="flex flex-wrap justify-center gap-3">
          <span
            v-for="(tag, i) in additionalSkills"
            :key="tag"
            class="tag-chip px-4 py-2 glass-effect rounded-full text-sm text-gray-400 hover:text-luxury-gold hover:border-luxury-gold/30 transition-all duration-300 cursor-default"
            :style="{ transitionDelay: `${i * 30}ms`, animationDelay: `${i * 30}ms` }"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { storeToRefs } from 'pinia'
import { useScrollReveal } from '@/composables/useScrollReveal'

const store = usePortfolioStore()
const { skills } = storeToRefs(store)
const { reveal, revealChildren } = useScrollReveal()

const headerRef = ref(null)
const filterRef = ref(null)
const gridRef   = ref(null)
const tagsRef   = ref(null)

const selectedCategory = ref('all')
const animatedLevels   = ref({})
let hasAnimated = false

const categories = [
  { value: 'all',      label: 'All Skills' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend',  label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops',   label: 'DevOps' },
]

const additionalSkills = [
  'Git', 'REST APIs', 'GraphQL', 'Redis', 'Nginx', 'Linux',
  'Figma', 'Jest', 'Webpack', 'Vite', 'CI/CD', 'Agile',
]

const filteredSkills = computed(() =>
  selectedCategory.value === 'all'
    ? skills.value
    : skills.value.filter(s => s.category === selectedCategory.value)
)

function animateSkills(list = filteredSkills.value) {
  list.forEach((skill, i) => {
    setTimeout(() => {
      animatedLevels.value = { ...animatedLevels.value, [skill.name]: skill.level }
    }, i * 80)
  })
}

function selectCategory(val) {
  selectedCategory.value = val
  animatedLevels.value = {}
  setTimeout(() => animateSkills(), 120)
}

onMounted(() => {
  reveal(headerRef.value)
  reveal(filterRef.value)
  reveal(tagsRef.value)

  // Trigger skill animation on scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true
        animateSkills()
        // Reveal each skill card staggered
        const cards = entry.target.querySelectorAll('.skill-card')
        cards.forEach((card, i) => {
          card.style.transitionDelay = `${i * 70}ms`
          setTimeout(() => card.classList.add('is-visible'), i * 70)
        })
        observer.disconnect()
      }
    })
  }, { threshold: 0.1 })

  if (gridRef.value) observer.observe(gridRef.value)
})
</script>

<style scoped>
.progress-fill {
  background: linear-gradient(90deg, #d4af37, #f4d03f, #d4af37);
  background-size: 200% auto;
  transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.3) 50%,
    transparent 100%
  );
  animation: shimmerMove 2.5s linear infinite;
}

@keyframes shimmerMove {
  from { transform: translateX(-100%); }
  to   { transform: translateX(400%); }
}

.skill-card {
  transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1),
              transform 0.6s cubic-bezier(0.16,1,0.3,1),
              filter 0.6s cubic-bezier(0.16,1,0.3,1);
}

.skill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(212, 175, 55, 0.12), 0 4px 16px rgba(0,0,0,0.3);
  border-color: rgba(212, 175, 55, 0.2);
}

.tag-chip {
  border: 1px solid rgba(255,255,255,0.08);
  transition: all 0.25s ease;
}
.tag-chip:hover {
  border-color: rgba(212,175,55,0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212,175,55,0.1);
}
</style>
