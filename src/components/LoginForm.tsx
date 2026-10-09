import { useState, type FormEvent } from 'react'

interface Props {
  onLogin: (idInstance: string, apiTokenInstance: string) => void
}

// idInstance - число из 12 цифр, apiTokenInstance - 50 символов (латинские буквы и цифры)
const validateId = (value: string) => (/^\d{12}$/.test(value) ? '' : 'idInstance - число из 12 цифр')
const validateToken = (value: string) =>
  /^[a-z0-9]{50}$/i.test(value) ? '' : 'apiTokenInstance - 50 символов (латинские буквы и цифры)'

export function LoginForm({ onLogin }: Props) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [touched, setTouched] = useState({ id: false, token: false })

  const id = idInstance.trim()
  const token = apiTokenInstance.trim()
  const idError = touched.id ? validateId(id) : ''
  const tokenError = touched.token ? validateToken(token) : ''

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched({ id: true, token: true })
    if (validateId(id) || validateToken(token)) return
    onLogin(id, token)
  }

  return (
    <div className="login">
      <form className="modal modal--login" onSubmit={submit} noValidate>
        <h1 className="modal__title">Вход в GREEN-API</h1>
        <p className="modal__hint">Введите данные инстанса из личного кабинета</p>

        <div className="form-group">
          <input
            className={`field ${idError ? 'field--invalid' : ''}`}
            placeholder="idInstance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, id: true }))}
            inputMode="numeric"
            autoComplete="off"
            autoFocus
          />
          {idError && <span className="field-error">{idError}</span>}
        </div>

        <div className="form-group">
          <input
            className={`field ${tokenError ? 'field--invalid' : ''}`}
            placeholder="apiTokenInstance"
            type="password"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, token: true }))}
            autoComplete="off"
          />
          {tokenError && <span className="field-error">{tokenError}</span>}
        </div>

        <button className="btn btn--block">Войти</button>
      </form>
    </div>
  )
}
