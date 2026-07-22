import React, { useState } from 'react';
import { sciFiPresetPrompts } from '../data/personalData';
import { Terminal, Play, RefreshCw, ChevronDown, ChevronUp, Cpu, Send } from 'lucide-react';

export default function SciFiTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('Qwen2.5-7B-LoRA 慈欣体生成测试终端就绪。\n请输入自定义场景描述，或点击上方预设指令发起大模型推理推演...');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokensPerSec, setTokensPerSec] = useState('46.8');

  const runGeneration = (promptText) => {
    if (isGenerating || !promptText.trim()) return;
    setIsGenerating(true);
    setOutput(`> INPUT: ${promptText}\n\n[LoRA Attention 权重激活 | VRAM: 1.2GB/16GB | SFT 0.3% 参数量 | 提示词温度 T=0.75]\n\n`);

    let fullText = "";
    const matchedPreset = sciFiPresetPrompts.find((p) => promptText.includes(p.label) || promptText.includes(p.prompt));

    if (matchedPreset) {
      fullText = matchedPreset.response;
    } else {
      fullText = `【模拟推演：慈欣体风格生成】\n在无垠的微观量子尺度与宏观宇宙场中，"${promptText}" 展现出了极其冰冷与壮丽的物理秩序。维度折叠场以光速扩散，碳基文明微不足道的挣扎在恒星级能量暴涨面前宛如微尘。死寂不是终点，而是宇宙重组的基态。`;
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
    setOutput('Qwen2.5-7B-LoRA 慈欣体生成测试终端就绪。\n请输入自定义场景描述，或点击上方预设指令发起大模型推理推演...');
  };

  return (
    <div className="sci-fi-wrapper">
      <button
        className="btn-sci-fi-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Terminal size={18} />
        {isOpen ? '收起「慈欣体」大模型生成终端' : '启动「慈欣体」大模型生成终端 (Interactive AI Terminal)'}
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
                Qwen2.5-7B-LoRA-Cixin-Singularity Terminal
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.75rem', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
              <span><Cpu size={12} style={{ display: 'inline', marginRight: 2 }} /> {tokensPerSec} tok/s</span>
              <span>GPU: Dual T4</span>
            </div>
          </div>

          <div className="console-body">
            <div className="preset-buttons-group">
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                选择预设指令：
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
                重置
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
                placeholder="或输入自定义科幻场景提示词 (例如: 死星撞击木星)..."
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
                <Send size={14} /> 生成
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
