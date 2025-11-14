import { Content, Grid, Column, Tile, TextInput, TextArea, Button } from '@carbon/react'
import { useState } from 'react'
import { topicsAPI } from '../lib/api/topics'
import { useNavigate } from 'react-router-dom'

export function TopicCreatePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function submit() {
    setError(null)
    setSubmitting(true)
    try {
      const t = await topicsAPI.create({ title, description })
      navigate(`/topics/${t.id}`)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to create topic')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Content id="main-content" style={{ padding: '2rem' }}>
      <Grid condensed>
        <Column lg={10} md={8} sm={4}>
          <h2>Create Topic</h2>
          <Tile>
            <div style={{ display: 'grid', gap: 12 }}>
              <TextInput id="title" labelText="Title" value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} required />
              <TextArea id="description" labelText="Description" value={description} onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)} />
              {error && <div style={{ color: '#fa4d56' }}>{error}</div>}
              <Button onClick={submit} disabled={!title || submitting}>Create</Button>
            </div>
          </Tile>
        </Column>
      </Grid>
    </Content>
  )
}
