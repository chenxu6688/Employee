<script setup lang="ts">
import { onMounted } from 'vue'
import { useEmployees } from './logic/useEmployees'
import EmployeesToolbar from './components/EmployeesToolbar.vue'
import EmployeesTable from './components/EmployeesTable.vue'
import EmployeeFormDialog from './components/EmployeeFormDialog.vue'

const emp = useEmployees()
onMounted(emp.fetchList)
</script>
<template>
  <el-container class="full">
    <el-header class="header">员工管理系统</el-header>
    <el-main>
      <el-card>
        <EmployeesToolbar
          :keyword="emp.keyword"
          :department="emp.department"
          :status="emp.status"
          @update:keyword="v => emp.keyword = v"
          @update:department="v => emp.department = v"
          @update:status="v => emp.status = v"
          @search="emp.fetchList"
          @create="emp.openCreate"
        />
        <EmployeesTable
          :rows="emp.rows"
          :loading="emp.loading"
          :sortBy="emp.sortBy"
          :sortOrder="emp.sortOrder"
          @sort="({prop, order}) => { if(prop){ emp.sortBy = prop as any; emp.sortOrder = order==='descending'?'desc':'asc'; emp.fetchList() } }"
          @edit="emp.openEdit"
          @delete="emp.confirmDelete"
        />
        <div class="pager">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[5,10,20,50]"
            :total="emp.total"
            v-model:current-page="emp.page"
            v-model:page-size="emp.pageSize"
            @size-change="emp.fetchList"
            @current-change="emp.fetchList"
          />
        </div>
      </el-card>
      <EmployeeFormDialog
        :visible="emp.formVisible"
        :title="emp.formTitle"
        :formData="emp.formData"
        :formRules="emp.formRules"
        @update:visible="v => emp.formVisible = v"
        @submit="emp.submitForm"
      />
    </el-main>
  </el-container>
</template>
<style scoped lang="scss">
.full { min-height: 100vh; }
.header { background: #fff; font-weight: 600; line-height: 60px; padding: 0 16px; border-bottom: 1px solid #ebeef5; }
.pager { display:flex; justify-content:flex-end; padding:12px 0; }
</style>
