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

const sceneSwitcher = document.querySelector('.scene-switcher');
if (sceneSwitcher) sceneSwitcher.hidden = false;

const navigationMenus = [...document.querySelectorAll('.desktop-menu, .mobile-menu, .docs-mobile-menu')];
navigationMenus.forEach((menu) => {
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => { menu.open = false; });
  });
  menu.addEventListener('toggle', () => {
    if (menu.open) navigationMenus.forEach((other) => { if (other !== menu) other.open = false; });
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  for (const menu of navigationMenus) {
    if (menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  }
});
document.addEventListener('click', (event) => {
  navigationMenus.forEach((menu) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
});

const year = document.querySelector('[data-current-year]');
if (year) year.textContent = new Date().getFullYear();

const sidebar = document.querySelector('.docs-sidebar');
const currentPage = sidebar?.querySelector('[aria-current="page"]');
if (currentPage && currentPage.offsetTop + currentPage.offsetHeight > sidebar.clientHeight) {
  sidebar.scrollTop = currentPage.offsetTop - sidebar.clientHeight / 2;
}

const openLinkedQuestion = () => {
  let id;
  try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
  const question = document.getElementById(id);
  if (question?.matches('.faq-list details')) question.open = true;
};
window.addEventListener('hashchange', openLinkedQuestion);
openLinkedQuestion();
