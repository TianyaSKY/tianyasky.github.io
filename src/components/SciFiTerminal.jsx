import React, { useState } from 'react';
import { sciFiPresetPrompts } from '../data/personalData';
import { Terminal, Play, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export default function SciFiTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePromptId, setActivePromptId] = useState(null);
  const [output, setOutput] = useState('Qwen2.5-7B-LoRA 慈欣体生成测试模型准备就绪。\n点击上方预设指令开始运行大模型推演...');
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePresetClick = (preset) => {
    if (isGenerating) return;
    setActivePromptId(preset.id);
    setIsGenerating(true);
    setOutput(`> INPUT: ${preset.prompt}\n\n[LoRA Attention 权重激活中 | 提示词温度 T=0.75 | 采样中...]\n\n`);

    let fullText = preset.response;
    let i = 0;

    const timer = setInterval(() => {
      if (i < fullText.length) {
        setOutput((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setIsGenerating(false);
      }
    }, 25);
  };

  const handleReset = () => {
    setActivePromptId(null);
    setIsGenerating(false);
    setOutput('Qwen2.5-7B-LoRA 慈欣体生成测试模型准备就绪。\n点击上方预设指令开始运行大模型推演...');
  };

  return (
    <div className="sci-fi-wrapper">
      <button
        className="btn-sci-fi-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Terminal size={18} />
        {isOpen ? '收起「慈欣体」AI 生成终端' : '启动「慈欣体」AI 生成终端 (Interactive Mock)'}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="sci-fi-console">
          <div className="console-header">
            <span className="console-dot red"></span>
            <span className="console-dot yellow"></span>
            <span className="console-dot green"></span>
            <span className="console-title">
              Qwen2.5-7B-LoRA-Cixin-Singularity Terminal (v1.0.4)
            </span>
          </div>

          <div className="console-body">
            <div className="preset-buttons-group">
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                选择生成场景：
              </span>
              {sciFiPresetPrompts.map((preset) => (
                <button
                  key={preset.id}
                  className="preset-btn"
                  onClick={() => handlePresetClick(preset)}
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
                重置终端
              </button>
            </div>

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
