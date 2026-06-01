import { useMemo, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Download, FileUp, Plus, PencilLine, Trash2, Search, Wallet, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import InputField from '../../components/ui/InputField'
import Badge from '../../components/ui/Badge'
import StudentTable from '../../components/tables/StudentTable'
import RechargeModal from '../../components/ui/RechargeModal'
import { useStudents } from '../../hooks/useStudents'
import { CLASS_CODES } from '../../lib/constants'
import { currencyLabel, formatClass } from '../../lib/formatters'
import { parseStudentExcel, parseBulkRechargeExcel } from '../../utils/excelUtils'
import { studentsApi } from '../../api/students'

const emptyForm = { admissionNumber: '', name: '', class: '1A', balance: 0, dailyLimit: '' }

export default function AdminStudents() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)
  const bulkRechargeInputRef = useRef(null)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [rechargeStudent, setRechargeStudent] = useState(null)
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

  const rechargeMutation = useMutation({
    mutationFn: ({ id, amount, note }) => studentsApi.recharge(id, amount, note),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Balance recharged')
      setRechargeStudent(null)
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Recharge failed'),
  })

  const bulkRechargeMutation = useMutation({
    mutationFn: (rows) => studentsApi.bulkRecharge(rows),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      const { recharged = 0, notFound = 0 } = response.data || {}
      toast.success(`Recharged ${recharged} students, ${notFound} not found`)
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Bulk recharge failed'),
  })

  const filteredStudents = useMemo(() => {
    let result = data
    
    if (classFilter) {
      result = result.filter((student) => student.class === classFilter)
    }
    
    const term = search.trim().toLowerCase()
    if (term) {
      result = result.filter((student) =>
        [student.admissionNumber, student.name, student.class].some((value) => String(value ?? '').toLowerCase().includes(term)),
      )
    }
    
    return result
  }, [data, search, classFilter])

  const columns = useMemo(
    () => [
      { accessorKey: 'index', header: 'Roll', cell: (info) => info.row.index + 1 },
      { accessorKey: 'name', header: 'Name', cell: (info) => <span className="font-semibold">{info.getValue()}</span> },
      { accessorKey: 'admissionNumber', header: 'Adm. No' },
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
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-full p-2 text-brand-success transition hover:bg-brand-success/10"
              onClick={() => setRechargeStudent(info.row.original)}
              title="Recharge"
            >
              <Wallet size={15} />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-brand-primary transition hover:bg-brand-primaryTint"
              onClick={() => openEditModal(info.row.original)}
              title="Edit"
            >
              <PencilLine size={15} />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-brand-danger transition hover:bg-brand-danger/10"
              onClick={() => {
                if (window.confirm('Delete this student permanently?')) deleteMutation.mutate(info.row.original._id)
              }}
              title="Delete"
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
        dailyLimit: student.dailyLimit ?? '',
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

  async function handleBulkRechargeChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const rows = await parseBulkRechargeExcel(file)
      bulkRechargeMutation.mutate(rows)
    } catch {
      toast.error('Could not parse the bulk recharge file')
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
      dailyLimit: form.dailyLimit ? Number(form.dailyLimit) : null,
    }

    if (editingStudent) {
      updateMutation.mutate({ 
        id: editingStudent._id, 
        payload: { 
          name: payload.name, 
          class: payload.class,
          dailyLimit: payload.dailyLimit,
        } 
      })
      return
    }

    createMutation.mutate(payload)
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-7">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-5xl font-black text-brand-dark">Students</h1>
          <div className="flex flex-wrap gap-2">
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
            <input ref={bulkRechargeInputRef} type="file" accept=".xlsx,.xls" onChange={handleBulkRechargeChange} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-brand-dark hover:bg-black/[0.03] transition-colors shadow-sm"
            >
              <FileUp size={14} /> Import
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-brand-dark hover:bg-black/[0.03] transition-colors shadow-sm"
            >
              <Download size={14} /> Export
            </button>
            <button
              onClick={() => bulkRechargeInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-brand-dark hover:bg-black/[0.03] transition-colors shadow-sm"
            >
              <Upload size={14} /> Bulk Recharge
            </button>
            <button
              onClick={() => openEditModal()}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90 transition-colors shadow-sm"
            >
              <Plus size={14} /> + Add
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-full border border-black/10 bg-white pl-9 pr-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/25 shadow-sm"
            />
          </div>
          <select
            className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/25 shadow-sm"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">Class</option>
            {CLASS_CODES.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-[1.4rem] bg-white border border-black/[0.07] shadow-soft overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-sm text-brand-muted">Loading students...</div>
          ) : (
            <StudentTable data={filteredStudents} columns={columns} />
          )}
        </div>
      </main>

      {/* Add / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[1.75rem] bg-white border border-black/[0.07] shadow-float p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-primary">{editingStudent ? 'Edit student' : 'Add student'}</p>
                <h2 className="font-display text-2xl font-black text-brand-dark mt-0.5">{editingStudent ? editingStudent.name : 'New student'}</h2>
              </div>
              <button onClick={closeModal} className="text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Ad no', key: 'admissionNumber', placeholder: '4001', disabled: Boolean(editingStudent) },
                { label: 'Name', key: 'name', placeholder: 'Student Name' },
              ].map(({ label, key, placeholder, disabled }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-dark/60">{label}</label>
                  <input
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/25 disabled:opacity-50"
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-dark/60">Class</label>
                <select
                  className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/25"
                  value={form.class}
                  onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))}
                >
                  {CLASS_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-dark/60">Rol no</label>
                <input
                  value={form.balance}
                  onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))}
                  placeholder="0"
                  type="number"
                  disabled={Boolean(editingStudent)}
                  className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/25 disabled:opacity-50"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-dark/60">img (optional)</label>
                <input
                  value={form.dailyLimit}
                  onChange={(e) => setForm((f) => ({ ...f, dailyLimit: e.target.value }))}
                  placeholder="Leave empty for no limit"
                  type="number"
                  className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/25"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full bg-brand-danger/90 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-danger transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {rechargeStudent && (
        <RechargeModal
          student={rechargeStudent}
          onClose={() => setRechargeStudent(null)}
          onSubmit={({ amount, note }) => rechargeMutation.mutate({ id: rechargeStudent._id, amount, note })}
          isLoading={rechargeMutation.isPending}
        />
      )}

      <Footer />
    </div>
  )
}
