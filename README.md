# CoverForge

**文章封面图片生成器。** 在浏览器中设计精美的 1280×720 文章封面，自定义排版、配色与背景，一键导出高分辨率 PNG。

---

## 功能特性

- **所见即所得实时预览** — 画布自适应各种屏幕宽度，预览区的排版、换行与最终导出图片完全一致。
- **背景滤镜烘焙** — 上传背景图后，可调节**模糊**与**亮度**，导出时滤镜效果直接烘焙进 PNG。
- **排版控制** — 6 款内置字体，支持上传自定义 `.ttf` / `.otf` 字体。通过九宫格对齐系统调整文字位置，字号自由调节。
- **灵活背景** — 纯色取色器 或 本地图片上传。
- **装饰条** — 可开关的几何装饰条，颜色独立于文字色可单独配置。
- **6 个内置预设** — Minimal Dark、Editorial、Indigo Night、Warm Paper、Bold Statement、Clean Swiss。一键套用即可开始创作。
- **用户预设** — 将当前配置保存为自定义预设（最多 10 个），存储在 `localStorage` 中。
- **撤销 / 重做** — 完整状态历史记录，最多 50 层，带计数徽章。
- **自动保存** — 刷新页面不丢失工作进度。下次打开时提示恢复上次会话。
- **键盘快捷键** — `⌘E` 导出，`⌘Z` 撤销，`⌘⇧Z` 重做，`⌘D` 切换装饰条，`⌘B` 切换背景类型，`1–9` 文字对齐，`?` 查看所有快捷键。
- **主题切换** — 三态切换：跟随系统 / 浅色 / 深色。设计令牌遵循 shadcn/ui HSL 约定，完整覆盖深色模式。
- **响应式布局** — 桌面端固定侧边栏，移动端浮层抽屉，小屏设备底部悬浮导出按钮。
- **高清导出** — 通过 `html2canvas-pro` 以 1.5× 倍率渲染，在视网膜屏幕上输出清晰锐利的图片。

---

## 技术栈

| 分类     | 技术 |
| -------- | ---- |
| 框架     | [Astro](https://astro.build/) 5 + [React](https://react.dev/) 19 |
| 样式     | 纯 CSS 自定义属性（shadcn/ui HSL 设计令牌约定） |
| 导出     | [html2canvas-pro](https://www.npmjs.com/package/html2canvas-pro) |
| 语言     | TypeScript（strict 模式） |
| 包管理器 | pnpm |

样式层为**纯 CSS**，无运行时 CSS-in-JS 或工具类库。设计令牌以 HSL 自定义属性形式定义在 `src/styles/tokens.css`。

---

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) ≥ 18
- [pnpm](https://pnpm.io/) ≥ 8

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

浏览器打开 `http://localhost:4321`，支持热更新。

### 构建生产版本

```bash
pnpm build
```

静态产物输出到 `dist/`。

### 预览生产构建

```bash
pnpm preview
```

---

## 工作原理

### 画布管线

渲染区域为一个固定 1280×720 的 `<div>`，由三层叠加组成：

1. **BackgroundLayer** — 纯色填充或带 CSS `filter: blur() brightness()` 的 `<img>`。
2. **DecorationLayer** — 通过绝对定位 `<span>` 元素渲染几何装饰条。
3. **TextLayer** — 主标题 + 副标题，通过 CSS flexbox 对齐（九宫格系统）定位。

`ResizeObserver` 计算统一的 `scale()` 变换以适配容器宽度，同时保持内部坐标系不变。导出时 `html2canvas-pro` 以 1.5× 设备像素比捕获同一元素。

### 状态管理

整个配置由单个 `useReducer` + 自定义撤销/重做栈（`useHistory`）驱动。`useAutosave` hook 在每次变更时以去抖方式写入 `localStorage`。`usePresets` 管理内置和用户自定义预设的增删操作。

### 主题系统

通过 `<html>` 上的 `data-theme` 属性实现三态切换：

- `data-theme="system"` — 跟随系统 `prefers-color-scheme`
- `data-theme="light"` / `data-theme="dark"` — 强制指定

所有颜色令牌位于 `src/styles/tokens.css`，遵循 shadcn/ui HSL 约定（如 `--background: 0 0% 100%`）。

---

## 项目结构

```
src/
├── components/
│   ├── App.tsx                      # 根组件：状态、快捷键、布局
│   ├── CanvasPreview.tsx            # 1280×720 缩放画布组合器
│   ├── Sidebar.tsx                  # 桌面固定侧边栏 + 移动端浮层
│   ├── SidebarHeader.tsx            # 撤销/重做 + 主题切换
│   ├── ContentSection.tsx           # 标题 + 副标题输入
│   ├── AppearanceSection.tsx        # 背景、颜色、滤镜
│   ├── TypographySection.tsx        # 字体选择、上传、字号
│   ├── LayoutSection.tsx            # 对齐网格 + 装饰条开关
│   ├── PresetBar.tsx                # 预设缩略图 + 保存
│   ├── ExportButton.tsx             # 导出按钮
│   ├── KeyboardShortcutOverlay.tsx  # ? 键快捷键面板
│   ├── BackgroundLayer.tsx          # 颜色/图片层
│   ├── DecorationLayer.tsx          # 装饰条层
│   ├── TextLayer.tsx                # 标题+副标题层
│   └── shared/                      # ColorPicker, Slider, Toggle 等通用组件
├── hooks/
│   ├── useCoverConfig.ts            # 编排 history + autosave
│   ├── useHistory.ts                # 撤销/重做栈（最多 50 层）
│   ├── useAutosave.ts               # localStorage 持久化
│   ├── usePresets.ts                # 内置 + 用户预设 CRUD
│   └── useDebounce.ts               # 通用去抖 hook
├── store/
│   ├── constants.ts                 # 画布尺寸、字体、对齐、默认值
│   ├── configReducer.ts             # 所有状态转换
│   └── presets.ts                   # 6 个内置预设
├── styles/
│   ├── tokens.css                   # 设计令牌（HSL）+ 深色模式
│   ├── global.css                   # 重置 + 基础 + 组件样式
│   └── ...
└── pages/
    └── index.astro                  # 入口页面（SSG）
```

---

## 配置

默认值定义在 `src/store/constants.ts`：

```ts
const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

const DEFAULT_CONFIG: CoverConfig = {
  title: 'Design is Intentional',
  subtitle: 'Every pixel tells a story. Every decision has purpose.',
  bgType: 'color',
  bgColor: '#0a0a0a',
  themeColor: '#4f46e5',
  textColor: '#ffffff',
  fontFamily: 'system-ui, ...',
  fontSize: 84,
  alignment: 'center',
  showDecorations: true,
  // ...
};
```

在 `PRESET_FONTS` 数组中添加预设字体，或在 `src/store/presets.ts` 中添加新的内置预设。

---

## License

MIT
