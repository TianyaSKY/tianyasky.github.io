import React from 'react';
import { stats, interestTags } from '../data/personalData';

export default function About() {
  return (
    <section id="about" className="section-inner">
      <div className="section-label">关于 · About the author</div>

      <div className="about-grid">
        <div className="about-prose">
          <p className="dropcap">
            <span className="dropcap-letter">我</span>是<strong>陈敏祥</strong>，大连海洋大学计算机科学与技术专业 2023 级本科生。我把
            <em>计算机视觉与三维几何</em>、<em>AI 原生系统与智能体工程</em>作为两条长期主线：前者研究如何从有限视觉信息恢复可靠空间关系，后者关注模型如何在明确权限、状态与反馈的系统中真正完成任务。
          </p>
          <p>
            科研侧，我以<strong>国家级大创项目第一负责人</strong>身份推进近海单目视觉定位：从杆状标志物检测、亚像素角点识别，到针对共线几何退化重新设计约束与非线性求解，并把算法部署到 Jetson 边缘设备上完成实时验证。沿着这条路线，我持续补足 PyTorch、OpenCV、目标检测与位姿解算的训练和工程化能力。
          </p>
          <p>
            工程侧，我更关心一条功能背后的完整数据流。<strong>SKYCloud</strong>把分片存储、RAG、MCP 与受控 OpenCode Runtime 组织成 AI Workspace；<strong>SKYOJ</strong>用三类评测协议、异步任务和 Docker 沙箱服务高校教学；<strong>SKYDouyin</strong>则从视频上传、行为事件一路打通到用户冷启动与 Milvus 向量召回。
          </p>
          <p>
            最近的<strong>SKYCity</strong>把这种系统思维放进一个 2D AI 小镇：LLM 只负责表达行动意图，世界引擎维护唯一真值，九位居民通过记忆、关系、工作、消费与对话形成可运行的经济闭环。相比“接入一个模型接口”，我更在意系统是否可观察、可回放、可限制，也愿意在每个项目里写清问题、取舍与下一步。
          </p>
        </div>

        <div>
          <div className="kicker" style={{ marginBottom: '1.25rem' }}>兴趣方向 / Interests</div>
          <ul className="interest-list">
            {interestTags.map((tag) => (
              <li key={tag}>
                <span className="label">{tag}</span>
                <span className="meta">/ 兴趣</span>
              </li>
            ))}
          </ul>

          <div className="kicker kicker-mid" style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
            数据 / In numbers
          </div>
          <ul className="interest-list">
            {stats.map((s) => (
              <li key={s.label}>
                <span className="label" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.4rem' }}>
                  {s.value}
                  {s.sub && <span style={{ color: 'var(--color-text-light)', fontSize: '0.6em', marginLeft: 4 }}>{s.sub}</span>}
                </span>
                <span className="meta">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
