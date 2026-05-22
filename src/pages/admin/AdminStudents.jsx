import { useMemo, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Download, FileUp, Plus, PencilLine, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import InputField from '../../components/ui/InputField'
import Badge from '../../components/ui/Badge'
import StudentTable from '../../components/tables/StudentTable'
import { useStudents } from '../../hooks/useStudents'
import { CLASS_CODES } from '../../lib/constants'
import { currencyLabel, formatClass } from '../../lib/formatters'
import { parseStudentExcel } from '../../utils/excelUtils'
import { studentsApi } from '../../api/students'

const emptyForm = { admissionNumber: '', name: '', class: '1A', balance: 0 }

export default function AdminStudents() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const { data = [], isLoading } = useStudents()

  const createMutation = useMutation({
    mutationFn: (payload) => studentsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student saved')
      closeModal()
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Unable to save student'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => studentsApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student updated')
      closeModal()
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Unable to update student'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => studentsApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student deleted')
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Unable to delete student'),
  })

  const importMutation = useMutation({
    mutationFn: (rows) => studentsApi.importRows(rows),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      const { inserted = 0, skipped = 0 } = response.data || {}
      toast.success(`Imported ${inserted} students, skipped ${skipped}`)
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Import failed'),
  })

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return data
    return data.filter((student) =>
      [student.admissionNumber, student.name, student.class].some((value) => String(value ?? '').toLowerCase().includes(term)),
    )
  }, [data, search])

  const columns = useMemo(
    () => [
      { accessorKey: 'index', header: 'Roll', cell: (info) => info.row.index + 1 },
      { accessorKey: 'name', header: 'Name', cell: (info) => <span className="font-semibold">{info.getValue()}</span> },
      {
        accessorKey: 'balance',
        header: 'Balance',
        cell: (info) => <span className={Number(info.getValue()) < 0 ? 'font-bold text-brand-danger' : 'font-bold text-brand-dark'}>{currencyLabel(info.getValue())}</span>,
      },
      { accessorKey: 'class', header: 'Class', cell: (info) => <Badge>{formatClass(info.getValue())}</Badge> },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 text-brand-primary transition hover:bg-brand-primaryTint"
              onClick={() => openEditModal(info.row.original)}
            >
              <PencilLine size={15} />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-brand-danger transition hover:bg-brand-danger/10"
              onClick={() => {
                if (window.confirm('Delete this student permanently?')) deleteMutation.mutate(info.row.original._id)
              }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  function closeModal() {
    setModalOpen(false)
    setEditingStudent(null)
    setForm(emptyForm)
  }

  function openEditModal(student = null) {
    if (student) {
      setEditingStudent(student)
      setForm({
        admissionNumber: student.admissionNumber ?? '',
        name: student.name ?? '',
        class: student.class ?? '1A',
        balance: student.balance ?? 0,
      })
    } else {
      setEditingStudent(null)
      setForm(emptyForm)
    }
    setModalOpen(true)
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const rows = await parseStudentExcel(file)
      importMutation.mutate(rows)
    } catch {
      toast.error('Could not parse the Excel file')
    } finally {
      event.target.value = ''
    }
  }

  async function handleExport() {
    try {
      const response = await studentsApi.exportFile()
      const blobUrl = URL.createObjectURL(response.data)
      const anchor = document.createElement('a')
      anchor.href = blobUrl
      anchor.download = 'Teapetti_students.xlsx'
      anchor.click()
      URL.revokeObjectURL(blobUrl)
    } catch {
      toast.error('Unable to export students')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const payload = {
      admissionNumber: form.admissionNumber.trim(),
      name: form.name.trim(),
      class: form.class,
      balance: Number(form.balance || 0),
    }

    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent._id, payload: { name: payload.name, class: payload.class } })
      return
    }

    createMutation.mutate(payload)
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="space-y-6 p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Students</p>
              <h1 className="font-display text-4xl font-black text-brand-dark">Student inventory and balance control</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <FileUp size={14} />
                Import Excel
              </Button>
              <Button variant="secondary" onClick={handleExport}>
                <Download size={14} />
                Export Excel
              </Button>
              <Button onClick={() => openEditModal()}>
                <Plus size={14} />
                Add Student
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InputField value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, class, adm. no" prefix={<Search size={14} />} />
            <Card className="p-4">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Total students</p>
              <p className="mt-2 text-3xl font-black text-brand-dark">{filteredStudents.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Negative balances</p>
              <p className="mt-2 text-3xl font-black text-brand-danger">{filteredStudents.filter((student) => Number(student.balance) < 0).length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Class codes</p>
              <p className="mt-2 text-3xl font-black text-brand-dark">{CLASS_CODES.length}</p>
            </Card>
          </div>

          {isLoading ? (
            <div className="rounded-3xl border border-brand-border bg-white/70 p-8 text-center text-brand-muted">Loading students...</div>
          ) : (
            <StudentTable data={filteredStudents} columns={columns} />
          )}
        </Card>

        {modalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
            <Card className="w-full max-w-xl p-6 md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">{editingStudent ? 'Edit student' : 'Add student'}</p>
                  <h2 className="font-display text-3xl font-black text-brand-dark">{editingStudent ? editingStudent.name : 'New student'}</h2>
                </div>
                <Button variant="ghost" onClick={closeModal}>Close</Button>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Admission number"
                  value={form.admissionNumber}
                  onChange={(event) => setForm((current) => ({ ...current, admissionNumber: event.target.value }))}
                  placeholder="4001"
                  disabled={Boolean(editingStudent)}
                />
                <InputField
                  label="Name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Student Name"
                />
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-brand-dark">Class</span>
                  <select
                    className="focus-ring w-full rounded-full border border-brand-border bg-white/90 px-4 py-3 text-sm shadow-sm"
                    value={form.class}
                    onChange={(event) => setForm((current) => ({ ...current, class: event.target.value }))}
                  >
                    {CLASS_CODES.map((classCode) => (
                      <option key={classCode} value={classCode}>{classCode}</option>
                    ))}
                  </select>
                </label>
                <InputField
                  label="Initial balance"
                  value={form.balance}
                  onChange={(event) => setForm((current) => ({ ...current, balance: event.target.value }))}
                  placeholder="0"
                  type="number"
                />

                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
                  <Button type="submit">Save student</Button>
                </div>
              </form>
            </Card>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
