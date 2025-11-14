import { Content, Grid, Column, Tile } from '@carbon/react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { useEffect } from 'react'
import { fetchUserSubmissions } from '../stores/submission.actions'

export function HistoryPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { submissions } = useAppSelector((s) => s.submission)

  useEffect(() => {
    if (user?.id) {
      dispatch<any>(fetchUserSubmissions(user.id))
    }
  }, [user?.id])

  return (
    <Content id="main-content" style={{ padding: '2rem' }}>
      <Grid condensed>
        <Column lg={16}><h2>History</h2></Column>
        {submissions.map((s) => (
          <Column lg={16} key={s.id}><Tile>Day {s.day} — {new Date(s.submittedAt).toLocaleString()}</Tile></Column>
        ))}
      </Grid>
    </Content>
  )
}
