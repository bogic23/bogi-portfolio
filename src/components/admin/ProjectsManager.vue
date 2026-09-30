<template>
  <section>
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-display font-semibold">
        Projects
        <span class="text-sm text-gray-500 font-normal">({{ items.length }})</span>
      </h2>
      <button @click="openAdd" class="btn-primary !px-5 !py-2.5 text-sm">+ Add Project</button>
    </div>

    <p v-if="listError" class="text-sm text-red-400/90 mb-4" role="alert">{{ listError }}</p>
    <p v-if="isLoading" class="text-sm text-gray-500">Loading projects…</p>

    <div v-else class="grid md:grid-cols-2 gap-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="glass-effect rounded-2xl overflow-hidden"
      >
        <div class="h-36 overflow-hidden bg-white/5">
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div class="p-5">
          <div class="flex items-start justify-between gap-3 mb-1">
            <h3 class="font-display font-semibold">{{ item.title }}</h3>
            <span
              v-if="item.featured"
              class="shrink-0 px-2 py-0.5 bg-luxury-gold text-luxury-darker text-xs font-bold rounded-full"
            >
              Featured
            </span>
          </div>
          <p class="text-gray-500 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span
              v-for="tech in item.tech"
              :key="tech"
              class="px-2 py-0.5 bg-luxury-gold/8 border border-luxury-gold/15 text-luxury-gold text-xs rounded-full"
            >
              {{ tech }}
            </span>
          </div>
          <div class="flex justify-end gap-2">
            <button @click="openEdit(item)" class="btn-ghost-sm">Edit</button>
            <button
              v-if="confirmDeleteId !== item.id"
              @click="confirmDeleteId = item.id"
              class="btn-ghost-sm hover:!text-red-400"
            >
              Delete
            </button>
            <button v-else @click="handleDelete(item.id)" class="btn-danger !px-3 !py-1.5 !text-xs">
              Confirm?
            </button>
          </div>
        </div>
      </div>
      <p v-if="!items.length" class="text-gray-600 text-sm md:col-span-2 text-center py-8">
        No projects yet. Add the first one.
      </p>
    </div>

    <AdminModal
      :open="showModal"
      :title="editing ? 'Edit Project' : 'Add Project'"
      @close="showModal = false"
    >
      <form @submit.prevent="handleSave" class="space-y-4" novalidate>
        <div>
          <label class="admin-label" for="project-title">Title *</label>
          <input id="project-title" v-model="form.title" class="admin-input" maxlength="100" required />
        </div>
        <div>
          <label class="admin-label" for="project-description">Description *</label>
          <textarea
            id="project-description"
            v-model="form.description"
            rows="3"
            maxlength="1000"
            class="admin-input"
            required
          ></textarea>
        </div>
        <div>
          <label class="admin-label" for="project-tech">Tech stack (comma-separated) *</label>
          <input
            id="project-tech"
            v-model="form.tech"
            class="admin-input"
            placeholder="Vue.js, Node.js, PostgreSQL"
          />
        </div>
        <div>
          <label class="admin-label" for="project-image">Image URL *</label>
          <input
            id="project-image"
            v-model="form.image"
            type="url"
            class="admin-input"
            placeholder="https://…"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="admin-label" for="project-github">GitHub URL</label>
            <input id="project-github" v-model="form.github" class="admin-input" placeholder="# or https://…" />
          </div>
          <div>
            <label class="admin-label" for="project-demo">Demo URL</label>
            <input id="project-demo" v-model="form.demo" class="admin-input" placeholder="# or https://…" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 items-end">
          <div>
            <label class="admin-label" for="project-order">Order</label>
            <input
              id="project-order"
              v-model.number="form.order"
              type="number"
              min="0"
              class="admin-input"
            />
          </div>
          <label class="flex items-center gap-2 text-sm text-gray-300 pb-2.5 cursor-pointer">
            <input v-model="form.featured" type="checkbox" class="accent-[#d4af37] w-4 h-4" />
            Featured
          </label>
        </div>

        <p v-if="formError" class="text-sm text-red-400/90" role="alert">{{ formError }}</p>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="showModal = false" class="btn-ghost-sm !px-4 !py-2 !text-sm">
            Cancel
          </button>
          <button type="submit" class="btn-primary !px-5 !py-2 text-sm" :disabled="isSaving">
            {{ isSaving ? 'Saving…' : editing ? 'Save changes' : 'Add project' }}
          </button>
        </div>
      </form>
    </AdminModal>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import AdminModal from './AdminModal.vue'

