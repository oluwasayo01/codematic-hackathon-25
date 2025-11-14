import { Toggle } from '@carbon/react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { toggleTheme } from '../../stores/slices/uiSlice'

export function AppFooter() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((s) => s.ui.theme)
  const isLight = theme === 'g10'
  return (
    <footer style={{
      height: 56,
      borderTop: '1px solid #393939',
      background: 'var(--cds-background, #161616)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      fontSize: 12,
      color: 'var(--cds-text-secondary, #8d8d8d)',
    }}>
      <span>© 2025 ArticulateAI</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="#" style={{ color: 'inherit' }}>Privacy</a>
        <a href="#" style={{ color: 'inherit' }}>Terms</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Theme</span>
          <Toggle id="theme-toggle" size="sm" labelA="Dark" labelB="Light" toggled={isLight} onToggle={() => dispatch(toggleTheme())} />
        </div>
      </div>
    </footer>
  )
}
