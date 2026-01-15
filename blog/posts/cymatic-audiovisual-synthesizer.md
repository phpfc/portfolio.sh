---
title: "Building Cymatic: Where Music Theory Meets WebGL"
description: "From music teacher to developer: building a browser-based audiovisual synthesizer that visualizes the science of sound. Exploring cymatics, harmonic ratios, and real-time audio-visual synchronization."
date: "2025-01-15"
tags: ["TypeScript", "WebGL", "Audio", "Music", "Creative Coding"]
published: true
---

# Building Cymatic: Where Music Theory Meets WebGL

Before I wrote my first line of code professionally, I spent years teaching and studying music. Piano lessons, music theory classes, endless hours understanding why certain notes sound good together. When I transitioned to software development, I thought I was leaving that world behind. Turns out, I was just finding a new way back to it.

Cymatic is a browser-based audiovisual synthesizer that makes sound visible. It's named after cymatics — the study of visible sound vibrations, famously demonstrated by Ernst Chladni's experiments with vibrating plates covered in sand. The patterns that emerge aren't random; they're direct visualizations of the mathematical relationships between frequencies.

## The Science: What Are Cymatics?

When a surface vibrates at a specific frequency, it creates standing wave patterns. Some areas oscillate intensely (antinodes), while others remain still (nodes). If you scatter sand on a vibrating plate, particles collect at the nodes, revealing geometric patterns that correspond directly to the frequency being played.

What fascinated me most was how these patterns relate to music theory. The ratios that create pleasing musical intervals — the same ratios I taught students for years — produce specific visual geometries. A perfect fifth (3:2 ratio) creates different patterns than a major third (5:4). The mathematics of harmony becomes visible.

## From Music Theory to Code

In my teaching days, I explained harmony through ratios. Why does a perfect fifth sound consonant? Because the frequencies relate as 3:2 — every third peak of one wave aligns with every second peak of another. Simple ratios create stable interference patterns; complex ratios create tension.

This understanding directly shaped the architecture:

```typescript
export const MUSICAL_INTERVALS: Record<string, number> = {
  'unison': 1/1,
  'minor-second': 16/15,
  'major-second': 9/8,
  'minor-third': 6/5,
  'major-third': 5/4,
  'perfect-fourth': 4/3,
  'tritone': 45/32,
  'perfect-fifth': 3/2,
  'minor-sixth': 8/5,
  'major-sixth': 5/3,
  'minor-seventh': 16/9,
  'major-seventh': 15/8,
  'octave': 2/1
};
```

These are just intonation ratios — the pure mathematical relationships that predate equal temperament tuning. When you play a major third on a well-tuned piano, you're hearing an approximation. When Cymatic plays it, you're hearing (and seeing) the real 5:4 ratio.

## Architecture: The Three Engines

The system has three core components that must stay perfectly synchronized:

### StateManager: The Single Source of Truth

Every parameter — base frequency, harmonic layers, amplitudes — lives in an immutable state object. When anything changes, both the audio and visual engines receive the update simultaneously.

```typescript
export interface SystemState {
  baseFrequency: number;  // Hz (e.g., 110)
  layers: Layer[];
}

export interface Layer {
  id: string;
  ratio: number;        // Harmonic ratio (e.g., 5/4 = 1.25)
  amplitude: number;    // [0..1]
  phase: number;        // radians
  enabled: boolean;
}
```

This pub-sub pattern ensures that what you hear always matches what you see. No drift, no desynchronization.

### AudioEngine: Web Audio API Synthesis

Each harmonic layer creates one oscillator with frequency calculated as `baseFrequency * ratio`. A base frequency of 110Hz with a perfect fifth layer (1.5 ratio) produces 165Hz.

```typescript
private createOscillator(layer: Layer, baseFrequency: number): void {
  const frequency = baseFrequency * layer.ratio;

  const osc = this.context.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = frequency;

  const gain = this.context.createGain();
  gain.gain.value = 0;

  osc.connect(gain);
  gain.connect(this.masterGain);
  osc.start();

  // Attack envelope to avoid clicks
  const now = this.context.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(layer.amplitude, now + 0.01);
}
```

The choice of sine waves is deliberate. Pure tones without overtones let the harmonic relationships between layers create all the timbral complexity. It's additive synthesis at its most fundamental — the same principle behind pipe organs and Hammond organs.

