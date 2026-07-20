# 项目说明

本项目基于 `@umijs/max` 构建，当前已完成部分后台基建骨架，包含路由、布局、请求层、权限入口、基础状态管理和开发期 mock 登录态。

补充说明：

- 业务层不使用 `Umi model`，但 `config/config.ts` 中仍需保留 `model: {}`，因为 `initialState`、`access`、`layout` 的 Umi 生成代码会依赖 `plugin-model`
- 当前 `getInitialState()` 中的用户信息仍为前端 mock + 本地缓存方案，主要用于前端开发阶段联调前的页面与权限演示
- Redux 已恢复为业务运行期全局状态容器，但当前只保留了 `uiSlice` 作为占位入口，未承接登录用户信息

## 文档入口

- 开发手册：`docs/开发手册.md`
- Umi Max 官方文档：https://umijs.org/docs/max/introduce

## 常用命令

```bash
npm install
npm run dev
npm run build
npm run format
```

## 当前基建范围

- Umi Layout 默认头像、昵称、退出登录菜单已接通
- 请求层已统一接入 `src/api/requestConfig.ts` 与 `src/api/requestErrorConfig.ts`
- HTTP 状态码与业务码已支持统一错误提示和登录失效跳转
- 当前用户信息通过 `getInitialState()` 提供，并用于布局和权限判断
- 真实登录接口、当前用户接口、正式 token 校验逻辑待后续接入后端
