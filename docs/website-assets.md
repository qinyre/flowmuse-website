# 官网素材来源

图片分别标注演示实录和组件画面，不代表全部设备的性能或兼容性实测结论。

## 既有实录

沿用官网已有 WebP，来源为主项目 `docs/参赛文档/复赛演示视频/edit/public/footage/`：

| 官网文件 | 实录文件与时间 |
| --- | --- |
| `handwriting.webp` | `02-natural-ink-v5.mp4`，32s |
| `pdf-notes.webp` | `01-library-pdf-v5.mp4`，14s |
| `collaboration.webp` | `06-social-collaboration-v5.mp4`，25s |
| `smart-layout.webp` | `04-smart-layout-v5.mp4`，38s |
| `ai-assistant.webp` | `05-ai-mindmap-v5.mp4`，10s |

## 新增组件截图

从主项目 `docs/研发记录/images/` 按原始字节复制，使用示例内容：

| 官网文件 | 主项目来源 |
| --- | --- |
| `screenshots/library.png` | `note-title-actions-desktop.png` |
| `screenshots/search.png` | `2026-10-26-search-polish-desktop.png` |
| `screenshots/themes.png` | `2026-10-27-settings-ui-theme-day.png` |
| `screenshots/collaboration-view.png` | `collaboration-status-header-desktop.png` |
| `screenshots/create-room.png` | `collaboration-room-create-preview.png` |

部分画面通过 CSS 展示上部或中央，方便查看相应控件；点击图片仍可打开完整原图。没有引入素材站图片或 AI 生成的产品截图。无截图的能力通过文字介绍，不拼凑虚构界面。

## 图标与字体

应用图标来自主项目 `FlowMuse-App/assets/images/flowmuse-app-icon.png`，沿用已有 192px 版本。导航使用既有内联 SVG。

字体来自主项目 `FlowMuse-App/assets/fonts/ui/FlowMuseSans-Regular.ttf` 与 `FlowMuseSans-SemiBold.ttf`。使用 fontTools 裁剪为 WOFF2，保留字体名称、版权和 `assets/OFL.txt`。
