// Message protocol between the main thread and the DSP worklet.
// See docs/modulation-protocol.md for the full specification.

export interface ModSourceDef {
  id: string
  name: string
  /** Per-voice sources differ per playing note; global sources are shared. */
  perVoice: boolean
  /** Bipolar sources emit -1..1, unipolar 0..1. */
  bipolar: boolean
}

export const MOD_SOURCES: readonly ModSourceDef[] = [
  ...Array.from({ length: 6 }, (_, i) => ({ id: `env${i + 1}`, name: `Env ${i + 1}`, perVoice: true, bipolar: false })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `lfo${i + 1}`, name: `LFO ${i + 1}`, perVoice: true, bipolar: false })),
  { id: 'velocity', name: 'Velocity', perVoice: true, bipolar: false },
  { id: 'keytrack', name: 'Key Track', perVoice: true, bipolar: true },
  { id: 'random', name: 'Random', perVoice: true, bipolar: false },
  ...Array.from({ length: 4 }, (_, i) => ({ id: `macro${i + 1}`, name: `Macro ${i + 1}`, perVoice: false, bipolar: false })),
  { id: 'modwheel', name: 'Mod Wheel', perVoice: false, bipolar: false },
  { id: 'pitchwheel', name: 'Pitch Whl', perVoice: false, bipolar: true },
  { id: 'aftertouch', name: 'Pressure', perVoice: false, bipolar: false }
]

export const NUM_MOD_SOURCES = MOD_SOURCES.length
export function modSourceIndex(id: string): number {
  const i = MOD_SOURCES.findIndex(s => s.id === id)
  if (i < 0) throw new Error(`unknown mod source: ${id}`)
  return i
}

export const MAX_MOD_SLOTS = 32
/** Cap on points per drawn LFO shape (evaluated per sample in the worklet). */
export const MAX_LFO_POINTS = 64
export const MAX_VOICES = 16
export const MAX_UNISON = 16

/** One point of an LFO curve. x,y in 0..1; power bends the segment AFTER this point. */
export interface LfoPoint {
  x: number
  y: number
  power: number // -1..1, 0 = linear
}

export interface ModSlotState {
  source: number // MOD_SOURCES index
  dest: number   // PARAMS index
  depth: number  // -1..1 in normalized param units
  enabled: boolean
}

export const FX_IDS = ['chorus', 'phaser', 'flanger', 'delay', 'reverb', 'eq', 'comp', 'fxdist'] as const
export type FxId = (typeof FX_IDS)[number]
export const DEFAULT_FX_ORDER: number[] = FX_IDS.map((_, i) => i)

// -------------------------------------------------- main thread -> worklet
export type ToWorklet =
  | { type: 'param'; index: number; value: number } // normalized 0..1
  | { type: 'noteOn'; note: number; velocity: number }
  | { type: 'noteOff'; note: number }
  | { type: 'sustain'; down: boolean }
  | { type: 'pitchBend'; value: number }   // -1..1
  | { type: 'modWheel'; value: number }    // 0..1
  | { type: 'aftertouch'; value: number }  // 0..1
  | { type: 'mod'; slot: number; state: ModSlotState | null }
  | { type: 'lfoShape'; lfo: number; points: LfoPoint[] }
  // `mips` holds numFrames * NUM_MIPS band-limited copies of each frame,
  // concatenated: mips[(frame * NUM_MIPS + mip) * frameSize ...]. Built on the
  // main thread (see shared/wavetable-gen.ts buildMips) and transferred.
  | { type: 'wavetable'; osc: number; frameSize: number; numFrames: number; mips: Float32Array }
  | { type: 'sample'; data: Float32Array; sampleRate: number }
  | { type: 'fxOrder'; order: number[] }
  | { type: 'allNotesOff' }

// -------------------------------------------------- worklet -> main thread
export type FromWorklet =
  | { type: 'ready' }
  | { type: 'scope'; left: Float32Array; right: Float32Array }
  | { type: 'status'; voices: number; peakL: number; peakR: number; sources: Float32Array }

export function defaultLfoShape(): LfoPoint[] {
  // A rising/falling triangle — a sensible visible default for a drawn LFO.
  return [
    { x: 0, y: 0, power: 0 },
    { x: 0.5, y: 1, power: 0 },
    { x: 1, y: 0, power: 0 }
  ]
}

/** Evaluate a multi-point LFO shape at phase 0..1. Shared by DSP and editor UI. */
export function evalLfoShape(points: LfoPoint[], phase: number): number {
  if (points.length === 0) return 0
  if (phase <= points[0].x) return points[0].y
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    if (phase <= b.x) {
      const span = b.x - a.x
      if (span <= 1e-9) return b.y
      let t = (phase - a.x) / span
      const pow = Math.pow(2, a.power * 4)
      t = Math.pow(t, pow)
      return a.y + (b.y - a.y) * t
    }
  }
  return points[points.length - 1].y
}
