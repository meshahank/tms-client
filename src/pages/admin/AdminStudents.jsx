import { useMemo, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Download, FileUp, Plus, PencilLine, Trash2, Search, Wallet, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
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
    onError: (err) => toast.error(err.response?.data?.error || 'Unable to save student'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => studentsApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student updated')
      closeModal()
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Unable to update student'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => studentsApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student deleted')
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Unable to delete student'),
  })

  const importMutation = useMutation({
    mutationFn: (rows) => studentsApi.importRows(rows),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      const { inserted = 0, skipped = 0 } = res.data || {}
      toast.success(`Imported ${inserted}, skipped ${skipped}`)
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Import failed'),
  })

  const rechargeMutation = useMutation({
    mutationFn: ({ id, amount, note }) => studentsApi.recharge(id, amount, note),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Balance recharged')
      setRechargeStudent(null)
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Recharge failed'),
  })

  const bulkRechargeMutation = useMutation({
    mutationFn: (rows) => studentsApi.bulkRecharge(rows),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      const { recharged = 0, notFound = 0 } = res.data || {}
      toast.success(`Recharged ${recharged}, ${notFound} not found`)
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Bulk recharge failed'),
  })

  const filteredStudents = useMemo(() => {
    let result = data
    if (classFilter) result = result.filter((s) => s.class === classFilter)
    const term = search.trim().toLowerCase()
    if (term) {
      result = result.filter((s) =>
        [s.admissionNumber, s.name, s.class].some((v) => String(v ?? '').toLowerCase().includes(term)),
      )
    }
    return result
  }, [data, search, classFilter])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'index',
        header: '#',
        cell: (info) => <span className="text-brand-muted tabular-nums">{info.row.index + 1}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => <span className="font-medium text-brand-dark">{info.getValue()}</span>,
      },
      { accessorKey: 'admissionNumber', header: 'Adm. No' },
      {
        accessorKey: 'balance',
        header: 'Balance',
        cell: (info) => (
          <span className={`font-semibold tabular-nums ${Number(info.getValue()) < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
            {currencyLabel(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'class',
        header: 'Class',
        cell: (info) => <Badge>{formatClass(info.getValue())}</Badge>,
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: (info) => (
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Recharge"
              onClick={() => setRechargeStudent(info.row.original)}
              className="rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50"
            >
              <Wallet size={14} />
            </button>
            <button
              type="button"
              title="Edit"
              onClick={() => openEditModal(info.row.original)}
              className="rounded-lg p-1.5 text-brand-green transition-colors hover:bg-brand-green/10"
            >
              <PencilLine size={14} />
            </button>
            <button
              type="button"
              title="Delete"
              onClick={() => window.confirm('Delete this student?') && deleteMutation.mutate(info.row.original._id)}
              className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 size={14} />
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

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const rows = await parseStudentExcel(file)
      importMutation.mutate(rows)
    } catch {
      toast.error('Could not parse the Excel file')
    } finally {
      e.target.value = ''
    }
  }

  async function handleBulkRechargeChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const rows = await parseBulkRechargeExcel(file)
      bulkRechargeMutation.mutate(rows)
    } catch {
      toast.error('Could not parse the bulk recharge file')
    } finally {
      e.target.value = ''
    }
  }

  async function handleExport() {
    try {
      const res = await studentsApi.exportFile()
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Teapetti_students.xlsx'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Unable to export students')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
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
        payload: { name: payload.name, class: payload.class, dailyLimit: payload.dailyLimit },
      })
    } else {
      createMutation.mutate(payload)
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending
  const debtCount = filteredStudents.filter((s) => Number(s.balance) < 0).length

  return (
    <div className="min-h-screen bg-brand-beige">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green mb-1">Roster</p>
            <h1 className="font-display text-4xl font-bold text-brand-dark">Students</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
            <input ref={bulkRechargeInputRef} type="file" accept=".xlsx,.xls" onChange={handleBulkRechargeChange} className="hidden" />
            {[
              { label: 'Import', icon: <FileUp size={13} />, fn: () => fileInputRef.current?.click() },
              { label: 'Export', icon: <Download size={13} />, fn: handleExport },
              { label: 'Bulk Recharge', icon: <Upload size={13} />, fn: () => bulkRechargeInputRef.current?.click() },
            ].map(({ label, icon, fn }) => (
              <button
                key={label}
                onClick={fn}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-beige-subtle active:scale-[0.97]"
              >
                {icon}{label}
              </button>
            ))}
            <button
              onClick={() => openEditModal()}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark active:scale-[0.97] shadow-sm"
            >
              <Plus size={13} />+ Add
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="input-base pl-9 w-60"
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="input-base"
          >
            <option value="">Class</option>
            {CLASS_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span className="text-brand-muted">
              <span className="font-semibold text-brand-dark">{filteredStudents.length}</span> students
            </span>
            {debtCount > 0 && (
              <span className="font-medium text-red-500">{debtCount} in debt</span>
            )}
          </div>
        </div>

        {/* Table card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="card overflow-hidden"
        >
          {isLoading ? (
            <div className="p-16 text-center text-sm text-brand-muted">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-16 text-center text-sm text-brand-muted">No students found.</div>
          ) : (
            <StudentTable data={filteredStudents} columns={columns} />
          )}
        </motion.div>
      </main>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-beige-dark/40 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="card w-full max-w-md p-7"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-green mb-0.5">
                    {editingStudent ? 'Edit' : 'New student'}
                  </p>
                  <h2 className="font-display text-xl font-bold text-brand-dark">
                    {editingStudent ? editingStudent.name : 'Add student'}
                  </h2>
                </div>
                <button onClick={closeModal} className="text-sm text-brand-muted hover:text-brand-dark transition-colors">
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Ad no', key: 'admissionNumber', placeholder: '4001', type: 'text', disabled: Boolean(editingStudent) },
                  { label: 'Name', key: 'name', placeholder: 'Student Name', type: 'text' },
                ].map(({ label, key, placeholder, type, disabled }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-brand-muted">{label}</label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      disabled={disabled}
                      className="input-base w-full disabled:opacity-40"
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-brand-muted">Class</label>
                  <select
                    value={form.class}
                    onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))}
                    className="input-base w-full"
                  >
                    {CLASS_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-brand-muted">Initial balance</label>
                  <input
                    type="number"
                    value={form.balance}
                    onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))}
                    placeholder="0"
                    disabled={Boolean(editingStudent)}
                    className="input-base w-full disabled:opacity-40"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-brand-muted">Daily limit (optional)</label>
                  <input
                    type="number"
                    value={form.dailyLimit}
                    onChange={(e) => setForm((f) => ({ ...f, dailyLimit: e.target.value }))}
                    placeholder="No limit"
                    className="input-base w-full"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-full bg-brand-green px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark active:scale-95 disabled:opacity-60"
                  >
                    {isSaving ? 'Saving...' : editingStudent ? 'Save' : 'Add'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
