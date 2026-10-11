// Preset browser: factory presets, localStorage user presets, JSON file
// export/import.

import { paramDef, valueToNorm } from '../shared/params'
import type { SynthEngine, PresetData } from '../audio/engine'
import { el } from './common'

const STORAGE_KEY = 'soundgineer.presets.v1'

/** Convenience: author factory presets in raw units, store normalized. */
function P(raw: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [id, v] of Object.entries(raw)) out[id] = valueToNorm(paramDef(id), v)
  return out
}

const FACTORY: Partial<PresetData>[] = [
  { name: 'Init', params: {} },
  {
    name: 'Deep Saw Bass',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.7, 'osc1.unison': 5, 'osc1.detune': 9,
      'osc1.transpose': -12, 'osc1.level': 0.8, 'sub.enabled': 1, 'sub.level': 0.7, 'sub.octave': -1,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 300, 'filter1.resonance': 0.35, 'filter1.drive': 0.3,
      'env1.attack': 0.003, 'env1.decay': 0.4, 'env1.sustain': 0.9, 'env1.release': 0.12,
      'env2.attack': 0.003, 'env2.decay': 0.35, 'env2.sustain': 0.15, 'env2.release': 0.1,
      'dist.type': 1, 'dist.drive': 0.25
    }),
    mods: [{ source: 'env2', dest: 'filter1.cutoff', depth: 0.45, enabled: true }]
  },
  {
    name: 'Morphing Pad',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 3, 'osc1.unison': 7, 'osc1.detune': 16, 'osc1.spread': 0.9, 'osc1.level': 0.55,
      'osc2.enabled': 1, 'osc2.wavetable': 1, 'osc2.unison': 5, 'osc2.detune': 12, 'osc2.transpose': 12, 'osc2.level': 0.3,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 2200, 'filter1.resonance': 0.15,
      'env1.attack': 0.9, 'env1.decay': 1.5, 'env1.sustain': 0.8, 'env1.release': 1.8,
      'lfo1.rate': 0.12, 'lfo1.sync': 0,
      'chorus.enabled': 1, 'chorus.mix': 0.4, 'reverb.enabled': 1, 'reverb.size': 0.85, 'reverb.mix': 0.35
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.6, enabled: true },
      { source: 'lfo2', dest: 'osc2.morph', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'Sync Pluck',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.55, 'osc1.sync': 1,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 900, 'filter1.resonance': 0.3, 'filter1.keytrack': 1,
      'env1.attack': 0.002, 'env1.decay': 0.5, 'env1.sustain': 0, 'env1.release': 0.4,
      'env2.attack': 0.001, 'env2.decay': 0.25, 'env2.sustain': 0, 'env2.release': 0.2,
      'delay.enabled': 1, 'delay.mix': 0.25, 'delay.feedback': 0.35,
      'reverb.enabled': 1, 'reverb.mix': 0.2
    }),
    mods: [
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.5, enabled: true },
      { source: 'env2', dest: 'osc1.sync', depth: 0.5, enabled: true },
      { source: 'velocity', dest: 'filter1.cutoff', depth: 0.25, enabled: true }
    ]
  },
  {
    name: 'PWM Keys',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 2, 'osc1.morph': 0.3, 'osc1.unison': 3, 'osc1.detune': 6,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 5000,
      'env1.attack': 0.01, 'env1.decay': 0.8, 'env1.sustain': 0.6, 'env1.release': 0.5,
      'lfo1.rate': 0.6, 'lfo1.sync': 0,
      'chorus.enabled': 1, 'chorus.mix': 0.35, 'eq.enabled': 1, 'eq.high_gain': 2
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.35, enabled: true },
      { source: 'modwheel', dest: 'osc1.morph', depth: 0.5, enabled: true }
    ]
  },

  // ------------------------------------------------------------------ bass
  {
    name: 'Reese Bass',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.7, 'osc1.unison': 2, 'osc1.detune': 35,
      'osc1.blend': 1, 'osc1.spread': 0, 'osc1.transpose': -12, 'osc1.level': 0.6,
      'osc2.enabled': 1, 'osc2.wavetable': 0, 'osc2.morph': 0.7, 'osc2.transpose': -12, 'osc2.fine': 12, 'osc2.level': 0.5,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 700, 'filter1.resonance': 0.1, 'filter1.drive': 0.4,
      'env1.attack': 0.003, 'env1.decay': 0.5, 'env1.sustain': 1, 'env1.release': 0.15,
      'dist.type': 1, 'dist.drive': 0.3, 'eq.enabled': 1, 'eq.low_gain': 2
    }),
    mods: [{ source: 'modwheel', dest: 'filter1.cutoff', depth: 0.3, enabled: true }]
  },
  {
    name: 'Acid Squelch',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.7, 'osc1.transpose': -12, 'osc1.level': 0.75,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 350, 'filter1.resonance': 0.75,
      'filter1.drive': 0.5, 'filter1.keytrack': 0.5,
      'env1.attack': 0.002, 'env1.decay': 0.3, 'env1.sustain': 0.6, 'env1.release': 0.08,
      'env2.attack': 0.001, 'env2.decay': 0.18, 'env2.sustain': 0, 'env2.release': 0.1,
      'dist.type': 1, 'dist.drive': 0.35,
      'delay.enabled': 1, 'delay.division': 7, 'delay.mix': 0.18, 'delay.feedback': 0.3
    }),
    mods: [
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.4, enabled: true },
      { source: 'velocity', dest: 'filter1.cutoff', depth: 0.2, enabled: true },
      { source: 'modwheel', dest: 'filter1.resonance', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'Wobble Bass',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 5, 'osc1.morph': 0.4, 'osc1.transpose': -12, 'osc1.level': 0.8,
      'sub.enabled': 1, 'sub.shape': 0, 'sub.octave': -1, 'sub.level': 0.6,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 400, 'filter1.resonance': 0.4, 'filter1.drive': 0.3,
      'env1.attack': 0.002, 'env1.decay': 0.4, 'env1.sustain': 1, 'env1.release': 0.1,
      'lfo1.sync': 1, 'lfo1.division': 4,
      'dist.type': 1, 'dist.drive': 0.3
    }),
    mods: [
      { source: 'lfo1', dest: 'filter1.cutoff', depth: 0.5, enabled: true },
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'FM Knock',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 4, 'osc1.morph': 0.25, 'osc1.transpose': -12, 'osc1.level': 0.8,
      'sub.enabled': 1, 'sub.shape': 0, 'sub.octave': -1, 'sub.level': 0.7,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 1200,
      'env1.attack': 0.001, 'env1.decay': 0.35, 'env1.sustain': 0, 'env1.release': 0.2,
      'env2.attack': 0.001, 'env2.decay': 0.08, 'env2.sustain': 0, 'env2.release': 0.05
    }),
    mods: [
      { source: 'env2', dest: 'osc1.morph', depth: 0.5, enabled: true },
      { source: 'env2', dest: 'osc1.transpose', depth: 0.15, enabled: true },
      { source: 'velocity', dest: 'osc1.morph', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'Solid Square',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 2, 'osc1.morph': 0.15, 'osc1.transpose': -12, 'osc1.level': 0.55,
      'sub.enabled': 1, 'sub.shape': 0, 'sub.octave': -1, 'sub.level': 0.65,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 2500,
      'env1.attack': 0.003, 'env1.decay': 0.4, 'env1.sustain': 0.9, 'env1.release': 0.12,
      'eq.enabled': 1, 'eq.low_gain': 3
    }),
    mods: [{ source: 'modwheel', dest: 'osc1.morph', depth: 0.4, enabled: true }]
  },
  {
    name: 'Neuro Growl',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 3, 'osc1.morph': 0.3, 'osc1.transpose': -12, 'osc1.level': 0.8,
      'osc2.enabled': 1, 'osc2.wavetable': 5, 'osc2.morph': 0.5, 'osc2.transpose': -12, 'osc2.level': 0.5,
      'filter1.enabled': 1, 'filter1.type': 8, 'filter1.cutoff': 800, 'filter1.resonance': 0.5, 'filter1.mix': 0.8,
      'filter2.enabled': 1, 'filter2.type': 1, 'filter2.cutoff': 900, 'filter2.resonance': 0.2,
      'env1.attack': 0.002, 'env1.decay': 0.4, 'env1.sustain': 1, 'env1.release': 0.1,
      'lfo1.sync': 1, 'lfo1.division': 1, 'lfo2.sync': 1, 'lfo2.division': 7,
      'dist.type': 3, 'dist.drive': 0.35, 'dist.mix': 0.7
    }),
    mods: [
      { source: 'lfo1', dest: 'filter1.cutoff', depth: 0.45, enabled: true },
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.5, enabled: true },
      { source: 'lfo2', dest: 'osc2.morph', depth: 0.25, enabled: true }
    ]
  },
  {
    name: '808 Drop',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0, 'osc1.transpose': -12, 'osc1.level': 0.9,
      'env1.attack': 0.001, 'env1.decay': 1.2, 'env1.sustain': 0.4, 'env1.release': 0.3,
      'env2.attack': 0.001, 'env2.decay': 0.09, 'env2.sustain': 0, 'env2.release': 0.05,
      'dist.type': 1, 'dist.drive': 0.2
    }),
    mods: [
      { source: 'env2', dest: 'osc1.transpose', depth: 0.25, enabled: true },
      { source: 'velocity', dest: 'dist.drive', depth: 0.2, enabled: true }
    ]
  },

  {
    name: 'Pulse Sub',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 2, 'osc1.morph': 0.45, 'osc1.transpose': -12, 'osc1.level': 0.5,
      'sub.enabled': 1, 'sub.shape': 1, 'sub.octave': -1, 'sub.level': 0.75,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 600, 'filter1.resonance': 0.2,
      'env1.attack': 0.002, 'env1.decay': 0.3, 'env1.sustain': 0.85, 'env1.release': 0.1,
      'env2.attack': 0.001, 'env2.decay': 0.22, 'env2.sustain': 0.1, 'env2.release': 0.1,
      'lfo1.sync': 1, 'lfo1.division': 10,
      'comp.enabled': 1, 'comp.threshold': -20, 'comp.ratio': 4, 'comp.makeup': 4
    }),
    mods: [
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.3, enabled: true },
      { source: 'macro1', dest: 'osc1.morph', depth: 0.4, enabled: true },
      { source: 'macro2', dest: 'filter1.cutoff', depth: 0.35, enabled: true }
    ]
  },
  {
    name: 'Fold Bass',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0, 'osc1.transpose': -12, 'osc1.level': 0.7,
      'sub.enabled': 1, 'sub.shape': 0, 'sub.octave': -1, 'sub.level': 0.5,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 2500, 'filter1.resonance': 0.15,
      'env1.attack': 0.002, 'env1.decay': 0.4, 'env1.sustain': 0.9, 'env1.release': 0.12,
      'env2.attack': 0.001, 'env2.decay': 0.3, 'env2.sustain': 0.2, 'env2.release': 0.1,
      'dist.type': 3, 'dist.drive': 0.3, 'dist.mix': 1,
      'comp.enabled': 1, 'comp.threshold': -16, 'comp.ratio': 3, 'comp.makeup': 3
    }),
    mods: [
      { source: 'env2', dest: 'dist.drive', depth: 0.4, enabled: true },
      { source: 'modwheel', dest: 'dist.drive', depth: 0.4, enabled: true },
      { source: 'velocity', dest: 'filter1.cutoff', depth: 0.2, enabled: true }
    ]
  },
  {
    name: 'Mid Bass Formant',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.7, 'osc1.unison': 3, 'osc1.detune': 14,
      'osc1.spread': 0.4, 'osc1.transpose': -12, 'osc1.level': 0.7,
      'sub.enabled': 1, 'sub.shape': 0, 'sub.octave': -1, 'sub.level': 0.6,
      'filter1.enabled': 1, 'filter1.type': 8, 'filter1.cutoff': 600, 'filter1.resonance': 0.55, 'filter1.mix': 0.85,
      'env1.attack': 0.002, 'env1.decay': 0.4, 'env1.sustain': 1, 'env1.release': 0.1,
      'lfo1.sync': 1, 'lfo1.division': 5,
      'fxdist.enabled': 1, 'fxdist.drive': 0.45, 'fxdist.tone': 6000, 'fxdist.mix': 0.6,
      'comp.enabled': 1, 'comp.threshold': -18, 'comp.ratio': 5, 'comp.makeup': 4
    }),
    mods: [
      { source: 'lfo1', dest: 'filter1.cutoff', depth: 0.35, enabled: true },
      { source: 'modwheel', dest: 'lfo1.rate', depth: 0.3, enabled: true },
      { source: 'macro1', dest: 'filter1.resonance', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'Rumble Sine',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0, 'osc1.transpose': -12, 'osc1.level': 0.85,
      'osc2.enabled': 1, 'osc2.wavetable': 1, 'osc2.morph': 0.2, 'osc2.level': 0.15,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 900,
      'env1.attack': 0.004, 'env1.decay': 0.6, 'env1.sustain': 0.9, 'env1.release': 0.25,
      'fxdist.enabled': 1, 'fxdist.drive': 0.3, 'fxdist.tone': 2500, 'fxdist.mix': 0.5,
      'eq.enabled': 1, 'eq.low_gain': 2, 'eq.mid_gain': -2, 'eq.mid_freq': 400
    }),
    mods: [
      { source: 'velocity', dest: 'osc2.level', depth: 0.2, enabled: true },
      { source: 'modwheel', dest: 'fxdist.drive', depth: 0.5, enabled: true }
    ]
  },

  // ------------------------------------------------------------------ leads
  {
    name: 'Super Saw Lead',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.7, 'osc1.unison': 7, 'osc1.detune': 20,
      'osc1.spread': 1, 'osc1.blend': 0.8, 'osc1.level': 0.6,
      'osc2.enabled': 1, 'osc2.wavetable': 0, 'osc2.morph': 0.7, 'osc2.unison': 7, 'osc2.detune': 25,
      'osc2.transpose': 12, 'osc2.spread': 1, 'osc2.level': 0.35,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 9000,
      'env1.attack': 0.005, 'env1.decay': 0.5, 'env1.sustain': 0.85, 'env1.release': 0.3,
      'lfo1.sync': 0, 'lfo1.rate': 5.5,
      'delay.enabled': 1, 'delay.division': 7, 'delay.mix': 0.2,
      'reverb.enabled': 1, 'reverb.size': 0.6, 'reverb.mix': 0.2, 'eq.enabled': 1, 'eq.high_gain': 2
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.fine', depth: 0.03, enabled: true },
      { source: 'lfo1', dest: 'osc2.fine', depth: 0.03, enabled: true }
    ]
  },
  {
    name: 'Sync Screamer',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 1, 'osc1.morph': 0.4, 'osc1.level': 0.75,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 3500, 'filter1.resonance': 0.25, 'filter1.drive': 0.5,
      'env1.attack': 0.002, 'env1.decay': 0.4, 'env1.sustain': 1, 'env1.release': 0.25,
      'env2.attack': 0.001, 'env2.decay': 0.6, 'env2.sustain': 0.3, 'env2.release': 0.3,
      'lfo1.sync': 0, 'lfo1.rate': 6,
      'dist.type': 2, 'dist.drive': 0.25,
      'delay.enabled': 1, 'delay.division': 7, 'delay.mix': 0.22
    }),
    mods: [
      { source: 'env2', dest: 'osc1.sync', depth: 0.6, enabled: true },
      { source: 'modwheel', dest: 'osc1.sync', depth: 0.4, enabled: true },
      { source: 'lfo1', dest: 'osc1.fine', depth: 0.04, enabled: true }
    ]
  },
  {
    name: 'Breath Flute',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.05, 'osc1.level': 0.6,
      'noise.enabled': 1, 'noise.type': 1, 'noise.level': 0.15,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 4000, 'filter1.keytrack': 0.6,
      'env1.attack': 0.06, 'env1.decay': 0.4, 'env1.sustain': 0.85, 'env1.release': 0.25,
      'lfo1.sync': 0, 'lfo1.rate': 5,
      'reverb.enabled': 1, 'reverb.mix': 0.25
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.fine', depth: 0.035, enabled: true },
      { source: 'lfo1', dest: 'osc1.level', depth: 0.08, enabled: true },
      { source: 'aftertouch', dest: 'osc1.level', depth: 0.1, enabled: true }
    ]
  },
  {
    name: 'Chip Lead',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 2, 'osc1.morph': 0, 'osc1.phase_rand': 0, 'osc1.level': 0.65,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 12000,
      'env1.attack': 0.001, 'env1.decay': 0.3, 'env1.sustain': 1, 'env1.release': 0.05,
      'lfo1.sync': 0, 'lfo1.rate': 6.5,
      'dist.type': 4, 'dist.bits': 6, 'dist.downsample': 6, 'dist.mix': 0.8,
      'delay.enabled': 1, 'delay.division': 7, 'delay.mix': 0.25, 'delay.feedback': 0.25
    }),
    mods: [{ source: 'lfo1', dest: 'osc1.fine', depth: 0.04, enabled: true }]
  },
  {
    name: 'Vox Lead',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 3, 'osc1.morph': 0.4, 'osc1.unison': 3, 'osc1.detune': 8, 'osc1.level': 0.7,
      'filter1.enabled': 1, 'filter1.type': 8, 'filter1.cutoff': 1200, 'filter1.resonance': 0.4, 'filter1.mix': 0.9,
      'env1.attack': 0.02, 'env1.decay': 0.5, 'env1.sustain': 0.9, 'env1.release': 0.3,
      'lfo1.sync': 0, 'lfo1.rate': 0.4, 'lfo2.sync': 0, 'lfo2.rate': 5.2,
      'chorus.enabled': 1, 'chorus.mix': 0.3, 'reverb.enabled': 1, 'reverb.mix': 0.25
    }),
    mods: [
      { source: 'modwheel', dest: 'osc1.morph', depth: 0.5, enabled: true },
      { source: 'lfo1', dest: 'filter1.cutoff', depth: 0.15, enabled: true },
      { source: 'lfo2', dest: 'osc1.fine', depth: 0.03, enabled: true }
    ]
  },
  {
    name: 'Crystal Bell',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 4, 'osc1.morph': 0.25, 'osc1.level': 0.65,
      'osc2.enabled': 1, 'osc2.wavetable': 4, 'osc2.morph': 0.7, 'osc2.transpose': 12, 'osc2.level': 0.3,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 9000,
      'env1.attack': 0.002, 'env1.decay': 1.8, 'env1.sustain': 0, 'env1.release': 1.2,
      'env2.attack': 0.001, 'env2.decay': 1.2, 'env2.sustain': 0, 'env2.release': 0.8,
      'delay.enabled': 1, 'delay.division': 6, 'delay.pingpong': 1, 'delay.mix': 0.3,
      'reverb.enabled': 1, 'reverb.size': 0.8, 'reverb.mix': 0.35
    }),
    mods: [
      { source: 'env2', dest: 'osc1.morph', depth: 0.35, enabled: true },
      { source: 'velocity', dest: 'osc1.morph', depth: 0.2, enabled: true }
    ]
  },

  {
    name: 'Trance Pluck Lead',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.7, 'osc1.unison': 9, 'osc1.detune': 22,
      'osc1.spread': 1, 'osc1.level': 0.6,
      'osc2.enabled': 1, 'osc2.wavetable': 2, 'osc2.morph': 0.2, 'osc2.transpose': 12, 'osc2.level': 0.25,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 1500, 'filter1.resonance': 0.2, 'filter1.keytrack': 0.5,
      'env1.attack': 0.002, 'env1.decay': 0.6, 'env1.sustain': 0.35, 'env1.release': 0.35,
      'env2.attack': 0.001, 'env2.decay': 0.3, 'env2.sustain': 0.1, 'env2.release': 0.2,
      'delay.enabled': 1, 'delay.division': 6, 'delay.pingpong': 1, 'delay.mix': 0.28, 'delay.feedback': 0.4,
      'reverb.enabled': 1, 'reverb.size': 0.75, 'reverb.mix': 0.25
    }),
    mods: [
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.45, enabled: true },
      { source: 'macro1', dest: 'env1.sustain', depth: 0.5, enabled: true },
      { source: 'macro2', dest: 'reverb.mix', depth: 0.35, enabled: true }
    ]
  },
  {
    name: 'Fuzz Mono',
    params: P({
      'master.polyphony': 1,
      'osc1.enabled': 1, 'osc1.wavetable': 2, 'osc1.morph': 0.2, 'osc1.level': 0.7,
      'osc2.enabled': 1, 'osc2.wavetable': 0, 'osc2.morph': 0.7, 'osc2.transpose': -12, 'osc2.fine': 6, 'osc2.level': 0.4,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 2800, 'filter1.resonance': 0.3,
      'env1.attack': 0.003, 'env1.decay': 0.4, 'env1.sustain': 1, 'env1.release': 0.15,
      'lfo1.sync': 0, 'lfo1.rate': 5.5,
      'fxdist.enabled': 1, 'fxdist.drive': 0.7, 'fxdist.tone': 4500, 'fxdist.mix': 0.8,
      'delay.enabled': 1, 'delay.division': 4, 'delay.mix': 0.18
    }),
    mods: [
      { source: 'aftertouch', dest: 'filter1.cutoff', depth: 0.25, enabled: true },
      { source: 'lfo1', dest: 'osc1.fine', depth: 0.03, enabled: true },
      { source: 'macro1', dest: 'fxdist.drive', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'Jet Lead',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.7, 'osc1.unison': 3, 'osc1.detune': 10, 'osc1.level': 0.65,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 4000, 'filter1.resonance': 0.2,
      'env1.attack': 0.005, 'env1.decay': 0.5, 'env1.sustain': 0.9, 'env1.release': 0.3,
      'flanger.enabled': 1, 'flanger.rate': 0.15, 'flanger.depth': 0.8, 'flanger.feedback': 0.75, 'flanger.mix': 0.55,
      'delay.enabled': 1, 'delay.division': 7, 'delay.mix': 0.2,
      'reverb.enabled': 1, 'reverb.mix': 0.2
    }),
    mods: [
      { source: 'modwheel', dest: 'flanger.feedback', depth: 0.2, enabled: true },
      { source: 'velocity', dest: 'filter1.cutoff', depth: 0.2, enabled: true }
    ]
  },
  {
    name: 'Glass Whistle',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 1, 'osc1.morph': 0.05, 'osc1.transpose': 12, 'osc1.level': 0.55,
      'osc2.enabled': 1, 'osc2.wavetable': 4, 'osc2.morph': 0.15, 'osc2.transpose': 24, 'osc2.level': 0.12,
      'filter1.enabled': 1, 'filter1.type': 4, 'filter1.cutoff': 3000, 'filter1.resonance': 0.3, 'filter1.keytrack': 1,
      'env1.attack': 0.08, 'env1.decay': 0.5, 'env1.sustain': 0.85, 'env1.release': 0.5,
      'env3.delay': 0.25, 'env3.attack': 0.6, 'env3.sustain': 1,
      'lfo1.sync': 0, 'lfo1.rate': 5.8,
      'delay.enabled': 1, 'delay.division': 3, 'delay.pingpong': 1, 'delay.mix': 0.25,
      'reverb.enabled': 1, 'reverb.size': 0.85, 'reverb.mix': 0.35
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.fine', depth: 0.04, enabled: true },
      { source: 'env3', dest: 'osc2.level', depth: 0.15, enabled: true },
      { source: 'modwheel', dest: 'osc2.level', depth: 0.3, enabled: true }
    ]
  },

  // ------------------------------------------------------------------ pads
  {
    name: 'Warm Analog Pad',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.65, 'osc1.unison': 5, 'osc1.detune': 10,
      'osc1.blend': 0.8, 'osc1.level': 0.55,
      'osc2.enabled': 1, 'osc2.wavetable': 0, 'osc2.morph': 0.65, 'osc2.unison': 3, 'osc2.detune': 7,
      'osc2.transpose': -12, 'osc2.level': 0.4,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 1800, 'filter1.resonance': 0.1,
      'env1.attack': 1.2, 'env1.decay': 2, 'env1.sustain': 0.8, 'env1.release': 2.2,
      'lfo1.sync': 0, 'lfo1.rate': 0.07, 'lfo1.mode': 1,
      'chorus.enabled': 1, 'chorus.mix': 0.4, 'reverb.enabled': 1, 'reverb.size': 0.7, 'reverb.mix': 0.3
    }),
    mods: [{ source: 'lfo1', dest: 'filter1.cutoff', depth: 0.12, enabled: true }]
  },
  {
    name: 'Choir Pad',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 3, 'osc1.morph': 0.55, 'osc1.unison': 5, 'osc1.detune': 9,
      'osc1.spread': 0.8, 'osc1.level': 0.6,
      'filter1.enabled': 1, 'filter1.type': 8, 'filter1.cutoff': 900, 'filter1.resonance': 0.35, 'filter1.mix': 0.85,
      'env1.attack': 0.8, 'env1.decay': 1.5, 'env1.sustain': 0.85, 'env1.release': 1.6,
      'lfo1.sync': 0, 'lfo1.rate': 0.09, 'lfo1.mode': 1, 'lfo2.sync': 0, 'lfo2.rate': 0.13, 'lfo2.mode': 1,
      'chorus.enabled': 1, 'chorus.mix': 0.3, 'reverb.enabled': 1, 'reverb.size': 0.85, 'reverb.mix': 0.4
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.3, enabled: true },
      { source: 'lfo2', dest: 'filter1.cutoff', depth: 0.15, enabled: true }
    ]
  },
  {
    name: 'Shimmer Pad',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 1, 'osc1.morph': 0.3, 'osc1.unison': 5, 'osc1.detune': 12, 'osc1.level': 0.5,
      'osc2.enabled': 1, 'osc2.wavetable': 1, 'osc2.morph': 0.5, 'osc2.unison': 3, 'osc2.detune': 10,
      'osc2.transpose': 19, 'osc2.level': 0.25,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 6000,
      'env1.attack': 1.5, 'env1.decay': 2, 'env1.sustain': 0.8, 'env1.release': 3,
      'lfo1.sync': 0, 'lfo1.rate': 0.06, 'lfo1.mode': 1, 'lfo2.sync': 0, 'lfo2.rate': 0.08, 'lfo2.mode': 1,
      'delay.enabled': 1, 'delay.division': 3, 'delay.mix': 0.25,
      'reverb.enabled': 1, 'reverb.size': 0.95, 'reverb.damp': 0.2, 'reverb.mix': 0.5
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.4, enabled: true },
      { source: 'lfo2', dest: 'osc2.morph', depth: 0.35, enabled: true }
    ]
  },
  {
    name: 'Dark Matter',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 5, 'osc1.morph': 0.2, 'osc1.unison': 3, 'osc1.detune': 8,
      'osc1.transpose': -12, 'osc1.level': 0.55,
      'sub.enabled': 1, 'sub.shape': 1, 'sub.octave': -1, 'sub.level': 0.4,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 700, 'filter1.resonance': 0.3, 'filter1.drive': 0.2,
      'env1.attack': 2, 'env1.decay': 2, 'env1.sustain': 0.85, 'env1.release': 3,
      'lfo1.sync': 0, 'lfo1.rate': 0.05, 'lfo1.mode': 1,
      'phaser.enabled': 1, 'phaser.rate': 0.08, 'phaser.mix': 0.3,
      'reverb.enabled': 1, 'reverb.size': 0.9, 'reverb.damp': 0.7, 'reverb.mix': 0.4
    }),
    mods: [
      { source: 'lfo1', dest: 'filter1.cutoff', depth: 0.18, enabled: true },
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.15, enabled: true }
    ]
  },
  {
    name: 'Glass Pad',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 4, 'osc1.morph': 0.35, 'osc1.unison': 4, 'osc1.detune': 6, 'osc1.level': 0.5,
      'osc2.enabled': 1, 'osc2.wavetable': 0, 'osc2.morph': 0, 'osc2.transpose': 12, 'osc2.level': 0.3,
      'filter1.enabled': 1, 'filter1.type': 4, 'filter1.cutoff': 2500, 'filter1.resonance': 0.2, 'filter1.mix': 0.7,
      'env1.attack': 0.9, 'env1.decay': 1.5, 'env1.sustain': 0.8, 'env1.release': 2,
      'lfo1.sync': 0, 'lfo1.rate': 0.1, 'lfo1.mode': 1,
      'chorus.enabled': 1, 'chorus.mix': 0.45, 'reverb.enabled': 1, 'reverb.mix': 0.35
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.3, enabled: true },
      { source: 'keytrack', dest: 'filter1.cutoff', depth: 0.2, enabled: true }
    ]
  },
  {
    name: 'Aurora Texture',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 1, 'osc1.morph': 0.2, 'osc1.unison': 3, 'osc1.spread': 1, 'osc1.level': 0.45,
      'osc2.enabled': 1, 'osc2.wavetable': 3, 'osc2.morph': 0.6, 'osc2.fine': 8, 'osc2.level': 0.4,
      'osc3.enabled': 1, 'osc3.wavetable': 5, 'osc3.morph': 0.5, 'osc3.transpose': 12, 'osc3.level': 0.2,
      'filter.routing': 1,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 3000,
      'filter2.enabled': 1, 'filter2.type': 4, 'filter2.cutoff': 1200, 'filter2.resonance': 0.4,
      'env1.attack': 2.5, 'env1.decay': 2, 'env1.sustain': 0.9, 'env1.release': 4,
      'lfo1.sync': 0, 'lfo1.rate': 0.04, 'lfo1.mode': 1, 'lfo2.sync': 0, 'lfo2.rate': 0.07, 'lfo2.mode': 1,
      'lfo3.sync': 0, 'lfo3.rate': 0.05, 'lfo3.mode': 1, 'lfo4.sync': 0, 'lfo4.rate': 0.03, 'lfo4.mode': 1,
      'phaser.enabled': 1, 'phaser.rate': 0.3, 'phaser.mix': 0.4,
      'reverb.enabled': 1, 'reverb.size': 0.9, 'reverb.mix': 0.5
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.5, enabled: true },
      { source: 'lfo2', dest: 'osc2.morph', depth: 0.4, enabled: true },
      { source: 'lfo3', dest: 'osc3.morph', depth: 0.5, enabled: true },
      { source: 'lfo4', dest: 'filter2.cutoff', depth: 0.25, enabled: true }
    ]
  },

  {
    name: 'Phase Cathedral',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 1, 'osc1.morph': 0.35, 'osc1.unison': 6, 'osc1.detune': 14, 'osc1.spread': 1, 'osc1.level': 0.5,
      'osc2.enabled': 1, 'osc2.wavetable': 3, 'osc2.morph': 0.6, 'osc2.transpose': 7, 'osc2.unison': 3, 'osc2.detune': 10, 'osc2.level': 0.25,
      'osc3.enabled': 1, 'osc3.wavetable': 0, 'osc3.morph': 0, 'osc3.transpose': -12, 'osc3.level': 0.3,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 2600, 'filter1.resonance': 0.1,
      'env1.attack': 1.6, 'env1.decay': 2, 'env1.sustain': 0.85, 'env1.release': 3,
      'lfo1.sync': 0, 'lfo1.rate': 0.09, 'lfo1.mode': 1,
      'phaser.enabled': 1, 'phaser.rate': 0.12, 'phaser.depth': 0.8, 'phaser.feedback': 0.55, 'phaser.mix': 0.5,
      'reverb.enabled': 1, 'reverb.size': 0.95, 'reverb.damp': 0.35, 'reverb.mix': 0.45
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.3, enabled: true },
      { source: 'macro1', dest: 'filter1.cutoff', depth: 0.35, enabled: true },
      { source: 'macro2', dest: 'osc2.level', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'Jet Stream Pad',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.7, 'osc1.unison': 8, 'osc1.detune': 18, 'osc1.spread': 1, 'osc1.level': 0.5,
      'noise.enabled': 1, 'noise.type': 1, 'noise.level': 0.08,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 1400, 'filter1.resonance': 0.25,
      'env1.attack': 0.8, 'env1.decay': 1.5, 'env1.sustain': 0.9, 'env1.release': 2,
      'lfo1.sync': 0, 'lfo1.rate': 0.05, 'lfo1.mode': 1,
      'flanger.enabled': 1, 'flanger.rate': 0.06, 'flanger.depth': 0.9, 'flanger.feedback': 0.7, 'flanger.mix': 0.5,
      'reverb.enabled': 1, 'reverb.size': 0.85, 'reverb.mix': 0.35
    }),
    mods: [
      { source: 'lfo1', dest: 'filter1.cutoff', depth: 0.25, enabled: true },
      { source: 'modwheel', dest: 'filter1.cutoff', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'Granite Drone',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 5, 'osc1.morph': 0.2, 'osc1.transpose': -12, 'osc1.unison': 4, 'osc1.detune': 25, 'osc1.level': 0.55,
      'osc2.enabled': 1, 'osc2.wavetable': 1, 'osc2.morph': 0.5, 'osc2.transpose': 7, 'osc2.level': 0.3,
      'sub.enabled': 1, 'sub.shape': 0, 'sub.octave': -2, 'sub.level': 0.4,
      'filter1.enabled': 1, 'filter1.type': 7, 'filter1.cutoff': 300, 'filter1.resonance': 0.6, 'filter1.mix': 0.6,
      'filter2.enabled': 1, 'filter2.type': 1, 'filter2.cutoff': 1600, 'filter2.resonance': 0.2,
      'env1.attack': 2.5, 'env1.decay': 2, 'env1.sustain': 1, 'env1.release': 4,
      'lfo1.sync': 0, 'lfo1.rate': 0.03, 'lfo1.mode': 1, 'lfo2.sync': 0, 'lfo2.rate': 0.07, 'lfo2.mode': 1,
      'fxdist.enabled': 1, 'fxdist.drive': 0.3, 'fxdist.tone': 3000, 'fxdist.mix': 0.4,
      'reverb.enabled': 1, 'reverb.size': 1, 'reverb.damp': 0.7, 'reverb.mix': 0.5
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.5, enabled: true },
      { source: 'lfo2', dest: 'filter1.cutoff', depth: 0.3, enabled: true },
      { source: 'macro1', dest: 'fxdist.drive', depth: 0.5, enabled: true }
    ]
  },
  {
    name: 'Velvet Strings',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.68, 'osc1.unison': 6, 'osc1.detune': 12, 'osc1.spread': 0.9, 'osc1.level': 0.55,
      'osc2.enabled': 1, 'osc2.wavetable': 2, 'osc2.morph': 0.35, 'osc2.transpose': 12, 'osc2.unison': 4, 'osc2.detune': 9, 'osc2.level': 0.2,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 3200, 'filter1.resonance': 0.05, 'filter1.keytrack': 0.4,
      'env1.attack': 0.35, 'env1.decay': 1, 'env1.sustain': 0.9, 'env1.release': 1.2,
      'lfo1.sync': 0, 'lfo1.rate': 4.8,
      'chorus.enabled': 1, 'chorus.depth': 0.6, 'chorus.mix': 0.45,
      'eq.enabled': 1, 'eq.mid_gain': -3, 'eq.mid_freq': 600,
      'reverb.enabled': 1, 'reverb.size': 0.8, 'reverb.mix': 0.3
    }),
    mods: [
      { source: 'velocity', dest: 'env1.attack', depth: -0.2, enabled: true },
      { source: 'aftertouch', dest: 'filter1.cutoff', depth: 0.2, enabled: true },
      { source: 'lfo1', dest: 'osc1.fine', depth: 0.02, enabled: true }
    ]
  },

  // ------------------------------------------------------------------ keys
  {
    name: 'Lo-Fi EP',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 4, 'osc1.morph': 0.25, 'osc1.level': 0.7,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 5000, 'filter1.keytrack': 0.4,
      'env1.attack': 0.002, 'env1.decay': 1.5, 'env1.sustain': 0.35, 'env1.release': 0.4,
      'lfo1.sync': 0, 'lfo1.rate': 4.5, 'lfo1.mode': 1,
      'dist.type': 4, 'dist.bits': 10, 'dist.downsample': 2, 'dist.mix': 0.5,
      'chorus.enabled': 1, 'chorus.mix': 0.35, 'reverb.enabled': 1, 'reverb.mix': 0.18
    }),
    mods: [
      { source: 'velocity', dest: 'filter1.cutoff', depth: 0.25, enabled: true },
      { source: 'velocity', dest: 'osc1.morph', depth: 0.15, enabled: true },
      { source: 'lfo1', dest: 'osc1.pan', depth: 0.25, enabled: true }
    ]
  },
  {
    name: 'Drawbar Organ',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0, 'osc1.level': 0.5,
      'osc2.enabled': 1, 'osc2.wavetable': 0, 'osc2.morph': 0, 'osc2.transpose': 12, 'osc2.level': 0.35,
      'osc3.enabled': 1, 'osc3.wavetable': 0, 'osc3.morph': 0, 'osc3.transpose': 19, 'osc3.level': 0.25,
      'sub.enabled': 1, 'sub.shape': 0, 'sub.octave': -1, 'sub.level': 0.4,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 10000,
      'env1.attack': 0.003, 'env1.decay': 0.1, 'env1.sustain': 1, 'env1.release': 0.05,
      'chorus.enabled': 1, 'chorus.rate': 0.8, 'chorus.depth': 0.7, 'chorus.mix': 0.5
    }),
    mods: [{ source: 'modwheel', dest: 'chorus.rate', depth: 0.3, enabled: true }]
  },
  {
    name: 'Funk Clav',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.75, 'osc1.level': 0.7,
      'filter1.enabled': 1, 'filter1.type': 7, 'filter1.cutoff': 2000, 'filter1.resonance': 0.6,
      'filter2.enabled': 1, 'filter2.type': 0, 'filter2.cutoff': 4000, 'filter2.keytrack': 0.5,
      'env1.attack': 0.001, 'env1.decay': 0.8, 'env1.sustain': 0.2, 'env1.release': 0.08,
      'env2.attack': 0.001, 'env2.decay': 0.12, 'env2.sustain': 0, 'env2.release': 0.05
    }),
    mods: [
      { source: 'env2', dest: 'filter2.cutoff', depth: 0.3, enabled: true },
      { source: 'velocity', dest: 'filter2.cutoff', depth: 0.25, enabled: true }
    ]
  },
  {
    name: 'Rave Stab',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.7, 'osc1.unison': 5, 'osc1.detune': 15, 'osc1.level': 0.6,
      'osc2.enabled': 1, 'osc2.wavetable': 0, 'osc2.morph': 0.7, 'osc2.unison': 3, 'osc2.detune': 12,
      'osc2.transpose': 12, 'osc2.level': 0.4,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 4500, 'filter1.resonance': 0.15,
      'env1.attack': 0.002, 'env1.decay': 0.4, 'env1.sustain': 0, 'env1.release': 0.25,
      'env2.attack': 0.001, 'env2.decay': 0.2, 'env2.sustain': 0, 'env2.release': 0.1,
      'dist.type': 1, 'dist.drive': 0.2, 'reverb.enabled': 1, 'reverb.mix': 0.2
    }),
    mods: [
      { source: 'velocity', dest: 'filter1.cutoff', depth: 0.3, enabled: true },
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.25, enabled: true }
    ]
  },

  {
    name: 'Phased Rhodes',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 4, 'osc1.morph': 0.12, 'osc1.level': 0.7,
      'osc2.enabled': 1, 'osc2.wavetable': 0, 'osc2.morph': 0, 'osc2.level': 0.35,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 5000, 'filter1.keytrack': 0.5,
      'env1.attack': 0.002, 'env1.decay': 2.2, 'env1.sustain': 0.25, 'env1.release': 0.5,
      'env2.attack': 0.001, 'env2.decay': 0.4, 'env2.sustain': 0, 'env2.release': 0.2,
      'phaser.enabled': 1, 'phaser.rate': 0.5, 'phaser.depth': 0.6, 'phaser.feedback': 0.3, 'phaser.mix': 0.45,
      'comp.enabled': 1, 'comp.threshold': -22, 'comp.ratio': 2.5, 'comp.makeup': 4,
      'reverb.enabled': 1, 'reverb.size': 0.5, 'reverb.mix': 0.18
    }),
    mods: [
      { source: 'env2', dest: 'osc1.morph', depth: 0.25, enabled: true },
      { source: 'velocity', dest: 'osc1.morph', depth: 0.25, enabled: true },
      { source: 'macro1', dest: 'phaser.mix', depth: 0.4, enabled: true }
    ]
  },
  {
    name: 'Toy Piano',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 4, 'osc1.morph': 0.45, 'osc1.transpose': 12, 'osc1.level': 0.6,
      'osc2.enabled': 1, 'osc2.wavetable': 2, 'osc2.morph': 0.1, 'osc2.transpose': 24, 'osc2.level': 0.15,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 7000,
      'env1.attack': 0.001, 'env1.decay': 0.9, 'env1.sustain': 0, 'env1.release': 0.4,
      'env2.attack': 0.001, 'env2.decay': 0.15, 'env2.sustain': 0, 'env2.release': 0.1,
      'dist.type': 4, 'dist.bits': 10, 'dist.downsample': 2, 'dist.mix': 0.4,
      'reverb.enabled': 1, 'reverb.size': 0.4, 'reverb.mix': 0.2
    }),
    mods: [
      { source: 'env2', dest: 'osc1.morph', depth: 0.3, enabled: true },
      { source: 'random', dest: 'osc1.fine', depth: 0.02, enabled: true }
    ]
  },
  {
    name: 'Wurly Grit',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 2, 'osc1.morph': 0.25, 'osc1.level': 0.6,
      'osc2.enabled': 1, 'osc2.wavetable': 4, 'osc2.morph': 0.2, 'osc2.level': 0.35,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 2800, 'filter1.keytrack': 0.6,
      'env1.attack': 0.002, 'env1.decay': 1.4, 'env1.sustain': 0.3, 'env1.release': 0.3,
      'env2.attack': 0.001, 'env2.decay': 0.25, 'env2.sustain': 0, 'env2.release': 0.1,
      'lfo1.sync': 0, 'lfo1.rate': 5.5, 'lfo1.mode': 1,
      'fxdist.enabled': 1, 'fxdist.drive': 0.35, 'fxdist.tone': 5000, 'fxdist.mix': 0.6
    }),
    mods: [
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.25, enabled: true },
      { source: 'velocity', dest: 'fxdist.drive', depth: 0.3, enabled: true },
      { source: 'modwheel', dest: 'master.volume', depth: -0.15, enabled: true },
      { source: 'lfo1', dest: 'osc1.pan', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'Hollow Organ',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 1, 'osc1.morph': 0.15, 'osc1.level': 0.55, 'osc1.phase_rand': 0,
      'osc2.enabled': 1, 'osc2.wavetable': 0, 'osc2.morph': 0, 'osc2.transpose': 12, 'osc2.level': 0.35, 'osc2.phase_rand': 0,
      'osc3.enabled': 1, 'osc3.wavetable': 0, 'osc3.morph': 0, 'osc3.transpose': 24, 'osc3.level': 0.2, 'osc3.phase_rand': 0,
      'filter1.enabled': 0,
      'env1.attack': 0.005, 'env1.decay': 0.1, 'env1.sustain': 1, 'env1.release': 0.06,
      'phaser.enabled': 1, 'phaser.rate': 4, 'phaser.depth': 0.5, 'phaser.feedback': 0.2, 'phaser.mix': 0.35,
      'reverb.enabled': 1, 'reverb.size': 0.6, 'reverb.mix': 0.2
    }),
    mods: [
      { source: 'modwheel', dest: 'phaser.rate', depth: -0.3, enabled: true },
      { source: 'macro1', dest: 'osc3.level', depth: 0.5, enabled: true }
    ]
  },

  // ------------------------------------------------------------------ plucks
  {
    name: 'Ice Pluck',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 5, 'osc1.morph': 0.7, 'osc1.level': 0.65,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 1500, 'filter1.resonance': 0.2, 'filter1.keytrack': 0.8,
      'env1.attack': 0.001, 'env1.decay': 0.35, 'env1.sustain': 0, 'env1.release': 0.5,
      'env2.attack': 0.001, 'env2.decay': 0.15, 'env2.sustain': 0, 'env2.release': 0.1,
      'delay.enabled': 1, 'delay.division': 6, 'delay.pingpong': 1, 'delay.mix': 0.3, 'delay.feedback': 0.4,
      'reverb.enabled': 1, 'reverb.size': 0.8, 'reverb.mix': 0.3
    }),
    mods: [
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.45, enabled: true },
      { source: 'velocity', dest: 'filter1.cutoff', depth: 0.2, enabled: true },
      { source: 'random', dest: 'osc1.morph', depth: 0.15, enabled: true }
    ]
  },
  {
    name: 'Kalimba',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.02, 'osc1.level': 0.7,
      'noise.enabled': 1, 'noise.type': 0, 'noise.level': 0.08,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 3000, 'filter1.keytrack': 0.7,
      'env1.attack': 0.001, 'env1.decay': 0.5, 'env1.sustain': 0, 'env1.release': 0.4,
      'env2.attack': 0.001, 'env2.decay': 0.05, 'env2.sustain': 0, 'env2.release': 0.03,
      'reverb.enabled': 1, 'reverb.size': 0.5, 'reverb.mix': 0.25
    }),
    mods: [
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.3, enabled: true },
      { source: 'velocity', dest: 'filter1.cutoff', depth: 0.2, enabled: true }
    ]
  },
  {
    name: 'Rubber Pluck',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.5, 'osc1.level': 0.7,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 900, 'filter1.resonance': 0.35,
      'env1.attack': 0.001, 'env1.decay': 0.4, 'env1.sustain': 0, 'env1.release': 0.3,
      'env2.attack': 0.001, 'env2.decay': 0.1, 'env2.sustain': 0, 'env2.release': 0.05,
      'dist.type': 3, 'dist.drive': 0.45, 'dist.mix': 0.8
    }),
    mods: [
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.35, enabled: true },
      { source: 'env2', dest: 'dist.drive', depth: 0.25, enabled: true },
      { source: 'velocity', dest: 'filter1.cutoff', depth: 0.25, enabled: true }
    ]
  },
  {
    name: 'Arp Nights',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 2, 'osc1.morph': 0.4, 'osc1.unison': 2, 'osc1.detune': 12, 'osc1.level': 0.6,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 2200, 'filter1.resonance': 0.3, 'filter1.keytrack': 0.4,
      'env1.attack': 0.001, 'env1.decay': 0.28, 'env1.sustain': 0, 'env1.release': 0.2,
      'env2.attack': 0.001, 'env2.decay': 0.12, 'env2.sustain': 0, 'env2.release': 0.08,
      'lfo1.sync': 1, 'lfo1.division': 7,
      'delay.enabled': 1, 'delay.division': 10, 'delay.pingpong': 1, 'delay.mix': 0.35, 'delay.feedback': 0.45,
      'reverb.enabled': 1, 'reverb.mix': 0.25
    }),
    mods: [
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.4, enabled: true },
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.2, enabled: true },
      { source: 'modwheel', dest: 'filter1.cutoff', depth: 0.3, enabled: true }
    ]
  },

  {
    name: 'Koto Pluck',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 1, 'osc1.morph': 0.6, 'osc1.level': 0.65,
      'osc2.enabled': 1, 'osc2.wavetable': 4, 'osc2.morph': 0.35, 'osc2.transpose': 12, 'osc2.level': 0.2,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 1800, 'filter1.resonance': 0.25, 'filter1.keytrack': 0.8,
      'env1.attack': 0.001, 'env1.decay': 0.8, 'env1.sustain': 0, 'env1.release': 0.6,
      'env2.attack': 0.001, 'env2.decay': 0.15, 'env2.sustain': 0, 'env2.release': 0.1,
      'delay.enabled': 1, 'delay.division': 6, 'delay.mix': 0.2, 'delay.feedback': 0.3,
      'reverb.enabled': 1, 'reverb.size': 0.6, 'reverb.mix': 0.25
    }),
    mods: [
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.4, enabled: true },
      { source: 'env2', dest: 'osc1.fine', depth: 0.03, enabled: true },
      { source: 'velocity', dest: 'osc2.level', depth: 0.2, enabled: true }
    ]
  },
  {
    name: 'Bit Pluck',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 2, 'osc1.morph': 0.5, 'osc1.level': 0.6,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 3000, 'filter1.resonance': 0.2,
      'env1.attack': 0.001, 'env1.decay': 0.22, 'env1.sustain': 0, 'env1.release': 0.15,
      'env2.attack': 0.001, 'env2.decay': 0.12, 'env2.sustain': 0, 'env2.release': 0.08,
      'dist.type': 4, 'dist.bits': 5, 'dist.downsample': 4, 'dist.mix': 0.7,
      'delay.enabled': 1, 'delay.division': 8, 'delay.pingpong': 1, 'delay.mix': 0.3, 'delay.feedback': 0.4
    }),
    mods: [
      { source: 'env2', dest: 'dist.downsample', depth: -0.3, enabled: true },
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.3, enabled: true },
      { source: 'macro1', dest: 'dist.bits', depth: -0.3, enabled: true }
    ]
  },
  {
    name: 'Marimba Wood',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0, 'osc1.level': 0.75, 'osc1.phase_rand': 0,
      'osc2.enabled': 1, 'osc2.wavetable': 4, 'osc2.morph': 0.6, 'osc2.transpose': 24, 'osc2.level': 0.2,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 3500, 'filter1.keytrack': 0.7,
      'env1.attack': 0.001, 'env1.decay': 0.45, 'env1.sustain': 0, 'env1.release': 0.35,
      'env2.attack': 0.001, 'env2.decay': 0.04, 'env2.sustain': 0, 'env2.release': 0.03,
      'reverb.enabled': 1, 'reverb.size': 0.45, 'reverb.mix': 0.2
    }),
    mods: [
      { source: 'env2', dest: 'osc2.level', depth: 0.4, enabled: true },
      { source: 'velocity', dest: 'filter1.cutoff', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'Comb Harp',
    params: P({
      'osc1.enabled': 0,
      'noise.enabled': 1, 'noise.type': 0, 'noise.level': 0.7,
      'filter1.enabled': 1, 'filter1.type': 7, 'filter1.cutoff': 260, 'filter1.resonance': 0.92, 'filter1.keytrack': 1,
      'filter2.enabled': 1, 'filter2.type': 0, 'filter2.cutoff': 5000,
      'env1.attack': 0.001, 'env1.decay': 1.2, 'env1.sustain': 0, 'env1.release': 1,
      'env2.attack': 0.001, 'env2.decay': 0.02, 'env2.sustain': 0, 'env2.release': 0.02,
      'reverb.enabled': 1, 'reverb.size': 0.7, 'reverb.mix': 0.3
    }),
    mods: [
      { source: 'env2', dest: 'noise.level', depth: 0.3, enabled: true },
      { source: 'macro1', dest: 'filter1.resonance', depth: -0.2, enabled: true },
      { source: 'velocity', dest: 'filter2.cutoff', depth: 0.3, enabled: true }
    ]
  },

  // ------------------------------------------------------------------ fx / other
  {
    name: 'Tension Riser',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 1, 'osc1.morph': 0.1, 'osc1.unison': 7, 'osc1.detune': 30,
      'osc1.spread': 1, 'osc1.level': 0.5,
      'noise.enabled': 1, 'noise.type': 0, 'noise.level': 0.35,
      'filter1.enabled': 1, 'filter1.type': 2, 'filter1.cutoff': 200,
      'env1.attack': 4, 'env1.decay': 1, 'env1.sustain': 1, 'env1.release': 1.5,
      'env2.attack': 5, 'env2.decay': 1, 'env2.sustain': 1, 'env2.release': 1,
      'lfo1.sync': 0, 'lfo1.rate': 8,
      'reverb.enabled': 1, 'reverb.size': 0.9, 'reverb.mix': 0.4
    }),
    mods: [
      { source: 'env2', dest: 'osc1.transpose', depth: 0.12, enabled: true },
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.3, enabled: true },
      { source: 'env2', dest: 'osc1.morph', depth: 0.6, enabled: true },
      { source: 'lfo1', dest: 'osc1.fine', depth: 0.05, enabled: true }
    ]
  },
  {
    name: 'Ocean Drift',
    params: P({
      'osc1.enabled': 0,
      'noise.enabled': 1, 'noise.type': 1, 'noise.level': 0.6,
      'filter1.enabled': 1, 'filter1.type': 4, 'filter1.cutoff': 800, 'filter1.resonance': 0.5,
      'env1.attack': 1.5, 'env1.decay': 1, 'env1.sustain': 1, 'env1.release': 2.5,
      'lfo1.sync': 0, 'lfo1.rate': 0.06, 'lfo1.mode': 1, 'lfo2.sync': 0, 'lfo2.rate': 0.11, 'lfo2.mode': 1,
      'reverb.enabled': 1, 'reverb.size': 0.9, 'reverb.mix': 0.45
    }),
    mods: [
      { source: 'lfo1', dest: 'filter1.cutoff', depth: 0.3, enabled: true },
      { source: 'lfo2', dest: 'noise.level', depth: 0.2, enabled: true },
      { source: 'lfo2', dest: 'filter1.resonance', depth: 0.15, enabled: true }
    ]
  },
  {
    name: 'Laser Zap',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0, 'osc1.transpose': 24, 'osc1.level': 0.7,
      'env1.attack': 0.001, 'env1.decay': 0.25, 'env1.sustain': 0, 'env1.release': 0.1,
      'env2.attack': 0.001, 'env2.decay': 0.18, 'env2.sustain': 0, 'env2.release': 0.05,
      'delay.enabled': 1, 'delay.division': 7, 'delay.mix': 0.2, 'delay.feedback': 0.3
    }),
    mods: [{ source: 'env2', dest: 'osc1.transpose', depth: 0.35, enabled: true }]
  },
  {
    name: 'Alarm Siren',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 2, 'osc1.morph': 0.1, 'osc1.level': 0.9,
      'filter1.enabled': 1, 'filter1.type': 4, 'filter1.cutoff': 1500, 'filter1.resonance': 0.2, 'filter1.keytrack': 0.6,
      'env1.attack': 0.01, 'env1.decay': 0.5, 'env1.sustain': 1, 'env1.release': 0.4,
      'lfo1.sync': 0, 'lfo1.rate': 0.8, 'lfo1.mode': 1,
      'reverb.enabled': 1, 'reverb.size': 0.7, 'reverb.mix': 0.25
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.transpose', depth: 0.08, enabled: true },
      { source: 'modwheel', dest: 'lfo1.rate', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'Robot Talk',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 3, 'osc1.morph': 0.5, 'osc1.level': 0.3,
      'filter1.enabled': 1, 'filter1.type': 8, 'filter1.cutoff': 1000, 'filter1.resonance': 0.3,
      'env1.attack': 0.005, 'env1.decay': 0.3, 'env1.sustain': 1, 'env1.release': 0.15,
      'lfo1.sync': 1, 'lfo1.division': 10, 'lfo1.smooth': 0.3,
      'dist.type': 4, 'dist.bits': 7, 'dist.downsample': 3, 'dist.mix': 0.6,
      'delay.enabled': 1, 'delay.division': 8, 'delay.mix': 0.15
    }),
    mods: [
      { source: 'random', dest: 'filter1.cutoff', depth: 0.3, enabled: true },
      { source: 'lfo1', dest: 'osc1.morph', depth: 0.5, enabled: true },
      { source: 'modwheel', dest: 'filter1.cutoff', depth: 0.3, enabled: true }
    ]
  },
  {
    name: 'Downlifter',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 0, 'osc1.morph': 0.7, 'osc1.unison': 6, 'osc1.detune': 25, 'osc1.spread': 1, 'osc1.level': 0.5,
      'noise.enabled': 1, 'noise.type': 0, 'noise.level': 0.4,
      'filter1.enabled': 1, 'filter1.type': 1, 'filter1.cutoff': 300,
      'env1.attack': 0.005, 'env1.decay': 3, 'env1.sustain': 0, 'env1.release': 1,
      'env2.attack': 0.001, 'env2.decay': 3, 'env2.sustain': 0, 'env2.release': 1,
      'flanger.enabled': 1, 'flanger.rate': 0.2, 'flanger.feedback': 0.6, 'flanger.mix': 0.4,
      'reverb.enabled': 1, 'reverb.size': 0.95, 'reverb.mix': 0.45
    }),
    mods: [
      { source: 'env2', dest: 'filter1.cutoff', depth: 0.6, enabled: true },
      { source: 'env2', dest: 'osc1.transpose', depth: 0.12, enabled: true }
    ]
  },
  {
    name: 'Vinyl Haze',
    params: P({
      'osc1.enabled': 1, 'osc1.wavetable': 4, 'osc1.morph': 0.1, 'osc1.level': 0.55,
      'osc2.enabled': 1, 'osc2.wavetable': 0, 'osc2.morph': 0.65, 'osc2.unison': 3, 'osc2.detune': 15, 'osc2.level': 0.25,
      'noise.enabled': 1, 'noise.type': 1, 'noise.level': 0.05,
      'filter1.enabled': 1, 'filter1.type': 0, 'filter1.cutoff': 2200, 'filter1.resonance': 0.1,
      'env1.attack': 0.15, 'env1.decay': 1.5, 'env1.sustain': 0.7, 'env1.release': 1.5,
      'lfo1.sync': 0, 'lfo1.rate': 0.4, 'lfo1.mode': 1, 'lfo1.smooth': 0.6,
      'dist.type': 4, 'dist.bits': 11, 'dist.mix': 0.4,
      'chorus.enabled': 1, 'chorus.rate': 0.25, 'chorus.depth': 0.7, 'chorus.mix': 0.5,
      'comp.enabled': 1, 'comp.threshold': -24, 'comp.ratio': 3, 'comp.makeup': 5,
      'reverb.enabled': 1, 'reverb.size': 0.6, 'reverb.damp': 0.8, 'reverb.mix': 0.3
    }),
    mods: [
      { source: 'lfo1', dest: 'osc1.fine', depth: 0.03, enabled: true },
      { source: 'lfo1', dest: 'osc2.fine', depth: 0.03, enabled: true },
      { source: 'macro1', dest: 'dist.bits', depth: -0.3, enabled: true }
    ]
  }
]

