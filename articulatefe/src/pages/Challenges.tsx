import { Content, Tile, Grid, Column } from '@carbon/react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchDailyChallenge } from '../stores/challenge.actions'
import { useEffect } from 'react'

export function Challenges() {
  const dispatch = useAppDispatch()
  const { currentChallenge, isLoading, error } = useAppSelector((s) => s.challenge)
  const user = useAppSelector((s) => s.auth.user)

  useEffect(() => {
    if (user?.id && !currentChallenge && !isLoading) {
      dispatch<any>(fetchDailyChallenge(user.id))
    }
  }, [user?.id])

  return (
    <Content id="main-content" style={{ padding: '2rem' }}>
      <Grid condensed>
        <Column lg={16} md={8} sm={4}>
          <h2>Daily Challenge</h2>
        </Column>
        <Column lg={16} md={8} sm={4}>
          {isLoading && <div>Loading...</div>}
          {error && <div style={{ color: '#fa4d56' }}>{error}</div>}
          {currentChallenge && (
            <Tile>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ opacity: 0.8 }}>Day {currentChallenge.day} • Difficulty {currentChallenge.challenge?.difficulty}</div>
                <div style={{ fontSize: 18 }}>{currentChallenge.challenge?.promptText}</div>
                <div style={{ opacity: 0.8 }}>Target duration: {currentChallenge.challenge?.targetDuration}s</div>
              </div>
            </Tile>
          )}
        </Column>
      </Grid>
    </Content>
  )
}
