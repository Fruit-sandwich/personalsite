// Web Audio API Synthesized Tactile Sound Engine
// Zero external MP3/WAV dependencies; ultra-low latency; customizable frequencies

const SOUND_STORAGE_KEY = "dm_sound_enabled_v1";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SOUND_STORAGE_KEY);
      // Default to muted until user turns it on, or remembers previous state
      this.isEnabled = stored === "true";
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public setEnabled(enabled: boolean): boolean {
    this.isEnabled = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem(SOUND_STORAGE_KEY, enabled ? "true" : "false");
    }
    if (enabled) {
      this.initContext();
      this.playSuccess();
    }
    return this.isEnabled;
  }

  public toggle(): boolean {
    return this.setEnabled(!this.isEnabled);
  }

  /**
   * Ultra-crisp mechanical switch keystroke click
   */
  public playClick(pitchMultiplier: number = 1.0) {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200 * pitchMultiplier, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.02);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.026);
  }

  /**
   * Terminal blip / tab switch tone
   */
  public playBlip(freq: number = 960) {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.9, t + 0.04);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Mode switch / theme change tick
   */
  public playSwitch() {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(1080, t + 0.03);

    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  /**
   * Confirmation / Copied success chime
   */
  public playSuccess() {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, t);
    gain1.gain.setValueAtTime(0.06, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.08);

    // Note 2 (Harmonic fifth)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, t + 0.04);
    gain2.gain.setValueAtTime(0.06, t + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.04);
    osc2.stop(t + 0.15);
  }

  /**
   * Identity inspection / terminal authentication fanfare
   */
  public playIdentityOpen() {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = t + idx * 0.035;

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, noteTime);
      gain.gain.setValueAtTime(0.05, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.1);
    });
  }

  public startMarchingAntsLoop(): () => void {
    if (!this.isEnabled) return () => {};
    const ctx = this.initContext();
    if (!ctx) return () => {};

    const t = ctx.currentTime;
    // Primary carrier oscillator - gentle pulse wave mimicking flowing electrical raster/circuit
    const carrier = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const masterGain = ctx.createGain();

    // Subtle 8.5 Hz modulation matching the rapid dashed stroke progression
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(8.5, t);

    // LFO modulates amplitude slightly to create that rhythmic "marching" sensation
    lfoGain.gain.setValueAtTime(0.015, t);
    lfo.connect(lfoGain);

    // Soft warm carrier frequency (triangular wave to give clean harmonic presence without harshness)
    carrier.type = "triangle";
    carrier.frequency.setValueAtTime(138.6, t); // Db3, warm cyber resonance
    carrier.frequency.exponentialRampToValueAtTime(146.83, t + 0.1); // D3 subtle settle

    // Low-pass resonant filter to create smooth electronic aura
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(420, t);
    filter.Q.setValueAtTime(4.0, t);

    // Smooth entry envelope
    masterGain.gain.setValueAtTime(0.0001, t);
    masterGain.gain.linearRampToValueAtTime(0.035, t + 0.08);

    carrier.connect(filter);
    filter.connect(masterGain);
    lfoGain.connect(masterGain.gain);
    masterGain.connect(ctx.destination);

    carrier.start(t);
    lfo.start(t);

    let stopped = false;
    return () => {
      if (stopped) return;
      stopped = true;
      try {
        const stopTime = ctx.currentTime;
        masterGain.gain.cancelScheduledValues(stopTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, stopTime);
        masterGain.gain.exponentialRampToValueAtTime(0.00001, stopTime + 0.12);
        setTimeout(() => {
          try {
            carrier.stop();
            lfo.stop();
            carrier.disconnect();
            lfo.disconnect();
            filter.disconnect();
            masterGain.disconnect();
          } catch {
            // ignore cleanup errors
          }
        }, 140);
      } catch {
        // ignore errors
      }
    };
  }

  /**
   * Variable font typographic swell effect:
   * Smooth, organic pitch-bending resonance (analogous to physical weight expansion)
   */
  public playSwell(depth: "heavy" | "medium" | "light" = "medium") {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Configure frequency ramp according to swell depth
    const config = {
      heavy: { startFreq: 140, endFreq: 440, filterFreq: 1200, duration: 0.18, vol: 0.045 },
      medium: { startFreq: 220, endFreq: 587.33, filterFreq: 1800, duration: 0.15, vol: 0.038 },
      light: { startFreq: 330, endFreq: 784, filterFreq: 2400, duration: 0.12, vol: 0.03 },
    }[depth];

    osc.type = "sine";
    osc.frequency.setValueAtTime(config.startFreq, t);
    // Smooth upward pitch sweep matching typography weight expansion
    osc.frequency.exponentialRampToValueAtTime(config.endFreq, t + config.duration);

    // Warm low-pass filter to keep it subtle and organic
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(config.filterFreq, t);
    filter.Q.setValueAtTime(2, t);

    // Envelope: quick attack, swell hold, smooth exponential decay
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(config.vol, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + config.duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + config.duration + 0.01);
  }
}

export const sound = new SoundEngine();
