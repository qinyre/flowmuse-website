'use strict';

(() => {
  const {gsap, ScrollTrigger} = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', (context) => {
    const listeners = new AbortController();
    const {signal} = listeners;
    const hero = gsap.timeline({defaults: {duration: .7, ease: 'power3.out', clearProps: 'opacity,transform'}});
    if (document.querySelector('.hero-copy')) {
      hero.from('.hero-copy .eyebrow', {y: 18, opacity: 0})
        .from('h1', {y: 28, opacity: 0}, .12)
        .from('.hero-description', {y: 20, opacity: 0}, .3)
        .from('.hero-actions, .hero-footnote, .hero-signature', {y: 18, opacity: 0, stagger: .08}, .45)
        .from('.hero-showcase', {y: 32, opacity: 0, duration: 1}, .2);
    } else {
      hero.fromTo('.page-hero-copy h1', {y: 20, opacity: .65}, {y: 0, opacity: 1, duration: .8}, 0)
        .from('.page-statement', {y: 14, duration: .7}, .07)
        .from('.page-lead', {y: 10, duration: .65}, .14);
      const visual = document.querySelector('.page-visual');
      if (visual) {
        hero.fromTo(visual, {y: 28, opacity: .6}, {y: 0, opacity: 1, duration: .9}, 0);
        gsap.to(visual.querySelector('.product-figure'), {y: -12, ease: 'none', scrollTrigger: {trigger: visual, start: 'top center', end: 'bottom top', scrub: .5}});
      }
    }
    document.querySelectorAll('.handwritten path').forEach((path) => {
      const length = path.getTotalLength();
      hero.fromTo(path, {strokeDasharray: length, strokeDashoffset: length}, {
        strokeDashoffset: 0, duration: 1.2, clearProps: 'strokeDasharray,strokeDashoffset',
      }, .65);
    });

    const motionToggle = document.querySelector('[data-motion-toggle]');
    if (document.querySelector('.hero')) {
      const idle = gsap.timeline({repeat: -1, yoyo: true, defaults: {ease: 'sine.inOut'}})
        .to('.flow-char', {y: -6, duration: 1.5, stagger: .13}, 0)
        .to('.showcase-note', {y: -6, duration: 2.6}, 0)
        .to('.product-window', {y: -5, duration: 2.6}, 0);
      let paused = false;
      let heroVisible = true;
      const syncIdle = () => idle.paused(paused || document.hidden || !heroVisible);
      const heroRange = ScrollTrigger.create({
        trigger: '.hero', start: 'top bottom', end: 'bottom top',
        onToggle: (self) => { heroVisible = self.isActive; syncIdle(); },
      });
      heroVisible = heroRange.isActive;
      document.addEventListener('visibilitychange', syncIdle, {signal});
      if (motionToggle) {
        motionToggle.hidden = false;
        motionToggle.addEventListener('click', () => {
          paused = !paused;
          motionToggle.setAttribute('aria-pressed', String(paused));
          motionToggle.textContent = paused ? '继续循环动效' : '暂停循环动效';
          syncIdle();
        }, {signal});
      }
      syncIdle();
    }

    gsap.utils.toArray('.section-heading, .feature-columns article, .ai-copy, .ai-visual, .collaboration-figure, .collaboration-copy article, .platform-inner > div, .faq-heading, .faq-list details, .start-section, .chapter-heading > *, .chapter-body > *, .fact-list > div, .pen-list > li, .step-list > li, .feature-index-row > div, .index-preview, .reading-next, .support-strip')
      .forEach((element) => {
        gsap.from(element, {
          y: 26, opacity: 0, duration: .75, ease: 'power3.out', clearProps: 'opacity,transform',
          scrollTrigger: {trigger: element, start: 'top 92%', once: true},
        });
      });

    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
    gsap.fromTo(progress, {scaleX: 0}, {
      scaleX: 1, ease: 'none', scrollTrigger: {start: 0, end: 'max', scrub: .2},
    });
    const backToTop = document.createElement('a');
    backToTop.className = 'back-to-top';
    backToTop.href = '#top';
    backToTop.textContent = '↑';
    backToTop.setAttribute('aria-label', '回到页首');
    backToTop.hidden = true;
    document.body.append(backToTop);
    const updateBackToTop = () => { backToTop.hidden = window.scrollY < 400; };
    document.addEventListener('scroll', updateBackToTop, {passive: true, signal});
    updateBackToTop();

    context.add('onSceneChange', (event) => {
      const panel = document.getElementById(event.currentTarget.dataset.scene);
      if (panel && !panel.hidden) {
        gsap.fromTo(panel, {opacity: .3, x: 14}, {
          opacity: 1, x: 0, duration: .4, ease: 'power2.out', overwrite: true, clearProps: 'opacity,transform',
        });
      }
    });
    document.querySelectorAll('[data-scene]').forEach((button) => {
      button.addEventListener('click', context.onSceneChange, {signal});
    });

    let active = true;
    document.fonts?.ready.then(() => { if (active) ScrollTrigger.refresh(); });
    return () => {
      active = false;
      listeners.abort();
      if (motionToggle) {
        motionToggle.hidden = true;
        motionToggle.setAttribute('aria-pressed', 'false');
        motionToggle.textContent = '暂停循环动效';
      }
      progress.remove();
      backToTop.remove();
    };
  });

  media.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
    const listeners = new AbortController();
    const {signal} = listeners;
    let glowLayer;
    if (document.body.classList.contains('home-page')) {
      const glow = document.createElement('div');
      glow.className = 'cursor-glow';
      glow.setAttribute('aria-hidden', 'true');
      glowLayer = document.createElement('div');
      glowLayer.className = 'cursor-glow-layer';
      glowLayer.append(glow);
      document.body.append(glowLayer);
      gsap.set(glow, {xPercent: -50, yPercent: -50});
      const moveX = gsap.quickTo(glow, 'x', {duration: .4, ease: 'power3.out'});
      const moveY = gsap.quickTo(glow, 'y', {duration: .4, ease: 'power3.out'});
      const fadeGlow = gsap.quickTo(glow, 'opacity', {duration: .25});
      document.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') return;
        moveX(event.clientX);
        moveY(event.clientY);
        fadeGlow(1);
      }, {passive: true, signal});
      document.addEventListener('pointerleave', () => fadeGlow(0), {signal});
    }

    document.querySelectorAll('.product-window, .screenshot-sheet, .feature-columns article, .platform-details, .page-visual .product-figure').forEach((element) => {
      const tiltX = gsap.quickTo(element, 'rotationX', {duration: .4, ease: 'power3.out'});
      const tiltY = gsap.quickTo(element, 'rotationY', {duration: .4, ease: 'power3.out'});
      element.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') return;
        const bounds = element.getBoundingClientRect();
        tiltX(gsap.utils.clamp(-4, 4, (bounds.top + bounds.height / 2 - event.clientY) / bounds.height * 8));
        tiltY(gsap.utils.clamp(-4, 4, (event.clientX - bounds.left - bounds.width / 2) / bounds.width * 8));
      }, {passive: true, signal});
      element.addEventListener('pointerleave', () => { tiltX(0); tiltY(0); }, {signal});
    });
    document.querySelectorAll('.button, .scene-switcher button, .assistant-peek').forEach((button) => {
      const hover = gsap.to(button, {scale: 1.035, y: -2, duration: .3, ease: 'power2.out', paused: true});
      button.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') hover.play(); }, {signal});
      button.addEventListener('pointerleave', () => hover.reverse(), {signal});
    });
    return () => { listeners.abort(); glowLayer?.remove(); };
  });
})();
