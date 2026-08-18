# 仓库交付

## 包含内容

- 应用源代码与静态资源
- 前后端依赖清单和锁文件
- TypeScript、框架、lint 与格式化配置
- 单元测试和端到端测试
- 脱敏环境变量模板
- 架构与运维文档

## 排除内容

- 运行时环境变量文件和密钥
- `node_modules`、`.next`、`dist` 和覆盖率输出
- SQLite 数据库、WAL/SHM 文件和应用日志
- 编辑器缓存与本地进程产物

## 验证

```powershell
npm.cmd --prefix frontend ci
npm.cmd --prefix backend ci
npm.cmd run lint
npm.cmd run build
npm.cmd run test:backend
npm.cmd run test:e2e
```

## Git 提交

```powershell
git init
git add .
git commit -m "feat: 初始化工作区认证应用"
git branch -M main
git remote add origin <仓库地址>
git push -u origin main
```

推送前检查暂存区：

```powershell
git status --short
git diff --cached --stat
git diff --cached -- . ':(exclude)*-lock.json'
```

推送前必须确认：

- 暂存区中没有 `.env`、`.env.local`、数据库、日志、构建输出或压缩包。
- `JWT_SECRET` 仅出现在脱敏示例和文档中。
- 保留锁文件，以确保 CI 安装具有确定性。
- 远程仓库已配置分支保护和必要检查。
