import { useState } from 'react'
import { Wallet, X } from 'lucide-react'
import Button from './Button'
import Card from './Card'
import InputField from './InputField'
import Badge from './Badge'
import { currencyLabel, formatClass } from '../../lib/formatters'

export default function RechargeModal({ student, onClose, onSubmit, isLoading }) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return
    onSubmit({ amount: value, note: note.trim() })
  }

  const quickAmounts = [50, 100, 200, 500]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
      <Card className="w-full max-w-md p-0">
        <div className="flex items-start justify-between gap-4 border-b border-brand-border p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primaryTint text-brand-primary">
              <Wallet size={20} />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Recharge</p>
              <h2 className="font-display text-xl font-black text-brand-dark">Add balance</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-brand-muted transition hover:bg-brand-primaryTint hover:text-brand-dark"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-brand-border bg-brand-primaryTint/40 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge>{student.admissionNumber}</Badge>
                <Badge className="bg-black/5 text-brand-dark">{formatClass(student.class)}</Badge>
              </div>
              <p className="mt-2 font-display text-lg font-bold text-brand-dark">{student.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">Current</p>
              <p className={`mt-1 text-xl font-bold ${Number(student.balance) < 0 ? 'text-brand-danger' : 'text-brand-dark'}`}>
                {currencyLabel(student.balance)}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-brand-dark">Quick amounts</label>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={Number(amount) === value ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setAmount(String(value))}
                >
                  {currencyLabel(value)}
                </Button>
              ))}
            </div>
          </div>

          <InputField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
          />

          <InputField
            label="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., June fee collection"
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading || !amount || Number(amount) <= 0}>
              {isLoading ? 'Processing...' : 'Recharge'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
