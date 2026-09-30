<template>
  <section>
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-display font-semibold">
        Experiences
        <span class="text-sm text-gray-500 font-normal">({{ items.length }})</span>
      </h2>
      <button @click="openAdd" class="btn-primary !px-5 !py-2.5 text-sm">+ Add Experience</button>
    </div>

    <p v-if="listError" class="text-sm text-red-400/90 mb-4" role="alert">{{ listError }}</p>
    <p v-if="isLoading" class="text-sm text-gray-500">Loading experiences…</p>

    <div v-else class="space-y-4">
      <div v-for="item in items" :key="item.id" class="glass-effect rounded-2xl p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <span
              class="inline-block px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/15 text-luxury-gold text-xs font-semibold rounded-full mb-2"
            >
              {{ item.period }}
            </span>
            <h3 class="font-display font-semibold text-lg">{{ item.role }}</h3>
            <p class="text-luxury-gold text-sm mb-2">{{ item.company }}</p>
            <p class="text-gray-500 text-sm mb-3">{{ item.description }}</p>
            <ul class="space-y-1">
              <li
                v-for="achievement in item.achievements"
                :key="achievement"
                class="text-sm text-gray-400 flex items-start gap-2"
              >
                <span class="text-luxury-gold">✓</span>{{ achievement }}
              </li>
            </ul>
          </div>
          <div class="flex shrink-0 gap-2">
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
      <p v-if="!items.length" class="text-gray-600 text-sm text-center py-8">
        No experiences yet. Add the first one.
      </p>
    </div>

    <AdminModal
      :open="showModal"
      :title="editing ? 'Edit Experience' : 'Add Experience'"
      @close="showModal = false"
    >
      <form @submit.prevent="handleSave" class="space-y-4" novalidate>
        <div>
          <label class="admin-label" for="exp-role">Role *</label>
          <input id="exp-role" v-model="form.role" class="admin-input" maxlength="100" required />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="admin-label" for="exp-company">Company *</label>
            <input
              id="exp-company"
              v-model="form.company"
              class="admin-input"
              maxlength="100"
              required
            />
          </div>
          <div>
            <label class="admin-label" for="exp-period">Period *</label>
            <input
              id="exp-period"
              v-model="form.period"
              class="admin-input"
              maxlength="40"
              placeholder="2022 - Present"
              required
            />
          </div>
        </div>
        <div>
          <label class="admin-label" for="exp-description">Description *</label>
          <textarea
            id="exp-description"
            v-model="form.description"
            rows="3"
            maxlength="1000"
            class="admin-input"
            required
          ></textarea>
        </div>
        <div>
          <label class="admin-label" for="exp-achievements">Achievements (one per line) *</label>
          <textarea
            id="exp-achievements"
            v-model="form.achievements"
            rows="4"
            class="admin-input"
            placeholder="Improved performance by 40%&#10;Led team of 5 developers"
          ></textarea>
        </div>
        <div>
          <label class="admin-label" for="exp-order">Order</label>
          <input
            id="exp-order"
            v-model.number="form.order"
            type="number"
            min="0"
            class="admin-input"
          />
        </div>

        <p v-if="formError" class="text-sm text-red-400/90" role="alert">{{ formError }}</p>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="showModal = false" class="btn-ghost-sm !px-4 !py-2 !text-sm">
            Cancel
          </button>
          <button type="submit" class="btn-primary !px-5 !py-2 text-sm" :disabled="isSaving">
            {{ isSaving ? 'Saving…' : editing ? 'Save changes' : 'Add experience' }}
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
  return { role: '', company: '', period: '', description: '', achievements: '', order: 0 }
}

async function fetchItems() {
  isLoading.value = true
  listError.value = ''
  try {
    const snap = await getDocs(collection(db, 'experiences'))
    items.value = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  } catch (e) {
    listError.value = e?.message ?? 'Failed to load experiences.'
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
    role: item.role ?? '',
    company: item.company ?? '',
    period: item.period ?? '',
    description: item.description ?? '',
    achievements: (item.achievements ?? []).join('\n'),
    order: item.order ?? 0,
  }
  formError.value = ''
  showModal.value = true
}

function buildPayload() {
  const role = form.value.role.trim()
  const company = form.value.company.trim()
  const period = form.value.period.trim()
  const description = form.value.description.trim()
  const achievements = form.value.achievements
    .split('\n')
    .map((a) => a.trim())
    .filter(Boolean)
  const order = Number(form.value.order)
  if (!role || role.length > 100) return { error: 'Role is required (max 100 chars).' }
  if (!company || company.length > 100) return { error: 'Company is required (max 100 chars).' }
  if (!period || period.length > 40) return { error: 'Period is required (max 40 chars).' }
  if (!description || description.length > 1000)
    return { error: 'Description is required (max 1000 chars).' }
  if (!achievements.length || achievements.length > 15)
    return { error: 'Add 1–15 achievements.' }
  if (achievements.some((a) => a.length > 200))
    return { error: 'Each achievement must be 200 characters or less.' }
  if (!Number.isFinite(order) || order < 0) return { error: 'Order must be 0 or higher.' }
  // Only schema fields — Firestore rules reject anything else.
  return { payload: { role, company, period, description, achievements, order } }
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
      await updateDoc(doc(db, 'experiences', editing.value.id), payload)
    } else {
      await addDoc(collection(db, 'experiences'), payload)
    }
    showModal.value = false
    await fetchItems()
  } catch (e) {
    formError.value = e?.message ?? 'Failed to save experience.'
  } finally {
    isSaving.value = false
  }
}

async function handleDelete(id) {
  confirmDeleteId.value = null
  try {
    await deleteDoc(doc(db, 'experiences', id))
    await fetchItems()
  } catch (e) {
    listError.value = e?.message ?? 'Failed to delete experience.'
  }
}

onMounted(fetchItems)
</script>
