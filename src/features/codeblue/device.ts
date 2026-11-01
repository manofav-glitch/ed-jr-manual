// Browser bits for code blue: clock tick, screen wake lock, sound and vibration.
import { useEffect, useRef, useState } from 'react';

export function useNow(active: boolean, everyMs = 250): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), everyMs);
    return () => clearInterval(id);
  }, [active, everyMs]);
  return active ? now : Date.now();
}

type WakeLockState = 'on' | 'off' | 'unsupported';

/** Keeps the screen on while `active`; re-acquires when the tab comes back to the front. */
export function useWakeLock(active: boolean): WakeLockState {
  const [state, setState] = useState<WakeLockState>('wakeLock' in navigator ? 'off' : 'unsupported');
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let stopped = false;
    const acquire = async () => {
      try {
        lock = await navigator.wakeLock.request('screen');
        if (stopped) void lock.release();
        else {
          setState('on');
          lock.addEventListener('release', () => setState('off'));
        }
      } catch {
        setState('off');
      }
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') void acquire();
    };
    void acquire();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stopped = true;
      document.removeEventListener('visibilitychange', onVisible);
      void lock?.release();
    };
  }, [active]);
  return state;
}

let ctx: AudioContext | null = null;

/** Call from a tap: browsers only allow sound after the user has touched the page. */
export function unlockAudio(): void {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    ctx = null;
  }
}

function tone(at: number, freq: number, dur: number, gain = 0.4) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.value = freq;
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.001, at + dur);
  o.connect(g).connect(ctx.destination);
  o.start(at);
  o.stop(at + dur);
}

/** Three loud beeps and a vibration. */
export function alarm(kind: 'rhythm' | 'adrenaline'): void {
  if (ctx) {
    const t = ctx.currentTime;
    const f = kind === 'rhythm' ? 988 : 660;
    for (let i = 0; i < 3; i++) tone(t + i * 0.28, f, 0.2, 0.6);
  }
  navigator.vibrate?.(kind === 'rhythm' ? [400, 150, 400, 150, 400] : [250, 150, 250]);
}

/** Clicks at `bpm` while `on`, scheduled ahead on the audio clock so they stay even. */
export function useMetronome(on: boolean, bpm: number): number {
  const [beat, setBeat] = useState(0);
  const next = useRef(0);
  useEffect(() => {
    if (!on) return;
    unlockAudio();
    if (!ctx) return;
    const c = ctx;
    const interval = 60 / bpm;
    next.current = c.currentTime + 0.05;
    const id = setInterval(() => {
      while (next.current < c.currentTime + 0.12) {
        tone(next.current, 1500, 0.04, 0.35);
        const delay = Math.max(0, (next.current - c.currentTime) * 1000);
        setTimeout(() => setBeat((b) => b + 1), delay);
        next.current += interval;
      }
    }, 25);
    return () => clearInterval(id);
  }, [on, bpm]);
  return beat;
}
