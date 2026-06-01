import * as XLSX from 'xlsx'

export function parseStudentExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        resolve(XLSX.utils.sheet_to_json(sheet))
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Unable to read Excel file'))
    reader.readAsBinaryString(file)
  })
}

export function parseBulkRechargeExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet)
        // Expected columns: Admission No, Amount, Note (optional)
        const normalizedRows = rows.map((row) => ({
          'Admission No': row['Admission No'] || row['admissionNumber'] || row['AdmNo'],
          Amount: Number(row['Amount'] || row['amount'] || 0),
          Note: row['Note'] || row['note'] || '',
        }))
        resolve(normalizedRows)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Unable to read Excel file'))
    reader.readAsBinaryString(file)
  })
}

export function exportStudentsExcel(students) {
  const sheet = XLSX.utils.json_to_sheet(
    students.map((student) => ({
      'Admission No': student.admissionNumber,
      Name: student.name,
      Class: student.class,
      Balance: student.balance,
      'Daily Limit': student.dailyLimit ?? '',
      'Total Credit': student.totalCredit,
      'Total Spent': student.totalSpent,
    })),
  )
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Students')
  XLSX.writeFile(workbook, 'Teapetti_students.xlsx')
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
