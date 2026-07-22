// ============================================================
// FlowMuse Website - GSAP animations & interactions
// 依赖:gsap, ScrollTrigger (在 index.html 通过 CDN 引入)
// ============================================================

gsap.registerPlugin(ScrollTrigger);

// 全局默认值,让所有 tween 走统一的 ease/duration
gsap.defaults({
    duration: 0.8,
    ease: 'power3.out',
});

// 全局开关:用户偏好减少动画时,所有自定义动画跳过(duration:0 或直接 return)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// 仅在精确指针设备(鼠标)上启用光晕、3D 倾斜这类交互。触屏完全跳过。
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

// matchMedia 用来按设备能力做条件动画 + 自动 cleanup
const mm = gsap.matchMedia();

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initFlowText();
    initFeatureCards();
    initPlatformCards();
    initHarmonyHighlight();
    initButtons();
    initStackBadges();
    initTechItems();
    initStatsCounter();
    initWhiteboardMockup();
    initWhiteboardTools();
    initWhiteboardDrawing();
    initCarousel();
    initScrollProgress();
    initBackToTop();
    initScrollReveal();
    initHeroEntrance();
    initSectionTags();
    initSmoothScroll();
    initNavbarOnScroll();
    initFooterYear();

    // 字体/图片加载后位置会变,refresh 一次保证 ScrollTrigger 算准
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
});

// ============================================================
// P0:Cursor Glow —— 用 gsap.quickTo() 复用 tween,移动端禁用
// ============================================================
function initCursorGlow() {
    if (prefersReducedMotion || !hasFinePointer) return;

    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    // quickTo 在内部复用一个 tween,每次调用只是改目标值,不会每帧新建 tween
    const xTo = gsap.quickTo(cursorGlow, 'x', { duration: 0.4, ease: 'power3' });
    const yTo = gsap.quickTo(cursorGlow, 'y', { duration: 0.4, ease: 'power3' });
    const opacityTo = gsap.quickTo(cursorGlow, 'opacity', { duration: 0.3 });

    opacityTo(1);

    document.addEventListener('mousemove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    document.addEventListener('mouseleave', () => opacityTo(0));
    document.addEventListener('mouseenter', () => opacityTo(1));
}

// ============================================================
// Hero 逐字波浪文字
// ============================================================
function initFlowText() {
    const flowTextElement = document.querySelector('.flow-text');
    if (!flowTextElement || prefersReducedMotion) return;

    const text = flowTextElement.getAttribute('data-flow-text');
    flowTextElement.innerHTML = text.split('').map((char) =>
        `<span class="flow-char" style="display: inline-block;">${char}</span>`
    ).join('');

    const flowChars = flowTextElement.querySelectorAll('.flow-char');
    gsap.to(flowChars, {
        y: -15,
        duration: 1.5,
        ease: 'sine.inOut',
        stagger: { each: 0.1, repeat: -1, yoyo: true },
    });
    gsap.to(flowChars, {
        opacity: 0.7,
        duration: 2,
        ease: 'sine.inOut',
        stagger: { each: 0.15, repeat: -1, yoyo: true },
    });
}

// ============================================================
// Feature Cards - 3D Tilt + magnetic hover(仅精确指针设备)
// ============================================================
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    if (!featureCards.length) return;

    featureCards.forEach((card) => {
        if (hasFinePointer && !prefersReducedMotion) {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1, x: 0, y: 0,
                    rotateX: 0, rotateY: 0,
                    duration: 0.3, ease: 'power2.out',
                });
            });
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const deltaX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const deltaY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                gsap.to(card, {
                    rotateY: deltaX * 10,
                    rotateX: -deltaY * 10,
                    duration: 0.3,
                    ease: 'power2.out',
                });
            });
        }
    });
}