const items = ref([])
const isLoading = ref(false)
const isSaving = ref(false)
const listError = ref('')
const formError = ref('')
const showModal = ref(false)
const editing = ref(null)
const confirmDeleteId = ref(null)
const form = ref(emptyForm())

function emptyForm() {
  return {
    title: '',
    description: '',
    tech: '',
    image: '',
    github: '#',
    demo: '#',
    featured: false,
    order: 0,
  }
}

function isHttpUrl(value) {
  return /^https?:\/\/.+/.test(value)
}

async function fetchItems() {
  isLoading.value = true
  listError.value = ''
  try {
    const snap = await getDocs(collection(db, 'projects'))
    items.value = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  } catch (e) {
    listError.value = e?.message ?? 'Failed to load projects.'
  } finally {
    isLoading.value = false
  }
}

function openAdd() {
  editing.value = null
  form.value = emptyForm()
  formError.value = ''
  showModal.value = true
}

function openEdit(item) {
  editing.value = item
  form.value = {
    title: item.title ?? '',
    description: item.description ?? '',
    tech: (item.tech ?? []).join(', '),
    image: item.image ?? '',
    github: item.github ?? '#',
    demo: item.demo ?? '#',
    featured: item.featured ?? false,
    order: item.order ?? 0,
  }
  formError.value = ''
  showModal.value = true
}

function buildPayload() {
  const title = form.value.title.trim()
  const description = form.value.description.trim()
  const tech = form.value.tech
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  const image = form.value.image.trim()
  const order = Number(form.value.order)
  if (!title || title.length > 100) return { error: 'Title is required (max 100 chars).' }
  if (!description || description.length > 1000)
    return { error: 'Description is required (max 1000 chars).' }
  if (!tech.length || tech.length > 15) return { error: 'Add 1–15 tech tags.' }
  if (!isHttpUrl(image) || image.length > 500)
    return { error: 'Image must be a valid http(s) URL.' }
  for (const link of [form.value.github, form.value.demo]) {
    const v = (link ?? '').trim()
    if (v && v !== '#' && !isHttpUrl(v)) return { error: 'GitHub/Demo must be a URL or "#".' }
  }
  if (!Number.isFinite(order) || order < 0) return { error: 'Order must be 0 or higher.' }
  // Only schema fields — Firestore rules reject anything else.
  return {
    payload: {
      title,
      description,
      tech,
      image,
      github: (form.value.github ?? '').trim() || '#',
      demo: (form.value.demo ?? '').trim() || '#',
      featured: !!form.value.featured,
      order,
    },
  }
}

async function handleSave() {
  const { payload, error } = buildPayload()
  if (error) {
    formError.value = error
    return
  }
  isSaving.value = true
  formError.value = ''
  try {
    if (editing.value) {
      await updateDoc(doc(db, 'projects', editing.value.id), payload)
    } else {
      await addDoc(collection(db, 'projects'), payload)
    }
    showModal.value = false
    await fetchItems()
  } catch (e) {
    formError.value = e?.message ?? 'Failed to save project.'
  } finally {
    isSaving.value = false
  }
}

async function handleDelete(id) {
  confirmDeleteId.value = null
  try {
    await deleteDoc(doc(db, 'projects', id))
    await fetchItems()
  } catch (e) {
    listError.value = e?.message ?? 'Failed to delete project.'
  }
}

onMounted(fetchItems)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
