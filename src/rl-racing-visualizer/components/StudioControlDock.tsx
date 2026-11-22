import React, { useState } from 'react';
import {
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Pause,
  Play,
  SlidersHorizontal,
  Table2,
} from 'lucide-react';
import {
  CONFIG,
  DISCRETE_ACTIONS,
  ObservationSnapshot,
  SCENARIO_PRESETS,
  VehiclePoseParams,
} from '../sim/rlRacingMath';
import { LayerVisibility } from '../render/calloutLayout';

export type CameraPresetId = 'hero' | 'top-radar' | 'wheel-speed' | 'centerline';

interface StudioControlDockProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  darkMode: boolean;
  cameraPreset: CameraPresetId;
  onSelectCamera: (id: CameraPresetId) => void;
  scenarioId: string;
  onSelectScenario: (id: string) => void;
  pose: VehiclePoseParams;
  onChangePose: (next: Partial<VehiclePoseParams>) => void;
  layers: LayerVisibility;
  onToggleLayer: (key: keyof LayerVisibility) => void;
  isAnimating: boolean;
  onToggleAnimating: () => void;
  snapshot: ObservationSnapshot;
}

type DockTab = 'camera' | 'params' | 'layers' | 'vector';

const CAMERA_OPTIONS: Array<{ id: CameraPresetId; label: string }> = [
  { id: 'hero', label: '主视图' },
  { id: 'top-radar', label: '俯视雷达' },
  { id: 'wheel-speed', label: '轮胎特写' },
  { id: 'centerline', label: '赛道偏差' },
];

