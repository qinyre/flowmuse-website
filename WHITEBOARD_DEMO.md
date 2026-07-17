# FlowMuse Whiteboard Demo

基于 FlowMuse 项目真实架构的 JavaScript 白板演示

## 🎨 架构还原

### 布局结构（参考 markdraw_editor.dart）

```
Scaffold
└── LayoutBuilder
    ├── EditorCanvas (画布层 - 全屏)
    ├── Toolbar (工具栏 - 可停靠顶部/左侧/右侧)
    ├── PropertyPanel (属性面板 - 右侧浮动)
    ├── ControlGroup - BottomLeft (缩放控制)
    ├── ControlGroup - BottomRight (撤销/重做)
    └── CanvasHint (操作提示)
```

### 核心组件

1. **EditorCanvas** - 主画布区域
   - 网格背景
   - 元素渲染
   - 交互处理

2. **Toolbar** - 工具栏
   - 选择、矩形、椭圆、箭头、直线
   - 手绘、文字、橡皮擦、平移

3. **PropertyPanel** - 属性面板
   - 描边颜色/粗细
   - 填充颜色
   - 透明度控制

4. **ControlGroups** - 控制组
   - 缩放控制（放大/缩小/重置）
   - 撤销/重做/清空

## 🚀 功能实现

### 基础绘图
- ✅ 矩形（Rectangle）
- ✅ 椭圆（Ellipse）
- ✅ 箭头（Arrow）
- ✅ 直线（Line）
- ✅ 手绘（Freedraw）
- ✅ 橡皮擦（Eraser）

### 视图控制
- ✅ 缩放（Zoom In/Out）
- ✅ 平移（Hand Tool）
- ✅ 重置视图

### 编辑操作
- ✅ 撤销/重做（Undo/Redo）
- ✅ 清空画布
- ✅ 历史记录管理

### 交互特性
- ✅ 鼠标绘制
- ✅ 触摸屏支持
- ✅ 键盘快捷键
- ✅ 实时预览

## ⌨️ 快捷键

| 功能 | 快捷键 |
|------|--------|
| 选择工具 | V |
| 矩形 | R |
| 椭圆 | O |
| 箭头 | A |
| 直线 | L |
| 手绘 | D |
| 文字 | T |
| 橡皮擦 | E |
| 平移 | H |
| 撤销 | Ctrl+Z |
| 重做 | Ctrl+Y |
| 放大 | + |
| 缩小 | - |
| 重置缩放 | 0 |

## 📂 文件说明

- `whiteboard-demo.html` - 白板 UI 布局（基于 Flutter Scaffold 结构）
- `whiteboard-engine.js` - 白板引擎（参考 Markdraw 架构）

## 🔧 技术细节

### 元素数据结构（参考 element.dart）

```javascript
{
    type: 'rectangle' | 'ellipse' | 'arrow' | 'line' | 'freedraw',
    x: number,
    y: number,
    width: number,
    height: number,
    strokeColor: string,
    fillColor: string,
    strokeWidth: number,
    opacity: number
}
```

### 状态管理

- **elements[]** - 场景元素列表（类似 EditorState）
- **history[]** - 历史记录栈
- **zoom/panX/panY** - 视图变换
- **currentTool** - 当前工具状态

### 渲染流程

1. 清空画布
2. 绘制网格背景
3. 应用视图变换（平移 + 缩放）
4. 遍历渲染所有元素
5. 绘制当前预览

## 🎯 与 FlowMuse 项目的对应关系

| FlowMuse (Dart) | Demo (JavaScript) |
|-----------------|-------------------|
| `Element` 类 | `element` 对象 |
| `EditorState` | `WhiteboardEngine.elements` |
| `MarkdrawController` | `WhiteboardEngine` 类 |
| `EditorCanvas` | `<canvas id="editorCanvas">` |
| `ToolbarDock` 枚举 | `.toolbar-top` CSS |
| `ControlGroupPosition` | `.control-group.bottom-left` 等 |
| `ChangeNotifier` | 直接 `render()` 调用 |

## 🚀 使用方法

### 直接打开
双击 `whiteboard-demo.html` 在浏览器中打开。

### 本地服务器
```bash
cd flowmuse-website
python -m http.server 8000
```

访问 `http://localhost:8000/whiteboard-demo.html`

### 集成到介绍网站

在 `index.html` 的 Hero Visual 部分使用 iframe：

```html
<iframe 
    src="whiteboard-demo.html" 
    style="width: 100%; height: 600px; border: none; border-radius: 12px;">
</iframe>
```

## 📝 扩展建议

如需完整实现 FlowMuse 功能，可以继续添加：

1. **文本元素** - 参考 `text_element.dart`
2. **图片元素** - 参考 `image_element.dart`
3. **选择框** - 参考 `selection_overlay.dart`
4. **多选操作** - 参考 `selected_elements.dart`
5. **协作光标** - 参考 `remote_collaborator_overlay.dart`
6. **导出功能** - Canvas toDataURL/toBlob
7. **Excalidraw 兼容** - JSON 数据格式

## 🔗 参考源码

- `/lib/features/whiteboard/editor_core/src/ui/markdraw_editor.dart` - UI 布局
- `/lib/features/whiteboard/editor_core/src/editor/editor.dart` - 核心逻辑
- `/lib/features/whiteboard/editor_core/src/core/elements/` - 元素定义

---

© 2024 FlowMuse - 基于真实项目架构的简化演示
