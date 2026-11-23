import {
  BookOpen,
  Compass,
  Focus,
  SlidersHorizontal,
  Video,
} from 'lucide-react';
import type { CameraViewPreset, ViewMode } from '../data/visionPositioningConfig';

interface ViewerTopBarProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  rayAngleMode: boolean;
  onToggleRayAngleMode: () => void;
  viewPreset: CameraViewPreset;
  onSelectPreset: (preset: CameraViewPreset) => void;
  inspectorOpen: boolean;
  onToggleInspector: () => void;
  onOpenOverview: () => void;
  hudHidden: boolean;
}

const CAMERA_PRESETS: Array<{ id: CameraViewPreset; label: string }> = [
  { id: 'default', label: 'Default' },
  { id: 'top', label: 'Top' },
  { id: 'front', label: 'Front' },
  { id: 'side', label: 'Side' },
  { id: 'isometric', label: 'Isometric' },
  { id: 'focus-structure', label: 'Focus Structure' },
  { id: 'from-camera', label: 'View from Camera' },
];

export function ViewerTopBar({
  mode,
  onModeChange,
  rayAngleMode,
  onToggleRayAngleMode,
  viewPreset,
  onSelectPreset,
  inspectorOpen,
  onToggleInspector,
  onOpenOverview,
  hudHidden,
}: ViewerTopBarProps) {
  if (hudHidden) return null;

  return (
    <header className="pointer-events-auto fixed top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 rounded-xl border border-slate-900/12 bg-white/95 px-2.5 sm:px-3.5 py-2 shadow-sm">
      {/* Left: Project Wordmark & Overview Link */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <span className="hidden sm:inline text-sm font-semibold tracking-tight text-slate-900 whitespace-nowrap truncate">
          Monocular Vision 3D
        </span>
        <span className="hidden lg:inline text-slate-300" aria-hidden="true">
          |
        </span>
        <button
          type="button"
          onClick={onOpenOverview}
          aria-label="Research Overview"
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Research Overview</span>
        </button>
      </div>

      {/* Center: Mode Switch & Ray-Angle Mode */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div
          role="group"
          aria-label="Rendering mode"
          className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5"
        >
          <button
            type="button"
            onClick={() => onModeChange('realistic')}
            aria-pressed={mode === 'realistic'}
            className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'realistic'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Realistic
          </button>
          <button
            type="button"
            onClick={() => onModeChange('scientific')}
            aria-pressed={mode === 'scientific'}
            className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'scientific'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scientific
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleRayAngleMode}
          aria-pressed={rayAngleMode}
          className={`hidden md:inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
            rayAngleMode
              ? 'border-amber-500 bg-amber-50 text-amber-900'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" aria-hidden="true" />
          Ray-Angle
        </button>
      </div>

      {/* Right: Camera Presets & Inspector Toggle */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="hidden xl:flex items-center gap-1">
          {(
            [
              { id: 'default', label: 'Default' },
              { id: 'top', label: 'Top' },
              { id: 'front', label: 'Front' },
              { id: 'side', label: 'Side' },
              { id: 'isometric', label: 'Iso' },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPreset(p.id)}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                viewPreset === p.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onSelectPreset('focus-structure')}
            title="Focus on Structure"
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewPreset === 'focus-structure'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Focus className="w-3.5 h-3.5" aria-hidden="true" />
            Structure
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset('from-camera')}
            title="View from Virtual Camera"
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewPreset === 'from-camera'
                ? 'bg-sky-600 text-white'
                : 'text-sky-700 hover:bg-sky-50'
            }`}
          >
            <Video className="w-3.5 h-3.5" aria-hidden="true" />
            Camera View
          </button>
        </div>

        {/* Compact View Preset Dropdown for tablet / mobile */}
        <label className="xl:hidden flex items-center">
          <span className="sr-only">Camera View Preset</span>
          <select
            aria-label="Camera View Preset"
            value={viewPreset}
            onChange={(e) => onSelectPreset(e.target.value as CameraViewPreset)}
            className="max-w-[96px] sm:max-w-none rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {CAMERA_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onToggleInspector}
          aria-expanded={inspectorOpen}
          aria-label="Toggle Scene Inspector"
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2 sm:px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
            inspectorOpen
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Inspector</span>
        </button>
      </div>
    </header>
  );
}