function loadUserPresets(): PresetData[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as PresetData[]
  } catch {
    return []
  }
}

function saveUserPresets(list: PresetData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export class PresetBrowser {
  readonly root: HTMLElement
  private readonly select: HTMLSelectElement

  constructor(private readonly engine: SynthEngine) {
    this.root = el('div', 'presets')
    this.select = el('select', 'param-select preset-select') as HTMLSelectElement
    this.select.addEventListener('change', () => this.load(this.select.value))

    const save = el('button', 'hdr-btn', 'SAVE')
    save.title = 'Save current patch to the browser'
    save.addEventListener('click', () => {
      const name = prompt('Preset name?', 'My Patch')
      if (!name) return
      const list = loadUserPresets().filter(p => p.name !== name)
      list.push(this.engine.toPreset(name))
      saveUserPresets(list)
      this.refresh(`user:${name}`)
    })

    const exportBtn = el('button', 'hdr-btn', 'EXPORT')
    exportBtn.title = 'Download patch as JSON'
    exportBtn.addEventListener('click', () => {
      const preset = this.engine.toPreset('Exported Patch')
      const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' })
      const a = el('a') as HTMLAnchorElement
      a.href = URL.createObjectURL(blob)
      a.download = 'patch.soundgineer.json'
      a.click()
      URL.revokeObjectURL(a.href)
    })

    const importBtn = el('button', 'hdr-btn', 'IMPORT')
    const file = el('input') as HTMLInputElement
    file.type = 'file'
    file.accept = '.json'
    file.style.display = 'none'
    file.addEventListener('change', async () => {
      const f = file.files?.[0]
      if (!f) return
      try {
        const preset = JSON.parse(await f.text()) as PresetData
        this.engine.loadPreset(preset)
        const list = loadUserPresets().filter(p => p.name !== preset.name)
        list.push(preset)
        saveUserPresets(list)
        this.refresh(`user:${preset.name}`)
      } catch (err) {
        alert(`Could not load preset: ${err}`)
      }
      file.value = ''
    })
    importBtn.addEventListener('click', () => file.click())

    this.root.append(this.select, save, exportBtn, importBtn, file)
    this.refresh('factory:Init')
  }

  private refresh(selected: string): void {
    this.select.textContent = ''
    const fGroup = el('optgroup') as HTMLOptGroupElement
    fGroup.label = 'Factory'
    for (const p of FACTORY) {
      const o = el('option', undefined, p.name) as HTMLOptionElement
      o.value = `factory:${p.name}`
      fGroup.appendChild(o)
    }
    this.select.appendChild(fGroup)
    const users = loadUserPresets()
    if (users.length) {
      const uGroup = el('optgroup') as HTMLOptGroupElement
      uGroup.label = 'User'
      for (const p of users) {
        const o = el('option', undefined, p.name) as HTMLOptionElement
        o.value = `user:${p.name}`
        uGroup.appendChild(o)
      }
      this.select.appendChild(uGroup)
    }
    this.select.value = selected
  }

  private load(key: string): void {
    const [kind, ...rest] = key.split(':')
    const name = rest.join(':')
    const preset =
      kind === 'factory'
        ? FACTORY.find(p => p.name === name)
        : loadUserPresets().find(p => p.name === name)
    if (preset) this.engine.loadPreset(preset)
  }
}
