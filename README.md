# FlowMuse 官网

FlowMuse（流形白板）的产品介绍网站，独立于 Flutter Web 应用与 Go 后端。首页保留纸面、绿色与手写动效；介绍区使用固定侧栏，每项功能有可直接访问的独立路由。

- 官网：<https://flowmuse.cloud/>
- 在线白板：<https://app.flowmuse.cloud/library>
- 主项目：<https://github.com/qinyre/FlowMuse>

## 本地开发

没有前端运行框架和 npm 依赖。使用 Node.js 18+ 生成完整静态 HTML，再启动任意静态服务器：

```sh
node tool/build-site.mjs
python -m http.server 8000 --bind 127.0.0.1
```

打开 <http://127.0.0.1:8000/>。生成页面已随源码提交，只预览时不需要构建。

```sh
node tool/build-site.mjs --check
node --check script.js
node --check motion.js
node --test tests/site.test.mjs
```

修改 `site/` 中的来源，重新生成页面，不直接修改生成的 `index.html`。新增功能时同步维护 `site/layout.mjs` 的分组导航和 `site/feature-pages.mjs`；新增一般介绍页放在 `site/content.mjs`。页面使用相对链接，兼容域名根目录与 GitHub Pages 项目子路径。

## 页面与来源

| 来源 | 用途 |
| --- | --- |
| `site/home.html` | 首页原有图文与实录画廊 |
| `site/layout.mjs` | 共享导航、侧栏、图片、正文组件和元信息 |
| `site/feature-pages.mjs` | 13 个独立功能页 |
| `site/content.mjs` | 功能总览、鸿蒙与多端、指南、隐私与 FAQ |
| `tool/build-site.mjs` | 生成 19 个页面及 sitemap、robots |
| `styles.css` / `pages.css` | 首页风格与介绍区、响应式样式 |
| `script.js` | 画廊、菜单、FAQ 深链接、年份和侧栏定位 |
| `motion.js` | 自托管 GSAP、滚动入场、图片反馈与减少动画适配 |
| `assets/` | 原始截图、应用图标、字体与许可 |
| `user-agreement/` | 与主项目同步的正式协议，保留独立路径 |
| `404.html` | 无脚本、无资源依赖的错误页 |
| `whiteboard-demo.html` / `whiteboard-engine.js` | 历史独立演示，保留入口 |

独立功能包括自然书写、PDF、画布编辑、实时协作、聚焦与跟随、好友与邀请、手写识别、智能排版、AI 助手、语音、资料库、备份和偏好设置。实际地址见 [站点地图](sitemap.xml)。

## 素材与字体

五张既有演示实录和五张新增组件截图的来源见 [素材清单](docs/website-assets.md)。保留原始图片，不生成虚构产品界面；无截图的功能使用文字与操作说明。

FlowMuse Sans 来自主项目 `FlowMuse-App/assets/fonts/ui/`，是 Noto Sans SC 的 SIL OFL 1.1 派生字体。`assets/OFL.txt` 随字体分发。新增文案后，可通过 Python fontTools 重新裁剪 400/600 字重：

```sh
python tool/subset-fonts.py --source-dir ../2024-se-17/FlowMuse-App/assets/fonts/ui
```

脚本保留字体名称与版权，并使同一份输入的输出可重复。字体 URL 的版本参数与 `site/layout.mjs` 的预加载参数保持一致。

GSAP 3.12.5 与 ScrollTrigger 保持上游原始字节；声明见 `assets/vendor/gsap/NOTICE.txt`。页面不依赖远程脚本、字体或图标。首页循环动效可暂停，离开视口或隐藏标签页时停止循环；减少动画时保留内容与基本交互。

## 发布与回退

发布 `index.html`、`features/`、`platforms/`、`guide/`、`privacy/`、`faq/`、`404.html`、`sitemap.xml`、`robots.txt`、两份 CSS、两份 JS、`assets/`、`user-agreement/` 和历史演示文件。不要发布 `.git/`、`site/`、`tool/`、`tests/`、`docs/`、`build/`、`.taste-skill/` 或本机配置。

官网根目录与白板应用、API 独立。将上述文件上传至新的版本目录，核对资源后再切换官网 root，保留旧版本用于回退。官网 `server` 中将旧的单页回退替换为真实目录和 404：

```nginx
index index.html;
location / {
    try_files $uri $uri/ =404;
}
error_page 404 /404.html;
```

不要把这个 `location /` 重复添加到现有同名块中，也不要修改 API 或白板应用站点。更新官网的 HTML 缓存片段 `deploy/nginx-html-cache.conf`，执行 `nginx -t` 后 reload，再检查目录页直达/刷新、404、MIME 与缓存响应头。网站发布不需要重启后端。

修改 CSS/JS 后，更新 `site/layout.mjs` 的版本参数。使用 GitHub Pages 时发布完整目录树，所有链接与资源保留项目子路径；其缓存由 GitHub 单独管理。

## 内容与隐私维护

页面按已实现能力介绍，不添加虚构用户、评价、性能数字或下载入口。本地数据、协作加密、私聊、智能服务和源码许可分别说明。公开文字不记录成员姓名、个人账号或学校身份，反馈邮箱与必须保留的第三方署名保持原用途。图片、视频和 Git 历史按用户已确认的范围保留。

重构范围、Taste 设计取舍与验证结果见 [实施记录](docs/2026-10-28-multipage-website.md)。本地构建与浏览器验收不代表已经上线。
