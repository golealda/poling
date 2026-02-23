import { useEffect, useRef, useState } from "react";
import timerSound from "./assets/timer.mp3";

type TimerStatus = "Idle" | "Running" | "Paused";

function nowMs() {
  return Date.now();
}

function formatSeconds(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimerApp() {
  const [status, setStatus] = useState<TimerStatus>("Idle");
  const [targetSecInput, setTargetSecInput] = useState<string>("90");
  const [targetSec, setTargetSec] = useState<number>(90);

  const [displaySec, setDisplaySec] = useState<number>(0);
  const [reached, setReached] = useState<boolean>(false);

  const startAtMsRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef<number>(0);
  const reachedOnceRef = useRef<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const canStart = status !== "Running";
  const canPause = status === "Running";
  const canReset = status !== "Idle" || accumulatedMsRef.current > 0 || displaySec > 0;

  useEffect(() => {
    const audio = new Audio(timerSound);
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status !== "Running") return;

    const getElapsedMs = () => {
      if (startAtMsRef.current == null) return accumulatedMsRef.current;
      return accumulatedMsRef.current + (nowMs() - startAtMsRef.current);
    };

    const tick = () => {
      const ms = getElapsedMs();
      const sec = Math.floor(ms / 1000);
      setDisplaySec(sec);

      if (!reachedOnceRef.current && targetSec > 0 && sec >= targetSec) {
        reachedOnceRef.current = true;
        accumulatedMsRef.current = targetSec * 1000;
        startAtMsRef.current = null;
        setDisplaySec(targetSec);
        setReached(true);
        setStatus("Paused");
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          void audioRef.current.play().catch(() => {});
        }
      }
    };

    tick();
    const id = window.setInterval(tick, 250);

    return () => window.clearInterval(id);
  }, [status, targetSec]);

  const onStart = () => {
    if (status === "Running") return;

    if (status === "Idle") {
      setReached(false);
      reachedOnceRef.current = false;
    }

    startAtMsRef.current = nowMs();
    setStatus("Running");
  };

  const onPause = () => {
    if (status !== "Running") return;

    if (startAtMsRef.current != null) {
      accumulatedMsRef.current += nowMs() - startAtMsRef.current;
    }
    startAtMsRef.current = null;
    setStatus("Paused");
  };

  const onReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    accumulatedMsRef.current = 0;
    startAtMsRef.current = null;
    reachedOnceRef.current = false;
    setReached(false);
    setDisplaySec(0);
    setStatus("Idle");
  };

  const onApplyTarget = () => {
    const next = Number(targetSecInput);
    if (!Number.isFinite(next) || next < 0) {
      alert("목표 시간은 0 이상의 숫자(초)로 입력해 주세요.");
      return;
    }
    const normalized = Math.floor(next);
    setTargetSec(normalized);

    reachedOnceRef.current = false;
    setReached(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-14 font-sans">
      <div className="mx-auto max-w-md space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-center text-xl font-bold text-slate-900">Timer</h1>

          <div className="mt-3 text-center text-sm text-slate-600">
            <span className="font-semibold text-slate-700">Status:</span> {status}
          </div>

          <div className="mt-5 text-center text-5xl font-bold tracking-wide text-slate-900">
            {formatSeconds(displaySec)}
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={onStart}
              disabled={!canStart}
              className="h-11 flex-1 rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start
            </button>
            <button
              onClick={onPause}
              disabled={!canPause}
              className="h-11 flex-1 rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Pause
            </button>
            <button
              onClick={onReset}
              disabled={!canReset}
              className="h-11 flex-1 rounded-xl bg-slate-200 text-sm font-semibold text-slate-800 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-semibold text-slate-900">목표 시간 설정 (초)</div>

          <div className="mt-3 flex gap-2">
            <input
              value={targetSecInput}
              onChange={(e) => setTargetSecInput(e.target.value)}
              inputMode="numeric"
              placeholder="예: 90"
              className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
            />
            <button
              onClick={onApplyTarget}
              className="h-10 w-24 rounded-xl bg-slate-700 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Apply
            </button>
          </div>

          <div className="mt-3 text-xs text-slate-600">
            현재 목표: <span className="font-semibold text-slate-800">{targetSec}</span>초
          </div>

          {reached && (
            <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-sm text-slate-800">
              목표 시간({targetSec}초)에 도달했습니다!
            </div>
          )}
        </div>

        <div className="text-center text-xs text-slate-500">
          정확도: setInterval로 시간을 "더하지 않고", now 기반으로 경과 시간을 계산합니다.
        </div>
      </div>
    </div>
  );
}
