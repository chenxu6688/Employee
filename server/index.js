import express from 'express'
import cors from 'cors'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import fs from 'fs'

const app = express()
app.use(cors())
app.use(express.json())

const dbDir = path.join(process.cwd(), 'projects', 'employees', 'server', 'db')
fs.mkdirSync(dbDir, { recursive: true })
const adapter = new JSONFile(path.join(dbDir, 'employees.json'))
const db = new Low(adapter, { employees: [], seq: 0 })
await db.read()
db.data ||= { employees: [], seq: 0 }

function list({ page=1, pageSize=10, sortBy='id', sortOrder='asc', keyword='', department='', status='' }) {
  let items = db.data.employees.filter(e => !e.deletedAt)
  if (keyword) items = items.filter(e => (e.name.includes(keyword) || e.position.includes(keyword)))
  if (department) items = items.filter(e => e.department === department)
  if (status) items = items.filter(e => e.status === status)
  items.sort((a,b) => {
    const va = a[sortBy], vb = b[sortBy]
    const cmp = va > vb ? 1 : va < vb ? -1 : 0
    return sortOrder === 'desc' ? -cmp : cmp
  })
  const total = items.length
  const start = (page - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)
  return { total, items: pageItems }
}

app.get('/api/employees', (req, res) => {
  const { page, pageSize, sortBy, sortOrder, keyword, department, status } = req.query
  res.json(list({
    page: Number(page || 1),
    pageSize: Number(pageSize || 10),
    sortBy: String(sortBy || 'id'),
    sortOrder: String(sortOrder || 'asc'),
    keyword: String(keyword || ''),
    department: String(department || ''),
    status: String(status || '')
  }))
})

app.get('/api/employees/:id', (req, res) => {
  const id = Number(req.params.id)
  const row = db.data.employees.find(e => e.id === id && !e.deletedAt)
  if (!row) return res.status(404).json({ message: 'Not found' })
  res.json(row)
})

app.post('/api/employees', async (req, res) => {
  const { name, position, department, entryDate, status } = req.body
  if (!name || !position || !department || !entryDate || !status) return res.status(400).json({ message: '字段缺失' })
  const id = ++db.data.seq
  db.data.employees.push({ id, name, position, department, entryDate, status })
  await db.write()
  res.json({ id })
})

app.put('/api/employees/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { name, position, department, entryDate, status } = req.body
  const row = db.data.employees.find(e => e.id === id)
  if (!row || row.deletedAt) return res.status(404).json({ message: 'Not found' })
  Object.assign(row, { name, position, department, entryDate, status })
  await db.write()
  res.json({ updated: 1 })
})

app.delete('/api/employees/:id', async (req, res) => {
  const id = Number(req.params.id)
  const row = db.data.employees.find(e => e.id === id)
  if (!row || row.deletedAt) return res.status(404).json({ message: 'Not found' })
  row.deletedAt = new Date().toISOString()
  await db.write()
  res.json({ deleted: 1 })
})

const PORT = Number(process.env.PORT || 4000)
app.listen(PORT, () => {
  console.log(`Employees API listening on http://localhost:${PORT}`)
})
