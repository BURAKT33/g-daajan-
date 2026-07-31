import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as XLSX from 'xlsx'

const DATA_DIR = join(process.cwd(), 'data')

for (const file of readdirSync(DATA_DIR).filter(f => f.endsWith('.xlsx'))) {
  const wb = XLSX.read(readFileSync(join(DATA_DIR, file)))
  console.log('='.repeat(80))
  console.log('FILE:', file)
  console.log('SHEETS:', wb.SheetNames)

  for (const name of wb.SheetNames) {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: '' })
    console.log(`\n  sheet "${name}" -> ${rows.length} rows`)
    if (rows.length > 0) {
      console.log('  COLUMNS:', Object.keys(rows[0]))
      console.log('  SAMPLE ROWS:')
      for (const r of rows.slice(0, 3)) console.log('   ', JSON.stringify(r))
    }
  }
}
