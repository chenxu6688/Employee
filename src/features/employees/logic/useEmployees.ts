import { ref, reactive } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

export type Employee = {
  id?: number
  name: string
  position: string
  department: string
  entryDate: string
  status: string
}

export function useEmployees() {
  const loading = ref(false)
  const errorMsg = ref('')
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
    errorMsg.value = ''
    try {
      const { data } = await axios.get('/api/employees', {
        params: { page: page.value, pageSize: pageSize.value, sortBy: sortBy.value, sortOrder: sortOrder.value, keyword: keyword.value, department: department.value, status: status.value }
      })
      rows.value = Array.isArray(data?.items) ? data.items : []
      total.value = Number(data?.total || 0)
    } catch {
      errorMsg.value = '列表加载失败，请检查后端服务'
      ElMessage.error(errorMsg.value)
      rows.value = []
      total.value = 0
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
    } catch {
      ElMessage.error('操作失败')
    }
  }

  const confirmDelete = async (row: Employee) => {
    try {
      await ElMessageBox.confirm(`确认删除员工「${row.name}」吗？`, '提示', { type: 'warning' })
      await axios.delete(`/api/employees/${row.id}`)
      ElNotification.success({ title: '成功', message: '已删除' })
      fetchList()
    } catch {
      // cancel
    }
  }

  return {
    // list state
    loading, errorMsg, total, page, pageSize, sortBy, sortOrder, keyword, department, status, rows,
    // form state
    formVisible, formTitle, formData, formRules,
    // actions
    fetchList, openCreate, openEdit, submitForm, confirmDelete
  }
}
