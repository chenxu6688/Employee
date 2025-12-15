<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
const props = defineProps<{
  keyword: string
  department: string
  status: string
}>()
const emits = defineEmits<{
  (e: 'update:keyword', v: string): void
  (e: 'update:department', v: string): void
  (e: 'update:status', v: string): void
  (e: 'search'): void
  (e: 'create'): void
}>()
</script>
<template>
  <div class="toolbar">
    <el-input :model-value="props.keyword" placeholder="关键字搜索" style="width: 220px" @update:modelValue="v => emits('update:keyword', v)" @keyup.enter="emits('search')" />
    <el-select :model-value="props.department" placeholder="部门筛选" clearable style="width: 180px" @update:modelValue="v => emits('update:department', v)" @change="emits('search')">
      <el-option label="研发部" value="研发部" />
      <el-option label="技术部" value="技术部" />
      <el-option label="产品部" value="产品部" />
      <el-option label="质量部" value="质量部" />
      <el-option label="数据部" value="数据部" />
    </el-select>
    <el-select :model-value="props.status" placeholder="状态筛选" clearable style="width: 160px" @update:modelValue="v => emits('update:status', v)" @change="emits('search')">
      <el-option label="在职" value="在职" />
      <el-option label="试用" value="试用" />
      <el-option label="离职" value="离职" />
    </el-select>
    <el-button type="primary" @click="emits('create')">新增员工</el-button>
  </div>
</template>
<style scoped lang="scss">
.toolbar { display:flex; gap:12px; margin-bottom:12px; align-items:center; }
</style>
