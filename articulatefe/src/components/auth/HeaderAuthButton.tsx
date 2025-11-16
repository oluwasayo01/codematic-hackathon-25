import { Button } from '@carbon/react'
import { useNavigate } from 'react-router-dom'

export function HeaderAuthButton() {
  const navigate = useNavigate()
  return <Button size="sm" onClick={() => navigate('/auth')}>Sign in</Button>
}
