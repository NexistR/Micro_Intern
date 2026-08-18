# 技术设计

## 范围

系统实现邮箱/密码注册、基于 Cookie 承载 JWT 的身份认证、会话查询、退出登录和认证工作区外壳。Dashboard 领域页面当前仅包含展示占位内容；授权体系以及 Company、Order、User 领域 API 不在当前范围内。

## 运行拓扑

```text
浏览器
  -> Next.js App Router（:3000）
  -> NestJS REST API（:3001/api）
  -> TypeORM
  -> SQLite
```

前端可独立部署，并通过 JSON 与 API 通信。会话状态由浏览器管理的 HttpOnly Cookie 承载，应用 JavaScript 不直接读取令牌。

## 前端设计

### 路由与组合

- `src/app/(auth)`：共享认证布局的公开登录/注册路由。
- `src/app/(workspace)`：由 `WorkspaceShell` 包装的工作区路由。
- Route Group 在不改变 URL 路径的前提下划分布局边界。
- `ThemeRegistry` 将 Material UI 缓存提供器集成到 App Router 渲染链路。

### 认证客户端

`src/lib/api.ts` 集中处理 API 地址解析、JSON 序列化、凭据请求、传输故障归一化和类型化错误传播。业务控制流依赖 `ApiError.code`，本地化消息仅作为展示数据。

`AuthForm` 管理受控输入、字段触达状态、提交状态、客户端校验、异步提交和服务端错误投影。注册与登录复用同一组件，仅在命令调用和成功状态迁移处发生分支。

`WorkspaceShell` 在挂载时请求 `/auth/me`。会话解析失败后使用 `/login` 替换当前路由；解析成功后才渲染工作区，并将认证主体传递给导航组件。

## 后端设计

### 模块依赖图

```text
AppModule
├─ ConfigModule（全局）
├─ TypeOrmModule
└─ AuthModule
   ├─ UsersModule
   └─ JwtModule
```

生产启动入口与端到端测试共用 `configureApp()`，统一定义 `/api` 前缀、Cookie 解析、允许凭据的 CORS 和全局 DTO 校验。

### 校验契约

`ValidationPipe` 启用 `whitelist`、`forbidNonWhitelisted`、`transform` 和 `stopAtFirstError`。`AuthCredentialsDto` 负责邮箱规范化与服务端凭据策略；`validationExceptionFactory` 生成稳定的 `{ code, message }` 错误结构。

客户端校验仅用于缩短反馈延迟，DTO 仍是输入数据的信任边界。

### 注册事务

1. 规范化并校验凭据。
2. 预先检查邮箱是否存在，以提供确定性的应用层反馈。
3. 使用成本因子 12 的 bcrypt 生成密码哈希。
4. 通过 User Repository 持久化用户。
5. 序列化前将实体转换为 `PublicUser`。

`users.email` 唯一约束是最终一致性边界。`UsersService.create()` 将并发插入导致的唯一约束异常映射为 `AUTH_EMAIL_EXISTS`。

### 登录与会话生命周期

`passwordHash` 配置为 `select: false`，登录流程通过 QueryBuilder 显式查询。bcrypt 比较成功后，系统签发以用户 ID 作为 `sub` 的 JWT。Controller 将令牌写入 `session` Cookie，配置如下：

- `HttpOnly=true`
- `SameSite=Lax`
- `NODE_ENV=production` 时 `Secure=true`
- `Max-Age` 为 24 小时
- `Path=/`

`JwtAuthGuard` 验证签名和有效期，将 `sub` 映射到 `request.user.id`，并把令牌异常统一归一化为 `AUTH_INVALID_SESSION`。`/auth/me` 会额外查询用户，确保已删除主体不能继续使用尚未过期的令牌。

## 数据模型

`users` 表结构：

| 字段 | 类型 | 约束 |
| --- | --- | --- |
| `id` | UUID | 主键 |
| `email` | varchar(254) | 唯一、必填 |
| `password_hash` | varchar(60) | 必填、默认查询排除 |
| `created_at` | datetime | 自动生成 |
| `updated_at` | datetime | 自动生成 |

`DB_SYNCHRONIZE=true` 仅限本地开发和测试。生产环境需要显式迁移与服务型数据库。

## HTTP 契约

| 方法 | 路径 | 成功响应 | 认证要求 |
| --- | --- | --- | --- |
| `GET` | `/api/health` | `200` 服务状态 | 公开 |
| `POST` | `/api/auth/signup` | `201` 用户响应 | 公开 |
| `POST` | `/api/auth/login` | `200` 用户响应与 Cookie | 公开 |
| `GET` | `/api/auth/me` | `200` 当前用户 | 会话 Cookie |
| `POST` | `/api/auth/logout` | `200` 与过期 Cookie | 公开 |

错误码分类：

| 错误码 | 典型状态码 |
| --- | --- |
| `VALIDATION_ERROR` | `400` |
| `AUTH_EMAIL_EXISTS` | `409` |
| `AUTH_USER_NOT_FOUND` | `401` |
| `AUTH_INVALID_PASSWORD` | `401` |
| `AUTH_INVALID_SESSION` | `401` |

## 验证策略

- 后端单元测试隔离验证健康检查 Controller/Service 边界。
- 端到端测试使用内存 SQLite 启动真实 `AppModule`。
- 端到端覆盖参数校验、注册、重复邮箱、差异化登录失败、HttpOnly Cookie 签发、会话查询和退出登录。
- 前端通过 ESLint、TypeScript 生产编译和 Next.js 静态生成验证正确性。

验证命令：

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run test:backend
npm.cmd run test:e2e
```

## 安全评审

- 令牌仅签名、不加密，载荷不得包含敏感数据。
- Cookie 控制可降低令牌窃取和跨站请求风险，但不能替代 CSP、输出编码或 CSRF 威胁建模。
- 差异化登录错误码会暴露账户是否存在；有抗枚举要求时应统一响应。
- 认证接口公开前必须增加限流与遥测。
- JWT 密钥应由外部密钥管理系统轮换，并定义事件响应所需的吊销策略。
- 当前未实现密码恢复、邮箱验证、MFA、RBAC/ABAC 和会话清单。

## 部署差距

- 未提供容器镜像、CI 工作流、反向代理配置或基础设施定义。
- 未建立数据库迁移历史。
- 未实现结构化日志、指标、链路追踪或依赖健康检查。
- 会话吊销仅依赖客户端 Cookie 过期；JWT 在自身过期前仍然有效。
- 领域标签页尚无后端 API 或授权策略。
