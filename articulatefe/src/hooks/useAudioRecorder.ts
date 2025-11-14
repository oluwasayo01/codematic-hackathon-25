import { useEffect, useRef, useState } from 'react'

export interface RecorderState {
  isSupported: boolean
  isRecording: boolean
  isPaused: boolean
  durationMs: number
  level: number
  blob?: Blob
  error?: string
}

export function useAudioRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const [state, setState] = useState<RecorderState>({
    isSupported: !!(navigator.mediaDevices && window.MediaRecorder),
    isRecording: false,
    isPaused: false,
    durationMs: 0,
    level: 0,
  })

  useEffect(() => () => stopAll(), [])

  function tick() {
    if (state.isRecording && !state.isPaused) {
      setState((s) => ({ ...s, durationMs: Date.now() - startTimeRef.current }))
    }
    // level metering
    const analyser = analyserRef.current
    const arr = dataArrayRef.current
    if (analyser && arr) {
      analyser.getByteTimeDomainData(arr as any)
      // Compute rough amplitude
      let max = 0
      for (let i = 0; i < arr.length; i++) {
        const v = Math.abs(arr[i] - 128)
        if (v > max) max = v
      }
      const level = Math.min(1, max / 128)
      setState((s) => ({ ...s, level }))
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const chunks: BlobPart[] = []
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr

      // audio context for visualization
      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.85
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      dataArrayRef.current = dataArray
      analyserRef.current = analyser
      source.connect(analyser)

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setState((s) => ({ ...s, blob }))
      }
      mr.start()
      startTimeRef.current = Date.now()
      setState((s) => ({ ...s, isRecording: true, isPaused: false, durationMs: 0, blob: undefined }))
      rafRef.current = requestAnimationFrame(tick)
    } catch (e: any) {
      setState((s) => ({ ...s, error: e?.message || 'Microphone permission denied' }))
    }
  }

  function pause() {
    const mr = mediaRecorderRef.current
    if (mr && mr.state === 'recording') {
      mr.pause()
      setState((s) => ({ ...s, isPaused: true }))
    }
  }

  function resume() {
    const mr = mediaRecorderRef.current
    if (mr && mr.state === 'paused') {
      mr.resume()
      setState((s) => ({ ...s, isPaused: false }))
    }
  }

  function stop() {
    const mr = mediaRecorderRef.current
    if (mr && (mr.state === 'recording' || mr.state === 'paused')) {
      mr.stop()
      setState((s) => ({ ...s, isRecording: false, isPaused: false }))
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }

  function stopAll() {
    stop()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    audioCtxRef.current?.close()
    analyserRef.current = null
    dataArrayRef.current = null
  }

  return { state, start, pause, resume, stop, stopAll, analyser: analyserRef, dataArray: dataArrayRef }
}
