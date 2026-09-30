<template>
  <section>
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-display font-semibold">
        Messages
        <span class="text-sm text-gray-500 font-normal">
          ({{ items.length }}{{ unreadCount ? `, ${unreadCount} unread` : '' }})
        </span>
      </h2>
      <button @click="fetchItems" class="btn-ghost-sm !px-4 !py-2 !text-sm">↻ Refresh</button>
    </div>

    <p v-if="listError" class="text-sm text-red-400/90 mb-4" role="alert">{{ listError }}</p>
    <p v-if="isLoading" class="text-sm text-gray-500">Loading messages…</p>

    <div v-else class="space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="glass-effect rounded-2xl p-5"
        :class="{ 'border-luxury-gold/30': !item.read }"
      >
        <div class="flex items-start justify-between gap-3 mb-2">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-display font-semibold">{{ item.subject }}</h3>
              <span
                v-if="!item.read"
                class="px-2 py-0.5 bg-luxury-gold text-luxury-darker text-xs font-bold rounded-full"
              >
                New
              </span>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              From <span class="text-gray-300">{{ item.name }}</span>
              · <span class="text-luxury-gold">{{ item.email }}</span>
              · <span class="text-xs">{{ formatDate(item.createdAt) }}</span>
            </p>
          </div>
          <div class="flex shrink-0 gap-2">
            <a
              :href="`mailto:${item.email}?subject=${encodeURIComponent('Re: ' + (item.subject ?? ''))}`"
              class="btn-ghost-sm"
            >
              Reply
            </a>
            <button @click="toggleRead(item)" class="btn-ghost-sm" :disabled="updatingId === item.id">
              {{ item.read ? 'Unread' : 'Read' }}
            </button>
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
        <p class="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{{ item.message }}</p>
      </div>
      <p v-if="!items.length" class="text-gray-600 text-sm text-center py-8">
        No messages yet.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '@/firebase'

const items = ref([])
const isLoading = ref(false)
const updatingId = ref(null)
const listError = ref('')
const confirmDeleteId = ref(null)

const unreadCount = computed(() => items.value.filter((m) => !m.read).length)

function formatDate(ts) {
  try {
    const date = ts?.toDate?.()
    return date ? date.toLocaleString() : '—'
  } catch {
    return '—'
  }
}

function sortByNewest(list) {
  return [...list].sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0
    const tb = b.createdAt?.toMillis?.() ?? 0
    return tb - ta
  })
}

async function fetchItems() {
  isLoading.value = true
  listError.value = ''
  try {
    const snap = await getDocs(collection(db, 'contact_messages'))
    items.value = sortByNewest(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  } catch (e) {
    listError.value = e?.message ?? 'Failed to load messages.'
  } finally {
    isLoading.value = false
  }
}

async function toggleRead(item) {
  updatingId.value = item.id
  try {
    // Rules allow admins to flip ONLY the `read` flag.
    await updateDoc(doc(db, 'contact_messages', item.id), { read: !item.read })
    item.read = !item.read
  } catch (e) {
    listError.value = e?.message ?? 'Failed to update message.'
  } finally {
    updatingId.value = null
  }
}

async function handleDelete(id) {
  confirmDeleteId.value = null
  try {
    await deleteDoc(doc(db, 'contact_messages', id))
    await fetchItems()
  } catch (e) {
    listError.value = e?.message ?? 'Failed to delete message.'
  }
}

onMounted(fetchItems)
</script>
