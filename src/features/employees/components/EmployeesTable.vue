<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import type { Employee } from '../logic/useEmployees'
const props = defineProps<{
  rows: Employee[]
  loading: boolean
  sortBy: 'id' | 'name' | 'entryDate'
  sortOrder: 'asc' | 'desc'
}>()
const emits = defineEmits<{
  (e: 'sort', payload: { prop?: string, order?: 'ascending' | 'descending' }): void
  (e: 'edit', row: Employee): void
  (e: 'delete', row: Employee): void
}>()
</script>
<template>
  <el-table :data="Array.isArray(props.rows) ? props.rows : []" border stripe @sort-change="({prop, order}) => emits('sort', {prop, order})">
    <el-table-column prop="id" label="ID" width="80" sortable="custom" />
    <el-table-column prop="name" label="姓名" width="140" sortable="custom" />
    <el-table-column prop="position" label="职位" width="160" />
    <el-table-column prop="department" label="部门" width="140" />
    <el-table-column prop="entryDate" label="入职日期" width="160" sortable="custom" />
    <el-table-column prop="status" label="状态" width="120" />
    <el-table-column label="操作" width="180" fixed="right">
      <template #default="scope">
        <el-button type="primary" plain size="small" @click="emits('edit', scope.row)">编辑</el-button>
        <el-button type="danger" plain size="small" @click="emits('delete', scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
