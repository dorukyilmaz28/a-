// ============================================
// TOUCH INTERACTION FOR GRADIENT SHIFT
// ============================================

let hero;
let interactive;
let touchStartX = 0;
let touchStartY = 0;

// Handle touch/mouse movement to shift gradient
function handleInteraction(e) {
    if (!hero || !interactive) return;
    
    let clientX, clientY;
    
    // Get coordinates based on input type
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    // Calculate percentage based on screen dimensions
    const xPercent = (clientX / window.innerWidth) * 100;
    const yPercent = (clientY / window.innerHeight) * 100;
    
    // Update gradient position for hero section
    hero.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    
    // Update gradient position for interactive section
    interactive.style.backgroundPosition = `${100 - xPercent}% ${100 - yPercent}%`;
}

// ============================================
// SCROLL-TRIGGERED FADE-IN ANIMATIONS
// ============================================

let messageItems;
let observer;

function initScrollAnimations() {
    messageItems = document.querySelectorAll('.message-item');
    
    if (messageItems.length === 0) return;
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on index for staggered effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all message items
    messageItems.forEach(item => {
        observer.observe(item);
    });
}

// ============================================
// SMOOTH SCROLL BEHAVIOR ENHANCEMENT
// ============================================

// Add smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15/dist/smooth-scroll.polyfills.min.js';
    document.head.appendChild(script);
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Throttle function for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to touch/mouse move events
const throttledHandleInteraction = throttle(handleInteraction, 16); // ~60fps

function initInteractionEvents() {
    if (!hero || !interactive) return;
    
    // Add event listeners for touch and mouse
    if ('ontouchstart' in window) {
        // Mobile touch events
        document.addEventListener('touchmove', throttledHandleInteraction, { passive: true });
        document.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        });
    } else {
        // Desktop mouse events
        document.addEventListener('mousemove', throttledHandleInteraction);
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Ensure all animations start properly
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    hero = document.getElementById('hero');
    interactive = document.getElementById('interactive');
    
    // Initialize all features
    initInteractionEvents();
    initScrollAnimations();
    
    // Ensure elements are visible (CSS animations will handle the rest)
    // No need to manually set opacity as CSS animations handle it
});