// ============================================================
// Platform Cards - 悬浮 / 3D 倾斜 / 点击涟漪
// ============================================================
function initPlatformCards() {
    const platformCards = document.querySelectorAll('.platform-card');
    if (!platformCards.length) return;

    platformCards.forEach((card, index) => {
        // 持续悬浮动画(reduced-motion 下跳过)
        if (!prefersReducedMotion) {
            gsap.to(card, {
                y: -10,
                duration: 2 + index * 0.3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.2,
            });
        }

        const icon = card.querySelector('.platform-icon');

        if (hasFinePointer && !prefersReducedMotion) {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { scale: 1.1, duration: 0.4, ease: 'back.out(2)' });
                if (card.classList.contains('platform-highlight')) {
                    gsap.to(card, {
                        boxShadow: '0 35px 80px -15px rgba(5, 150, 105, 0.6), 0 0 0 3px rgba(5, 150, 105, 0.5)',
                        duration: 0.3,
                    });
                }
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1, rotateY: 0, rotateX: 0,
                    duration: 0.4, ease: 'power2.inOut',
                });
                if (card.classList.contains('platform-highlight')) {
                    gsap.to(card, {
                        boxShadow: '0 20px 50px -10px rgba(5, 150, 105, 0.35), 0 0 0 1px rgba(5, 150, 105, 0.3)',
                        duration: 0.3,
                    });
                }
            });
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const deltaX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const deltaY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                gsap.to(card, {
                    rotateY: deltaX * 20,
                    rotateX: -deltaY * 20,
                    duration: 0.3,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });
        }

        // 点击图标快速旋转(所有设备,含触屏)
        if (icon) {
            icon.style.cursor = 'pointer';
            const clickHandler = (e) => {
                e.stopPropagation();
                e.preventDefault();
                gsap.to(icon, {
                    rotation: '+=360',
                    scale: 1.3,
                    duration: 0.5,
                    ease: 'power2.out',
                });
                gsap.to(icon, { scale: 1, duration: 0.3, delay: 0.5, ease: 'power2.inOut' });
                if (!prefersReducedMotion) {
                    gsap.fromTo(card,
                        { x: -5 },
                        {
                            x: 5,
                            duration: 0.05,
                            repeat: 5,
                            yoyo: true,
                            ease: 'power1.inOut',
                            onComplete: () => gsap.to(card, { x: 0, duration: 0.1 }),
                        }
                    );
                }
            };
            icon.addEventListener('click', clickHandler, true);
            icon.querySelectorAll('*').forEach((child) => {
                child.style.pointerEvents = 'none';
            });
        }

        // 点击卡片涟漪
        card.addEventListener('click', (e) => {
            const rect = card.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            ripple.style.width = '0px';
            ripple.style.height = '0px';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(5, 150, 105, 0.3)';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(ripple);
            gsap.to(ripple, {
                width: 300, height: 300, opacity: 0,
                duration: 0.8, ease: 'power2.out',
                onComplete: () => ripple.remove(),
            });
            gsap.fromTo(card,
                { scale: 0.95 },
                { scale: 1.1, duration: 0.4, ease: 'back.out(3)' }
            );
        });
    });
}

// ============================================================
// HarmonyOS 高亮卡片光晕脉冲
// ============================================================
function initHarmonyHighlight() {
    const harmonyCard = document.querySelector('.platform-highlight');
    if (!harmonyCard || prefersReducedMotion) return;

    gsap.to(harmonyCard, {
        boxShadow: '0 25px 60px -12px rgba(5, 150, 105, 0.45), 0 0 0 1px rgba(5, 150, 105, 0.35)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });

    const badge = harmonyCard.querySelector('.platform-badge');
    if (badge) {
        gsap.to(badge, {
            scale: 1.05,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });
    }
}

// ============================================================
// Buttons - 按压弹性
// ============================================================
function initButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-download, .btn-download-alt');
    buttons.forEach((btn) => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'back.out(1.7)' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
        });
        btn.addEventListener('mousedown', () => {
            gsap.to(btn, { scale: 0.95, duration: 0.1, ease: 'power2.out' });
        });
        btn.addEventListener('mouseup', () => {
            gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'back.out(3)' });
        });
    });
}

