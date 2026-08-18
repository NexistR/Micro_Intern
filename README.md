# 工作区认证应用

基于 Next.js 与 NestJS 的工作区认证系统，使用 Cookie 承载 JWT 会话、TypeORM 持久化用户数据，并通过 Material UI 提供业务操作界面。

## 技术栈

| 分层 | 技术 |
| --- | --- |
| 前端 | Next.js 16.3.1、React 19、Material UI v6、TypeScript |
| 后端 | NestJS 11、TypeORM、class-validator、TypeScript |
| 认证 | bcryptjs、JWT、HttpOnly 会话 Cookie |
| 持久化 | better-sqlite3 |
| 质量保障 | ESLint、Jest、Supertest、生产构建 |

## 仓库结构

```text
frontend/   App Router 界面、认证表单、工作区外壳、API 客户端
backend/    REST API、认证/用户模块、TypeORM 实体、端到端测试
docs/       架构设计与仓库交付文档
```

详细设计参见 [技术设计](docs/TECHNICAL_DOCUMENTATION.md)，仓库提交约束参见 [仓库交付](docs/REPOSITORY_DELIVERY.md)。

## 环境初始化

```powershell
npm.cmd --prefix frontend ci
npm.cmd --prefix backend ci
Copy-Item frontend/.env.example frontend/.env.local
Copy-Item backend/.env.example backend/.env
```

分别启动后端与前端：

```powershell
npm.cmd run dev:backend
```

```powershell
npm.cmd run dev:frontend
```

运行时端点：

- 前端：`http://localhost:3000`
- 健康检查：`GET http://localhost:3001/api/health`
- API 前缀：`http://localhost:3001/api`

## API 概览

| 方法 | 路径 | 契约 |
| --- | --- | --- |
| `GET` | `/api/health` | 服务就绪状态 |
| `POST` | `/api/auth/signup` | 持久化 bcrypt 哈希后的凭据 |
| `POST` | `/api/auth/login` | 在 `session` Cookie 中签发 JWT |
| `GET` | `/api/auth/me` | 解析当前认证主体 |
| `POST` | `/api/auth/logout` | 使会话 Cookie 过期 |

以下错误码属于稳定的客户端契约：`VALIDATION_ERROR`、`AUTH_EMAIL_EXISTS`、`AUTH_USER_NOT_FOUND`、`AUTH_INVALID_PASSWORD`、`AUTH_INVALID_SESSION`。

## 质量门禁

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run test:backend
npm.cmd run test:e2e
```

## 生产约束

- 使用托管数据库和版本化迁移替换 SQLite 与自动结构同步。
- 通过密钥管理服务注入 `JWT_SECRET`，禁止提交运行时环境变量文件。
- 在上游终止 TLS，并保留 Cookie 的 `Secure`、`HttpOnly` 与 `SameSite` 控制。
- 增加限流、审计遥测、账户恢复、邮箱验证和授权策略执行。
- 根据账户枚举风险要求，评估是否合并“用户不存在”与“密码错误”响应。

`@mui/material-nextjs` v6 的适配器声明支持至 Next.js 15。本项目使用 Next.js 16.3.1 与 `v15-appRouter`，当前验证基线覆盖 lint、生产构建、SSR 样式和本地运行行为。
