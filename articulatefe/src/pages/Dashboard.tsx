import { Content, Tile, Grid, Column } from '@carbon/react'
import { AppFooter } from '../components/layout/AppFooter'

export function Dashboard() {
  return (
    <>
      <Content id="main-content" style={{ padding: '2rem' }}>
        <Grid condensed>
        <Column lg={16} md={8} sm={4}>
          <h1 style={{ marginTop: 0 }}>Articulate Dashboard</h1>
          <p style={{ opacity: 0.85, maxWidth: 800 }}>
            Welcome to your articulation workspace. Track your daily practice, review history,
            and evaluate progress. Use the sidebar to navigate.
          </p>
        </Column>
        <Column lg={8} md={4} sm={4}>
          <Tile>Today's Goal: 15 minutes of practice</Tile>
        </Column>
        <Column lg={8} md={4} sm={4}>
          <Tile>Streak: 3 days</Tile>
        </Column>
        </Grid>
      </Content>
      <AppFooter />
    </>
  )
}
