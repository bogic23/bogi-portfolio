import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/firebase'

const DEFAULT_ROLE = 'guest'

function friendlyAuthError(e) {
  const code = e?.code ?? ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in instead.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled before completing.'
    case 'auth/popup-blocked':
      return 'Popup was blocked by the browser. Please allow popups and try again.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Google sign-in. Add it under Authentication > Settings > Authorized domains.'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email. Log in with email/password instead.'
    default:
      return e?.message ?? 'Something went wrong. Please try again.'
  }
}

async function ensureUserProfile(firebaseUser, displayNameFallback = '') {
  const userRef = doc(db, 'users', firebaseUser.uid)
  const snap = await getDoc(userRef)
  if (snap.exists()) return { id: snap.id, ...snap.data() }

  // Self-heal: account existed before profiles were introduced (or doc was
  // deleted) — recreate it locked to the default role.
  const fallbackName =
    displayNameFallback || (firebaseUser.email ? firebaseUser.email.split('@')[0] : '')
  const profile = {
    email: firebaseUser.email ?? '',
    displayName: ((firebaseUser.displayName ?? '') || fallbackName).slice(0, 60),
    role: DEFAULT_ROLE,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  await setDoc(userRef, profile)
  const fresh = await getDoc(userRef)
  return { id: fresh.id, ...fresh.data() }
}

let listenerStarted = false

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null) // { uid, email, displayName }
  const profile = ref(null) // Firestore users/{uid} doc incl. role
  const isLoading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  function setUser(firebaseUser) {
    user.value = firebaseUser
      ? {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        }
      : null
  }

  async function register({ displayName, email, password }) {
    isLoading.value = true
    error.value = null
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      if (displayName?.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() })
      }
      // Role is ALWAYS 'guest' here; Firestore rules reject anything else.
      await setDoc(doc(db, 'users', cred.user.uid), {
        email: cred.user.email ?? '',
        displayName: displayName?.trim() ?? '',
        role: DEFAULT_ROLE,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      setUser({ ...cred.user, displayName: displayName?.trim() || cred.user.displayName })
      profile.value = await ensureUserProfile(cred.user, displayName?.trim() ?? '')
      return true
    } catch (e) {
      error.value = friendlyAuthError(e)
      console.error('[auth] register failed:', e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function login({ email, password }) {
    isLoading.value = true
    error.value = null
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
      setUser(cred.user)
      profile.value = await ensureUserProfile(cred.user)
      return true
    } catch (e) {
      error.value = friendlyAuthError(e)
      console.error('[auth] login failed:', e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function loginWithGoogle() {
    isLoading.value = true
    error.value = null
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider())
      setUser(cred.user)
      // New Google users get a users/{uid} doc locked to role "guest";
      // returning users load their existing profile.
      profile.value = await ensureUserProfile(cred.user)
      return true
    } catch (e) {
      error.value = friendlyAuthError(e)
      console.error('[auth] google sign-in failed:', e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    error.value = null
    try {
      await signOut(auth)
      setUser(null)
      profile.value = null
      return true
    } catch (e) {
      error.value = friendlyAuthError(e)
      console.error('[auth] logout failed:', e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function initAuth() {
    if (listenerStarted) return
    listenerStarted = true
    onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          profile.value = await ensureUserProfile(firebaseUser)
        } catch (e) {
          console.error('[auth] failed to load profile:', e)
        }
      } else {
        profile.value = null
      }
      initialized.value = true
    })
  }

  initAuth()

  return {
    user,
    profile,
    isLoading,
    error,
    initialized,
    register,
    login,
    loginWithGoogle,
    logout,
    initAuth,
  }
})