// ============================================================
// Tech Stack Badges - 浮动 / 悬停 / 点击
// ============================================================
function initStackBadges() {
    const stackBadges = document.querySelectorAll('.stack-badge');
    stackBadges.forEach((badge, index) => {
        if (!prefersReducedMotion) {
            gsap.to(badge, {
                y: -10,
                duration: 2 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.1,
            });
        }
        badge.addEventListener('mouseenter', () => {
            gsap.to(badge, { scale: 1.15, y: -15, duration: 0.4, ease: 'back.out(2)' });
            if (!prefersReducedMotion) {
                gsap.to(badge, { rotation: (Math.random() - 0.5) * 10, duration: 0.3 });
            }
        });
        badge.addEventListener('mouseleave', () => {
            gsap.to(badge, { scale: 1, rotation: 0, duration: 0.3, ease: 'power2.inOut' });
        });
        badge.addEventListener('click', () => {
            gsap.fromTo(badge,
                { scale: 0.9 },
                { scale: 1.15, duration: 0.4, ease: 'elastic.out(1, 0.5)' }
            );
        });
    });
}

// ============================================================
// Tech Items - hover/数字旋转
// ============================================================
function initTechItems() {
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach((item) => {
        const techNumber = item.querySelector('.tech-number');

        item.addEventListener('mouseenter', () => {
            gsap.to(item, { scale: 1.03, y: -5, duration: 0.4, ease: 'power2.out' });
            if (techNumber) {
                gsap.to(techNumber, { scale: 1.2, rotation: 360, duration: 0.6, ease: 'back.out(1.5)' });
            }
            gsap.to(item, {
                boxShadow: '0 20px 60px -10px rgba(5, 150, 105, 0.2)',
                duration: 0.3,
            });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(item, { scale: 1, y: 0, duration: 0.4, ease: 'power2.inOut' });
            if (techNumber) {
                gsap.to(techNumber, { scale: 1, rotation: 0, duration: 0.4 });
            }
            gsap.to(item, {
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                duration: 0.3,
            });
        });
        item.addEventListener('click', () => {
            gsap.fromTo(item,
                { scale: 0.98 },
                { scale: 1.03, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' }
            );
            if (techNumber) {
                gsap.to(techNumber, { rotation: '+=720', duration: 0.8, ease: 'power2.out' });
            }
        });
    });
}

// ============================================================
// P2:Stats Counter —— 用 proxy 对象避免 onUpdate 里读 DOM(layout thrash)
// ============================================================
function initStatsCounter() {
    const statValues = document.querySelectorAll('.hero-stats .stat-value');
    statValues.forEach((stat) => {
        const text = stat.textContent.trim();
        const numberMatch = text.match(/\d+/);
        if (!numberMatch) return;
        const targetNumber = parseInt(numberMatch[0]);
        const hasPlus = text.includes('+');

        const counter = { value: 0 };
        gsap.to(counter, {
            value: targetNumber,
            duration: 2,
            ease: 'power2.out',
            delay: 1.2,
            onUpdate: () => {
                stat.textContent = Math.ceil(counter.value) + (hasPlus ? '+' : '');
            },
        });
    });
}

// ============================================================
// Whiteboard Mockup - 3D 倾斜(仅鼠标设备)
// ============================================================
function initWhiteboardMockup() {
    const whiteboardMockup = document.querySelector('.whiteboard-mockup');
    if (!whiteboardMockup || !hasFinePointer || prefersReducedMotion) return;

    whiteboardMockup.addEventListener('mousemove', (e) => {
        const rect = whiteboardMockup.getBoundingClientRect();
        const deltaX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const deltaY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        gsap.to(whiteboardMockup, {
            rotateY: deltaX * 5,
            rotateX: -deltaY * 5,
            duration: 0.5,
            ease: 'power2.out',
        });
    });
    whiteboardMockup.addEventListener('mouseleave', () => {
        gsap.to(whiteboardMockup, {
            rotateY: 0, rotateX: 0,
            duration: 0.5, ease: 'power2.out',
        });
    });
}

// ============================================================
// Whiteboard Toolbar - 工具切换
// ============================================================
function initWhiteboardTools() {
    const wbTools = document.querySelectorAll('.wb-tool');
    wbTools.forEach((tool) => {
        tool.addEventListener('click', () => {
            wbTools.forEach((t) => t.classList.remove('active'));
            tool.classList.add('active');
            gsap.fromTo(tool,
                { scale: 0.9 },
                { scale: 1, duration: 0.3, ease: 'back.out(2)' }
            );
        });
        tool.addEventListener('mouseenter', () => {
            if (!tool.classList.contains('active')) {
                gsap.to(tool, { scale: 1.1, duration: 0.2, ease: 'power2.out' });
            }
        });
        tool.addEventListener('mouseleave', () => {
            if (!tool.classList.contains('active')) {
                gsap.to(tool, { scale: 1, duration: 0.2, ease: 'power2.inOut' });
            }
        });
    });
}

// ============================================================
// Whiteboard Drawing - SVG 形状入场
// 注意:hero 白板里的 rect/circle/path 由 initHeroEntrance() 的
// 入场 timeline 统一驱动,这里不再单独挂 ScrollTrigger。
// (hero 是首屏,ScrollTrigger.start 已过,onEnter 不会自动触发,
//  会和 hero timeline 抢 opacity 属性导致形状卡在透明。)
// ============================================================
function initWhiteboardDrawing() {
    // no-op —— 入场动画交给 initHeroEntrance()
}

// ============================================================
// Feature Carousel - 连续带 + 拖拽 / 滚轮 / 键盘 / 点击
// ============================================================
function initCarousel() {
    const carousel = document.querySelector('.feature-carousel');
    const carouselContainer = document.querySelector('.feature-carousel-container');
    const carouselCards = document.querySelectorAll('.feature-card-small');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const progressDots = document.querySelectorAll('.carousel-dot');
    if (!carousel || !carouselCards.length) return;

    let currentOffset = 0;
    let targetOffset = 0;
    let isDragging = false;
    let startX = 0;
    let startOffset = 0;
    const totalCards = carouselCards.length;
    const cardStep = 320; // cardWidth 300 + gap 20

    function updateCarousel(animated = true) {
        const positiveIndex = ((Math.round(targetOffset) % totalCards) + totalCards) % totalCards;
        progressDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === positiveIndex);
        });

        carouselCards.forEach((card, index) => {
            let relativePos = index - currentOffset;
            while (relativePos > totalCards / 2) relativePos -= totalCards;
            while (relativePos < -totalCards / 2) relativePos += totalCards;

            const x = relativePos * cardStep;
            const y = Math.pow(relativePos, 2) * 25;
            const z = -Math.pow(relativePos, 2) * 40 + 100;
            const absPos = Math.abs(relativePos);
            const scale = Math.max(0.75, 1 - absPos * 0.12);
            const opacity = Math.max(0.4, 1 - absPos * 0.15);
            const rotateY = relativePos * -12;
            const rotateX = -absPos * 5;

            gsap.to(card, {
                x, y, z, scale, opacity, rotateY, rotateX,
                duration: animated ? 0.3 : 0,
                ease: 'power2.out',
            });

            if (Math.abs(relativePos) < 0.3) {
                gsap.to(card, {
                    boxShadow: '0 30px 70px -15px rgba(5, 150, 105, 0.45), 0 0 0 2px rgba(5, 150, 105, 0.35)',
                    borderColor: 'rgba(5, 150, 105, 0.6)',
                    duration: animated ? 0.3 : 0,
                });
            } else {
                gsap.to(card, {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    borderColor: 'var(--color-border)',
                    duration: animated ? 0.3 : 0,
                });
            }
        });
    }

    function animateCarousel() {
        currentOffset += (targetOffset - currentOffset) * 0.15;
        if (Math.abs(targetOffset - currentOffset) > 0.001) {
            updateCarousel(false);
            requestAnimationFrame(animateCarousel);
        } else {
            currentOffset = targetOffset;
        }
    }

    updateCarousel(false);

    let lastMoveX = 0;
    let velocity = 0;
    function onDragStart(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startOffset = targetOffset;
        velocity = 0;
        lastMoveX = startX;
        if (carouselContainer) carouselContainer.style.cursor = 'grabbing';
    }
    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diff = currentX - startX;
        velocity = currentX - lastMoveX;
        lastMoveX = currentX;
        targetOffset = startOffset - diff / cardStep;
        currentOffset = targetOffset;
        updateCarousel(false);
    }
    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        if (carouselContainer) carouselContainer.style.cursor = 'grab';
        targetOffset += velocity * 0.05;
        targetOffset = Math.round(targetOffset);
        animateCarousel();
    }

    if (carouselContainer) {
        carouselContainer.addEventListener('mousedown', onDragStart);
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        carouselContainer.addEventListener('touchstart', onDragStart, { passive: false });
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', onDragEnd);
    }
    if (prevBtn) prevBtn.addEventListener('click', () => { targetOffset -= 1; animateCarousel(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { targetOffset += 1; animateCarousel(); });

    progressDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const currentIndex = Math.round(targetOffset) % totalCards;
            const diff = index - ((currentIndex % totalCards) + totalCards) % totalCards;
            if (diff > totalCards / 2) targetOffset += diff - totalCards;
            else if (diff < -totalCards / 2) targetOffset += diff + totalCards;
            else targetOffset += diff;
            animateCarousel();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { targetOffset -= 1; animateCarousel(); }
        else if (e.key === 'ArrowRight') { targetOffset += 1; animateCarousel(); }
    });

    carousel.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetOffset += e.deltaY > 0 ? 1 : -1;
        animateCarousel();
    }, { passive: false });

    // 中心卡片 3D 跟随(仅鼠标设备)
    if (hasFinePointer) {
        carouselCards.forEach((card) => {
            let tiltAnimation = null;
            card.addEventListener('mousemove', (e) => {
                const index = Array.from(carouselCards).indexOf(card);
                let relativePos = index - currentOffset;
                while (relativePos > totalCards / 2) relativePos -= totalCards;
                while (relativePos < -totalCards / 2) relativePos += totalCards;
                if (Math.abs(relativePos) > 0.3) return;

                const rect = card.getBoundingClientRect();
                const deltaX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const deltaY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                if (tiltAnimation) tiltAnimation.kill();

                const baseRotateY = relativePos * -12;
                const baseRotateX = -Math.abs(relativePos) * 5;
                tiltAnimation = gsap.to(card, {
                    rotateY: baseRotateY + deltaX * 15,
                    rotateX: baseRotateX - deltaY * 15,
                    duration: 0.3,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });
            card.addEventListener('mouseleave', () => {
                if (tiltAnimation) tiltAnimation.kill();
                const index = Array.from(carouselCards).indexOf(card);
                let relativePos = index - currentOffset;
                while (relativePos > totalCards / 2) relativePos -= totalCards;
                while (relativePos < -totalCards / 2) relativePos += totalCards;
                gsap.to(card, {
                    rotateY: relativePos * -12,
                    rotateX: -Math.abs(relativePos) * 5,
                    duration: 0.5,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });
        });
    }
}

// ============================================================
// P1:顶部滚动进度条
// ============================================================
function initScrollProgress() {
    if (prefersReducedMotion) return;
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    gsap.to(bar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
            start: 0,
            end: 'max',
            scrub: 0.3,
        },
    });
}

// ============================================================
// P2:返回顶部浮动按钮
// ============================================================
function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', '返回顶部');
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    document.body.appendChild(btn);

    // 默认隐藏,滚到一定距离才出现
    gsap.set(btn, { autoAlpha: 0, y: 20 });

    ScrollTrigger.create({
        start: 400,
        onToggle: (self) => {
            if (self.isActive) {
                gsap.to(btn, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' });
            } else {
                gsap.to(btn, { autoAlpha: 0, y: 20, duration: 0.3, ease: 'power2.inOut' });
            }
        },
    });

    btn.addEventListener('click', () => {
        gsap.to(window, { duration: 1, scrollTo: 0, ease: 'power3.inOut' });
        // scrollTo 是 plugin,没加载时退回原生
    });
    btn.addEventListener('click', () => {
        if (!window.ScrollToPlugin) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ============================================================
// P1:ScrollTrigger.batch —— 同屏多元素同时入场并加 stagger
// (替代原来逐元素 forEach 手写 ScrollTrigger)
// ============================================================
function initScrollReveal() {
    if (prefersReducedMotion) return;

    // 通用入场:从下淡入
    ScrollTrigger.batch('.feature-card', {
        start: 'top 85%',
        onEnter: (batch) => gsap.to(batch, {
            opacity: 1, y: 0,
            duration: 0.8, stagger: 0.1, ease: 'power3.out',
            overwrite: true,
        }),
        onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, y: 60 }),
    });
    gsap.set('.feature-card', { opacity: 0, y: 60 });

    ScrollTrigger.batch('.platform-card', {
        start: 'top 85%',
        onEnter: (batch) => gsap.to(batch, {
            opacity: 1, scale: 1,
            duration: 0.6, stagger: 0.08, ease: 'back.out(1.4)',
            overwrite: true,
        }),
        onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, scale: 0.9 }),
    });
    gsap.set('.platform-card', { opacity: 0, scale: 0.9 });

    ScrollTrigger.batch('.tech-item', {
        start: 'top 85%',
        onEnter: (batch) => gsap.to(batch, {
            opacity: 1, x: 0,
            duration: 0.8, stagger: 0.15, ease: 'power3.out',
            overwrite: true,
        }),
        onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, x: -40 }),
    });
    gsap.set('.tech-item', { opacity: 0, x: -40 });

    ScrollTrigger.batch('.stack-badge', {
        start: 'top 85%',
        onEnter: (batch) => gsap.to(batch, {
            opacity: 1, scale: 1,
            duration: 0.5, stagger: 0.05, ease: 'back.out(1.5)',
            overwrite: true,
        }),
        onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, scale: 0.8 }),
    });
    gsap.set('.stack-badge', { opacity: 0, scale: 0.8 });

    // 单元素动画(保持原有效果)
    gsap.utils.toArray('.section-header').forEach((header) => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        });
    });

    gsap.utils.toArray('.section-title').forEach((title) => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 1,
            },
            opacity: 0, y: 50, scale: 0.9,
        });
    });

    gsap.utils.toArray('.feature-icon').forEach((icon, index) => {
        gsap.from(icon, {
            scrollTrigger: {
                trigger: icon,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            scale: 0, rotation: 360,
            duration: 0.8, ease: 'back.out(2)', delay: index * 0.05,
        });
    });

    gsap.from('.stats-bar', {
        scrollTrigger: {
            trigger: '.stats-bar',
            start: 'top 90%',
            toggleActions: 'play none none reverse',
        },
        y: 100, opacity: 0, duration: 1, ease: 'power3.out',
    });

    gsap.utils.toArray('.tech-number').forEach((num, index) => {
        gsap.from(num, {
            scrollTrigger: {
                trigger: num,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            scale: 0, rotation: 720, opacity: 0,
            duration: 0.6, ease: 'back.out(1.7)', delay: index * 0.15,
        });
    });

    gsap.from('.download-title', {
        scrollTrigger: { trigger: '.download', start: 'top 70%' },
        opacity: 0, y: 30, duration: 0.8,
    });
    gsap.from('.download-subtitle', {
        scrollTrigger: { trigger: '.download', start: 'top 70%' },
        opacity: 0, y: 20, duration: 0.8, delay: 0.2,
    });
    gsap.from('.download-buttons', {
        scrollTrigger: { trigger: '.download', start: 'top 70%' },
        opacity: 0, y: 30, duration: 0.8, delay: 0.4,
    });

    gsap.from('.footer', {
        scrollTrigger: { trigger: '.footer', start: 'top 95%', toggleActions: 'play none none reverse' },
        opacity: 0, y: 50, duration: 1, ease: 'power2.out',
    });
}

// ============================================================
// Hero 区入场动画(timeline 串联,比 delay 链更顺)
// ============================================================
function initHeroEntrance() {
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8 })
      .from('.hero-title', { opacity: 0, y: 40, duration: 1 }, '-=0.4')
      .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8 }, '-=0.5')
      .from('.hero-actions', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
      .from('.hero-stats .stat', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, '-=0.4')
      .from('.whiteboard-mockup', { opacity: 0, scale: 0.95, duration: 1.2 }, '-=1');

    // SVG 形状(rect/circle/path)单独做入场,带 clearProps 确保
    // 动画结束后 opacity/scale 清回 CSS 默认值,即使中间有任何
    // 中断或后续 mousemove 监听器改了 transform,最终也保持可见。
    tl.from('.wb-drawing rect', {
        opacity: 0, scale: 0.8, duration: 0.8, ease: 'back.out(1.5)',
        clearProps: 'opacity,scale',
    }, '-=0.4')
      .from('.wb-drawing circle', {
          opacity: 0, scale: 0.8, duration: 0.8, ease: 'back.out(1.5)',
          clearProps: 'opacity,scale',
      }, '-=0.6')
      .from('.wb-drawing path', {
          opacity: 0, duration: 0.8,
          clearProps: 'opacity',
      }, '-=0.5');

    // Hero parallax
    gsap.to('.hero-visual', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        },
    });
}

