<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

type Employee = {
  id?: number
  name: string
  position: string
  department: string
  entryDate: string
  status: string
}

const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const sortBy = ref<'id' | 'name' | 'entryDate'>('id')
const sortOrder = ref<'asc' | 'desc'>('asc')
const keyword = ref('')
const department = ref('')
const status = ref('')
const rows = ref<Employee[]>([])

const formVisible = ref(false)
const formTitle = ref('新增员工')
const formData = reactive<Employee>({ name: '', position: '', department: '', entryDate: '', status: '在职' })
const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  department: [{ required: true, message: '请输入部门', trigger: 'change' }],
  entryDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}
let editingId: number | null = null

const fetchList = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/api/employees', {
      params: { page: page.value, pageSize: pageSize.value, sortBy: sortBy.value, sortOrder: sortOrder.value, keyword: keyword.value, department: department.value, status: status.value }
    })
    rows.value = data.items
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  formTitle.value = '新增员工'
  editingId = null
  Object.assign(formData, { name: '', position: '', department: '', entryDate: '', status: '在职' })
  formVisible.value = true
}
const openEdit = (row: Employee) => {
  formTitle.value = '编辑员工'
  editingId = row.id || null
  Object.assign(formData, row)
  formVisible.value = true
}
const submitForm = async () => {
  try {
    if (editingId == null) {
      await axios.post('/api/employees', formData)
      ElNotification.success({ title: '成功', message: '已新增员工' })
    } else {
      await axios.put(`/api/employees/${editingId}`, formData)
      ElNotification.success({ title: '成功', message: '已更新员工' })
    }
    formVisible.value = false
    fetchList()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}
const confirmDelete = async (row: Employee) => {
  try {
    await ElMessageBox.confirm(`确认删除员工「${row.name}」吗？`, '提示', { type: 'warning' })
    await axios.delete(`/api/employees/${row.id}`)
    ElNotification.success({ title: '成功', message: '已删除（软删）' })
    fetchList()
  } catch {
    // cancel
  }
}

onMounted(fetchList)
</script>

<template>
  <el-container class="full">
    <el-header class="header">员工管理系统</el-header>
    <el-main>
      <el-card>
        <div class="toolbar">
          <el-input v-model="keyword" placeholder="关键字搜索" style="width: 220px" @keyup.enter="fetchList" />
          <el-select v-model="department" placeholder="部门筛选" clearable style="width: 180px" @change="fetchList">
            <el-option label="研发部" value="研发部" />
            <el-option label="技术部" value="技术部" />
            <el-option label="产品部" value="产品部" />
            <el-option label="质量部" value="质量部" />
            <el-option label="数据部" value="数据部" />
          </el-select>
          <el-select v-model="status" placeholder="状态筛选" clearable style="width: 160px" @change="fetchList">
            <el-option label="在职" value="在职" />
            <el-option label="试用" value="试用" />
            <el-option label="离职" value="离职" />
          </el-select>
          <el-button type="primary" @click="openCreate">新增员工</el-button>
        </div>

        <el-table :data="rows" border stripe v-loading="loading" @sort-change="({prop, order}) => { if(prop){ sortBy = prop as any; sortOrder = order==='descending'?'desc':'asc'; fetchList() } }">
          <el-table-column prop="id" label="ID" width="80" sortable="custom" />
          <el-table-column prop="name" label="姓名" width="140" sortable="custom" />
          <el-table-column prop="position" label="职位" width="160" />
          <el-table-column prop="department" label="部门" width="140" />
          <el-table-column prop="entryDate" label="入职日期" width="160" sortable="custom" />
          <el-table-column prop="status" label="状态" width="120" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button type="primary" plain size="small" @click="openEdit(scope.row)">编辑</el-button>
              <el-button type="danger" plain size="small" @click="confirmDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pager">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[5,10,20,50]"
            :total="total"
            v-model:current-page="page"
            v-model:page-size="pageSize"
            @size-change="fetchList"
            @current-change="fetchList"
          />
        </div>
      </el-card>

      <el-dialog v-model="formVisible" :title="formTitle" width="520px">
        <el-form :model="formData" :rules="formRules" label-width="90px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-input v-model="formData.position" />
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-select v-model="formData.department" placeholder="请选择">
              <el-option label="研发部" value="研发部" />
              <el-option label="技术部" value="技术部" />
              <el-option label="产品部" value="产品部" />
              <el-option label="质量部" value="质量部" />
              <el-option label="数据部" value="数据部" />
            </el-select>
          </el-form-item>
          <el-form-item label="入职日期" prop="entryDate">
            <el-date-picker v-model="formData.entryDate" type="date" value-format="YYYY-MM-DD" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择">
              <el-option label="在职" value="在职" />
              <el-option label="试用" value="试用" />
              <el-option label="离职" value="离职" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="formVisible=false">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.full { min-height: 100vh; }
.header { background: #fff; font-weight: 600; line-height: 60px; padding: 0 16px; border-bottom: 1px solid #ebeef5; }
.toolbar { display:flex; gap:12px; margin-bottom:12px; align-items:center; }
.pager { display:flex; justify-content:flex-end; padding:12px 0; }
</style>
