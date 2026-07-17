# FlowMuse 官方网站

FlowMuse 白板笔记应用的官方介绍网站。

## 🎨 特性

- 响应式设计，适配各种屏幕尺寸
- 流畅的 GSAP 动画效果
- 基于 FlowMuse 项目真实 UI 风格的白板演示
- 支持多平台展示（Android、macOS/iOS、Windows、Web、HarmonyOS）

## 🚀 快速开始

### 本地预览

```bash
# 使用 Python 启动本地服务器
python -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000
```

然后访问 `http://localhost:8000`

### 文件结构

```
flowmuse-website/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # JavaScript 动画
├── README.md           # 项目说明
└── .gitignore         # Git 忽略文件
```

## 🛠️ 技术栈

- **HTML5** - 语义化标签
- **CSS3** - Grid/Flexbox 布局、CSS 变量、动画
- **JavaScript** - GSAP 动画库
- **Iconify** - 图标系统

## 📦 依赖

所有依赖通过 CDN 加载，无需本地安装：

- GSAP 3.12.5
- ScrollTrigger
- Iconify 3.1.0
- Google Fonts (DM Sans)

## 🎯 主要功能

### Hero 区域
- 产品介绍
- 行动号召按钮
- 真实 FlowMuse 白板 UI 预览

### 功能特性
- Markdraw 白板引擎介绍
- 多端协作说明
- 实时同步展示

### 平台支持
- Android
- macOS / iOS
- Windows
- Web
- HarmonyOS（原生优化）

### 技术架构
- 纯 Dart 内核
- Flutter 跨平台
- Excalidraw 兼容

## 🎨 设计系统

### 颜色方案

基于 FlowMuse Day 主题：

- 主色调：`#4F8F84`
- 强调色：`#A16207` / `#CA8A04`
- 背景：`#FFFFFF` → `#F7FAF8` → `#FDFEFE`

### 响应式断点

- 桌面：> 1024px
- 平板：768px - 1024px
- 手机：< 768px

## 📝 待办事项

- [ ] 添加更多产品截图
- [ ] 完善下载页面
- [ ] 添加多语言支持
- [ ] 优化移动端体验
- [ ] 集成实时 Demo

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本网站代码采用 MIT 许可证。

FlowMuse 产品本身的许可证请参考主项目仓库。

## 🔗 相关链接

- [FlowMuse 主项目](https://github.com/your-org/flowmuse)
- [在线预览](https://flowmuse.example.com)
- [文档中心](https://docs.flowmuse.example.com)

---

© 2024 FlowMuse. 基于 Flutter 构建.
