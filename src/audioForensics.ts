import * as ort from 'onnxruntime-web'

const AUDIO_MODEL_URL = 'https://huggingface.co/SpeechAntiSpoofingBenchmarks/AASIST/resolve/main/aasist.onnx'
const AUDIO_MODEL_NAME = 'AASIST Speech Anti-Spoofing'
const AUDIO_MODEL_VARIANT = 'ASVspoof2019 LA · ONNX · class 1 bona fide'
const TARGET_SAMPLE_RATE = 16000
const WINDOW_SAMPLES = 64600

ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.29.0/dist/'
if (typeof navigator !== 'undefined') {
  ort.env.wasm.numThreads = Math.max(1, Math.min(2, navigator.hardwareConcurrency || 1))
}

export type AudioForensicsResult = {
  bonaFideProbability: number
  spoofProbability: number
  verdict: 'likely_bonafide' | 'likely_spoof'
  elapsedMs: number
  model: string
  variant: string
  inputSampleRate: number
  analyzedSamples: number
}

let sessionPromise: Promise<ort.InferenceSession> | null = null

async function getSession() {
  if (!sessionPromise) {
    sessionPromise = ort.InferenceSession.create(AUDIO_MODEL_URL, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all',
    })
  }
  return sessionPromise
}

function softmax2(a: number, b: number) {
  const m = Math.max(a, b)
  const ea = Math.exp(a - m)
  const eb = Math.exp(b - m)
  const sum = ea + eb
  return [ea / sum, eb / sum] as const
}

function resampleLinear(input: Float32Array, sourceRate: number, targetRate: number) {
  if (sourceRate === targetRate) return input
  const ratio = sourceRate / targetRate
  const length = Math.max(1, Math.round(input.length / ratio))
  const out = new Float32Array(length)
  for (let i = 0; i < length; i++) {
    const pos = i * ratio
    const left = Math.min(input.length - 1, Math.floor(pos))
    const right = Math.min(input.length - 1, left + 1)
    const frac = pos - left
    out[i] = input[left] * (1 - frac) + input[right] * frac
  }
  return out
}

function padFixed(input: Float32Array) {
  const out = new Float32Array(WINDOW_SAMPLES)
  if (input.length === 0) return out
  if (input.length >= WINDOW_SAMPLES) {
    out.set(input.subarray(0, WINDOW_SAMPLES))
    return out
  }
  for (let i = 0; i < WINDOW_SAMPLES; i++) out[i] = input[i % input.length]
  return out
}

async function decodeMono(file: File) {
  const context = new AudioContext()
  try {
    const decoded = await context.decodeAudioData(await file.arrayBuffer())
    const mono = new Float32Array(decoded.length)
    for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
      const data = decoded.getChannelData(channel)
      for (let i = 0; i < data.length; i++) mono[i] += data[i] / decoded.numberOfChannels
    }
    return { mono, sampleRate: decoded.sampleRate }
  } finally {
    await context.close()
  }
}

export async function classifyAudioFile(file: File): Promise<AudioForensicsResult> {
  const started = performance.now()
  const { mono, sampleRate } = await decodeMono(file)
  const resampled = resampleLinear(mono, sampleRate, TARGET_SAMPLE_RATE)
  const window = padFixed(resampled)
  const session = await getSession()
  const tensor = new ort.Tensor('float32', window, [1, WINDOW_SAMPLES])
  const output = await session.run({ wav: tensor })
  const logits = output[session.outputNames[0]].data
  const spoofLogit = Number(logits[0])
  const bonaFideLogit = Number(logits[1])
  const [spoofProbability, bonaFideProbability] = softmax2(spoofLogit, bonaFideLogit)
  return {
    bonaFideProbability,
    spoofProbability,
    verdict: spoofProbability >= 0.5 ? 'likely_spoof' : 'likely_bonafide',
    elapsedMs: performance.now() - started,
    model: AUDIO_MODEL_NAME,
    variant: AUDIO_MODEL_VARIANT,
    inputSampleRate: sampleRate,
    analyzedSamples: WINDOW_SAMPLES,
  }
}
