import { Content, Grid, Column, Tile, Button } from '@carbon/react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { useEffect } from 'react'
import { fetchTopics } from '../stores/topic.actions'
import { useNavigate } from 'react-router-dom'

export function TopicsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { topics, isLoading, error } = useAppSelector((s) => s.topic)

  useEffect(() => {
    dispatch<any>(fetchTopics())
  }, [])

  return (
    <Content id="main-content" style={{ padding: '2rem' }}>
      <Grid condensed>
        <Column lg={16} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2>Topics</h2>
          <Button size="sm" onClick={() => navigate('/topics/new')}>Create Topic</Button>
        </Column>
        {isLoading && <Column lg={16}>Loading...</Column>}
        {error && <Column lg={16}><div style={{ color: '#fa4d56' }}>{error}</div></Column>}
        {topics.map((t) => (
          <Column key={t.id} lg={8} md={4} sm={4}>
            <Tile style={{ cursor: 'pointer' }} onClick={() => navigate(`/topics/${t.id}`)}>
              <div style={{ fontSize: 18 }}>{t.title}</div>
              {t.description && <div style={{ opacity: 0.8 }}>{t.description}</div>}
            </Tile>
          </Column>
        ))}
      </Grid>
    </Content>
  )
}
