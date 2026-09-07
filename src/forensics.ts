import * as ort from 'onnxruntime-web'

const MODEL_URL = 'https://huggingface.co/buildborderless/CommunityForensics-DeepfakeDet-ViT/resolve/main/onnx/model_int8.onnx'
const MODEL_NAME = 'CommunityForensics DeepfakeDet-ViT'
const MODEL_VARIANT = 'corrected v1.1 INT8 (July 2026)'

// Keep inference fully client-side. Model and WASM runtime are fetched by the browser
// so the Cloudflare static deployment stays small and reliable.
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.29.0/dist/'
if (typeof navigator !== 'undefined') {
  ort.env.wasm.numThreads = Math.max(1, Math.min(2, navigator.hardwareConcurrency || 1))
}

export type ImageForensicsResult = {
  fakeProbability: number
  realProbability: number
  verdict: 'likely_fake' | 'likely_real'
  elapsedMs: number
  model: string
  variant: string
}

export type VideoFrameResult = ImageForensicsResult & { time: number }

export type VideoForensicsResult = {
  frames: VideoFrameResult[]
  averageFakeProbability: number
  maxFakeProbability: number
  verdict: 'likely_fake' | 'likely_real' | 'mixed'
  elapsedMs: number
  model: string
  variant: string
}

let sessionPromise: Promise<ort.InferenceSession> | null = null

async function getSession() {
  if (!sessionPromise) {
    sessionPromise = ort.InferenceSession.create(MODEL_URL, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all',
    })
  }
  return sessionPromise
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x))
}

function preprocessBitmap(bitmap: ImageBitmap) {
  const targetShortest = 440
  const cropSize = 384
  const scale = targetShortest / Math.min(bitmap.width, bitmap.height)
  const resizedWidth = bitmap.width * scale
  const resizedHeight = bitmap.height * scale
  const cropLeft = Math.max(0, (resizedWidth - cropSize) / 2)
  const cropTop = Math.max(0, (resizedHeight - cropSize) / 2)

  const sx = cropLeft / scale
  const sy = cropTop / scale
  const sw = cropSize / scale
  const sh = cropSize / scale

  const canvas = document.createElement('canvas')
  canvas.width = cropSize
  canvas.height = cropSize
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, cropSize, cropSize)

  const pixels = ctx.getImageData(0, 0, cropSize, cropSize).data
  const size = cropSize * cropSize
  const input = new Float32Array(3 * size)
  const mean = [0.48145466, 0.4578275, 0.40821073]
  const std = [0.26862954, 0.26130258, 0.27577711]

  for (let i = 0; i < size; i++) {
    const p = i * 4
    input[i] = (pixels[p] / 255 - mean[0]) / std[0]
    input[size + i] = (pixels[p + 1] / 255 - mean[1]) / std[1]
    input[2 * size + i] = (pixels[p + 2] / 255 - mean[2]) / std[2]
  }
  return new ort.Tensor('float32', input, [1, 3, cropSize, cropSize])
}

export async function classifyBlob(blob: Blob): Promise<ImageForensicsResult> {
  const started = performance.now()
  const bitmap = await createImageBitmap(blob)
  try {
    const tensor = preprocessBitmap(bitmap)
    const session = await getSession()
    const inputName = session.inputNames[0]
    const output = await session.run({ [inputName]: tensor })
    const data = output[session.outputNames[0]].data
    const fakeProbability = sigmoid(Number(data[0]))
    const realProbability = 1 - fakeProbability
    return {
      fakeProbability,
      realProbability,
      verdict: fakeProbability >= 0.5 ? 'likely_fake' : 'likely_real',
      elapsedMs: performance.now() - started,
      model: MODEL_NAME,
      variant: MODEL_VARIANT,
    }
  } finally {
    bitmap.close()
  }
}

function seekVideo(video: HTMLVideoElement, time: number) {
  return new Promise<void>((resolve, reject) => {
    const onSeeked = () => { cleanup(); resolve() }
    const onError = () => { cleanup(); reject(new Error('Unable to seek video')) }
    const cleanup = () => {
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onError)
    }
    video.addEventListener('seeked', onSeeked, { once: true })
    video.addEventListener('error', onError, { once: true })
    video.currentTime = time
  })
}

export async function classifyVideoFile(file: File, onProgress?: (done: number, total: number) => void): Promise<VideoForensicsResult> {
  const started = performance.now()
  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.muted = true
  video.preload = 'auto'
  video.src = url
  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve()
      video.onerror = () => reject(new Error('Unable to load video'))
    })
    const duration = Math.max(0.2, Number.isFinite(video.duration) ? video.duration : 1)
    const count = Math.min(6, Math.max(3, Math.ceil(duration / 2)))
    const times = Array.from({ length: count }, (_, i) => Math.min(duration - 0.05, duration * (i + 1) / (count + 1)))
    const canvas = document.createElement('canvas')
    const results: VideoFrameResult[] = []
    for (let i = 0; i < times.length; i++) {
      await seekVideo(video, times[i])
      canvas.width = Math.max(1, video.videoWidth)
      canvas.height = Math.max(1, video.videoHeight)
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas 2D context unavailable')
      ctx.drawImage(video, 0, 0)
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Frame capture failed')), 'image/jpeg', 0.92))
      results.push({ ...(await classifyBlob(blob)), time: times[i] })
      onProgress?.(i + 1, times.length)
    }
    const averageFakeProbability = results.reduce((s, r) => s + r.fakeProbability, 0) / results.length
    const maxFakeProbability = Math.max(...results.map(r => r.fakeProbability))
    return {
      frames: results,
      averageFakeProbability,
      maxFakeProbability,
      verdict: averageFakeProbability >= 0.6 ? 'likely_fake' : maxFakeProbability >= 0.7 ? 'mixed' : 'likely_real',
      elapsedMs: performance.now() - started,
      model: MODEL_NAME,
      variant: MODEL_VARIANT,
    }
  } finally {
    URL.revokeObjectURL(url)
    video.remove()
  }
}
