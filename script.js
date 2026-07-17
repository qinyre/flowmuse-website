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
    console.log('Found platform cards:', platformCards.length); // 调试日志

    platformCards.forEach((card, index) => {
        // 持续悬浮动画
        gsap.to(card, {
            y: -10,
            duration: 2 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2
        });

        // 为每个图标添加旋转计数器
        const icon = card.querySelector('.platform-icon');
        console.log('Card', index, 'icon:', icon); // 调试日志
        let rotationCount = 0;

        // 鼠标悬停 - 3D 倾斜 + 放大
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.1,
                z: 50,
                duration: 0.4,
                ease: 'back.out(2)'
            });

            // HarmonyOS 高亮卡片特殊效果
            if (card.classList.contains('platform-highlight')) {
                gsap.to(card, {
                    boxShadow: '0 35px 80px -15px rgba(161, 98, 7, 0.6), 0 0 0 3px rgba(161, 98, 7, 0.5)',
                    duration: 0.3
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                z: 0,
                rotateY: 0,
                rotateX: 0,
                duration: 0.4,
                ease: 'power2.inOut'
            });

            if (card.classList.contains('platform-highlight')) {
                gsap.to(card, {
                    boxShadow: '0 20px 50px -10px rgba(161, 98, 7, 0.35), 0 0 0 1px rgba(161, 98, 7, 0.3)',
                    duration: 0.3
                });
            }
        });

        // 鼠标移动时 3D 倾斜跟随
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            gsap.to(card, {
                rotateY: deltaX * 20,
                rotateX: -deltaY * 20,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });

        // 点击图标快速旋转
        if (icon) {
            icon.style.cursor = 'pointer';
            console.log('Adding click listener to icon', index); // 确认监听器被添加

            // 给图标容器和内部所有元素添加点击事件
            const clickHandler = (e) => {
                e.stopPropagation(); // 阻止事件冒泡到卡片
                e.preventDefault(); // 阻止默认行为

                console.log('Icon clicked!', icon); // 调试日志

                // 增加旋转计数
                rotationCount++;

                // 快速旋转 360 度 - 旋转整个 icon 容器
                gsap.to(icon, {
                    rotation: `+=${360}`,
                    scale: 1.3,
                    duration: 0.5,
                    ease: 'power2.out',
                    onStart: () => console.log('Rotation started'),
                    onComplete: () => console.log('Rotation completed')
                });

                // 恢复缩放
                gsap.to(icon, {
                    scale: 1,
                    duration: 0.3,
                    delay: 0.5,
                    ease: 'power2.inOut'
                });

                // 卡片震动效果
                gsap.fromTo(card,
                    { x: -5 },
                    {
                        x: 5,
                        duration: 0.05,
                        repeat: 5,
                        yoyo: true,
                        ease: 'power1.inOut',
                        onComplete: () => {
                            gsap.to(card, { x: 0, duration: 0.1 });
                        }
                    }
                );
            };

            // 给图标和其所有子元素添加点击事件
            icon.addEventListener('click', clickHandler, true); // 使用捕获阶段
            icon.querySelectorAll('*').forEach(child => {
                child.style.pointerEvents = 'none'; // 让子元素不拦截点击
            });
        }

        // 点击卡片涟漪效果
        card.addEventListener('click', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 创建涟漪元素
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '0px';
            ripple.style.height = '0px';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(161, 98, 7, 0.3)';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(ripple);

            gsap.to(ripple, {
                width: 300,
                height: 300,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            });

            // 卡片弹跳
            gsap.fromTo(card,
                { scale: 0.95 },
                {
                    scale: 1.1,
                    duration: 0.4,
                    ease: 'back.out(3)'
                }
            );
        });
    });

    // HarmonyOS 高亮卡片光晕脉冲
    const harmonyCard = document.querySelector('.platform-highlight');
    if (harmonyCard) {
        gsap.to(harmonyCard, {
            boxShadow: '0 25px 60px -12px rgba(161, 98, 7, 0.45), 0 0 0 1px rgba(161, 98, 7, 0.35)',
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        const badge = harmonyCard.querySelector('.platform-badge');
        if (badge) {
            gsap.to(badge, {
                scale: 1.05,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }

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
                scale: 1.15,
                y: -15,
                duration: 0.4,
                ease: 'back.out(2)'
            });

            // 随机旋转角度
            const randomRotation = (Math.random() - 0.5) * 10;
            gsap.to(badge, {
                rotation: randomRotation,
                duration: 0.3
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

        // 点击徽章的涟漪效果
        badge.addEventListener('click', () => {
            gsap.fromTo(badge,
                { scale: 0.9 },
                {
                    scale: 1.15,
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.5)'
                }
            );
        });
    });

    // Tech Items - Enhanced Hover Effect
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach((item, index) => {
        const techNumber = item.querySelector('.tech-number');

        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.03,
                y: -5,
                duration: 0.4,
                ease: 'power2.out'
            });

            // 数字放大旋转
            gsap.to(techNumber, {
                scale: 1.2,
                rotation: 360,
                duration: 0.6,
                ease: 'back.out(1.5)'
            });

            // 添加发光效果
            gsap.to(item, {
                boxShadow: '0 20px 60px -10px rgba(161, 98, 7, 0.2)',
                duration: 0.3
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.inOut'
            });

            gsap.to(techNumber, {
                scale: 1,
                rotation: 0,
                duration: 0.4
            });

            gsap.to(item, {
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                duration: 0.3
            });
        });

        // 点击技术项的效果
        item.addEventListener('click', () => {
            // 脉冲效果
            gsap.fromTo(item,
                { scale: 0.98 },
                {
                    scale: 1.03,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                }
            );

            // 数字旋转两圈
            gsap.to(techNumber, {
                rotation: '+=720',
                duration: 0.8,
                ease: 'power2.out'
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

    // Whiteboard Tool Switching
    const wbTools = document.querySelectorAll('.wb-tool');
    wbTools.forEach((tool, index) => {
        tool.addEventListener('click', () => {
            // 移除所有工具的 active 状态
            wbTools.forEach(t => t.classList.remove('active'));

            // 添加当前工具的 active 状态
            tool.classList.add('active');

            // 添加点击动画
            gsap.fromTo(tool,
                { scale: 0.9 },
                {
                    scale: 1,
                    duration: 0.3,
                    ease: 'back.out(2)'
                }
            );
        });

        // 悬停效果
        tool.addEventListener('mouseenter', () => {
            if (!tool.classList.contains('active')) {
                gsap.to(tool, {
                    scale: 1.1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            }
        });

        tool.addEventListener('mouseleave', () => {
            if (!tool.classList.contains('active')) {
                gsap.to(tool, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.inOut'
                });
            }
        });
    });

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

    // Feature Carousel - Continuous Belt with Mouse Drag
    const carousel = document.querySelector('.feature-carousel');
    const carouselContainer = document.querySelector('.feature-carousel-container');
    const carouselCards = document.querySelectorAll('.feature-card-small');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const progressDots = document.querySelectorAll('.carousel-dot');

    let currentOffset = 0; // 当前偏移量（连续的浮点数）
    let targetOffset = 0;
    let isDragging = false;
    let startX = 0;
    let startOffset = 0;
    const totalCards = carouselCards.length;
    const cardWidth = 300;
    const cardGap = 20; // 卡片间距
    const cardStep = cardWidth + cardGap;

    function updateCarousel(animated = true) {
        // 更新进度点
        const centerIndex = Math.round(targetOffset) % totalCards;
        const positiveIndex = ((centerIndex % totalCards) + totalCards) % totalCards;
        progressDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === positiveIndex);
        });

        carouselCards.forEach((card, index) => {
            // 计算相对位置（支持循环）
            let relativePos = index - currentOffset;

            // 循环处理 - 确保卡片连续排列
            while (relativePos > totalCards / 2) relativePos -= totalCards;
            while (relativePos < -totalCards / 2) relativePos += totalCards;

            // 水平位置 - 连续排列，没有间断
            const x = relativePos * cardStep;

            // 垂直位置 - 抛物线形成凸起
            const y = Math.pow(relativePos, 2) * 25;

            // Z 轴深度 - 中间向前凸
            const z = -Math.pow(relativePos, 2) * 40 + 100;

            // 缩放 - 中间最大
            const absPos = Math.abs(relativePos);
            const scale = Math.max(0.75, 1 - absPos * 0.12);

            // 透明度
            const opacity = Math.max(0.4, 1 - absPos * 0.15);

            // Y 轴旋转 - 形成弧度
            const rotateY = relativePos * -12;

            // X 轴旋转
            const rotateX = -absPos * 5;

            // 应用变换
            const duration = animated ? 0.3 : 0;
            gsap.to(card, {
                x: x,
                y: y,
                z: z,
                scale: scale,
                opacity: opacity,
                rotateY: rotateY,
                rotateX: rotateX,
                duration: duration,
                ease: 'power2.out'
            });

            // 中间卡片高亮
            if (Math.abs(relativePos) < 0.3) {
                gsap.to(card, {
                    boxShadow: '0 30px 70px -15px rgba(161, 98, 7, 0.45), 0 0 0 2px rgba(161, 98, 7, 0.35)',
                    borderColor: 'rgba(161, 98, 7, 0.6)',
                    duration: duration
                });
            } else {
                gsap.to(card, {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    borderColor: 'var(--color-border)',
                    duration: duration
                });
            }
        });
    }

    // 平滑动画循环
    function animateCarousel() {
        currentOffset += (targetOffset - currentOffset) * 0.15;
        if (Math.abs(targetOffset - currentOffset) > 0.001) {
            updateCarousel(false);
            requestAnimationFrame(animateCarousel);
        } else {
            currentOffset = targetOffset;
        }
    }

    // 初始化
    if (carousel) {
        updateCarousel(false);
    }

    // 鼠标/触摸拖动
    let lastMoveX = 0;
    let velocity = 0;

    function onDragStart(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startOffset = targetOffset;
        velocity = 0;
        lastMoveX = startX;
        carouselContainer.style.cursor = 'grabbing';
    }

    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diff = currentX - startX;
        const movement = currentX - lastMoveX;
        velocity = movement;
        lastMoveX = currentX;

        // 拖动灵敏度
        targetOffset = startOffset - diff / cardStep;
        currentOffset = targetOffset;
        updateCarousel(false);
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        carouselContainer.style.cursor = 'grab';

        // 惯性滑动
        targetOffset += velocity * 0.05;

        // 吸附到最近的卡片
        targetOffset = Math.round(targetOffset);
        animateCarousel();
    }

    if (carouselContainer) {
        // 鼠标事件
        carouselContainer.addEventListener('mousedown', onDragStart);
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);

        // 触摸事件
        carouselContainer.addEventListener('touchstart', onDragStart, { passive: false });
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', onDragEnd);
    }

    // 按钮控制
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            targetOffset -= 1;
            animateCarousel();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            targetOffset += 1;
            animateCarousel();
        });
    }

    // 进度点点击
    progressDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const currentIndex = Math.round(targetOffset) % totalCards;
            const diff = index - ((currentIndex % totalCards) + totalCards) % totalCards;

            // 选择最短路径
            if (diff > totalCards / 2) {
                targetOffset += diff - totalCards;
            } else if (diff < -totalCards / 2) {
                targetOffset += diff + totalCards;
            } else {
                targetOffset += diff;
            }
            animateCarousel();
        });
    });

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (carousel && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') {
                targetOffset -= 1;
            } else {
                targetOffset += 1;
            }
            animateCarousel();
        }
    });

    // 鼠标滚轮控制
    if (carousel) {
        carousel.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 1 : -1;
            targetOffset += delta;
            animateCarousel();
        }, { passive: false });
    }

    // 卡片鼠标跟随 3D 倾斜效果
    carouselCards.forEach(card => {
        let tiltAnimation = null;

        card.addEventListener('mouseenter', () => {
            // 只对中心卡片应用倾斜效果
            const index = Array.from(carouselCards).indexOf(card);
            let relativePos = index - currentOffset;
            while (relativePos > totalCards / 2) relativePos -= totalCards;
            while (relativePos < -totalCards / 2) relativePos += totalCards;

            if (Math.abs(relativePos) < 0.3) {
                card.style.transition = 'none';
            }
        });

        card.addEventListener('mousemove', (e) => {
            // 只对中心卡片应用倾斜效果
            const index = Array.from(carouselCards).indexOf(card);
            let relativePos = index - currentOffset;
            while (relativePos > totalCards / 2) relativePos -= totalCards;
            while (relativePos < -totalCards / 2) relativePos += totalCards;

            if (Math.abs(relativePos) > 0.3) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            if (tiltAnimation) {
                tiltAnimation.kill();
            }

            // 获取当前的基础旋转值
            const baseRotateY = relativePos * -12;
            const baseRotateX = -Math.abs(relativePos) * 5;

            tiltAnimation = gsap.to(card, {
                rotateY: baseRotateY + deltaX * 15,
                rotateX: baseRotateX - deltaY * 15,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });

        card.addEventListener('mouseleave', () => {
            if (tiltAnimation) {
                tiltAnimation.kill();
            }

            const index = Array.from(carouselCards).indexOf(card);
            let relativePos = index - currentOffset;
            while (relativePos > totalCards / 2) relativePos -= totalCards;
            while (relativePos < -totalCards / 2) relativePos += totalCards;

            const baseRotateY = relativePos * -12;
            const baseRotateX = -Math.abs(relativePos) * 5;

            gsap.to(card, {
                rotateY: baseRotateY,
                rotateX: baseRotateX,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });
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
const canvasPreview = document.querySelector('.canvas-preview');
if (canvasPreview) {
    gsap.from(canvasPreview, {
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5
    });
}

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

    // Stats Counter Animation
    const statValues = document.querySelectorAll('.stat-value');
    console.log('Found stat values:', statValues.length); // 调试日志

    statValues.forEach(stat => {
        const text = stat.textContent.trim(); // 去除空格
        const numberMatch = text.match(/\d+/); // 提取数字

        if (numberMatch) {
            const targetNumber = parseInt(numberMatch[0]);
            console.log('Animating stat to:', targetNumber); // 调试日志

            // 创建一个临时对象来存储计数
            const counter = { value: 0 };

            gsap.to(counter, {
                value: targetNumber,
                duration: 2,
                ease: 'power2.out',
                delay: 1.2,
                onUpdate: function() {
                    stat.textContent = Math.ceil(counter.value) + '+';
                },
                onStart: () => console.log('Counter animation started'),
                onComplete: () => console.log('Counter animation completed')
            });
        }
    });
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
