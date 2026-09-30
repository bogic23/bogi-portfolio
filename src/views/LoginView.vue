<template>
  <main class="min-h-screen flex items-center justify-center px-6 pt-28 pb-16 relative overflow-hidden">
    <div
      class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="w-full max-w-md glass-effect rounded-3xl p-8 relative z-10">
      <div class="text-center mb-8">
        <div class="section-tag"><span>⬡</span> Welcome back</div>
        <h1 class="text-3xl md:text-4xl font-display font-bold mt-4">
          Log <span class="gold-gradient">In</span>
        </h1>
        <p class="text-gray-500 text-sm mt-3">Sign in to your account to continue</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
        <div>
          <label for="login-email" class="block text-xs font-medium text-gray-400 tracking-wide mb-2">
            Email
          </label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
            class="auth-input"
          />
        </div>

        <div>
          <label for="login-password" class="block text-xs font-medium text-gray-400 tracking-wide mb-2">
            Password
          </label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
            class="auth-input"
          />
        </div>

        <p v-if="authStore.error" class="text-sm text-red-400/90" role="alert">
          {{ authStore.error }}
        </p>

        <button type="submit" class="btn-primary w-full" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Logging in…' : 'Log In' }}
        </button>
      </form>

      <div class="flex items-center gap-3 my-6" aria-hidden="true">
        <span class="h-px flex-1 bg-white/10"></span>
        <span class="text-xs text-gray-600">or</span>
        <span class="h-px flex-1 bg-white/10"></span>
      </div>

      <button
        type="button"
        @click="handleGoogle"
        :disabled="authStore.isLoading"
        class="btn-google w-full"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.6 2.8c2.3-2.1 3.8-5.1 3.8-8.8z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-3.8 2.9C3.5 21.3 7.4 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4L1.4 6.9C.5 8.6 0 10.2 0 12s.5 3.4 1.4 4.9l3.8-2.5z"
          />
          <path
            fill="#EA4335"
            d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.4 0 3.5 2.7 1.4 6.9l3.8 2.9c1-2.9 3.7-5.1 6.8-5.1z"
          />
        </svg>
        Continue with Google
      </button>

      <p class="text-center text-sm text-gray-500 mt-6">
        No account yet?
        <RouterLink to="/register" class="text-luxury-gold hover:text-luxury-gold-light font-medium">
          Register
        </RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  const ok = await authStore.login({ email: email.value, password: password.value })
  if (ok) router.push('/')
}

async function handleGoogle() {
  const ok = await authStore.loginWithGoogle()
  if (ok) router.push('/')
}
</script>

<style scoped>
.auth-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.auth-input::placeholder {
  color: #525252;
}
.auth-input:focus {
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.12);
}
.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: #fff;
  color: #1f1f1f;
  font-size: 0.9rem;
  font-weight: 600;
  transition:
    box-shadow 0.2s ease,
    transform 0.15s ease,
    opacity 0.2s ease;
}
.btn-google:hover:not(:disabled) {
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}
.btn-google:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
