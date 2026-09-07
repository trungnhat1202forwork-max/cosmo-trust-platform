import * as ort from 'onnxruntime-web'

const MODEL_URL = 'https://huggingface.co/buildborderless/CommunityForensics-DeepfakeDet-ViT/resolve/main/onnx/model_int8.onnx'
const MODEL_NAME = 'CommunityForensics DeepfakeDet-ViT'
const MODEL_VARIANT = 'corrected v1.1 INT8 (July 2026)'

// Keep inference fully client-side. WASM binaries are loaded from the official npm CDN.
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

  // Convert crop coordinates from the resized image back to the source bitmap.
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
    input[size * 2 + i] = (pixels[p + 2] / 255 - mean[2]) / std[2]
  }

  return new ort.Tensor('float32', input, [1, 3, cropSize, cropSize])
}

export async function classifyBitmap(bitmap: ImageBitmap): Promise<ImageForensicsResult> {
  const started = performance.now()
  const session = await getSession()
  const tensor = preprocessBitmap(bitmap)
  const output = await session.run({ pixel_values: tensor })
  const outputName = session.outputNames[0]
  const raw = Number(output[outputName].data[0])
  const fakeProbability = sigmoid(raw)
  return {
    fakeProbability,
    realProbability: 1 - fakeProbability,
    verdict: fakeProbability >= 0.5 ? 'likely_fake' : 'likely_real',
    elapsedMs: performance.now() - started,
    model: MODEL_NAME,
    variant: MODEL_VARIANT,
  }
}

export async function classifyBlob(blob: Blob): Promise<ImageForensicsResult> {
  const bitmap = await createImageBitmap(blob)
  try {
    return await classifyBitmap(bitmap)
  } finally {
    bitmap.close()
  }
}

export async function classifyImageUrl(url: string): Promise<ImageForensicsResult> {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Unable to fetch image (${response.status})`)
  return classifyBlob(await response.blob())
}

function waitForEvent(target: EventTarget, event: string) {
  return new Promise<void>((resolve, reject) => {
    const done = () => { cleanup(); resolve() }
    const fail = () => { cleanup(); reject(new Error(`Media event failed: ${event}`)) }
    const cleanup = () => {
      target.removeEventListener(event, done)
      target.removeEventListener('error', fail)
    }
    target.addEventListener(event, done, { once: true })
    target.addEventListener('error', fail, { once: true })
  })
}

export async function classifyVideoFile(
  file: File,
  onProgress?: (done: number, total: number) => void,
): Promise<VideoForensicsResult> {
  const started = performance.now()
  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.muted = true
  video.preload = 'auto'
  video.playsInline = true
  video.src = url

  try {
    if (video.readyState < 1) await waitForEvent(video, 'loadedmetadata')
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 1
    const fractions = duration < 2 ? [0.25, 0.5, 0.75] : [0.1, 0.3, 0.5, 0.7, 0.9]
    const times = fractions.map(f => Math.min(Math.max(0, duration * f), Math.max(0, duration - 0.05)))
    const frames: VideoFrameResult[] = []

    for (let i = 0; i < times.length; i++) {
      const t = times[i]
      if (Math.abs(video.currentTime - t) > 0.02) {
        video.currentTime = t
        await waitForEvent(video, 'seeked')
      }
      const bitmap = await createImageBitmap(video)
      try {
        const result = await classifyBitmap(bitmap)
        frames.push({ ...result, time: t })
      } finally {
        bitmap.close()
      }
      onProgress?.(i + 1, times.length)
    }

    const avg = frames.reduce((sum, frame) => sum + frame.fakeProbability, 0) / Math.max(1, frames.length)
    const max = Math.max(...frames.map(frame => frame.fakeProbability))
    const mixed = avg < 0.5 && max >= 0.7

    return {
      frames,
      averageFakeProbability: avg,
      maxFakeProbability: max,
      verdict: mixed ? 'mixed' : avg >= 0.5 ? 'likely_fake' : 'likely_real',
      elapsedMs: performance.now() - started,
      model: MODEL_NAME,
      variant: MODEL_VARIANT,
    }
  } finally {
    video.removeAttribute('src')
    video.load()
    URL.revokeObjectURL(url)
  }
}
