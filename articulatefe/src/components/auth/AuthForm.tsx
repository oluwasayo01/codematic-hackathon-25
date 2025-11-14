import { useState } from 'react'
import { TextInput, PasswordInput, Button, InlineLoading } from '@carbon/react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { signIn, signInWithGoogle } from '../../stores/auth.actions'
import { Link } from 'react-router-dom'

export function AuthForm() {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((s) => s.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await dispatch<any>(signIn(email, password))
    } catch (err: any) {
      setError(err?.message ?? 'Sign in failed')
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <TextInput id="email" labelText="Email" type="email" value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} required />
        <PasswordInput id="password" labelText="Password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} required />
        {error && <div style={{ color: '#fa4d56', fontSize: 12 }}>{error}</div>}
        <Button type="submit" disabled={isLoading} style={{ width: '100%' }}>
          {isLoading ? <InlineLoading description="Signing in..." /> : 'Continue'}
        </Button>
      </form>
      <div style={{ margin: '1rem 0', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }}>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)' }} />
        <span style={{ opacity: 0.8, fontSize: 12 }}>or</span>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)' }} />
      </div>
      <Button kind="secondary" onClick={() => dispatch<any>(signInWithGoogle())} style={{ width: '100%' }}>
        Continue with Google
      </Button>
      <div style={{ marginTop: '1rem', fontSize: 12, opacity: 0.8 }}>
        Don’t have an account? <Link to="/signup">Create one</Link>
      </div>
    </div>
  )
}
