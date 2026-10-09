import { useState } from 'react'
import { LoginForm } from './components/LoginForm'
import { Messenger } from './components/Messenger'
import type { Credentials } from './types'

export default function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null)

  if (!credentials) {
    return (
      <LoginForm onLogin={(idInstance, apiTokenInstance) => setCredentials({ idInstance, apiTokenInstance })} />
    )
  }

  return <Messenger credentials={credentials} onLogout={() => setCredentials(null)} />
}
