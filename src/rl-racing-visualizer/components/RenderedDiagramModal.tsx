import React from 'react';
import { Download, X } from 'lucide-react';
import AccessibleDialog from '../../components/AccessibleDialog';
import { RenderedDiagramResult } from '../render/exportDiagramCanvas';

interface RenderedDiagramModalProps {
  result: RenderedDiagramResult | null;
  darkMode: boolean;
  onClose: () => void;
}

export const RenderedDiagramModal: React.FC<RenderedDiagramModalProps> = ({
  result,
  darkMode,
  onClose,
}) => {
  if (!result) return null;

  return (
    <AccessibleDialog
      label="Diagram preview"
      onClose={onClose}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 md:p-8"
      dialogClassName={`relative flex flex-col max-w-6xl w-full max-h-[92dvh] rounded-xl border shadow-2xl overflow-hidden ${
        darkMode ? 'bg-[#0e131e] border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
        {/* Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3.5 border-b sm:flex-nowrap sm:gap-4 sm:px-5 ${
            darkMode ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight">
              Rendered diagram · {result.width} × {result.height} PNG
            </h2>
            <p
              className={`text-xs mt-0.5 truncate ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              9-ray LiDAR, tire velocity, centerline offset, and the 16-D observation vector
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={result.dataUrl}
              download="rl-racing-3d-observation-diagram.png"
              className="inline-flex min-h-11 items-center gap-2 px-4 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              data-dialog-initial-focus
              className={`grid min-h-11 min-w-11 place-items-center rounded-lg transition-colors cursor-pointer ${
                darkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rendered Image Canvas Preview */}
        <div
          className={`flex-1 overflow-auto p-4 flex items-center justify-center ${
            darkMode ? 'bg-slate-950' : 'bg-slate-100'
          }`}
        >
          <img
            src={result.dataUrl}
            alt="RL Racing 3D Observation Space & 9-Ray LiDAR Rendered Technical Diagram"
            data-testid="rendered-diagram-image"
            className="max-w-full max-h-[74vh] w-auto h-auto rounded-lg border border-slate-300/60 shadow-md object-contain"
          />
        </div>
    </AccessibleDialog>
  );
};
