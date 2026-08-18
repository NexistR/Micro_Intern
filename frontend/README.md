# 前端

使用 Next.js App Router、React 19 与 Material UI v6 构建的认证和工作区界面。

## 路由

- `/login`、`/signup`：邮箱/密码认证。
- `/dashboard`、`/company`、`/order`、`/user`：需要认证的工作区。

## 开发

```powershell
npm.cmd ci
npm.cmd run dev
```

`.env.local` 中的 `NEXT_PUBLIC_API_URL` 定义 API 基地址。认证使用后端签发的 HttpOnly 会话 Cookie，API 请求通过 `credentials: include` 携带凭据。

`@mui/material-nextjs` v6 声明支持至 Next.js 15；当前 Next.js 16 集成使用 `v15-appRouter`，验证范围包括 lint、生产构建和 SSR 响应。`.npmrc` 固定兼容的依赖解析策略。
