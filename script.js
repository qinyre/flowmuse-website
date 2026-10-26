'use strict';

const sceneButtons = document.querySelectorAll('[data-scene]');
const scenePanels = document.querySelectorAll('[data-scene-panel]');

sceneButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedPanel = document.getElementById(button.dataset.scene);
    if (!selectedPanel) return;
    scenePanels.forEach((panel) => { panel.hidden = panel !== selectedPanel; });
    sceneButtons.forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
  });
});

document.querySelector('.scene-switcher').hidden = false;

const mobileMenu = document.querySelector('.mobile-menu');
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => { mobileMenu.open = false; });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu.open) {
    mobileMenu.open = false;
    mobileMenu.querySelector('summary').focus();
  }
});

document.querySelector('[data-current-year]').textContent = new Date().getFullYear();
