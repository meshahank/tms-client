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

export function exportStudentsExcel(students) {
  const sheet = XLSX.utils.json_to_sheet(
    students.map((student) => ({
      'Admission No': student.admissionNumber,
      Name: student.name,
      Class: student.class,
      Balance: student.balance,
      'Total Credit': student.totalCredit,
      'Total Spent': student.totalSpent,
    })),
  )
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Students')
  XLSX.writeFile(workbook, 'Teapetti_students.xlsx')
}
