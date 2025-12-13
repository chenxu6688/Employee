# 项目B：员工管理系统

## 设计理念
- 企业后台基础模块，聚焦数据录入与高效检索
- 软删除保障可恢复与审计

## 技术栈
- 前端：Vue 3 + TypeScript + Vite + Element Plus
- 后端：Express（REST）+ SQLite（better-sqlite3）

## 目录结构
- `/src` 前端代码
- `/assets` 静态资源
- `/docs` 文档
- `/config` Vite 配置
- `/server` 后端服务（`index.js`，端口默认 `4000`）

## 运行
- 前端：`npm install && npm run dev`（端口 `5190`）
- 后端：`npm install && npm run server`（端口 `4000`）

## API 约定
- `GET /api/employees` 分页/筛选/排序
- `GET /api/employees/:id` 详情
- `POST /api/employees` 新增（必填校验）
- `PUT /api/employees/:id` 更新
- `DELETE /api/employees/:id` 软删除（标记 `deletedAt`）