// ============================================================
// Section Tags - 鼠标悬停字距变化
// ============================================================
function initSectionTags() {
    const sectionTags = document.querySelectorAll('.section-tag');
    sectionTags.forEach((tag) => {
        tag.addEventListener('mouseenter', () => {
            gsap.to(tag, { scale: 1.1, letterSpacing: '0.1em', duration: 0.3, ease: 'power2.out' });
        });
        tag.addEventListener('mouseleave', () => {
            gsap.to(tag, { scale: 1, letterSpacing: '0.05em', duration: 0.3, ease: 'power2.inOut' });
        });
    });
}

// ============================================================
// Anchor 平滑滚动
// ============================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return; // 占位链接不处理
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: offsetTop, autoKill: true },
                ease: 'power3.inOut',
            });
            // scrollTo plugin 没加载时退回原生
            if (!window.ScrollToPlugin) {
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

// ============================================================
// Navbar 滚动时阴影
// ============================================================
function initNavbarOnScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.style.boxShadow = window.pageYOffset > 50
            ? '0 2px 8px rgba(0, 0, 0, 0.06)'
            : 'none';
    }, { passive: true });
}

// ============================================================
// P2:Footer 年份自动更新
// ============================================================
function initFooterYear() {
    const yearSpan = document.querySelector('[data-current-year]');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// ============================================================
// Reduced Motion —— 兜底:杀掉所有 ScrollTrigger
// (CSS 媒体查询已降级 transition,这里负责 JS 侧)
// ============================================================
if (prefersReducedMotion) {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.globalTimeline.timeScale(0);
}

// Console 招牌
console.log('%cFlowMuse', 'font-size: 32px; font-weight: 700; color: #059669; font-family: DM Sans;');
console.log('%c自由流动的白板笔记 · 基于 Flutter 构建', 'font-size: 14px; color: #78716C; font-family: DM Sans;');
