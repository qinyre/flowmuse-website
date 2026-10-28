export const origin = 'https://flowmuse.cloud';
export const app = 'https://app.flowmuse.cloud/library';
export const source = 'https://github.com/qinyre/FlowMuse';
export const version = '20261028-sidebar-groups';
export const productPages = [
  ['/features/', '功能总览', '从记录、整理到一起完成'],
  ['/features/writing/', '手写与 PDF', '让笔迹和理解留在同一页'],
  ['/features/collaboration/', '实时协作', '不同设备，共同推进思路'],
  ['/features/intelligence/', '智能整理', '识别、排版与 AI 笔记助手'],
  ['/features/library/', '笔记资料库', '分类、找回与妥善备份'],
];
export const navigationGroups = [
  ['记录与阅读', [['/features/writing/','自然书写'],['/features/pdf/','PDF 阅读与批注'],['/features/canvas/','画布编辑与导出']]],
  ['一起创作', [['/features/collaboration/','实时协作'],['/features/presence/','聚焦与跟随'],['/features/friends/','好友与邀请']]],
  ['智能整理', [['/features/recognition/','手写识别'],['/features/layout/','智能排版'],['/features/intelligence/','AI 笔记助手'],['/features/speech/','语音输入']]],
  ['管理笔记', [['/features/library/','笔记资料库'],['/features/backup/','备份与恢复'],['/features/preferences/','主题与偏好']]],
  ['了解与使用', [['/platforms/','鸿蒙与多端'],['/guide/','使用指南'],['/faq/','常见问题'],['/privacy/','数据与隐私']]],
];
export const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function url(from, to) {
  if (/^(https?:|mailto:|#)/.test(to)) return to;
  const depth = from.split('/').filter(Boolean).length;
  return (depth ? '../'.repeat(depth) : './') + to.replace(/^\//, '');
}
export const icon = (id, className = '') => `<svg class="icon ${className}" aria-hidden="true"><use href="#${id}"/></svg>`;
const icons = `<svg class="icon-definitions" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
<symbol id="arrow" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></symbol>
<symbol id="external" viewBox="0 0 24 24"><path d="M7 17 17 7M7 7h10v10"/></symbol>
<symbol id="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
<symbol id="pen" viewBox="0 0 24 24"><path d="m15 4 5 5-11 11-6 1 1-6L15 4Zm-9 9 5 5M14 5l5 5"/></symbol>
<symbol id="paper" viewBox="0 0 24 24"><path d="M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8m-8 4h6"/></symbol>
<symbol id="spark" viewBox="0 0 24 24"><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4"/></symbol>
<symbol id="people" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m5 10v-3a6 6 0 0 0-3-5"/></symbol>
<symbol id="github" viewBox="0 0 24 24"><path d="M9 20c-4 1-4-2-6-2m12 4v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.8-1.6 6.8-7.3A5.7 5.7 0 0 0 19.3 4 5.3 5.3 0 0 0 19.1 0S17.8-.4 15 1.5a14 14 0 0 0-7 0C5.2-.4 3.9 0 3.9 0A5.3 5.3 0 0 0 3.7 4 5.7 5.7 0 0 0 2.2 8c0 5.7 3.5 6.9 6.8 7.3A3.5 3.5 0 0 0 8 18v4" transform="translate(1 1) scale(.9)"/></symbol>
</defs></svg>`;

export function link(route, target, label, className = 'text-link') {
  const external = /^https?:/.test(target);
  return `<a class="${className}" href="${escape(url(route, target))}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label} ${icon(external ? 'external' : 'arrow')}</a>`;
}
export function shot(route, file, width, height, alt, caption, {crop = false, eager = false} = {}) {
  const src = url(route, '/assets/' + file);
  return `<figure class="product-figure${crop ? ' figure-cropped' : ''}${crop === 'center' ? ' figure-dialog' : ''}"><a href="${src}" target="_blank" rel="noopener noreferrer" aria-label="${escape('查看大图：' + alt)}"><img src="${src}" width="${width}" height="${height}" alt="${escape(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}></a><figcaption><span>${escape(caption)}</span><span class="figure-zoom">查看大图 ${icon('external')}</span></figcaption></figure>`;
}
export function hero(page, {title, description, visual = ''}) {
  const statement = title.replace(/<\/?span[^>]*>|<br>/g, '');
  return `<section class="page-hero container" id="top"><nav class="breadcrumbs" aria-label="当前位置"><a href="${url(page.route, '/')}">首页</a><span aria-hidden="true">/</span>${page.route.startsWith('/features/') && page.route !== '/features/' ? `<a href="${url(page.route, '/features/')}">产品能力</a><span aria-hidden="true">/</span>` : ''}<span aria-current="page">${page.label}</span></nav><div class="page-hero-copy"><h1>${page.label}</h1><p class="page-statement">${statement}</p><p class="page-lead">${description}</p></div>${visual ? `<div class="page-visual">${visual}</div>` : ''}</section>`;
}
export function toc(items) {
  return `<nav class="page-toc container" aria-label="本页目录"><span>这一页，聊聊</span>${items.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}</nav>`;
}
export function chapter(id, number, title, intro, body, extra = '') {
  return `<section class="chapter container ${extra}" id="${id}"><div class="chapter-heading"><h2>${title}</h2>${intro ? `<p>${intro}</p>` : ''}</div><div class="chapter-body">${body}</div></section>`;
}
export const facts = rows => `<dl class="fact-list">${rows.map(([title, body]) => `<div><dt>${title}</dt><dd>${body}</dd></div>`).join('')}</dl>`;
export const note = (title, body) => `<aside class="editor-note"><strong>${title}</strong><p>${body}</p></aside>`;
export const steps = rows => `<ol class="step-list">${rows.map(([title, body]) => `<li><div><h3>${title}</h3><p>${body}</p></div></li>`).join('')}</ol>`;
export function table(caption, headings, rows) {
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="${caption}"><table><caption>${caption}</caption><thead><tr>${headings.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function next(route, target, label, body) {
  return `<section class="reading-next container"><a href="${url(route,target)}"><div><h2>${label}</h2><p>${body}</p></div>${icon('arrow')}</a></section>`;
}
export function render(page, body) {
  const r = page.route;
  const u = path => url(r, path);
  const brand = `<a class="brand" href="${u('/')}" aria-label="FlowMuse 流形白板首页"><img src="${u('/assets/app-icon.png')}" width="40" height="40" alt=""><span translate="no">FlowMuse<span class="brand-dot">.</span><small>流形白板</small></span></a>`;
  const navItem = (target, label) => `<a href="${u(target)}"${target === r ? ' aria-current="page"' : ''}>${label}</a>`;
  const topLinks = [['/platforms/','鸿蒙与多端'],['/guide/','使用指南'],['/privacy/','数据与隐私']];
  const sideLinks = `<div class="sidebar-overview">${navItem('/features/','产品概览')}</div>${navigationGroups.map(([label,links])=>`<div class="sidebar-group"><p>${label}</p>${links.map(([path,name])=>navItem(path,name)).join('')}</div>`).join('')}`;
  const sidebar = `<aside class="docs-sidebar"><p class="sidebar-heading">探索 <span translate="no">FlowMuse</span></p><nav aria-label="产品介绍导航">${sideLinks}</nav><a class="sidebar-home" href="${u('/')}">← 返回首页</a></aside>`;
  const mobileSidebar = `<div class="docs-mobile-bar"><details class="docs-mobile-menu"><summary><span>产品目录</span><span class="mobile-current">${page.label}</span>${icon('chevron')}</summary><nav aria-label="手机产品目录">${sideLinks}</nav></details></div>`;
  return `<!doctype html>
<!-- 由 tool/build-site.mjs 从 site/ 生成，请修改来源后重新生成。 -->
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(page.title)} · FlowMuse 流形白板</title><meta name="description" content="${escape(page.description)}"><meta name="theme-color" content="#f8f7f2">
<meta property="og:type" content="website"><meta property="og:locale" content="zh_CN"><meta property="og:site_name" content="FlowMuse 流形白板"><meta property="og:title" content="${escape(page.title)} · FlowMuse"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${origin+r}"><meta property="og:image" content="${origin}/assets/handwriting.webp">
<link rel="canonical" href="${origin+r}"><link rel="icon" type="image/png" sizes="192x192" href="${u('/assets/app-icon.png')}"><link rel="apple-touch-icon" href="${u('/assets/app-icon.png')}">
<link rel="preload" href="${u('/assets/flowmuse-regular.woff2')}?v=${version}" as="font" type="font/woff2" crossorigin><link rel="preload" href="${u('/assets/flowmuse-semibold.woff2')}?v=${version}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${u('/styles.css')}?v=${version}"><link rel="stylesheet" href="${u('/pages.css')}?v=${version}">
<script src="${u('/assets/vendor/gsap/gsap.min.js')}" defer></script><script src="${u('/assets/vendor/gsap/ScrollTrigger.min.js')}" defer></script><script src="${u('/script.js')}?v=${version}" defer></script><script src="${u('/motion.js')}?v=${version}" defer></script></head>
<body class="${r === '/' ? 'home-page' : 'detail-page'}"><a class="skip-link" href="#main">跳到正文</a>${icons}
<header class="site-header"><div class="container header-inner">${brand}<nav class="desktop-nav" aria-label="主导航"><details class="desktop-menu"><summary${r.startsWith('/features/') ? ' class="is-current"' : ''}>产品能力 ${icon('chevron')}</summary><div class="nav-dropdown">${productPages.map(([path,label,detail]) => `<a href="${u(path)}"${path === r ? ' aria-current="page"' : ''}><strong>${label}</strong><span>${detail}</span></a>`).join('')}</div></details>${topLinks.map(([path,label])=>navItem(path,label)).join('')}</nav><a class="button button-small header-cta" href="${app}" target="_blank" rel="noopener noreferrer">打开白板 ${icon('external')}</a><details class="mobile-menu"><summary aria-label="导航菜单"><span></span><span></span><span></span></summary><nav aria-label="手机导航"><p>产品能力</p>${productPages.map(([path,label])=>navItem(path,label)).join('')}${topLinks.map(([path,label])=>navItem(path,label)).join('')}${navItem('/faq/','常见问题')}</nav></details></div></header>
${r === '/' ? `<main id="main" tabindex="-1">${body}</main>` : `<div class="docs-layout">${sidebar}<main class="docs-main" id="main" tabindex="-1">${mobileSidebar}${body}</main></div>`}
<footer class="site-footer container"><div class="footer-top"><div>${brand}<p>自由落笔，一起成形。</p><a class="text-link" href="mailto:3252024846@qq.com">联系与反馈 ${icon('arrow')}</a></div><nav aria-label="页脚导航"><div><p>了解产品</p>${productPages.slice(1).map(([path,label])=>navItem(path,label)).join('')}</div><div><p>开始使用</p>${navItem('/platforms/','鸿蒙与多端')}${navItem('/guide/','使用指南')}${navItem('/faq/','常见问题')}<a href="${source}" target="_blank" rel="noopener noreferrer">项目源码 ${icon('external')}</a></div><div><p>关于与支持</p>${navItem('/privacy/','数据与隐私')}${navItem('/user-agreement/','用户服务协议')}<a href="${source}/issues" target="_blank" rel="noopener noreferrer">问题反馈 ${icon('external')}</a></div></nav></div><div class="footer-bottom"><p>© <span data-current-year>2026</span> <span translate="no">FlowMuse</span></p><a href="#top">回到页首 <span aria-hidden="true">↑</span></a></div></footer></body></html>\n`;
}
