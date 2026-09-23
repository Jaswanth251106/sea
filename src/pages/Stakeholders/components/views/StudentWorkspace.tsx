import React, { useState } from 'react';
import { StakeholderConfig } from '../../data/stakeholderData';
import ScientificPanel from '../common/ScientificPanel';
import ActionButton from '../common/ActionButton';
import ActionModal from '../common/ActionModal';

interface StudentWorkspaceProps {
  config: StakeholderConfig;
}

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({ config }) => {
  const [depth, setDepth] = useState(350);
  const [selectedTopic, setSelectedTopic] = useState('currents');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<{ q1?: boolean; q2?: boolean } | null>(null);

  const getZoneInfo = (d: number) => {
    if (d <= 200) {
      return {
        name: 'Sunlight Zone (Epipelagic)',
        desc: 'Sunlight penetrates clearly. Photosynthetic phytoplankton thrive here, sustaining the primary ocean food web.',
        temp: Math.round(28 - (d / 200) * 8),
        sunlight: `${Math.round(100 - (d / 200) * 90)}%`,
        pressure: `${(1 + d / 10).toFixed(0)} atm`,
      };
    } else if (d <= 900) {
      const frac = (d - 200) / 700;
      return {
        name: 'Twilight Zone (Mesopelagic)',
        desc: 'Rapidly diminishing light. Plants cannot grow. Marine organisms exhibit large eyes and bioluminescence.',
        temp: Math.round(20 - frac * 13),
        sunlight: '< 1% (Dim Twilight)',
        pressure: `${(1 + d / 10).toFixed(0)} atm`,
      };
    } else {
      return {
        name: 'Midnight Zone (Bathypelagic)',
        desc: 'Complete perpetual darkness. Temperatures near freezing. Organisms rely on organic marine snow from above.',
        temp: 4,
        sunlight: '0% (Total Darkness)',
        pressure: `${(1 + d / 10).toFixed(0)} atm`,
      };
    }
  };

  const zone = getZoneInfo(depth);
  const topics = config.topics || {};
  const topic = topics[selectedTopic] || topics.currents;

  return (
    <div className="workspace-inner">
      <div className="panels-grid-1-2">
        {/* Left Column: Water column below surface */}
        <ScientificPanel
          title="What Happens Below the Surface?"
          tag="3D Ocean"
          meta="Depth Explorer"
        >
          {/* Depth Slider */}
          <div className="depth-slider-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                Depth Selection:
              </span>
              <span style={{ fontSize: '20px', color: 'var(--color-ocean-blue)', fontWeight: 800 }}>
                {depth} meters
              </span>
            </div>

            <div className="slider-track-wrap">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="depth-slider"
                aria-label="Ocean depth slider from 0 to 1000 meters"
              />
            </div>

            <div className="depth-ticks">
              <span>0m (Surface)</span>
              <span>200m (Sunlight limit)</span>
              <span>500m (Thermocline)</span>
              <span>1000m (Deep Ocean)</span>
            </div>
          </div>

          {/* Dynamic Layer Card */}
          <div
            style={{
              background: '#F8FBFE',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <span
                className="metric-badge"
                style={{
                  background: 'var(--color-sky-blue)',
                  color: 'var(--color-ocean-blue)',
                  border: '1px solid #BAE6FD',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                ● {zone.name}
              </span>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
                {zone.desc}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#FFFFFF', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>WATER TEMP</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{zone.temp}°C</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>SUNLIGHT</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{zone.sunlight}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>PRESSURE</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{zone.pressure}</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
            Drag the depth slider above to observe temperature and light attenuation.
          </div>
        </ScientificPanel>

        {/* Right Column: Explore Ocean Concepts */}
        <ScientificPanel
          title="Explore Ocean Concepts"
          tag="Explore"
          meta={`${Object.keys(topics).length} Interactive Topics`}
        >
          {/* Topic Pills */}
          <div className="student-topic-pills">
            {Object.values(topics).map((t) => (
              <button
                key={t.id}
                type="button"
                className={`topic-pill ${selectedTopic === t.id ? 'active' : ''}`}
                onClick={() => setSelectedTopic(t.id)}
              >
                <span>{t.icon}</span>
                <span>{t.title.split(':')[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Topic Card */}
          {topic && (
            <div className="concept-card">
              <div className="concept-title">
                <span>{topic.icon}</span>
                <span>{topic.title}</span>
              </div>

              <p className="concept-text">{topic.simpleText}</p>

              <div className="concept-takeaway">
                💡 {topic.takeaway}
              </div>
            </div>
          )}
        </ScientificPanel>
      </div>

      {/* Student Action Bar */}
      <div className="workspace-action-bar" style={{ marginTop: '16px' }}>
        <span className="action-bar-label">Interactive Learning:</span>
        <div className="action-buttons-group">
          {config.actions.map((act) => (
            <ActionButton
              key={act.id}
              label={act.label}
              primary={act.primary}
              onClick={() => {
                if (act.id === 'reset_depth') {
                  setDepth(0);
                } else if (act.id === 'launch_float') {
                  setDepth(0);
                  let curr = 0;
                  const intv = setInterval(() => {
                    curr += 100;
                    if (curr <= 1000) {
                      setDepth(curr);
                    } else {
                      clearInterval(intv);
                    }
                  }, 300);
                } else {
                  setActiveModal(act.id);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Quiz Modal */}
      <ActionModal
        isOpen={activeModal === 'ocean_quiz'}
        onClose={() => {
          setActiveModal(null);
          setQuizScore(null);
        }}
        title="Interactive Ocean Science Quiz"
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Test your ocean knowledge with these two questions:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#F8FBFE', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Q1: How deep do autonomous Argo floats dive during their mission cycle?
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['50 meters', '500 meters', '2,000 meters'].map((ans) => (
                <button
                  key={ans}
                  type="button"
                  className="action-btn"
                  onClick={() => setQuizScore((prev) => ({ ...prev, q1: ans === '2,000 meters' }))}
                >
                  {ans}
                </button>
              ))}
            </div>
            {quizScore && quizScore.q1 !== undefined && (
              <div style={{ marginTop: '8px', color: quizScore.q1 ? 'var(--color-success)' : 'var(--color-danger)', fontSize: '12px', fontWeight: 600 }}>
                {quizScore.q1 ? '✓ Correct! Argo floats dive down to 2,000 meters.' : '✗ Try again! Argo floats dive to 2,000 meters.'}
              </div>
            )}
          </div>

          <div style={{ background: '#F8FBFE', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Q2: What is the steep temperature drop layer called?
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Thermocline', 'Halocline', 'Epipelagic'].map((ans) => (
                <button
                  key={ans}
                  type="button"
                  className="action-btn"
                  onClick={() => setQuizScore((prev) => ({ ...prev, q2: ans === 'Thermocline' }))}
                >
                  {ans}
                </button>
              ))}
            </div>
            {quizScore && quizScore.q2 !== undefined && (
              <div style={{ marginTop: '8px', color: quizScore.q2 ? 'var(--color-success)' : 'var(--color-danger)', fontSize: '12px', fontWeight: 600 }}>
                {quizScore.q2 ? '✓ Correct! The Thermocline is the layer where water temperature plunges rapidly.' : '✗ Try again! It is the Thermocline.'}
              </div>
            )}
          </div>
        </div>
      </ActionModal>
    </div>
  );
};

export default StudentWorkspace;
