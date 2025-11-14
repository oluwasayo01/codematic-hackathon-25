import { Content, Grid, Column, Tile } from '@carbon/react'
import { useAppSelector } from '../hooks/redux'

export function EvaluationPage() {
  const latest = useAppSelector((s) => s.progress.evaluations[0])
  return (
    <Content id="main-content" style={{ padding: '2rem' }}>
      <Grid condensed>
        <Column lg={16}><h2>Latest Evaluation</h2></Column>
        {latest ? (
          <Column lg={16}>
            <Tile>
              <div>Day {latest.day} — Score {latest.overallScore}</div>
              <div style={{ opacity: 0.8, marginTop: 8 }}>{latest.specificFeedback}</div>
            </Tile>
          </Column>
        ) : (
          <Column lg={16}><div>No evaluation available yet.</div></Column>
        )}
      </Grid>
    </Content>
  )
}
