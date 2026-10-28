import assert from 'node:assert/strict';
import {readFileSync, existsSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pages} from '../site/content.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'styles.css'), 'utf8');
const script = readFileSync(resolve(root, 'script.js'), 'utf8');
const motion = readFileSync(resolve(root, 'motion.js'), 'utf8');

test('完整页面生成结果同步，独立路由与页面标题唯一', () => {
  execFileSync(process.execPath, ['tool/build-site.mjs', '--check'], {cwd: root});
  assert.equal(new Set(pages.map(p => p.route)).size, pages.length);
  assert.equal(new Set(pages.map(p => p.title)).size, pages.length);
});

test('全站锚点、SVG 引用、资源和跨页链接均有目标，也兼容子路径', () => {
  for (const page of pages) {
    const file = page.route.slice(1) + 'index.html';
    const content = readFileSync(resolve(root, file), 'utf8');
    const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${file} 不允许重复 id`);
    assert.equal((content.match(/<h1\b/g) || []).length, 1, `${file} 应只有一个主标题`);
    const refs = [...content.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(m => m[1]);
    for (const ref of refs) {
      if (/^(https?:|mailto:)/.test(ref)) continue;
      assert.ok(!ref.startsWith('/'), `${file} 的 ${ref} 会丢失 GitHub Pages 子路径`);
      const target = new URL(ref, 'https://local.test/' + file);
      let path = resolve(root, decodeURIComponent(target.pathname).slice(1));
      assert.ok(existsSync(path), `${file} 缺少 ${ref}`);
      if (statSync(path).isDirectory()) path = resolve(path, 'index.html');
      assert.ok(existsSync(path), `${file} 缺少目录首页 ${ref}`);
      if (target.hash) assert.ok(readFileSync(path, 'utf8').includes(`id="${target.hash.slice(1)}"`), `${file} 缺少锚点 ${ref}`);
    }
  }
  for (const match of css.matchAll(/url\("([^"]+)"\)/g)) assert.ok(existsSync(resolve(root, match[1].split('?')[0])));
});

test('首页自托管资源，外链 HTTPS，新窗口保留安全隔离', () => {
  for (const tag of html.match(/<(?:script|link|img)\b[^>]*>/g)) {
    if (tag.includes('rel="canonical"')) continue;
    assert.doesNotMatch(tag, /(?:src|href)="https?:\/\//, '首页不依赖远程脚本、字体或图片');
  }
  assert.doesNotMatch(html, /(?:href|src)="http:\/\//);
  for (const tag of html.match(/<a\b[^>]*>/g)) {
    if (tag.includes('target="_blank"')) assert.match(tag, /rel="noopener noreferrer"/);
  }
  assert.ok(existsSync(resolve(root, 'assets/OFL.txt')), '自托管字体保留授权');
});

test('图片保留尺寸和无障碍说明，首屏图优先加载', () => {
  for (const tag of html.match(/<img\b[^>]*>/g)) {
    assert.match(tag, /\balt="[^"]*"/);
    assert.match(tag, /\bwidth="\d+"/);
    assert.match(tag, /\bheight="\d+"/);
  }
  assert.match(html, /handwriting\.webp[^>]+fetchpriority="high"/);
  assert.match(html, /<html lang="zh-CN">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

function harness({innerPage = false, hash = ''} = {}) {
  function element(id, attrs = {}) {
    return {
      id, attrs, hidden: Boolean(attrs.hidden), open: false,
      dataset: {scene: attrs['data-scene']}, events: {},
      addEventListener(name, callback) { this.events[name] = callback; },
      setAttribute(name, value) { this.attrs[name] = value; },
      matches() { return false; },
    };
  }
  const buttons = [...(innerPage ? '' : html).matchAll(/<button\b[^>]*data-scene="([^"]+)"[^>]*>/g)]
    .map((m, i) => element(`button-${i}`, {'data-scene': m[1], 'aria-pressed': i === 0 ? 'true' : 'false'}));
  const panels = buttons.map((button, i) => element(button.dataset.scene, {hidden: i !== 0}));
  const summary = {focused: false, focus() { this.focused = true; }};
  const links = [element('link')];
  const menu = element('menu');
  menu.querySelectorAll = () => links;
  menu.querySelector = () => summary;
  menu.contains = target => links.includes(target) || target === summary;
  const desktop = element('desktop-menu');
  desktop.querySelectorAll = () => [];
  desktop.querySelector = () => summary;
  desktop.contains = () => false;
  const year = {};
  const question = element('rooms-q4');
  question.matches = selector => selector === '.faq-list details';
  const switcher = {hidden: true};
  const document = {
    events: {}, addEventListener(name, fn) { this.events[name] = fn; },
    querySelectorAll(selector) {
      return {'[data-scene]': buttons, '[data-scene-panel]': panels, '.desktop-menu, .mobile-menu, .docs-mobile-menu': [menu, desktop]}[selector] || [];
    },
    getElementById(id) { return panels.find((panel) => panel.id === id) || (id === question.id ? question : null); },
    querySelector(selector) {
      return {'.mobile-menu': menu, '.scene-switcher': innerPage ? null : switcher, '[data-current-year]': year}[selector] || null;
    },
  };
  const window = {location: {hash}, events: {}, addEventListener(name, fn) { this.events[name] = fn; }};
  vm.runInNewContext(script, {document, Date, window});
  return {buttons, panels, menu, desktop, links, summary, year, document, switcher, question, window};
}

test('切换截图时只有对应画面可见，按钮状态始终一致', () => {
  const {buttons, panels, switcher} = harness();
  assert.equal(buttons.length, 3);
  assert.equal(switcher.hidden, false);
  for (const index of [1, 2, 0, 0, 2]) {
    buttons[index].events.click();
    assert.deepEqual(panels.map((p) => p.hidden), panels.map((_, i) => i !== index));
    assert.deepEqual(buttons.map((b) => b.attrs['aria-pressed']), buttons.map((_, i) => String(i === index)));
  }
  buttons[0].dataset.scene = 'missing-panel';
  buttons[0].events.click();
  assert.equal(panels.filter((p) => !p.hidden).length, 1, '引用失效时保留当前画面');
});

test('手机菜单在链接跳转或 Escape 时关闭，Escape 归还焦点', () => {
  const {menu, links, summary, document, year} = harness();
  menu.open = true;
  links[0].events.click();
  assert.equal(menu.open, false);
  menu.open = true;
  document.events.keydown({key: 'Tab'});
  assert.equal(menu.open, true);
  document.events.keydown({key: 'Escape'});
  assert.equal(menu.open, false);
  assert.equal(summary.focused, true);
  assert.equal(year.textContent, new Date().getFullYear());
});

test('内页没有截图画廊仍可导航，菜单互斥且点击外部可关闭', () => {
  const {menu, desktop, document, summary} = harness({innerPage: true});
  desktop.open = true;
  menu.open = true;
  menu.events.toggle();
  assert.equal(desktop.open, false);
  document.events.click({target: summary});
  assert.equal(menu.open, true);
  document.events.click({target: {}});
  assert.equal(menu.open, false);
});

test('FAQ 初次直达与后续锚点均展开答案，非法片段不打断页面', () => {
  assert.equal(harness({hash: '#rooms-q4'}).question.open, true);
  const {question, window} = harness();
  window.location.hash = '#rooms-q4';
  window.events.hashchange();
  assert.equal(question.open, true);
  assert.doesNotThrow(() => harness({hash: '#%E0%A4%A'}));
});

test('保留协议和历史演示路径，页面不再将网页版标成安装包', () => {
  for (const file of ['user-agreement/index.html', 'whiteboard-demo.html', 'whiteboard-engine.js']) {
    assert.ok(existsSync(resolve(root, file)));
  }
  assert.match(html, /安装包尚未/);
  assert.match(html, /https:\/\/app\.flowmuse\.cloud\/library/);
  assert.doesNotMatch(html, /data-stat-target|1 秒自动识别|Web Speech API|sh(erpa|erpa-onnx)/);
});

test('原版 GSAP 与 ScrollTrigger 自托管、版权保留且加载顺序正确', () => {
  const files = {
    'gsap.min.js': '28033e449a31ebcc396e5be8b13b63152bf03094288fb5867034321927bce087',
    'ScrollTrigger.min.js': 'ad33c2df9ada8a663c2147357828f980d0b7ca731ef33eb3c6e4f327c3b2cda5',
  };
  for (const [file, hash] of Object.entries(files)) {
    const bytes = readFileSync(resolve(root, 'assets/vendor/gsap', file));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash);
    assert.match(bytes.toString('utf8'), /Copyright 2024, GreenSock/);
  }
  const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*>/g)].map((m) => {
    assert.match(m[0], /\bdefer\b/);
    return m[1].split('?')[0].replace(/^\.\//, '');
  });
  assert.deepEqual(scripts, ['assets/vendor/gsap/gsap.min.js', 'assets/vendor/gsap/ScrollTrigger.min.js', 'script.js', 'motion.js']);
});

test('动效库或滚动插件缺失时，静态正文和基础交互不依赖动效初始化', () => {
  for (const window of [{}, {gsap: {}}, {ScrollTrigger: {}}]) {
    assert.doesNotThrow(() => vm.runInNewContext(motion, {window}));
  }
  const {buttons, panels} = harness();
  buttons[1].events.click();
  assert.equal(panels[1].hidden, false);
});
