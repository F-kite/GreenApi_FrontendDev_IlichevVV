import { useEffect, useState, type FormEvent } from 'react'

interface Props {
  onSubmit: (phone: string) => void
  onClose: () => void
}

const MIN_DIGITS = 10

export function NewChatModal({ onSubmit, onClose }: Props) {
  const [phone, setPhone] = useState('')
  const digits = phone.replace(/\D/g, '')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (digits.length >= MIN_DIGITS) onSubmit(`7${digits}`)
  }

  return (
    <div className="overlay" onMouseDown={onClose}>
      <form className="modal" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
        <h2 className="modal__title">Найти по номеру</h2>
        <div className="phone-field">
          <span className="phone-field__code">
            <span className="flag" aria-hidden="true" />
            +7
          </span>
          <input
            autoFocus
            type="tel"
            inputMode="tel"
            placeholder="123 456 78 90"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button className="btn btn--block" disabled={digits.length < MIN_DIGITS}>
          Найти в MAX
        </button>
      </form>
    </div>
  )
}
