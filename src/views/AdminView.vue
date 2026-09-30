<template>
  <main class="min-h-screen px-6 pt-28 pb-16 relative overflow-hidden">
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-luxury-gold/5 blur-3xl pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="max-w-6xl mx-auto relative z-10">
      <div class="text-center mb-10">
        <div class="section-tag"><span>⬡</span> Admin</div>
        <h1 class="text-3xl md:text-4xl font-display font-bold mt-4">
          Admin <span class="gold-gradient">Dashboard</span>
        </h1>
        <p class="text-gray-500 text-sm mt-3">
          Manage portfolio content and users
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-3 mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
          :class="
            activeTab === tab.value
              ? 'bg-luxury-gold text-luxury-darker shadow-gold-sm'
              : 'glass-effect text-gray-400 hover:text-luxury-gold'
          "
        >
          {{ tab.label }}
        </button>
      </div>

      <SkillsManager v-if="activeTab === 'skills'" />
      <ProjectsManager v-else-if="activeTab === 'projects'" />
      <ExperiencesManager v-else-if="activeTab === 'experiences'" />
      <UsersManager v-else-if="activeTab === 'users'" />
      <MessagesManager v-else-if="activeTab === 'messages'" />
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import SkillsManager from '@/components/admin/SkillsManager.vue'
import ProjectsManager from '@/components/admin/ProjectsManager.vue'
import ExperiencesManager from '@/components/admin/ExperiencesManager.vue'
import UsersManager from '@/components/admin/UsersManager.vue'
import MessagesManager from '@/components/admin/MessagesManager.vue'

const activeTab = ref('skills')

const tabs = [
  { value: 'skills', label: 'Skills' },
  { value: 'projects', label: 'Projects' },
  { value: 'experiences', label: 'Experiences' },
  { value: 'users', label: 'Users' },
  { value: 'messages', label: 'Messages' },
]
</script>
