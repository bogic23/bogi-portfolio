import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'

// Fallback content — shown until Firestore responds (and if collections are empty).
// Seed these into Firestore with `npm run seed:firestore`.
const fallbackSkills = [
  { name: 'Vue.js', level: 95, category: 'frontend', icon: '🟢', order: 0 },
  { name: 'React', level: 85, category: 'frontend', icon: '⚛️', order: 1 },
  { name: 'TypeScript', level: 90, category: 'frontend', icon: '📘', order: 2 },
  { name: 'Node.js', level: 88, category: 'backend', icon: '🟩', order: 3 },
  { name: 'Python', level: 82, category: 'backend', icon: '🐍', order: 4 },
  { name: 'PostgreSQL', level: 85, category: 'database', icon: '🐘', order: 5 },
  { name: 'MongoDB', level: 80, category: 'database', icon: '🍃', order: 6 },
  { name: 'Docker', level: 78, category: 'devops', icon: '🐳', order: 7 },
  { name: 'AWS', level: 75, category: 'devops', icon: '☁️', order: 8 },
  { name: 'Tailwind CSS', level: 92, category: 'frontend', icon: '🎨', order: 9 },
]

const fallbackProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-stack luxury e-commerce platform with real-time inventory management',
    tech: ['Vue.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    github: '#',
    demo: '#',
    featured: true,
    order: 0,
  },
  {
    id: 2,
    title: 'Analytics Dashboard',
    description: 'Interactive data visualization dashboard with real-time updates',
    tech: ['React', 'D3.js', 'Python', 'WebSocket'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    github: '#',
    demo: '#',
    featured: true,
    order: 1,
  },
  {
    id: 3,
    title: 'AI Chat Application',
    description: 'Intelligent chatbot with natural language processing capabilities',
    tech: ['Vue.js', 'OpenAI', 'Node.js', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800',
    github: '#',
    demo: '#',
    featured: false,
    order: 2,
  },
  {
    id: 4,
    title: 'Task Management System',
    description: 'Collaborative project management tool with team features',
    tech: ['Vue.js', 'Firebase', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    github: '#',
    demo: '#',
    featured: false,
    order: 3,
  },
]

const fallbackExperiences = [
  {
    id: 1,
    role: 'Senior Full-Stack Developer',
    company: 'Tech Innovations Inc.',
    period: '2022 - Present',
    description: 'Lead development of enterprise applications, mentor junior developers',
    achievements: [
      'Improved application performance by 40%',
      'Led team of 5 developers',
      'Implemented CI/CD pipeline',
    ],
    order: 0,
  },
  {
    id: 2,
    role: 'Frontend Developer',
    company: 'Digital Solutions Ltd.',
    period: '2020 - 2022',
    description: 'Developed responsive web applications for various clients',
    achievements: [
      'Delivered 20+ successful projects',
      'Reduced load time by 60%',
      'Won Best UI Award 2021',
    ],
    order: 1,
  },
  {
    id: 3,
    role: 'Junior Developer',
    company: 'StartUp Hub',
    period: '2019 - 2020',
    description: 'Built MVPs for early-stage startups',
    achievements: ['Launched 5 MVPs', 'Full-stack development', 'Agile methodology implementation'],
    order: 2,
  },
]

function sortByOrder(list) {
  return [...list].sort((a, b) => (a.order ?? a.id ?? 0) - (b.order ?? b.id ?? 0))
}

function mapDoc(docSnap) {
  const data = docSnap.data()
  // Prefer numeric `id` field when present, else fall back to Firestore doc ID.
  return { id: docSnap.id, ...data }
}

export const usePortfolioStore = defineStore('portfolio', () => {
  const isDarkMode = ref(true)
  const activeSection = ref('home')

  const skills = ref([...fallbackSkills])
  const projects = ref([...fallbackProjects])
  const experiences = ref([...fallbackExperiences])

  const isLoading = ref(false)
  const isLoaded = ref(false)
  const error = ref(null)
  let unsubscribe = null

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
  }

  function setActiveSection(section) {
    activeSection.value = section
  }

  async function fetchPortfolio() {
    isLoading.value = true
    error.value = null
    try {
      const [skillsSnap, projectsSnap, experiencesSnap] = await Promise.all([
        getDocs(collection(db, 'skills')),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'experiences')),
      ])
      if (!skillsSnap.empty) skills.value = sortByOrder(skillsSnap.docs.map(mapDoc))
      if (!projectsSnap.empty) projects.value = sortByOrder(projectsSnap.docs.map(mapDoc))
      if (!experiencesSnap.empty)
        experiences.value = sortByOrder(experiencesSnap.docs.map(mapDoc))
    } catch (e) {
      // Keep fallback data visible; surface the error for debugging.
      error.value = e?.message ?? String(e)
      console.error('[portfolio] Failed to load Firestore data:', e)
    } finally {
      isLoading.value = false
      isLoaded.value = true
    }
  }

  function subscribePortfolio() {
    if (unsubscribe) return unsubscribe
    const apply = (snap, target) => {
      if (!snap.empty) target.value = sortByOrder(snap.docs.map(mapDoc))
    }
    const unsubs = [
      onSnapshot(
        collection(db, 'skills'),
        (snap) => apply(snap, skills),
        (e) => console.error('[portfolio] skills listener failed:', e),
      ),
      onSnapshot(
        collection(db, 'projects'),
        (snap) => apply(snap, projects),
        (e) => console.error('[portfolio] projects listener failed:', e),
      ),
      onSnapshot(
        collection(db, 'experiences'),
        (snap) => apply(snap, experiences),
        (e) => console.error('[portfolio] experiences listener failed:', e),
      ),
    ]
    unsubscribe = () => unsubs.forEach((u) => u())
    return unsubscribe
  }

  function unsubscribePortfolio() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  // Eager one-time load; components stay reactive via storeToRefs.
  // Realtime subscription is opt-in via subscribePortfolio() (e.g. in App.vue).
  fetchPortfolio()

  return {
    isDarkMode,
    activeSection,
    skills,
    projects,
    experiences,
    isLoading,
    isLoaded,
    error,
    toggleDarkMode,
    setActiveSection,
    fetchPortfolio,
    subscribePortfolio,
    unsubscribePortfolio,
  }
})
