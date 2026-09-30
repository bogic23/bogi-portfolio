// Seeds Firestore collections for the portfolio site.
// Usage: `npm run seed:firestore` (loads .env via `node --env-file=.env`).
//
// IMPORTANT ordering (rules deny client writes):
//   1. Create a Firestore database (console or `firebase firestore:databases:create`).
//   2. Run `npm run seed:firestore` BEFORE deploying the restrictive rules,
//      OR seed via Firebase Console (Console bypasses rules).
//   3. Then `firebase deploy --only firestore:rules`.
//
// Reads client config from VITE_ env vars (.env). Uses the web SDK so no
// service-account key is needed; run once from a trusted machine.

import { initializeApp } from 'firebase/app'
import { collection, doc, getDocs, getFirestore, writeBatch } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
}

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.error('Missing VITE_API_KEY / VITE_PROJECT_ID / VITE_APP_ID env vars.')
  process.exit(1)
}

const skills = [
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

const projects = [
  {
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

const experiences = [
  {
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
    role: 'Junior Developer',
    company: 'StartUp Hub',
    period: '2019 - 2020',
    description: 'Built MVPs for early-stage startups',
    achievements: ['Launched 5 MVPs', 'Full-stack development', 'Agile methodology implementation'],
    order: 2,
  },
]

async function seedCollection(db, name, docs, idFn) {
  const existing = await getDocs(collection(db, name))
  if (!existing.empty) {
    console.log(`- ${name}: already has ${existing.size} docs, skipping (delete manually to reseed).`)
    return
  }
  const batch = writeBatch(db)
  docs.forEach((data, i) => {
    const id = idFn(data, i)
    batch.set(id ? doc(db, name, id) : doc(collection(db, name)), data)
  })
  await batch.commit()
  console.log(`- ${name}: seeded ${docs.length} docs.`)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

await seedCollection(db, 'skills', skills, (s) => s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
await seedCollection(db, 'projects', projects, (_, i) => `project-${i + 1}`)
await seedCollection(db, 'experiences', experiences, (_, i) => `experience-${i + 1}`)
console.log('Done.')
