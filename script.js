// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Set initial state
    gsap.set(['.hero-badge', '.hero-title', '.hero-subtitle', '.hero-actions', '.hero-stats'], {
        opacity: 0,
        y: 30
    });

    // Hero Content Animation - use 'to' instead of 'from'
    gsap.to('.hero-badge', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2
    });

    gsap.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4
    });

    gsap.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.6
    });

    gsap.to('.hero-actions', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.8
    });

    gsap.to('.hero-stats', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 1
    });

    // Whiteboard Mockup Animation
    gsap.set('.whiteboard-mockup', { opacity: 0, scale: 0.95 });
    gsap.to('.whiteboard-mockup', {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5
    });

    // Animate SVG drawings
    gsap.set('.wb-drawing rect', { opacity: 0, scale: 0.8 });
    gsap.to('.wb-drawing rect', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 1.2,
        ease: 'back.out(1.5)'
    });

    gsap.set('.wb-drawing circle', { opacity: 0, scale: 0.8 });
    gsap.to('.wb-drawing circle', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 1.4,
        ease: 'back.out(1.5)'
    });

    gsap.set('.wb-drawing path', { opacity: 0 });
    gsap.to('.wb-drawing path', {
        opacity: 1,
        duration: 0.8,
        delay: 1.6,
        ease: 'power2.out'
    });
});

// Hero Content Animation
gsap.from('.hero-badge', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.2
});

gsap.from('.hero-title', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    delay: 0.4
});

gsap.from('.hero-subtitle', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.6
});

gsap.from('.hero-actions', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.8
});

gsap.from('.hero-stats .stat', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    delay: 1
});

// Hero Visual Animation
gsap.from('.canvas-preview', {
    opacity: 0,
    scale: 0.95,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.5
});

// Scroll Animations - Features
gsap.utils.toArray('.feature-card').forEach((card, index) => {
    gsap.from(card, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
        }
    });
});

// Scroll Animations - Platforms
gsap.utils.toArray('.platform-card').forEach((card, index) => {
    gsap.from(card, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: index * 0.08,
        ease: 'back.out(1.4)',
        clearProps: 'all',
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
        }
    });
});

// Scroll Animations - Tech
gsap.utils.toArray('.tech-item').forEach((item, index) => {
    gsap.from(item, {
        opacity: 0,
        x: -40,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true
        }
    });
});

gsap.utils.toArray('.stack-badge').forEach((badge, index) => {
    gsap.from(badge, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        delay: index * 0.05,
        ease: 'back.out(1.5)',
        clearProps: 'all',
        scrollTrigger: {
            trigger: badge,
            start: 'top 85%',
            once: true
        }
    });
});

// Scroll Animations - Download
gsap.from('.download-title', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.download',
        start: 'top 70%'
    }
});

gsap.from('.download-subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.download',
        start: 'top 70%'
    }
});

gsap.from('.download-buttons', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.4,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.download',
        start: 'top 70%'
    }
});

// Section Headers Animation
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: header,
            start: 'top 85%'
        }
    });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        nav.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// Button Hover Effects
const buttons = document.querySelectorAll('.btn-primary, .btn-download');

buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Feature Cards Tilt Effect
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 1000
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});

// Platform Cards Float Animation
const platformCards = document.querySelectorAll('.platform-card');

platformCards.forEach((card, index) => {
    gsap.to(card, {
        y: -10,
        duration: 2 + (index * 0.2),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.1
    });
});

// Stats Counter Animation
const statValues = document.querySelectorAll('.stat-value');

statValues.forEach(stat => {
    const text = stat.textContent;
    const isNumber = !isNaN(text.replace('+', ''));

    if (isNumber) {
        gsap.from(stat, {
            textContent: 0,
            duration: 2,
            ease: 'power2.out',
            delay: 1.2,
            snap: { textContent: 1 },
            onUpdate: function() {
                stat.textContent = Math.ceil(this.targets()[0].textContent) + '+';
            }
        });
    }
});

// Respect Reduced Motion Preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    gsap.globalTimeline.clear();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    platformCards.forEach(card => {
        gsap.set(card, { clearProps: 'all' });
    });
}

// Console Message
console.log(
    '%cFlowMuse',
    'font-size: 32px; font-weight: 700; color: #A16207; font-family: DM Sans;'
);
console.log(
    '%c自由流动的白板笔记 · 基于 Flutter 构建',
    'font-size: 14px; color: #78716C; font-family: DM Sans;'
);
