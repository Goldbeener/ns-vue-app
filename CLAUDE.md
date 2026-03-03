# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个使用 NativeScript + Vue 3 构建的移动应用项目，用于挑战计划管理。应用使用 TypeScript 开发，支持 iOS 平台。

## 技术栈

- **框架**: NativeScript 8.9 + Vue 3 (nativescript-vue 3.0.2)
- **语言**: TypeScript 5.8
- **包管理器**: pnpm
- **构建工具**: Webpack 5 (@nativescript/webpack)
- **代码规范**: ESLint (使用 @antfu/eslint-config)
- **UI 组件**: @nativescript/animated-circle (动画圆形进度条)

## 常用命令

### 开发和构建
```bash
# 在 iOS 模拟器上运行（开发模式）
ns run ios

# 在 iOS 设备上运行
ns run ios --device

# 清理构建
ns clean

# 构建生产版本
ns build ios --release

# 查看项目信息
ns info
```

### 代码质量
```bash
# 运行 ESLint 检查
pnpm exec eslint .

# 自动修复 ESLint 问题
pnpm exec eslint . --fix
```

### 包管理
```bash
# 安装依赖
pnpm install

# 添加 NativeScript 插件
ns plugin add <plugin-name>
```

## 项目架构

### 目录结构
- `src/` - 应用源代码
  - `app.ts` - 应用入口，注册自定义元素和启动 Vue 应用
  - `App.vue` - 根组件，包含 TabView 导航结构
  - `pages/` - 页面组件
    - `Current.vue` - 当前挑战页面（显示进度圆环和指标）
    - `Groups.vue` - 规划页面
    - `Profile.vue` - 个人页面
  - `store/` - 全局状态管理
  - `utils/` - 工具函数
- `types/` - TypeScript 类型定义
- `App_Resources/` - 原生应用资源（图标、启动画面等）
- `platforms/` - 原生平台代码（自动生成，不要手动修改）

### 应用结构
应用使用 TabView 作为主导航，包含三个标签页：
1. **当前** - 显示当前挑战的进度，使用 AnimatedCircle 组件展示完成百分比
2. **规划** - 挑战规划管理
3. **我的** - 个人信息和设置

### 路径别名
TypeScript 配置了路径别名：
- `~/*` 和 `@/*` 都映射到 `src/*`

### 自定义元素注册
在 `src/app.ts` 中注册了 AnimatedCircle 组件，这是使用第三方 NativeScript 插件的标准方式。

## ESLint 配置要点

项目使用 @antfu/eslint-config，并进行了以下自定义：
- 要求使用分号（`style/semi: warn`）
- 允许 console 和 debugger
- 关闭了部分 Vue 和 TypeScript 严格规则以提高开发灵活性
- 忽略 `node_modules`、`App_Resources`、`platforms` 目录

## NativeScript 特定注意事项

1. **不要运行长时间运行的命令** - `ns run` 命令会启动开发服务器并保持运行，应该让用户手动在终端中执行
2. **平台特定代码** - `platforms/` 目录由 NativeScript CLI 自动管理，不应手动编辑
3. **Vue 组件** - 使用 NativeScript UI 组件（如 `<Page>`, `<ActionBar>`, `<StackLayout>`, `<GridLayout>`）而不是 HTML 元素
4. **样式** - 支持 CSS 子集，使用 NativeScript 特定的布局属性
5. **应用 ID** - 在 `nativescript.config.ts` 中定义为 `org.nativescript.myAwesomeApp`

## 开发工作流

1. 修改代码后，NativeScript CLI 会自动热重载（如果 `ns run` 正在运行）
2. 新增第三方 NativeScript 插件后，需要在 `src/app.ts` 中使用 `registerElement` 注册
3. 使用 TypeScript 严格模式，确保类型安全
4. Vue 3 Composition API 是首选的组件编写方式
