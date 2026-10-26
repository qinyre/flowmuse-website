# FlowMuse 官网

FlowMuse（流形白板）的产品介绍网站，独立于 Flutter Web 应用与 Go 后端。

- 官网：<https://flowmuse.cloud/>
- 在线白板：<https://app.flowmuse.cloud/library>
- 主项目：<https://github.com/qinyre/FlowMuse>

## 预览与验证

无需安装前端依赖或执行构建。使用 Python 3 启动静态服务器：

```sh
python -m http.server 8000 --bind 127.0.0.1
```

打开 <http://127.0.0.1:8000/>。使用 Node.js 18+ 运行轻量验证：

```sh
node --check script.js
node --test tests/site.test.mjs
```

浏览器验收包括桌面/手机布局、截图切换、手机菜单及 Escape、FAQ 键盘操作、减少动画、禁用 JavaScript、应用与反馈入口。内容默认可见，FAQ 与手机导航使用原生 `details`；截图默认展示自然书写，不依赖 JavaScript 才能加载正文。

## 文件

```text
index.html                产品介绍与语义化内容
styles.css                纸面/绿色视觉与响应式布局
script.js                 截图切换、手机菜单关闭、页脚年份
assets/                   自托管截图、图标、裁剪字体与许可证
tests/site.test.mjs        静态资源和交互回归测试，无第三方依赖
user-agreement/           现有用户协议（保留原文）
whiteboard-demo.html       早期独立白板演示（保留兼容入口）
whiteboard-engine.js       早期演示引擎，不是产品编辑器
docs/                     本次更新范围、素材与发布记录
```

首页不依赖 Google Fonts、GSAP、Iconify 或其他远程脚本。图片为 WebP、注明真实演示来源，指定尺寸以减少布局偏移；首屏图片优先加载，其他图片懒加载。图片大图为直接链接，无需额外弹窗库。

## 素材来源

- 图标来自主项目 `FlowMuse-App/assets/images/flowmuse-app-icon.png`，缩至 192px。
- 五张产品截图来自主项目 `docs/参赛文档/复赛演示视频/edit/public/footage/` 中的实录：`02-natural-ink-v5.mp4` 32s、`01-library-pdf-v5.mp4` 14s、`06-social-collaboration-v5.mp4` 25s、`04-smart-layout-v5.mp4` 38s、`05-ai-mindmap-v5.mp4` 10s。截图用于功能展示，不等于当前所有设备的实测结论。
- FlowMuse Sans 来自主项目 `FlowMuse-App/assets/fonts/ui/`（Noto Sans SC 派生，SIL OFL 1.1）。许可证随 `assets/OFL.txt` 分发。400/600 字重按本页 HTML 与 JavaScript 字符裁剪为 WOFF2，字体内部版权与家族名保留；改文案后可用 Python fontTools 重新裁剪，未覆盖字形使用系统回退。

2026-10-26 核对主项目没有 GitHub Release 安装包，因此页面分别提供“打开网页版”和“查看源码与构建说明”，不承诺各平台已有下载或商店上架。

## 发布

只发布 `index.html`、`styles.css`、`script.js`、`assets/`、`user-agreement/` 和两份早期白板演示文件。不要将 `.git/`、`tests/`、`docs/`、`build/` 或本机配置上传到公开目录。

服务器官网根目录独立于 `app.flowmuse.cloud` 和 `api.flowmuse.cloud`。先上传到独立版本目录，核对资源哈希，再切换官网 root；保留证书、API 转发和其他站点配置。`nginx -t` 成功后 reload，验证 HTTPS 首页、资源 MIME、协议路径及应用入口。不需要重启后端。回退时恢复官网原 root 并重新检查和 reload。

每次修改静态 CSS/JS，应同步更新 `index.html` 的资源版本参数，避免旧缓存与新页面混用。