export const StudioControlDock: React.FC<StudioControlDockProps> = ({
  collapsed,
  onToggleCollapse,
  darkMode,
  cameraPreset,
  onSelectCamera,
  scenarioId,
  onSelectScenario,
  pose,
  onChangePose,
  layers,
  onToggleLayer,
  isAnimating,
  onToggleAnimating,
  snapshot,
}) => {
  const [activeTab, setActiveTab] = useState<DockTab>('camera');

  const hitCount = snapshot.rays.filter((r) => r.hit).length;
  const activeScenario =
    SCENARIO_PRESETS.find((s) => s.id === scenarioId) ?? SCENARIO_PRESETS[0];

  // Unified high-craft surface tokens (solid/rgba without backdrop-filter over WebGL)
  const dockShell = darkMode
    ? 'bg-[#0e131e]/95 border-white/10 text-slate-100 shadow-[0_14px_40px_rgba(0,0,0,0.55)]'
    : 'bg-white/96 border-slate-900/10 text-slate-900 shadow-[0_12px_36px_rgba(15,23,42,0.14)]';
  const wellBg = darkMode ? 'bg-white/[0.05]' : 'bg-slate-100/90';
  const dividerCol = darkMode ? 'bg-white/10' : 'bg-slate-200';
  const borderHairline = darkMode ? 'border-white/[0.08]' : 'border-slate-200/80';
  const mutedText = darkMode ? 'text-slate-400' : 'text-slate-500';
  const subtleHover = darkMode
    ? 'text-slate-300 hover:text-white hover:bg-white/[0.07]'
    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-900/[0.05]';
  const activeSegment = darkMode
    ? 'bg-slate-100 text-slate-950 shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
    : 'bg-slate-900 text-white shadow-[0_1px_3px_rgba(15,23,42,0.22)]';
  const activeSoft = darkMode
    ? 'bg-white/[0.13] text-white'
    : 'bg-white text-slate-950 shadow-[0_1px_2px_rgba(15,23,42,0.08)]';

  // Collapsed state: ultra-slim single-line floating bar
  if (collapsed) {
    return (
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20"
        data-testid="studio-control-dock"
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-expanded={false}
          aria-label="展开控制面板"
          className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border text-xs font-medium transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap ${dockShell}`}
        >
          <span className="font-semibold">{activeScenario.nameZh}</span>
          <span className={`h-3 w-px ${dividerCol}`} aria-hidden="true" />
          <span className={`font-mono-tabular ${mutedText}`}>
            R {snapshot.reward.total >= 0 ? '+' : ''}
            {snapshot.reward.total.toFixed(2)} · 命中 {hitCount}/9
          </span>
          <span className={`h-3 w-px ${dividerCol}`} aria-hidden="true" />
          <span className="inline-flex items-center gap-1 font-medium">
            展开控制栏
            <ChevronUp className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[min(780px,94vw)]"
      data-testid="studio-control-dock"
    >
      <div className={`w-full rounded-2xl border overflow-hidden ${dockShell}`}>
        {/* Top Navigation & Telemetry Strip — zero protruding ears */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 px-2 py-1.5 border-b sm:px-3 sm:py-2 ${borderHairline}`}
        >
          {/* Left: Clean underline/segmented mode tabs */}
          <div
            className={`inline-flex flex-wrap items-center gap-0.5 p-0.5 rounded-lg ${wellBg}`}
            role="tablist"
          >
            {(
              [
                { id: 'camera', label: '视角与工况', icon: Camera },
                { id: 'params', label: '状态调节', icon: SlidersHorizontal },
                { id: 'layers', label: '标注图层', icon: Layers },
                { id: 'vector', label: '16-D 向量', icon: Table2 },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-1.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 sm:px-2.5 ${
                    active ? activeSoft : subtleHover
                  }`}
                >
                  <Icon className="hidden sm:block w-3.5 h-3.5 opacity-80" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Quiet telemetry + Play/Pause + Inline Collapse */}
          <div className="flex items-center gap-1 shrink-0 sm:gap-2">
            <div className="hidden md:flex items-center gap-2 text-[11px] font-mono-tabular pr-1">
              <span className={mutedText}>R</span>
              <span
                className={`font-semibold ${
                  snapshot.reward.total < -10
                    ? 'text-red-500'
                    : snapshot.reward.total > 0
                      ? darkMode
                        ? 'text-emerald-400'
                        : 'text-emerald-600'
                      : ''
                }`}
              >
                {snapshot.reward.total >= 0 ? '+' : ''}
                {snapshot.reward.total.toFixed(2)}
              </span>
              <span className={mutedText} aria-hidden="true">
                ·
              </span>
              <span className={mutedText}>命中 {hitCount}/9</span>
            </div>

            <span className={`hidden md:block h-3.5 w-px ${dividerCol}`} aria-hidden="true" />

            <button
              type="button"
              onClick={onToggleAnimating}
              aria-label={isAnimating ? '暂停轮胎动态' : '轮胎动态旋转'}
              title={isAnimating ? '暂停轮胎动态' : '轮胎动态旋转'}
              className={`inline-flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 sm:px-2.5 ${
                isAnimating
                  ? darkMode
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-emerald-50 text-emerald-700'
                  : subtleHover
              }`}
            >
              {isAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAnimating ? '暂停' : '动态'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleCollapse}
              aria-expanded={true}
              aria-label="收起控制面板"
              title="收起控制栏 (H)"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${subtleHover}`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Panel Body */}
        <div className="max-h-[40dvh] overflow-y-auto px-2.5 py-2.5 sm:px-3.5">
          {activeTab === 'camera' && (
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Camera segmented control */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[11px] font-medium whitespace-nowrap ${mutedText}`}>
                  视角
                </span>
                <div className={`inline-flex flex-wrap items-center gap-0.5 p-0.5 rounded-lg ${wellBg}`}>
                  {CAMERA_OPTIONS.map((cam) => (
                    <button
                      key={cam.id}
                      type="button"
                      aria-pressed={cameraPreset === cam.id}
                      onClick={() => onSelectCamera(cam.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                        cameraPreset === cam.id ? activeSegment : subtleHover
                      }`}
                    >
                      {cam.label}
                    </button>
                  ))}
                </div>
              </div>

              <span className={`hidden sm:block h-4 w-px ${dividerCol}`} aria-hidden="true" />

              {/* Scenario segmented control */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[11px] font-medium whitespace-nowrap ${mutedText}`}>
                  工况
                </span>
                <div className={`inline-flex flex-wrap items-center gap-0.5 p-0.5 rounded-lg ${wellBg}`}>
                  {SCENARIO_PRESETS.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      aria-pressed={scenarioId === sc.id}
                      onClick={() => onSelectScenario(sc.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                        scenarioId === sc.id ? activeSoft : subtleHover
                      }`}
                    >
                      {sc.nameZh}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'params' && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className={mutedText}>轮胎速度 v</span>
                    <span className="font-mono-tabular font-semibold">
                      {pose.speed.toFixed(2)}{' '}
                      <span className={`font-normal ${mutedText}`}>/ {CONFIG.CAR_BASE_SPEED}</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={CONFIG.CAR_BASE_SPEED}
                    step={0.02}
                    value={pose.speed}
                    onChange={(e) => onChangePose({ speed: parseFloat(e.target.value) })}
                    className={`studio-slider w-full ${
                      darkMode ? 'studio-slider-dark bg-white/15' : 'bg-slate-200'
                    }`}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className={mutedText}>中心线偏移</span>
                    <span className="font-mono-tabular font-semibold">
                      {pose.lateralOffset >= 0 ? '+' : ''}
                      {pose.lateralOffset.toFixed(1)} m
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-12.5}
                    max={12.5}
                    step={0.2}
                    value={pose.lateralOffset}
                    onChange={(e) => onChangePose({ lateralOffset: parseFloat(e.target.value) })}
                    className={`studio-slider w-full ${
                      darkMode ? 'studio-slider-dark bg-white/15' : 'bg-slate-200'
                    }`}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className={mutedText}>车头偏航角 θ</span>
                    <span className="font-mono-tabular font-semibold">
                      {pose.relativeYawDeg >= 0 ? '+' : ''}
                      {pose.relativeYawDeg.toFixed(0)}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-45}
                    max={45}
                    step={1}
                    value={pose.relativeYawDeg}
                    onChange={(e) => onChangePose({ relativeYawDeg: parseFloat(e.target.value) })}
                    className={`studio-slider w-full ${
                      darkMode ? 'studio-slider-dark bg-white/15' : 'bg-slate-200'
                    }`}
                  />
                </label>
              </div>

              {/* Clean inline Discrete(7) action selector bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-500/10">
                <span className={`text-[11px] font-medium whitespace-nowrap ${mutedText}`}>
                  离散动作
                </span>
                <div className={`inline-flex flex-wrap items-center gap-0.5 p-0.5 rounded-lg ${wellBg}`}>
                  {DISCRETE_ACTIONS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={pose.actionId === a.id}
                      onClick={() => onChangePose({ actionId: a.id })}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        pose.actionId === a.id ? activeSegment : subtleHover
                      }`}
                    >
                      <span className="font-mono-tabular opacity-65 mr-1">{a.id}</span>
                      {a.labelZh}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layers' && (
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { key: 'rays', label: '9向 LiDAR 射线' },
                  { key: 'rayBadges', label: '射线端测距' },
                  { key: 'speedArrow', label: '轮胎速度箭头' },
                  { key: 'centerline', label: '中心线向量' },
                  { key: 'headingAndPos', label: '朝向角与坐标' },
                  { key: 'aabbBoxes', label: 'AABB 碰撞框' },
                  { key: 'callouts', label: '工程引线卡' },
                ] as const
              ).map((item) => {
                const active = layers[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onToggleLayer(item.key)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? darkMode
                          ? 'bg-white/[0.12] text-white'
                          : 'bg-slate-900 text-white'
                        : `${wellBg} ${mutedText} hover:opacity-90`
                    }`}
                  >
                    <Check
                      className={`w-3 h-3 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'vector' && (
            <div
              className="grid grid-cols-4 sm:grid-cols-8 gap-1.5"
              data-testid="obs-vector-grid"
            >
              {snapshot.dimensions.map((d) => {
                const isHit = d.group === 'lidar' && snapshot.rays[d.index - 7]?.hit;
                return (
                  <div
                    key={d.index}
                    className={`px-2 py-1.5 rounded-lg text-[11px] border ${
                      isHit
                        ? darkMode
                          ? 'bg-red-500/15 border-red-500/40'
                          : 'bg-red-50/90 border-red-300/80'
                        : darkMode
                          ? 'bg-white/[0.04] border-white/[0.06]'
                          : 'bg-slate-50/90 border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`font-mono-tabular text-[10px] ${mutedText}`}>
                        [{d.index}]
                      </span>
                      <span className="truncate font-medium text-[11px]">
                        {d.group === 'lidar'
                          ? `${snapshot.rays[d.index - 7].angleDeg >= 0 ? '+' : ''}${snapshot.rays[d.index - 7].angleDeg}°`
                          : d.key.replace('track_', '')}
                      </span>
                    </div>
                    <div
                      className={`font-mono-tabular text-xs font-bold mt-0.5 ${
                        isHit ? (darkMode ? 'text-red-400' : 'text-red-600') : ''
                      }`}
                    >
                      {d.normalized.toFixed(3)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
