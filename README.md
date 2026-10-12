# Soundgineer

A browser-based, Vital-style **wavetable synthesizer** built on the Web Audio
API. Vanilla TypeScript + Vite, zero runtime dependencies: all DSP runs
sample-accurately inside an `AudioWorkletProcessor`, the UI is hand-rolled
Canvas/WebGL2/DOM.

Architecture: main thread (UI, parameter state, wavetable generation) ⇄
`MessagePort` ⇄ AudioWorklet (16-voice engine, mod matrix, FX rack).

## Quick start

```bash
npm install
npm run dev        # → http://localhost:5173
```

Click to start audio, then play with the on-screen keyboard (`A W S E D F T G
Y H U J K`, octave `Z`/`X`) or a MIDI keyboard (Chrome/Edge — grant MIDI
permission).

Other scripts:

```bash
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run typecheck
node scripts/smoke.mjs                      # headless end-to-end check
# CHROMIUM_PATH=/path/to/chromium node scripts/smoke.mjs   (pre-installed browser)
```

## What's inside

**Per-voice signal path** (16 voices, oldest/released-first stealing):

- **3 wavetable oscillators** — morph (wavetable position), unison up to 16
  voices with detune/blend/stereo-spread, start phase + randomization, level,
  pan, transpose/fine, hard sync. Band-limited playback via per-frame mip
  pyramids (FFT low-passed copies, one per octave).
- **Sub oscillator** (sine/tri/saw/square, −3..0 oct) and **noise oscillator**
  (white / pink / WAV sample slot with pitch).
- **2 filters**, series or parallel — analog-style TPT SVF (LP/HP/BP/notch,
  12 & 24 dB), feedback comb, vowel-morphing formant. Cutoff, resonance,
  drive, key-track, mix per filter.
- **Shape section** — soft clip, hard clip, wavefolder, bitcrusher (+ sample
  rate divider).
- Envelope 1 is hard-wired to voice amplitude (velocity-scaled).

**Modulators**

- **6 envelopes** — DAHDSR (delay/attack/hold/decay/sustain/release) with
  per-stage curve shaping.
- **8 LFOs** — drawable multi-point curves (click to add points, drag
  segment midpoints to bend, right-click to delete, Ctrl to snap), Hz or
  BPM-synced rates, Trigger/Free/Sync retrigger modes, output smoothing.
- Velocity, key track, per-note random, mod wheel, pitch wheel, channel
  pressure, and **4 macro knobs** (MIDI CC 20–23).

**Modulation matrix** — any source → any moddable parameter, 32 slots,
bipolar depth. Assign by dragging a source badge onto a knob, or right-click
a knob. Depth arcs render around each knob with live animated value dots
(Vital-style). Full protocol: [docs/modulation-protocol.md](docs/modulation-protocol.md).

**Effects rack** (global, reorderable): chorus, phaser, flanger, BPM-syncable
ping-pong delay, Freeverb-style reverb, 3-band EQ, compressor, distortion.

**Wavetable engine** — 2048-sample frames; built-in tables are generated from
additive/FM/formula recipes with **FFT spectral morphing** between key frames
(magnitude + shortest-path phase interpolation). Import your own via the
**WAV** button on each oscillator: Serum-style concatenated 2048-sample-frame
WAVs load as-is; any other WAV is treated as a single cycle, FFT-resampled,
and expanded into a morph table.

**Visualizers** — WebGL2 3D wavetable view with the live (modulated) morph
position highlighted, oscilloscope, and log-frequency spectrum analyzer.

**Presets** — JSON patches (parameters + matrix + LFO shapes + FX order).
Save to localStorage, or export/import files. 59 factory patches ship in
`src/ui/presets.ts`, grouped by category:

| Category | Count | Examples |
|---|---|---|
| Bass | 12 | Deep Saw Bass, Reese Bass, Acid Squelch, Neuro Growl, Fold Bass, Mid Bass Formant |
| Leads | 10 | Super Saw Lead, Sync Screamer, Chip Lead, Fuzz Mono, Jet Lead, Glass Whistle |
| Pads | 11 | Morphing Pad, Shimmer Pad, Dark Matter, Phase Cathedral, Granite Drone, Velvet Strings |
| Keys | 9 | PWM Keys, Lo-Fi EP, Drawbar Organ, Phased Rhodes, Toy Piano, Hollow Organ |
| Plucks | 9 | Sync Pluck, Kalimba, Arp Nights, Koto Pluck, Marimba Wood, Comb Harp |
| FX / other | 7 | Tension Riser, Ocean Drift, Laser Zap, Robot Talk, Downlifter, Vinyl Haze |

Plus an empty Init patch. Many factory patches map Macro 1–2 and the mod
wheel to their most useful controls.

## Repository layout

```
src/shared/     parameter registry, message protocol, FFT, wavetable
                generation/import — imported by BOTH threads
src/worklet/    the DSP: processor (voice manager, FX, telemetry),
                voice (signal path), dsp (osc/env/LFO/filters), effects
src/audio/      main-thread engine: worklet lifecycle, state, presets
src/ui/         knobs, editors, matrix, FX rack, scope, 3D view, keyboard, MIDI
docs/           modulation-matrix / message protocol spec
scripts/        headless Playwright smoke test
```

The worklet is bundled by Vite via `?worker&url` as a standalone ES module
(`worker.format = 'es'`), so `AudioWorklet.addModule()` works in both dev and
production. ES-module worklets require a Chromium-based browser or recent
Firefox; Chrome/Edge recommended.

## Known limits

- Hard sync (>1×) is not band-limited — it aliases on purpose, like the
  classic dirty setting.
- Vital's binary `.vitaltable` format is not parsed (JSON presets +
  Serum-style WAV import cover the common interchange path).
- White/pink noise ignore the pitch knob (it applies to the sample slot).
