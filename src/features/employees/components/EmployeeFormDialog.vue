<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import type { Employee } from '../logic/useEmployees'
const props = defineProps<{
  visible: boolean
  title: string
  formData: Employee
  formRules: any
}>()
const emits = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'submit'): void
}>()
</script>
<template>
  <el-dialog :model-value="props.visible" :title="props.title" width="520px" @close="emits('update:visible', false)">
    <el-form :model="props.formData" :rules="props.formRules" label-width="90px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="props.formData.name" />
      </el-form-item>
      <el-form-item label="职位" prop="position">
        <el-input v-model="props.formData.position" />
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-select v-model="props.formData.department" placeholder="请选择">
          <el-option label="研发部" value="研发部" />
          <el-option label="技术部" value="技术部" />
          <el-option label="产品部" value="产品部" />
          <el-option label="质量部" value="质量部" />
          <el-option label="数据部" value="数据部" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职日期" prop="entryDate">
        <el-date-picker v-model="props.formData.entryDate" type="date" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="props.formData.status" placeholder="请选择">
          <el-option label="在职" value="在职" />
          <el-option label="试用" value="试用" />
          <el-option label="离职" value="离职" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="emits('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="emits('submit')">提交</el-button>
    </template>
  </el-dialog>
</template>
