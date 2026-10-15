// Validation for preset JSON coming from outside the app (file import and
// localStorage). Everything is rebuilt field by field from the parsed data,
// so a malformed or hostile file can't push NaNs, huge arrays or odd types
// into the engine and audio worklet.

import type { PresetData } from '../audio/engine'
import { MAX_LFO_POINTS, MAX_MOD_SLOTS, type LfoPoint } from '../shared/messages'

/**
 * Exported presets are ~9 KB (pretty-printed, all 223 params). A preset with
 * every mod slot used and every LFO at MAX_LFO_POINTS is ~50 KB, so 128 KB
 * leaves headroom while refusing anything absurd before it is read.
 */
export const MAX_PRESET_FILE_BYTES = 128 * 1024
export const MAX_PRESET_NAME_LENGTH = 64

const NUM_LFOS = 8
const MAX_PARAM_ENTRIES = 1024
const MAX_FX_ENTRIES = 32
const MAX_ID_LENGTH = 64
const JSON_MIME_TYPES = ['', 'application/json', 'text/json']

export class PresetError extends Error {}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function finite(v: unknown, what: string): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new PresetError(`${what} must be a finite number`)
  return v
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

function id(v: unknown, what: string): string {
  if (typeof v !== 'string' || v.length === 0 || v.length > MAX_ID_LENGTH) throw new PresetError(`${what} must be a short string`)
  return v
}

function array(v: unknown, max: number, what: string): unknown[] {
  if (!Array.isArray(v)) throw new PresetError(`${what} must be an array`)
  if (v.length > max) throw new PresetError(`${what} has too many entries (max ${max})`)
  return v
}

export function sanitizeName(v: unknown): string {
  // strip control characters; names end up in the UI and in select values
  const name = typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, '').trim() : ''
  return name.slice(0, MAX_PRESET_NAME_LENGTH) || 'Imported Patch'
}

function sanitizeLfoShape(v: unknown, l: number): LfoPoint[] {
  const pts = array(v, MAX_LFO_POINTS, `lfoShapes[${l}]`).map((p, i) => {
    if (!isObject(p)) throw new PresetError(`lfoShapes[${l}][${i}] must be an object`)
    return {
      x: clamp(finite(p.x, `lfoShapes[${l}][${i}].x`), 0, 1),
      y: clamp(finite(p.y, `lfoShapes[${l}][${i}].y`), 0, 1),
      power: clamp(finite(p.power ?? 0, `lfoShapes[${l}][${i}].power`), -1, 1)
    }
  })
  // evalLfoShape walks points left to right
  pts.sort((a, b) => a.x - b.x)
  return pts
}

/**
 * Rebuild a PresetData from untrusted parsed JSON. Throws PresetError when the
 * structure is wrong; unknown param/mod/fx ids are left for loadPreset to skip.
 */
export function sanitizePreset(raw: unknown): PresetData {
  if (!isObject(raw)) throw new PresetError('not a preset object')
  if (raw.version !== 1) throw new PresetError(`unsupported preset version: ${String(raw.version).slice(0, 16)}`)

  const params: Record<string, number> = {}
  if (raw.params !== undefined) {
    if (!isObject(raw.params)) throw new PresetError('params must be an object')
    const entries = Object.entries(raw.params)
    if (entries.length > MAX_PARAM_ENTRIES) throw new PresetError('too many params')
    for (const [k, v] of entries) params[id(k, 'param id')] = clamp(finite(v, `params.${k}`), 0, 1)
  }

  const mods =
    raw.mods === undefined
      ? []
      : array(raw.mods, MAX_MOD_SLOTS, 'mods').map((m, i) => {
          if (!isObject(m)) throw new PresetError(`mods[${i}] must be an object`)
          return {
            source: id(m.source, `mods[${i}].source`),
            dest: id(m.dest, `mods[${i}].dest`),
            depth: clamp(finite(m.depth, `mods[${i}].depth`), -1, 1),
            enabled: m.enabled !== false
          }
        })

  const lfoShapes = raw.lfoShapes === undefined ? [] : array(raw.lfoShapes, NUM_LFOS, 'lfoShapes').map(sanitizeLfoShape)

  const fxOrder =
    raw.fxOrder === undefined ? [] : array(raw.fxOrder, MAX_FX_ENTRIES, 'fxOrder').map((f, i) => id(f, `fxOrder[${i}]`))

  return { name: sanitizeName(raw.name), version: 1, params, mods, lfoShapes, fxOrder }
}

/** Check type and size of an imported file before reading it, then parse and validate. */
export async function readPresetFile(file: File): Promise<PresetData> {
  if (!/\.json$/i.test(file.name)) throw new PresetError('only .json preset files can be imported')
  if (!JSON_MIME_TYPES.includes(file.type)) throw new PresetError(`unexpected file type "${file.type}"`)
  if (file.size === 0) throw new PresetError('file is empty')
  if (file.size > MAX_PRESET_FILE_BYTES) {
    throw new PresetError(`file is too large (${Math.ceil(file.size / 1024)} KB, max ${MAX_PRESET_FILE_BYTES / 1024} KB)`)
  }
  const text = (await file.text()).replace(/^﻿/, '')
  if (!text.trimStart().startsWith('{')) throw new PresetError('file is not a JSON preset')
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new PresetError('file is not valid JSON')
  }
  return sanitizePreset(raw)
}
