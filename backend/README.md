# 后端

使用 NestJS、TypeORM 与 SQLite 实现的认证 API。

## 开发

```powershell
npm.cmd ci
npm.cmd run start:dev
```

API 监听 `http://localhost:3001/api`。根据 `.env.example` 创建 `.env`，并在非本地环境替换 `JWT_SECRET`。

## 验证

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd test -- --runInBand
npm.cmd run test:e2e -- --runInBand
```

`DB_SYNCHRONIZE=true` 时，TypeORM 自动创建 `users` 表。生产环境必须关闭自动同步并使用版本化迁移。