### VisualEngine: GLSL Fragment Shaders

This is where the math becomes visible. The fragment shader computes a cymatic field for every pixel on screen, 60 times per second:

```glsl
float field(vec2 p, float t) {
  float r = length(p);
  float theta = atan(p.y, p.x);
  float v = 0.0;

  for (int i = 0; i < 8; i++) {
    if (i >= u_layerCount) break;
    if (u_layers[i].enabled < 0.5) continue;

    float k = u_baseVisualFreq * u_layers[i].ratio;

    // Radial component - concentric rings
    float radial = sin(k * r + u_layers[i].phase + t * 0.3);

    // Angular component - creates nodal lines
    float m = floor(u_layers[i].ratio * 2.0);
    float angular = cos(m * theta);

    // Combine: cymatic nodal patterns
    float contribution = u_layers[i].amplitude * radial * (0.5 + 0.5 * angular);
    v += contribution;
  }

  return v;
}
```

The key insight: the same ratio that determines pitch also determines the visual pattern's geometry. A layer with ratio 2.0 (octave) creates patterns with mode number 4, producing four-fold symmetry. Ratio 1.5 (perfect fifth) produces three-fold patterns. The visual complexity emerges from the interference of these different symmetries.

## The Synchronization Problem

Getting audio and visuals to stay perfectly aligned is harder than it sounds. The Web Audio API runs on its own high-priority thread with sample-accurate timing. `requestAnimationFrame` runs at display refresh rate, typically 60fps but variable.

The solution: use `audioContext.currentTime` as the single source of temporal truth.

```typescript
private startRenderLoop(): void {
  const render = () => {
    if (!this.isRunning) return;

    // Audio time is the reference
    const time = this.audioEngine.getCurrentTime();

    // Visual engine syncs to audio
    this.visualEngine.render(time);

    this.animationFrameId = requestAnimationFrame(render);
  };
  render();
}
```

Both engines now share the same clock. When the visual field equation uses `t * 0.3` for animation, that `t` comes directly from the audio context. Frame-perfect synchronization.

## The Rendering Approach: Oscilloscope Aesthetic

Rather than filling regions with color based on field intensity, Cymatic draws only the edges — the zero-crossings of the field function:

```glsl
// Only draw where field crosses zero
float edgeWidth = 0.08;
float edgeIntensity = 1.0 - smoothstep(0.0, edgeWidth, abs(v));

// Add glow
float glowWidth = 0.15;
float glow = (1.0 - smoothstep(0.0, glowWidth, abs(v))) * 0.3;

vec3 lineColor = vec3(0.6, 0.8, 1.0);  // Light blue
vec3 color = mix(vec3(0.0), lineColor, edgeIntensity + glow);
```

This creates the characteristic Chladni plate look — bright lines on black, like sand collecting at nodal lines, or the phosphor traces of an oscilloscope. It's both aesthetically clean and physically meaningful.

## Reflections: The Bridge Between Worlds

Building Cymatic reminded me why I fell in love with music in the first place. Not the performance aspect, but the underlying logic — how simple mathematical relationships create emotional responses. A suspended chord creates tension because of frequency ratios. Resolution feels satisfying because the ratios simplify.

As a developer, I get to explore these relationships in ways that weren't possible as a teacher. I can make the math visible, interactive, immediate. A student could adjust a ratio slider and simultaneously hear the interval change and see the pattern transform.

The project also reinforced something I've come to believe about career changes: you don't leave your past expertise behind. My years of teaching harmony gave me intuitions about this project that pure technical skill couldn't. Understanding why the 45/32 tritone ratio sounds unstable helped me predict how its visual pattern would look — restless, asymmetric, never quite settling.

## Technical Highlights

For those interested in the implementation details:

- **Zero external dependencies** for audio or graphics — pure Web APIs
- **Immutable state architecture** with pub-sub pattern
- **WebGL2** with GLSL ES 3.0 shaders
- **Up to 8 simultaneous harmonic layers**
- **High DPI canvas support** for retina displays
- **Property-based testing** with fast-check for edge cases

## Try It

[Launch Cymatic](https://cymatic-audiovisual.netlify.app/) and explore the relationship between sound and geometry. Start with simple intervals — the octave, perfect fifth, major third. Then combine them and watch complexity emerge from simplicity.

That emergence is what cymatics is really about. And maybe, in some small way, it's what music has always been about.
