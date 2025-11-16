import { Content, Grid, Column, Tile, Button } from '@carbon/react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { useEffect } from 'react'
import { fetchProgress, fetchEvaluations, downloadReport } from '../stores/progress.actions'

export function ProgressPage() {
  const dispatch = useAppDispatch()
  const { progress, evaluations, isLoading, error } = useAppSelector((s) => s.progress)
  const user = useAppSelector((s) => s.auth.user)

  useEffect(() => {
    if (user?.id) {
      dispatch<any>(fetchProgress(user.id))
      dispatch<any>(fetchEvaluations(user.id))
    }
  }, [user?.id])

  return (
    <Content id="main-content" style={{ padding: '2rem' }}>
      <Grid condensed>
        <Column lg={16} md={8} sm={4}>
          <h2>Progress</h2>
        </Column>
        {isLoading && <Column lg={16}><div>Loading...</div></Column>}
        {error && <Column lg={16}><div style={{ color: '#fa4d56' }}>{error}</div></Column>}
        {progress && (
          <>
            <Column lg={8} md={4} sm={4}>
              <Tile>Streak: {progress.currentStreak} days</Tile>
            </Column>
            <Column lg={8} md={4} sm={4}>
              <Tile>Average Score: {progress.averageScore}</Tile>
            </Column>
            <Column lg={16} md={8} sm={4}>
              <Button onClick={() => user?.id && dispatch<any>(downloadReport(user.id))}>Download Report</Button>
            </Column>
          </>
        )}
        <Column lg={16} md={8} sm={4}>
          <h3>Evaluations</h3>
          {evaluations.slice(0, 5).map((e) => (
            <Tile key={e.id} style={{ marginBottom: 8 }}>Day {e.day} — Score {e.overallScore}</Tile>
          ))}
        </Column>
      </Grid>
    </Content>
  )
}
