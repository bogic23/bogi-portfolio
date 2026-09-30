/**
 * useScrollReveal
 *
 * Composable that wires IntersectionObserver to a list of elements, adding
 * the `is-visible` class when they scroll into view.
 *
 * Usage:
 *   const { reveal, revealAll } = useScrollReveal()
 *
 *   // In template: <div ref="el => reveal(el)" class="reveal-hidden">...</div>
 *   // Or bind an array: items.forEach((_, i) => revealAll(sectionRef.value, 'reveal-hidden', i))
 */

import { onUnmounted } from 'vue'

export function useScrollReveal(options = {}) {
  const {
    threshold = 0.12,
    rootMargin = '0px 0px -40px 0px',
    once = true,
  } = options

  const observers = []

  /**
   * Observe a single element.
   * @param {Element|null} el
   * @param {Object} opts  - per-element overrides
   */
  function reveal(el, opts = {}) {
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      {
        threshold: opts.threshold ?? threshold,
        rootMargin: opts.rootMargin ?? rootMargin,
      }
    )

    observer.observe(el)
    observers.push(observer)
  }

  /**
   * Observe all direct children of a container, adding a stagger delay.
   * @param {Element|null} container
   * @param {string} className    - reveal class to add to each child
   * @param {number} baseDelay    - base delay in ms
   * @param {number} staggerMs    - additional ms per child index
   */
  function revealChildren(container, className = 'reveal-hidden', baseDelay = 0, staggerMs = 80) {
    if (!container) return

    const children = Array.from(container.children)
    children.forEach((child, index) => {
      child.classList.add(className)
      child.style.transitionDelay = `${baseDelay + index * staggerMs}ms`
      reveal(child)
    })
  }

  /**
   * Observe a specific element with a stagger index applied as a delay.
   * @param {Element|null} el
   * @param {number} index
   * @param {number} staggerMs
   */
  function revealStaggered(el, index = 0, staggerMs = 80) {
    if (!el) return
    el.style.transitionDelay = `${index * staggerMs}ms`
    reveal(el)
  }

  onUnmounted(() => {
    observers.forEach((obs) => obs.disconnect())
  })

  return { reveal, revealChildren, revealStaggered }
}
