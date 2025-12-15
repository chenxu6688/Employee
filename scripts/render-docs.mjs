import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { marked } from 'marked'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = resolve(__dirname, '..', '..', '..')
const srcMd = resolve(root, '员工管理系统技术文档.md')
const outHtml = resolve(root, '员工管理系统技术文档.html')

const md = readFileSync(srcMd, 'utf-8')
const body = marked(md)
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>员工管理系统技术文档</title><style>body{font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,\"Noto Sans\",sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\";max-width:900px;margin:24px auto;padding:0 16px;line-height:1.6}code,pre{background:#f6f8fa;border-radius:6px}pre{padding:12px;overflow:auto}h1,h2,h3{margin-top:22px}table{border-collapse:collapse}table th,table td{border:1px solid #ddd;padding:8px}</style></head><body>${body}</body></html>`
writeFileSync(outHtml, html, 'utf-8')
console.log('HTML 文档已生成:', outHtml)
