import React, { useState } from 'react';
import { sciFiPresetPrompts } from '../data/personalData';
import { Terminal, Play, RefreshCw, ChevronDown, ChevronUp, Cpu, Send } from 'lucide-react';

export default function SciFiTerminal({ defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('Qwen3.6-27B-4bit-QLoRA sci-fi continuation terminal ready.\nEnter a preceding passage (or select a preset prompt above) to generate Cixin Liu-style continuation...');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokensPerSec, setTokensPerSec] = useState('110');

  const runGeneration = (promptText) => {
    if (isGenerating || !promptText.trim()) return;
    setIsGenerating(true);
    setOutput(`> INPUT: ${promptText}\n\n[LoRA Attention Active | VRAM: 16.8GB/32GB | SFT 0.039% Params | Temperature T=0.8]\n\n`);

    let fullText = "";
    const matchedPreset = sciFiPresetPrompts.find((p) => promptText.includes(p.label) || promptText.includes(p.prompt));

    if (matchedPreset) {
      fullText = matchedPreset.response;
    } else {
      fullText = `[Simulated Continuation: Cixin Liu Hard Sci-Fi Style]\nAcross the microscopic quantum scale and the macroscopic cosmic field, "${promptText}" unfolded with cold physical order. The dimensional folding front propagated at light speed; before stellar-grade energy inflation, the struggles of carbon-based civilization were no more than dust. Silence was not an endpoint, but the ground state of cosmic reconfiguration.`;
    }

    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setOutput((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setIsGenerating(false);
      }
    }, 20);
  };

  const handleReset = () => {
    setIsGenerating(false);
    setCustomInput('');
    setOutput('Qwen3.6-27B-4bit-QLoRA sci-fi continuation terminal ready.\nEnter a preceding passage (or select a preset prompt above) to generate Cixin Liu-style continuation...');
  };

  return (
    <div className="sci-fi-wrapper">
      <button
        className="btn-sci-fi-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Terminal size={18} />
        {isOpen ? 'Collapse Sci-Fi Continuation Terminal' : 'Launch Sci-Fi Continuation Terminal (Interactive AI Terminal)'}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="sci-fi-console">
          <div className="console-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="console-dot red"></span>
              <span className="console-dot yellow"></span>
              <span className="console-dot green"></span>
              <span className="console-title">
                Qwen3.6-27B-4bit-QLoRA-Cixin-Singularity Terminal
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.75rem', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
              <span><Cpu size={12} style={{ display: 'inline', marginRight: 2 }} /> {tokensPerSec} tok/s</span>
              <span>GPU: RTX 5090 · 32GB</span>
            </div>
          </div>

          <div className="console-body">
            <div className="preset-buttons-group">
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                Preset prompts:
              </span>
              {sciFiPresetPrompts.map((preset) => (
                <button
                  key={preset.id}
                  className="preset-btn"
                  onClick={() => runGeneration(preset.prompt)}
                  disabled={isGenerating}
                >
                  <Play size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {preset.label}
                </button>
              ))}
              <button
                className="preset-btn"
                style={{ borderColor: '#64748b', color: '#94a3b8' }}
                onClick={handleReset}
                disabled={isGenerating}
              >
                <RefreshCw size={12} style={{ display: 'inline', marginRight: 4 }} />
                Reset
              </button>
            </div>

            {/* Custom Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runGeneration(customInput);
              }}
              style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
            >
              <input
                type="text"
                placeholder="Or enter a custom sci-fi prompt (e.g., Photoid strike on Jupiter)..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                disabled={isGenerating}
                style={{
                  flex: 1,
                  background: '#030712',
                  border: '1px solid #1e3a8a',
                  borderRadius: '6px',
                  padding: '0.45rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={isGenerating || !customInput.trim()}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <Send size={14} /> Generate
              </button>
            </form>

            <div className="console-output-box">
              {output}
              {isGenerating && <span className="typing-cursor"></span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
