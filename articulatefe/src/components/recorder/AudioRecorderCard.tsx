import { Button, Tile } from '@carbon/react'
import { Microphone, Stop, Play, Pause } from '@carbon/icons-react'
import { useEffect, useRef } from 'react'
import { useAudioRecorder } from '../../hooks/useAudioRecorder'

function format(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export function AudioRecorderCard({ onSubmit }: { onSubmit: (blob: Blob) => Promise<void> }) {
  const { state, start, pause, resume, stop, analyser, dataArray } = useAudioRecorder()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let raf: number | null = null
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d') || null
    function draw() {
      const analyserNode = analyser.current
      const arr = dataArray.current
      if (!canvas || !ctx) { raf = requestAnimationFrame(draw); return }

      // ensure canvas matches CSS size for crisp drawing
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const cssWidth = canvas.clientWidth || 0
      const cssHeight = canvas.clientHeight || 0
      if (canvas.width !== Math.floor(cssWidth * dpr) || canvas.height !== Math.floor(cssHeight * dpr)) {
        // reset transform before resizing to avoid compounding scales
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        canvas.width = Math.floor(cssWidth * dpr)
        canvas.height = Math.floor(cssHeight * dpr)
        ctx.scale(dpr, dpr)
      }

      const width = cssWidth
      const height = cssHeight
      ctx.clearRect(0, 0, width, height)

      // background baseline
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, Math.floor(height / 2))
      ctx.lineTo(width, Math.floor(height / 2))
      ctx.stroke()

      if (!analyserNode || !arr) { raf = requestAnimationFrame(draw); return }

      // frequency bars (spectrum)
      const freqData = arr
      analyserNode.getByteFrequencyData(freqData as any)

      const barCount = Math.min(96, freqData.length)
      const step = Math.max(1, Math.floor(freqData.length / barCount))
      const barGap = 2
      const barWidth = Math.max(2, (width - (barCount - 1) * barGap) / barCount)

      // gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, height)
      grad.addColorStop(0, '#0f62fe')
      grad.addColorStop(1, '#8a3ffc')
      ctx.fillStyle = grad

      for (let i = 0; i < barCount; i++) {
        let sum = 0
        for (let j = 0; j < step; j++) sum += freqData[i * step + j] || 0
        const val = sum / step // 0..255
        const amp = val / 255
        const barH = Math.max(4, amp * (height - 6))
        const x = i * (barWidth + barGap)
        const y = height - barH
        ctx.fillRect(x, y, barWidth, barH)
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { if (raf) cancelAnimationFrame(raf) }
  }, [analyser, dataArray])

  async function handleSubmit() {
    if (state.blob) await onSubmit(state.blob)
  }

  const pulse = state.isRecording && !state.isPaused

  return (
    <Tile style={{ padding: 16, display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', width: 16, height: 16 }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: pulse ? '#fa4d56' : '#6f6f6f' }} />
          {pulse && (
            <div style={{ position: 'absolute', inset: -8, borderRadius: 24, border: '2px solid rgba(250,77,86,0.5)', animation: 'pulse 1.5s infinite' }} />
          )}
        </div>
        <div style={{ fontVariantNumeric: 'tabular-nums' }}>{format(state.durationMs)}</div>
        <div style={{ flex: 1 }} />
        {!state.isRecording && <Button kind="primary" size="sm" renderIcon={Microphone} onClick={start}>Start</Button>}
        {state.isRecording && !state.isPaused && <Button kind="danger" size="sm" renderIcon={Pause} onClick={pause}>Pause</Button>}
        {state.isRecording && state.isPaused && <Button kind="tertiary" size="sm" renderIcon={Play} onClick={resume}>Resume</Button>}
        {state.isRecording && <Button kind="ghost" size="sm" renderIcon={Stop} onClick={stop}>Stop</Button>}
      </div>
      <div style={{ position: 'relative' }}>
        <canvas ref={canvasRef} height={120} style={{ width: '100%', height: 120, background: 'rgba(255,255,255,0.04)', borderRadius: 8 }} />
        {/* Live level meter overlay as a visual fallback */}
        <div style={{ position: 'absolute', left: 8, right: 8, bottom: 8, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
          <div style={{ width: `${Math.round(state.level * 100)}%`, height: '100%', background: '#0f62fe', borderRadius: 2, transition: 'width 80ms linear' }} />
        </div>
      </div>
      {state.blob && (
        <div style={{ display: 'flex', gap: 8 }}>
          <audio controls src={URL.createObjectURL(state.blob)} style={{ flex: 1 }} />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      )}
      <style>
        {`@keyframes pulse { 0%{transform: scale(0.9); opacity: 1} 70%{transform: scale(1.1); opacity: 0} 100%{transform: scale(0.9); opacity: 0} }`}
      </style>
    </Tile>
  )
}
