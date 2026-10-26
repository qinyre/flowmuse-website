# FlowMuse 官网更新

## 范围

独立仓库 `qinyre/flowmuse-website`，基线 `1839adc`，分支 `feat/website-refresh`。
只更新产品介绍网站；不修改 `2024-se-17` 客户端工作区、Web 应用、API、数据库或协议。

## 实施

1. 延续绿色与纸面风格，使用正式应用图标和现有演示录屏截图，替换首页示意白板。
2. 按手写/PDF、AI 辅助整理、多端协作组织介绍；纠正语音与手写识别混淆、过时统计和未经验证的速度承诺。
3. 分开网页版入口与客户端源码/构建说明。2026-10-26 核对 GitHub Releases 为空，不编造下载地址或上架状态。
4. 保留静态 HTML/CSS/JS；字体、图标与截图本地托管，移除首页对 GSAP、Iconify、Google Fonts 的依赖。保留独立白板演示及用户协议路径。
5. 验证桌面、手机、键盘、减少动画、关闭 JavaScript、资源和入口；在官网专用发布目录部署，保留上一版本供回退，不重启后端。

## 素材

- 图标：主仓库 `FlowMuse-App/assets/images/flowmuse-app-icon.png`。
- 产品截图：主仓库 `docs/参赛文档/复赛演示视频/edit/public/footage/*-v5.mp4` 中的真实演示帧，不代表当前版本全部平台实测。
- 字体：FlowMuse Sans（由 Noto Sans SC 派生，SIL OFL 1.1），随站点保留许可证。网页按静态文案裁剪 WOFF2，未覆盖字符使用系统回退。

## 验证与发布

### 本地验收

- `node --check script.js`、`node --test tests/site.test.mjs`：6 项测试通过；`git diff --check` 无错误。
- Chromium 检查 320、360、390、768、900、1024、1440、1920px：文档 scrollWidth 与 clientWidth 相等，无横向溢出。
- 三张首屏截图均可切换并加载，只有当前画面可见；手机菜单链接/Escape 关闭且归还焦点，FAQ 使用 Enter 展开/收起。
- 减少动画模式下首屏 animationName 为 none；关闭 JavaScript 时正文、默认图片、FAQ 保持可用，隐藏无法工作的截图切换按钮。
- 首页资源全部本地加载，字体与截图正常，无页面异常或控制台错误。
- Web 应用入口 HTTP 200；通过 GitHub API 核对主仓库、问题入口和构建说明存在。浏览器直连 GitHub 有一次超时，不将它记为站点链接失效或已完成网络可靠性验证。
- 原用户协议和早期白板演示源码保持不变；这次不验证产品自身的识别效果、协作延迟或真实手写笔表现。

### 公网发布

- 功能源提交：`e703fbf9f3db7d34a06c7a54a346efc834c8f20f`。
- 发布时间：2026-10-26 21:23（北京时间）。
- 发布目录：`/var/www/flowmuse-website-releases/20261026-e703fbf`。
- 包 SHA-256：`aa3e7eb3692de6365f33fbde5a514b801d203d090cb3cceb1963a0ac6f36bfad`；上传后匹配，临时上传包已清除。
- 公网 15 个发布文件逐一通过字节哈希核验，HTML/CSS/JS、WebP/PNG 和 WOFF2 MIME 正确；Git archive 按本机 core.autocrlf 对文本转为 CRLF，另行核对与 Git 源文仅此行尾差异，二进制保持一致。
- 干净 Chromium 会话直接打开官网根地址展示新版；390px 无横向溢出，三种截图切换正常，菜单 Escape 关闭，无页面异常。协议地址 HTTP 200 且返回真实协议正文；不是 SPA 回退页。
- 线上桌面/手机截图保存在 `docs/screenshots/home-desktop.png`、`home-mobile.png`，不打入官网发布包。
- 仅替换 `/etc/nginx/sites-available/flowmuse` 中官网 root 一处。`nginx -t` 成功并 reload；已有的 IPv6 TLS protocol options 警告来自独立 app 站点配置，未在本次顺带修改。
- 原官网 `/var/www/flowmuse` 保留。Nginx 原配置备份：`/etc/nginx/sites-available/flowmuse.before-website-20261026-e703fbf`。
- 白板应用 root 保持 `/var/www/flowmuse-app-releases/library-sidebar-20261026-cc182d4`；后端容器 ID 与 StartedAt 发布前后一致，API health 返回 `{"status":"ok"}`。

回退：只将**当前配置中的官网 root** 从新版本目录恢复为 `/var/www/flowmuse`，确认 `nginx -t` 后 reload。若期间有其他运维变更，不直接覆盖整份旧配置。官网独立于客户端工作区，本次未提交或修改其设置面板任务。
