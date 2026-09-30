<template>
  <section id="contact" class="py-28 relative overflow-hidden">
    <!-- Background accents -->
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
    <div class="absolute top-1/3 left-0 w-64 h-64 bg-luxury-bronze/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

    <div class="container mx-auto px-6">
      <!-- Section Header -->
      <div ref="headerRef" class="section-header reveal-hidden">
        <div class="section-tag"><span>⬡</span> Say Hello</div>
        <h2 class="text-4xl md:text-5xl font-display font-bold mb-4">
          Get In <span class="gold-gradient">Touch</span>
        </h2>
        <div class="section-divider"></div>
        <p class="text-gray-500 mt-5 max-w-2xl mx-auto">
          Have a project in mind? Let's create something amazing together
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <!-- Left — Contact info -->
        <div ref="infoRef" class="reveal-left">
          <h3 class="text-2xl font-display font-semibold mb-4 text-luxury-gold">
            Let's work together
          </h3>
          <p class="text-gray-400 mb-8 leading-relaxed">
            I'm always interested in hearing about new projects and opportunities.
            Whether you have a question or just want to say hi, feel free to reach out!
          </p>

          <!-- Contact details -->
          <div class="space-y-4 mb-10">
            <a
              v-for="item in contactInfo"
              :key="item.label"
              :href="item.href"
              class="contact-item flex items-center gap-4 p-4 glass-effect rounded-2xl transition-all duration-300 hover:border-luxury-gold/25 hover:shadow-gold-sm group"
            >
              <div class="w-12 h-12 rounded-xl bg-luxury-gold/10 flex items-center justify-center transition-all duration-300 group-hover:bg-luxury-gold group-hover:shadow-gold-sm shrink-0">
                <span class="text-xl transition-all duration-300 group-hover:scale-110 block">{{ item.icon }}</span>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-0.5">{{ item.label }}</div>
                <div class="font-medium text-sm transition-colors duration-300 group-hover:text-luxury-gold">{{ item.value }}</div>
              </div>
              <svg class="w-4 h-4 text-gray-600 ml-auto transition-all duration-300 group-hover:text-luxury-gold group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- Social links -->
          <div>
            <h4 class="text-sm font-semibold text-gray-400 mb-4 tracking-widest uppercase">Find me on</h4>
            <div class="flex gap-3 flex-wrap">
              <a
                v-for="(social, i) in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="social-btn"
                :style="{ transitionDelay: `${i * 50}ms` }"
                :title="social.name"
              >
                <span class="text-base">{{ social.icon }}</span>
                <span class="social-label">{{ social.name }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Right — Form -->
        <div ref="formRef" class="reveal-right">
          <div class="glass-effect rounded-3xl p-8 relative overflow-hidden">
            <!-- Corner accent -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-bl-3xl pointer-events-none"></div>

            <h3 class="text-xl font-display font-semibold mb-6">Send a message</h3>

            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Name -->
              <div class="input-wrapper">
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="input-floating"
                  placeholder=" "
                  id="contact-name"
                  autocomplete="name"
                />
                <label for="contact-name" class="input-label">Your Name</label>
              </div>

              <!-- Email -->
              <div class="input-wrapper">
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="input-floating"
                  placeholder=" "
                  id="contact-email"
                  autocomplete="email"
                />
                <label for="contact-email" class="input-label">Email Address</label>
              </div>

              <!-- Subject -->
              <div class="input-wrapper">
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  class="input-floating"
                  placeholder=" "
                  id="contact-subject"
                />
                <label for="contact-subject" class="input-label">Subject</label>
              </div>

              <!-- Message -->
              <div class="input-wrapper">
                <textarea
                  v-model="form.message"
                  required
                  rows="5"
                  class="textarea-floating"
                  placeholder=" "
                  id="contact-message"
                ></textarea>
                <label for="contact-message" class="input-label textarea-label">Message</label>
              </div>

              <!-- Submit button -->
              <button
                type="submit"
                class="btn-primary w-full flex items-center justify-center gap-2 relative overflow-hidden"
                :disabled="isSubmitting"
                :class="{ 'opacity-70 cursor-not-allowed': isSubmitting }"
              >
                <transition
                  enter-active-class="transition-all duration-200"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition-all duration-150"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                  mode="out-in"
                >
                  <span v-if="isSubmitting" class="flex items-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Sending...
                  </span>
                  <span v-else class="flex items-center gap-2">
                    Send Message
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                  </span>
                </transition>
              </button>

              <!-- Success message -->
              <transition
                enter-active-class="transition-all duration-400 ease-out"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div v-if="submitted" class="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm">
                  <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Message sent! I'll get back to you shortly.
                </div>
              </transition>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { reveal } = useScrollReveal()
const headerRef = ref(null)
const infoRef   = ref(null)
const formRef   = ref(null)

const form = reactive({ name: '', email: '', subject: '', message: '' })
const isSubmitting = ref(false)
const submitted    = ref(false)

const contactInfo = [
  { icon: '📧', label: 'Email',    value: 'alex.chen@example.com', href: 'mailto:alex.chen@example.com' },
  { icon: '📱', label: 'Phone',    value: '+1 (555) 123-4567',      href: 'tel:+15551234567' },
  { icon: '📍', label: 'Location', value: 'San Francisco, CA',      href: '#' },
]

const socialLinks = [
  { name: 'GitHub',   icon: '🐙', url: 'https://github.com' },
  { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
  { name: 'Twitter',  icon: '𝕏',  url: 'https://twitter.com' },
  { name: 'Dribbble', icon: '🎨', url: 'https://dribbble.com' },
]

async function handleSubmit() {
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  isSubmitting.value = false
  submitted.value    = true
  Object.assign(form, { name: '', email: '', subject: '', message: '' })
  setTimeout(() => { submitted.value = false }, 5000)
}

onMounted(() => {
  reveal(headerRef.value)
  reveal(infoRef.value)
  reveal(formRef.value)
})
</script>

<style scoped>
.contact-item {
  cursor: default;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #9ca3af;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
}
.social-btn:hover {
  background: rgba(212,175,55,0.1);
  border-color: rgba(212,175,55,0.3);
  color: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(212,175,55,0.15);
}

.social-label {
  display: none;
}
@media (min-width: 480px) {
  .social-label { display: inline; }
}
</style>
