<template>
  <section>
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-display font-semibold">
        Users
        <span class="text-sm text-gray-500 font-normal">({{ items.length }})</span>
      </h2>
      <button @click="fetchItems" class="btn-ghost-sm !px-4 !py-2 !text-sm">↻ Refresh</button>
    </div>

    <p class="text-xs text-gray-600 mb-4">
      Roles control dashboard access. Removing a profile here does not delete the Firebase
      Authentication account — remove that in the Firebase Console if needed.
    </p>

    <p v-if="listError" class="text-sm text-red-400/90 mb-4" role="alert">{{ listError }}</p>
    <p v-if="isLoading" class="text-sm text-gray-500">Loading users…</p>

    <div v-else class="glass-effect rounded-2xl overflow-x-auto">
      <table class="admin-table w-full min-w-[720px]">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Joined</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>
              <p class="font-medium text-white">{{ item.displayName || '—' }}</p>
              <p class="text-gray-500 text-xs">{{ item.email }}</p>
              <p v-if="item.id === authStore.user?.uid" class="text-luxury-gold text-xs mt-0.5">
                (you)
              </p>
            </td>
            <td>
              <span
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="
                  item.role === 'admin'
                    ? 'bg-luxury-gold/15 border border-luxury-gold/30 text-luxury-gold'
                    : 'bg-white/5 border border-white/10 text-gray-400'
                "
              >
                {{ item.role }}
              </span>
            </td>
            <td class="text-gray-500 text-xs">{{ formatDate(item.createdAt) }}</td>
            <td>
              <div class="flex justify-end items-center gap-2">
                <select
                  :value="item.role"
                  :disabled="item.id === authStore.user?.uid || updatingId === item.id"
                  @change="handleRoleChange(item, $event.target.value)"
                  class="admin-input !w-auto !py-1.5 !text-xs"
                  :aria-label="`Role for ${item.email}`"
                >
                  <option value="guest">guest</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  v-if="confirmDeleteId !== item.id"
                  @click="confirmDeleteId = item.id"
                  :disabled="item.id === authStore.user?.uid"
                  class="btn-ghost-sm hover:!text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove profile document"
                >
                  Remove
                </button>
                <button
                  v-else
                  @click="handleDelete(item.id)"
                  class="btn-danger !px-3 !py-1.5 !text-xs"
                >
                  Confirm?
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!items.length">
            <td colspan="4" class="text-center text-gray-600 py-8">No users found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const items = ref([])
const isLoading = ref(false)
const updatingId = ref(null)
const listError = ref('')
const confirmDeleteId = ref(null)

function formatDate(ts) {
  try {
    const date = ts?.toDate?.()
    return date ? date.toLocaleDateString() : '—'
  } catch {
    return '—'
  }
}

async function fetchItems() {
  isLoading.value = true
  listError.value = ''
  try {
    const snap = await getDocs(collection(db, 'users'))
    items.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (e) {
    listError.value = e?.message ?? 'Failed to load users.'
  } finally {
    isLoading.value = false
  }
}

async function handleRoleChange(item, newRole) {
  if (!['guest', 'admin'].includes(newRole) || newRole === item.role) return
  updatingId.value = item.id
  listError.value = ''
  try {
    // Partial update merges with the stored doc, keeping the full
    // profile valid per Firestore rules.
    await updateDoc(doc(db, 'users', item.id), {
      role: newRole,
      updatedAt: serverTimestamp(),
    })
    await fetchItems()
  } catch (e) {
    listError.value = e?.message ?? 'Failed to update role.'
  } finally {
    updatingId.value = null
  }
}

async function handleDelete(id) {
  confirmDeleteId.value = null
  try {
    await deleteDoc(doc(db, 'users', id))
    await fetchItems()
  } catch (e) {
    listError.value = e?.message ?? 'Failed to remove user.'
  }
}

onMounted(fetchItems)
</script>
