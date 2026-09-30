<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')"></div>
      <div
        class="relative w-full max-w-lg glass-effect rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-display font-semibold">{{ title }}</h3>
          <button
            @click="$emit('close')"
            class="btn-ghost-sm"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
})

defineEmits(['close'])
</script>
