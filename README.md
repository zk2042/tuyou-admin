# tuyou-admin

途友管理后台项目，基于 `@umijs/max`、`Ant Design`、`Redux Toolkit`、`react-redux` 搭建，适合中后台管理系统开发。

## 项目概览

- 路由与框架配置统一放在 `config/`
- 页面级 UI 放在 `src/pages/`
- 接口请求代码放在 `src/services/`
- 全局初始化数据通过 `getInitialState()` 提供
- 运行期全局共享状态统一使用 `Redux Toolkit`
- 当前登录态仍为前端 mock + 本地缓存方案，后续可替换为真实登录接口

当前示例页面包括：

- `首页`
- `权限演示`
- `CRUD 示例`
- `登录页`

## 技术栈

- `@umijs/max`
- `Ant Design` / `@ant-design/pro-components`
- `Redux Toolkit`
- `react-redux`
- `TypeScript`
- `wangEditor`

## 环境要求

- Node.js：推荐 `20.20.0`
- npm：建议使用与当前 Node.js 版本匹配的默认 npm

首次切换 Node.js 版本后，建议重新执行一次 `npm install`。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

开发环境启动：

```bash
npm run dev
```

测试环境启动：

```bash
npm run dev:test
```

预发环境启动：

```bash
npm run dev:pre
```

### 3. 构建打包

开发环境构建：

```bash
npm run build
```

测试环境构建：

```bash
npm run build:test
```

预发环境构建：

```bash
npm run build:pre
```

生产环境构建：

```bash
npm run build:prod
```

### 4. 代码格式化

```bash
npm run format
```

## 多环境说明

项目当前统一使用 `UMI_ENV` 作为环境入口，默认值为 `dev`。

可选环境值：

- `dev`
- `test`
- `pre`
- `prod`

环境切换由 `package.json` 脚本负责，例如：

- `npm run build` -> `UMI_ENV=dev`
- `npm run build:test` -> `UMI_ENV=test`
- `npm run build:pre` -> `UMI_ENV=pre`
- `npm run build:prod` -> `UMI_ENV=prod`

`config/config.ts` 中会输出两条日志，便于确认当前启用的环境：

```text
[Umi Config] rawEnv: dev
[Umi Config] currentEnv: dev
```

含义说明：

- `rawEnv`：脚本传入的原始环境值
- `currentEnv`：最终生效的环境值；如果传入值不在代理配置中，会自动回退到 `dev`

## 代理配置

代理文件位于 `config/proxy.ts`，当前预留了以下环境配置入口：

- `dev`
- `localhost`
- `test`
- `pre`
- `prod`

本地联调时，请根据实际后端地址补充对应环境下的代理规则。

## 目录结构

```text
config/
  config.ts         Umi 主配置
  routes.ts         路由配置
  proxy.ts          多环境代理配置

docs/
  开发手册.md       项目开发说明

src/
  app.tsx           Umi 运行时配置、Provider 挂载、初始化数据
  access.ts         权限定义
  api/              请求配置与错误处理
  components/       公共组件
  constants/        常量
  pages/            页面目录
  services/         接口调用层
  store/            Redux Toolkit 状态管理
  utils/            工具函数
```

## 核心约定

### 1. 状态管理

- `getInitialState()` 负责应用启动初始化与当前用户上下文
- `Redux Toolkit` 负责应用运行期共享状态
- 业务层不新增 `Umi model`
- `config/config.ts` 中保留 `model: {}` 仅用于满足 Umi 框架层依赖

### 2. 登录与权限

- 当前用户信息来自前端 mock + `localStorage`
- 布局用户区和权限入口依赖 `getInitialState()`
- 权限逻辑统一在 `src/access.ts` 中维护

### 3. 请求层

请求基础设施位于：

- `src/api/requestConfig.ts`
- `src/api/requestErrorConfig.ts`

当前约定如下：

- 基础前缀：`/api`
- 默认超时：`30000ms`
- 业务成功码：`10000`
- 登录失效码：`30007`、`30008`
- 权限不足码：`30005`

已内置：

- token 注入
- 常见 HTTP 错误处理
- 业务错误统一提示
- 登录失效自动跳转

## 公共组件

当前仓库已提供以下可复用组件：

- `ApiSelect`：基于接口数据的通用下拉组件
- `WangRichTextEditor`：基于 wangEditor 的富文本编辑器封装
- `Footer`：后台底部组件
- `Guide`：首页欢迎区组件

## 开发建议

- 修改页面前先确认 `config/routes.ts` 和 `src/access.ts`
- 新增接口时按业务域拆分到 `src/services/`
- 跨页面共享状态优先考虑 `Redux Toolkit`
- 不要在多个页面重复写相同权限判断
- 不要重新引入业务 `Umi model`

## 相关文档

- 项目开发手册：`docs/开发手册.md`
- Umi Max 文档：https://umijs.org/docs/max/introduce

## 后续可完善项

- 补齐各环境真实代理地址
- 接入真实登录与当前用户接口
- 补充 API 类型生成规范
- 补充测试与发布流程说明
