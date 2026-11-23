import { Eye, EyeOff, Pause, Play, RotateCcw } from 'lucide-react';
import type { Vec3 } from '../data/visionPositioningConfig';

interface TimelineDockProps {
  progress: number; // 0..1
  isPlaying: boolean;
  cameraPosition: Vec3;
  hudHidden: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onScrub: (nextProgress: number) => void;
  onToggleHudHidden: () => void;
}

export function TimelineDock({
  progress,
  isPlaying,
  cameraPosition,
  hudHidden,
  onTogglePlay,
  onReset,
  onScrub,
  onToggleHudHidden,
}: TimelineDockProps) {
  if (hudHidden) {
    return (
      <div className="pointer-events-auto fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <button
          type="button"
          onClick={onToggleHudHidden}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-900/12 bg-white/95 px-3.5 py-2 text-xs font-medium text-slate-800 shadow-md hover:bg-white transition-colors whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
          Show Controls
        </button>
      </div>
    );
  }

  return (
    <div
      aria-label="Camera Trajectory Timeline"
      className="pointer-events-auto fixed bottom-3 left-1/2 -translate-x-1/2 z-20 w-[min(780px,calc(100vw-24px))] rounded-xl border border-slate-900/12 bg-white/95 px-3.5 py-2 shadow-lg"
    >
      <div className="flex items-center gap-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause camera trajectory' : 'Play camera trajectory'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={onReset}
            aria-label="Reset camera trajectory"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrubber */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap hidden sm:inline">
            Simulation Demo
          </span>
          <input
            type="range"
            aria-label="Camera trajectory progress"
            min={0}
            max={1}
            step={0.002}
            value={progress}
            onChange={(e) => onScrub(parseFloat(e.target.value))}
            className="w-full precision-slider"
          />
          <span className="font-mono-num text-[11px] font-medium text-slate-700 w-9 text-right shrink-0">
            {Math.round(progress * 100)}%
          </span>
        </div>

        {/* Live Camera World Coordinates */}
        <div className="hidden md:flex items-center gap-1.5 pl-2.5 border-l border-slate-200 text-[11px] font-mono-num text-slate-700 whitespace-nowrap shrink-0">
          <span className="text-slate-400">C:</span>
          <span data-testid="timeline-camera-coords">
            ({cameraPosition.x.toFixed(1)}, {cameraPosition.y.toFixed(1)},{' '}
            {cameraPosition.z.toFixed(1)}) m
          </span>
        </div>

        {/* Clean Hide HUD toggle */}
        <button
          type="button"
          onClick={onToggleHudHidden}
          aria-label="Hide HUD controls"
          title="Hide HUD (H)"
          className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
        >
          <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Hide</span>
        </button>
      </div>
    </div>
  );
}
