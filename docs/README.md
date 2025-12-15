# 项目B：员工管理系统（简化结构）

## 技术栈
- 前端：Vue 3 + TypeScript + Vite + Element Plus
- 后端：Express（REST）+ LowDB(JSON)
 
## 目录结构
```
projects/employees/
  src/
    features/
      employees/
        EmployeesPage.vue
        components/
          EmployeesToolbar.vue
          EmployeesTable.vue
          EmployeeFormDialog.vue
        logic/
          useEmployees.ts
    App.vue
    main.ts
    style.css
  server/
    index.js
    db/employees.json
  scripts/
    render-docs.mjs
  vite.config.ts
  package.json
  tsconfig.json
  index.html
```
 
## 运行
- 前端：`npm install && npm run dev`（端口 `5190`，占用自动切换）
- 后端：`npm install && npm run server`（端口 `4000`）
 
## API 约定
- `GET /api/employees` 分页/筛选/排序
- `GET /api/employees/:id` 详情
- `POST /api/employees` 新增（必填校验）
- `PUT /api/employees/:id` 更新
- `DELETE /api/employees/:id` 硬删除（直接移除）
- `DELETE /api/employees/purge-deleted` 清理历史软删记录
