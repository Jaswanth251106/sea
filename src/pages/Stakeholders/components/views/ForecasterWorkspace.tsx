import React, { useState } from 'react';
import { StakeholderConfig } from '../../data/stakeholderData';
import ScientificPanel from '../common/ScientificPanel';
import { MetricRow, HeroMetric } from '../common/MetricReadout';
import ActionButton from '../common/ActionButton';
import ActionModal from '../common/ActionModal';

interface ForecasterWorkspaceProps {
  config: StakeholderConfig;
}

export const ForecasterWorkspace: React.FC<ForecasterWorkspaceProps> = ({ config }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedConditionTab, setSelectedConditionTab] = useState<'temp' | 'curr' | 'wave' | 'anom'>('temp');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showWindOverlay, setShowWindOverlay] = useState(false);

  const timelineSteps = config.timelineSteps || [];
  const currentTimeline = timelineSteps[activeStepIndex] || timelineSteps[0];

  return (
    <div className="workspace-inner">
      {/* Top Layout: Current Conditions & Forecast Timeline */}
      <div className="panels-grid" style={{ marginBottom: '16px' }}>
        {/* Panel 1: CURRENT OCEAN CONDITIONS */}
        <ScientificPanel
          title="Current Ocean Conditions"
          tag="Real-Time Analysis"
          meta="Station: Sector 4"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <HeroMetric
              label="SST"
              value="29.1"
              unit="°C"
              subtext="Sea Surface Temp"
              statusColor="var(--color-ocean-blue)"
            />
            <HeroMetric
              label="Current"
              value="0.85"
              unit="m/s"
              subtext="Surface Speed"
              statusColor="var(--color-warning)"
            />
            <HeroMetric
              label="Salinity"
              value="33.8"
              unit="PSU"
              subtext="Salinity Units"
              statusColor="var(--color-marine-teal)"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '6px' }}>
            <MetricRow label="Sig. Wave Height (Hs)" value="1.8 m" detail="Period: 7.4s" />
            <MetricRow label="Wind Velocity" value="14.2 kt" detail="245° SW Flow" />
            <MetricRow label="Mixed Layer Depth" value="38 m" badge="Stratified" badgeType="badge-normal" />
          </div>
        </ScientificPanel>

        {/* Panel 2: FORECAST TIMELINE */}
        <ScientificPanel
          title="Forecast Timeline"
          tag="Forecast"
          meta={`${currentTimeline?.label || ''} (${currentTimeline?.offset || ''})`}
        >
          {/* Timeline Buttons */}
          <div className="timeline-bar">
            {timelineSteps.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                className={`timeline-step ${activeStepIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveStepIndex(idx)}
              >
                <div>{step.label}</div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                  {step.offset}
                </div>
              </button>
            ))}
          </div>

          {/* Condition Tab Selector */}
          <div className="layer-toggle-group" style={{ marginTop: '10px' }}>
            <button
              type="button"
              className={`layer-btn ${selectedConditionTab === 'temp' ? 'active' : ''}`}
              onClick={() => setSelectedConditionTab('temp')}
            >
              Temperature
            </button>
            <button
              type="button"
              className={`layer-btn ${selectedConditionTab === 'curr' ? 'active' : ''}`}
              onClick={() => setSelectedConditionTab('curr')}
            >
              Current
            </button>
            <button
              type="button"
              className={`layer-btn ${selectedConditionTab === 'wave' ? 'active' : ''}`}
              onClick={() => setSelectedConditionTab('wave')}
            >
              Wave
            </button>
            <button
              type="button"
              className={`layer-btn ${selectedConditionTab === 'anom' ? 'active' : ''}`}
              onClick={() => setSelectedConditionTab('anom')}
            >
              Anomaly
            </button>
          </div>

          {/* Condition Details Card */}
          <div style={{ background: '#F8FBFE', padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: '8px', marginTop: '10px' }}>
            {selectedConditionTab === 'temp' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>PROJECTED SST ({currentTimeline?.label})</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-ocean-blue)' }}>{currentTimeline?.sst}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  <div>Trend: +0.2°C / 24h</div>
                  <div style={{ color: 'var(--color-success)', fontWeight: 600 }}>Spread: ±0.15°C</div>
                </div>
              </div>
            )}

            {selectedConditionTab === 'curr' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>PROJECTED CURRENT ({currentTimeline?.label})</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-warning)' }}>{currentTimeline?.current}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  <div>Direction: 068° ENE</div>
                  <div style={{ color: '#B45309', fontWeight: 600 }}>Shear: 0.12 s⁻¹</div>
                </div>
              </div>
            )}

            {selectedConditionTab === 'wave' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>SIG. WAVE HEIGHT ({currentTimeline?.label})</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{currentTimeline?.wave}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  <div>Primary Swell: 8.2s @ 210°</div>
                  <div>Sea State: Moderate</div>
                </div>
              </div>
            )}

            {selectedConditionTab === 'anom' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>THERMAL ANOMALY ({currentTimeline?.label})</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-warning)' }}>{currentTimeline?.anomaly}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  <div>Baseline: 1991–2020</div>
                  <div style={{ color: '#B45309', fontWeight: 600 }}>Status: Alert</div>
                </div>
              </div>
            )}
          </div>
        </ScientificPanel>

        {/* Panel 3: OPERATIONAL ALERTS */}
        <ScientificPanel
          title="Forecast Alerts"
          tag="Alerts"
          meta={`${config.alerts?.length || 0} Active`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {config.alerts?.map((alert, i) => (
              <div key={i} className="forecast-alert-box">
                <span className="alert-icon">⚠</span>
                <div className="alert-content">
                  <span className="alert-title">{alert.title}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{alert.location}</span>
                  <span className="alert-desc">{alert.desc}</span>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '2px', padding: '10px 12px', background: '#F8FBFE', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
              <div style={{ color: 'var(--color-ocean-blue)', fontWeight: 700, marginBottom: '2px' }}>
                Forecast Confidence Index: 92%
              </div>
              <div>Boundary conditions verified against scatterometer winds.</div>
              {showWindOverlay && (
                <div style={{ color: 'var(--color-success)', fontWeight: 600, marginTop: '4px' }}>
                  ✓ Surface wind vector field active (14.2 kt SW flow).
                </div>
              )}
            </div>
          </div>
        </ScientificPanel>
      </div>

      {/* Forecaster Action Bar */}
      <div className="workspace-action-bar">
        <span className="action-bar-label">Forecaster Operations:</span>
        <div className="action-buttons-group">
          <ActionButton
            label="Run Model Ensemble"
            primary={true}
            onClick={() => setActiveModal('run_ensemble')}
          />
          <ActionButton
            label="Export Reanalysis Package"
            primary={false}
            onClick={() => setActiveModal('export_reanalysis')}
          />
          <ActionButton
            label={showWindOverlay ? 'Disable Wind Overlay' : 'Toggle Wind Overlay'}
            primary={false}
            onClick={() => setShowWindOverlay(!showWindOverlay)}
          />
        </div>
      </div>

      {/* Modals */}
      <ActionModal
        isOpen={activeModal === 'run_ensemble'}
        onClose={() => setActiveModal(null)}
        title="20-Member Numerical Model Ensemble"
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Executing perturbation ensemble across 20 model realizations for Sector 4.
        </p>
        <div style={{ background: 'var(--color-bg-page)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px' }}>
          <div><strong>Ensemble Convergence:</strong> 94.6% agreement at +72 hours</div>
          <div><strong>SST Spread (T+72h):</strong> 28.9°C min · 29.2°C median · 29.6°C max</div>
          <div><strong>Current Shear Probability:</strong> 78% likelihood &gt; 1.0 m/s</div>
          <div style={{ color: 'var(--color-success)', fontWeight: 600, marginTop: '8px' }}>
            ✓ Forecast envelope calculated and synchronized.
          </div>
        </div>
      </ActionModal>

      <ActionModal
        isOpen={activeModal === 'export_reanalysis'}
        onClose={() => setActiveModal(null)}
        title="Export Reanalysis Data Package"
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Standard NetCDF-4 / GRIB2 operational payload for external meteorology systems.
        </p>
        <div style={{ background: 'var(--color-bg-page)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px' }}>
          <div><strong>Filename:</strong> OCEANX_FCST_BAY_OF_BENGAL_06Z.nc</div>
          <div><strong>Parameters:</strong> SST, surface current, salinity, MLD, wave height</div>
          <div><strong>Resolution:</strong> 3-hourly from 0 to 72 hours</div>
          <div style={{ color: 'var(--color-ocean-blue)', fontWeight: 600, marginTop: '6px' }}>
            ✓ Package ready for secure download.
          </div>
        </div>
      </ActionModal>
    </div>
  );
};

export default ForecasterWorkspace;
