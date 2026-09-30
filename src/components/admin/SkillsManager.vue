<template>
  <section>
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-display font-semibold">
        Skills
        <span class="text-sm text-gray-500 font-normal">({{ items.length }})</span>
      </h2>
      <button @click="openAdd" class="btn-primary !px-5 !py-2.5 text-sm">+ Add Skill</button>
    </div>

    <p v-if="listError" class="text-sm text-red-400/90 mb-4" role="alert">{{ listError }}</p>
    <p v-if="isLoading" class="text-sm text-gray-500">Loading skills…</p>

    <div v-else class="glass-effect rounded-2xl overflow-x-auto">
      <table class="admin-table w-full min-w-[640px]">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Level</th>
            <th>Order</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td class="font-medium text-white">{{ item.icon }} {{ item.name }}</td>
            <td class="text-gray-400 capitalize">{{ item.category }}</td>
            <td class="text-luxury-gold">{{ item.level }}%</td>
            <td class="text-gray-500">{{ item.order ?? '—' }}</td>
            <td>
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
            </td>
          </tr>
          <tr v-if="!items.length">
            <td colspan="5" class="text-center text-gray-600 py-8">No skills yet. Add the first one.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminModal :open="showModal" :title="editing ? 'Edit Skill' : 'Add Skill'" @close="showModal = false">
      <form @submit.prevent="handleSave" class="space-y-4" novalidate>
        <div>
          <label class="admin-label" for="skill-name">Name *</label>
          <input id="skill-name" v-model="form.name" class="admin-input" maxlength="60" required />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="admin-label" for="skill-level">Level (0–100) *</label>
            <input
              id="skill-level"
              v-model.number="form.level"
              type="number"
              min="0"
              max="100"
              class="admin-input"
              required
            />
          </div>
          <div>
            <label class="admin-label" for="skill-order">Order</label>
            <input
              id="skill-order"
              v-model.number="form.order"
              type="number"
              min="0"
              class="admin-input"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="admin-label" for="skill-category">Category *</label>
            <select id="skill-category" v-model="form.category" class="admin-input">
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="devops">DevOps</option>
            </select>
          </div>
          <div>
            <label class="admin-label" for="skill-icon">Icon (emoji)</label>
            <input id="skill-icon" v-model="form.icon" class="admin-input" maxlength="10" />
          </div>
        </div>

        <p v-if="formError" class="text-sm text-red-400/90" role="alert">{{ formError }}</p>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="showModal = false" class="btn-ghost-sm !px-4 !py-2 !text-sm">
            Cancel
          </button>
          <button type="submit" class="btn-primary !px-5 !py-2 text-sm" :disabled="isSaving">
            {{ isSaving ? 'Saving…' : editing ? 'Save changes' : 'Add skill' }}
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
  return { name: '', level: 50, category: 'frontend', icon: '', order: 0 }
}

async function fetchItems() {
  isLoading.value = true
  listError.value = ''
  try {
    const snap = await getDocs(collection(db, 'skills'))
    items.value = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  } catch (e) {
    listError.value = e?.message ?? 'Failed to load skills.'
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
    name: item.name ?? '',
    level: item.level ?? 50,
    category: item.category ?? 'frontend',
    icon: item.icon ?? '',
    order: item.order ?? 0,
  }
  formError.value = ''
  showModal.value = true
}

function buildPayload() {
  const name = form.value.name.trim()
  const level = Number(form.value.level)
  const order = Number(form.value.order)
  if (!name) return { error: 'Name is required.' }
  if (!Number.isFinite(level) || level < 0 || level > 100)
    return { error: 'Level must be a number between 0 and 100.' }
  if (!['frontend', 'backend', 'database', 'devops'].includes(form.value.category))
    return { error: 'Invalid category.' }
  if ((form.value.icon ?? '').length > 10) return { error: 'Icon must be 10 characters or less.' }
  if (!Number.isFinite(order) || order < 0) return { error: 'Order must be 0 or higher.' }
  // Only schema fields — Firestore rules reject anything else.
  return {
    payload: {
      name,
      level,
      category: form.value.category,
      icon: form.value.icon ?? '',
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
      await updateDoc(doc(db, 'skills', editing.value.id), payload)
    } else {
      await addDoc(collection(db, 'skills'), payload)
    }
    showModal.value = false
    await fetchItems()
  } catch (e) {
    formError.value = e?.message ?? 'Failed to save skill.'
  } finally {
    isSaving.value = false
  }
}

async function handleDelete(id) {
  confirmDeleteId.value = null
  try {
    await deleteDoc(doc(db, 'skills', id))
    await fetchItems()
  } catch (e) {
    listError.value = e?.message ?? 'Failed to delete skill.'
  }
}

onMounted(fetchItems)
</script>
