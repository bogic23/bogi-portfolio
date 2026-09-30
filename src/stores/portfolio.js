import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  const isDarkMode = ref(true)
  const activeSection = ref('home')
  
  const skills = ref([
    { name: 'Vue.js', level: 95, category: 'frontend', icon: '🟢' },
    { name: 'React', level: 85, category: 'frontend', icon: '⚛️' },
    { name: 'TypeScript', level: 90, category: 'frontend', icon: '📘' },
    { name: 'Node.js', level: 88, category: 'backend', icon: '🟩' },
    { name: 'Python', level: 82, category: 'backend', icon: '🐍' },
    { name: 'PostgreSQL', level: 85, category: 'database', icon: '🐘' },
    { name: 'MongoDB', level: 80, category: 'database', icon: '🍃' },
    { name: 'Docker', level: 78, category: 'devops', icon: '🐳' },
    { name: 'AWS', level: 75, category: 'devops', icon: '☁️' },
    { name: 'Tailwind CSS', level: 92, category: 'frontend', icon: '🎨' },
  ])

  const projects = ref([
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack luxury e-commerce platform with real-time inventory management',
      tech: ['Vue.js', 'Node.js', 'PostgreSQL', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      github: '#',
      demo: '#',
      featured: true
    },
    {
      id: 2,
      title: 'Analytics Dashboard',
      description: 'Interactive data visualization dashboard with real-time updates',
      tech: ['React', 'D3.js', 'Python', 'WebSocket'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      github: '#',
      demo: '#',
      featured: true
    },
    {
      id: 3,
      title: 'AI Chat Application',
      description: 'Intelligent chatbot with natural language processing capabilities',
      tech: ['Vue.js', 'OpenAI', 'Node.js', 'MongoDB'],
      image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800',
      github: '#',
      demo: '#',
      featured: false
    },
    {
      id: 4,
      title: 'Task Management System',
      description: 'Collaborative project management tool with team features',
      tech: ['Vue.js', 'Firebase', 'Tailwind'],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      github: '#',
      demo: '#',
      featured: false
    }
  ])

  const experiences = ref([
    {
      id: 1,
      role: 'Senior Full-Stack Developer',
      company: 'Tech Innovations Inc.',
      period: '2022 - Present',
      description: 'Lead development of enterprise applications, mentor junior developers',
      achievements: [
        'Improved application performance by 40%',
        'Led team of 5 developers',
        'Implemented CI/CD pipeline'
      ]
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
        'Won Best UI Award 2021'
      ]
    },
    {
      id: 3,
      role: 'Junior Developer',
      company: 'StartUp Hub',
      period: '2019 - 2020',
      description: 'Built MVPs for early-stage startups',
      achievements: [
        'Launched 5 MVPs',
        'Full-stack development',
        'Agile methodology implementation'
      ]
    }
  ])

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
  }

  function setActiveSection(section) {
    activeSection.value = section
  }

  return {
    isDarkMode,
    activeSection,
    skills,
    projects,
    experiences,
    toggleDarkMode,
    setActiveSection
  }
})