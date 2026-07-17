// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Create cursor glow effect
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    // Smooth cursor glow follow
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';

        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Split flow text into individual characters
    const flowTextElement = document.querySelector('.flow-text');
    if (flowTextElement) {
        const text = flowTextElement.getAttribute('data-flow-text');
        flowTextElement.innerHTML = text.split('').map((char, index) =>
            `<span class="flow-char" style="display: inline-block;">${char}</span>`
        ).join('');

        // Animate each character with wave effect
        const flowChars = flowTextElement.querySelectorAll('.flow-char');
        gsap.to(flowChars, {
            y: -15,
            duration: 1.5,
            ease: 'sine.inOut',
            stagger: {
                each: 0.1,
                repeat: -1,
                yoyo: true
            }
        });

        // Add flowing opacity effect
        gsap.to(flowChars, {
            opacity: 0.7,
            duration: 2,
            ease: 'sine.inOut',
            stagger: {
                each: 0.15,
                repeat: -1,
                yoyo: true
            }
        });
    }

    // Interactive Feature Cards - Magnetic Effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            gsap.to(card, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            gsap.to(card, {
                rotateY: deltaX * 10,
                rotateX: -deltaY * 10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Platform Cards - Bounce on Hover
    const platformCards = document.querySelectorAll('.platform-card');
    platformCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -20,
                duration: 0.4,
                ease: 'back.out(2)'
            });

            const icon = card.querySelector('.platform-icon');
            gsap.to(icon, {
                rotation: 360,
                duration: 0.6,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.inOut'
            });
        });
    });

    // Buttons - Elastic Press Effect
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-download, .btn-download-alt');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.inOut'
            });
        });

        btn.addEventListener('mousedown', () => {
            gsap.to(btn, {
                scale: 0.95,
                duration: 0.1,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseup', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.2,
                ease: 'back.out(3)'
            });
        });
    });

    // Tech Stack Badges - Float Animation
    const stackBadges = document.querySelectorAll('.stack-badge');
    stackBadges.forEach((badge, index) => {
        // Random floating animation
        gsap.to(badge, {
            y: -10,
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.1
        });

        badge.addEventListener('mouseenter', () => {
            gsap.to(badge, {
                scale: 1.2,
                rotation: Math.random() * 10 - 5,
                duration: 0.3,
                ease: 'back.out(2)'
            });
        });

        badge.addEventListener('mouseleave', () => {
            gsap.to(badge, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.inOut'
            });
        });
    });

    // Stats - Count Up Animation with ScrollTrigger
    const statValues = document.querySelectorAll('.hero-stats .stat-value');
    statValues.forEach(stat => {
        const text = stat.textContent;
        if (!isNaN(text.replace('+', ''))) {
            const target = parseInt(text.replace('+', ''));
            gsap.from(stat, {
                textContent: 0,
                duration: 2,
                ease: 'power1.out',
                snap: { textContent: 1 },
                delay: 1.2,
                onUpdate: function() {
                    stat.textContent = Math.ceil(this.targets()[0].textContent) + '+';
                }
            });
        }
    });

    // Whiteboard Mockup - Interactive Hover
    const whiteboardMockup = document.querySelector('.whiteboard-mockup');
    if (whiteboardMockup) {
        whiteboardMockup.addEventListener('mousemove', (e) => {
            const rect = whiteboardMockup.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            gsap.to(whiteboardMockup, {
                rotateY: deltaX * 5,
                rotateX: -deltaY * 5,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        whiteboardMockup.addEventListener('mouseleave', () => {
            gsap.to(whiteboardMockup, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }

    // Parallax Scrolling Effect for Hero Section
    gsap.to('.hero-visual', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    // Section Titles - Reveal Animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 1
            },
            opacity: 0,
            y: 50,
            scale: 0.9
        });
    });

    // Feature Icons - Morph on Scroll
    gsap.utils.toArray('.feature-icon').forEach((icon, index) => {
        gsap.from(icon, {
            scrollTrigger: {
                trigger: icon,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0,
            rotation: 360,
            duration: 0.8,
            ease: 'back.out(2)',
            delay: index * 0.05
        });
    });

    // Stats Bar - Slide In from Bottom
    gsap.from('.stats-bar', {
        scrollTrigger: {
            trigger: '.stats-bar',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Tech Number Badges - Sequential Reveal
    gsap.utils.toArray('.tech-number').forEach((num, index) => {
        gsap.from(num, {
            scrollTrigger: {
                trigger: num,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            scale: 0,
            rotation: 720,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
            delay: index * 0.15
        });
    });

    // Mouse Follower for Section Tags
    const sectionTags = document.querySelectorAll('.section-tag');
    sectionTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            gsap.to(tag, {
                scale: 1.1,
                letterSpacing: '0.1em',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        tag.addEventListener('mouseleave', () => {
            gsap.to(tag, {
                scale: 1,
                letterSpacing: '0.05em',
                duration: 0.3,
                ease: 'power2.inOut'
            });
        });
    });

    // Whiteboard Drawing - Animate on Scroll
    const wbDrawing = document.querySelector('.wb-drawing');
    if (wbDrawing) {
        const shapes = wbDrawing.querySelectorAll('rect, circle, path');
        gsap.set(shapes, { opacity: 0, scale: 0.5 });

        gsap.to(shapes, {
            scrollTrigger: {
                trigger: wbDrawing,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)'
        });
    }

    // Footer - Fade Up on Scroll
    gsap.from('.footer', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 95%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out'
    });

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

    // Scroll-triggered animations for feature cards - DISABLED
    // gsap.utils.toArray('.feature-card').forEach((card, index) => {
    //     gsap.from(card, {
    //         scrollTrigger: {
    //             trigger: card,
    //             start: 'top 80%',
    //             once: true
    //         },
    //         opacity: 0,
    //         y: 50,
    //         duration: 0.8,
    //         delay: index * 0.1,
    //         ease: 'power3.out'
    //     });
    // });

    // Scroll-triggered animations for platform cards - DISABLED
    // gsap.utils.toArray('.platform-card').forEach((card, index) => {
    //     gsap.from(card, {
    //         scrollTrigger: {
    //             trigger: card,
    //             start: 'top 80%',
    //             once: true
    //         },
    //         opacity: 0,
    //         scale: 0.8,
    //         duration: 0.6,
    //         delay: index * 0.1,
    //         ease: 'back.out(1.7)'
    //     });
    // });

    // Stats animation - DISABLED
    // gsap.utils.toArray('.stat-value').forEach((stat) => {
    //     gsap.from(stat, {
    //         scrollTrigger: {
    //             trigger: stat,
    //             start: 'top 85%',
    //             once: true
    //         },
    //         opacity: 0,
    //         scale: 0.5,
    //         duration: 0.8,
    //         ease: 'back.out(1.7)'
    //     });
    // });
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
