import React, { useState } from 'react';
import { StakeholderConfig } from '../../data/stakeholderData';
import ScientificPanel from '../common/ScientificPanel';
import { MetricRow, HeroMetric } from '../common/MetricReadout';
import ActionButton from '../common/ActionButton';
import ActionModal from '../common/ActionModal';

interface ResearcherWorkspaceProps {
  config: StakeholderConfig;
}

export const ResearcherWorkspace: React.FC<ResearcherWorkspaceProps> = ({ config }) => {
  const [selectedLayer, setSelectedLayer] = useState<'temp' | 'sal' | 'vel'>('temp');
  const [selectedSlice, setSelectedSlice] = useState<'surface' | '200m' | '500m' | '1000m'>('500m');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const sliceDepths = {
    surface: { depth: '0m', temp: '29.1°C', sal: '33.8 PSU', vel: '0.85 m/s' },
    '200m': { depth: '200m', temp: '16.4°C', sal: '34.7 PSU', vel: '0.32 m/s' },
    '500m': { depth: '500m', temp: '10.2°C', sal: '35.1 PSU', vel: '0.14 m/s' },
    '1000m': { depth: '1000m', temp: '6.8°C', sal: '35.2 PSU', vel: '0.05 m/s' },
  };

  const activeSliceData = sliceDepths[selectedSlice];

  return (
    <div className="workspace-inner">
      {/* 3-Panel Scientific Layout */}
      <div className="panels-grid">
        {/* Panel 1: 3D OCEAN */}
        <ScientificPanel
          title="3D Ocean Water Column"
          tag="3D Ocean"
          meta="0.08° Resolution Grid"
        >
          {/* Layer and Slice Toggles */}
          <div className="layer-toggle-group" style={{ marginBottom: '8px' }}>
            <button
              type="button"
              className={`layer-btn ${selectedLayer === 'temp' ? 'active' : ''}`}
              onClick={() => setSelectedLayer('temp')}
            >
              Temperature
            </button>
            <button
              type="button"
              className={`layer-btn ${selectedLayer === 'sal' ? 'active' : ''}`}
              onClick={() => setSelectedLayer('sal')}
            >
              Salinity
            </button>
            <button
              type="button"
              className={`layer-btn ${selectedLayer === 'vel' ? 'active' : ''}`}
              onClick={() => setSelectedLayer('vel')}
            >
              Velocity
            </button>
          </div>

          {/* Depth Slice Selector */}
          <div className="layer-toggle-group">
            {(['surface', '200m', '500m', '1000m'] as const).map((slice) => (
              <button
                key={slice}
                type="button"
                className={`layer-btn ${selectedSlice === slice ? 'active' : ''}`}
                onClick={() => setSelectedSlice(slice)}
              >
                {slice === '500m' ? '500m slice' : slice}
              </button>
            ))}
          </div>

          {/* Physical Layer Telemetry Matrix */}
          <div style={{ background: '#F8FBFE', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '14px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Active Iso-Surface</span>
              <span className="metric-badge badge-decreasing">{activeSliceData.depth} Layer</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <HeroMetric
                label="Layer Temperature"
                value={activeSliceData.temp}
                subtext="In-situ thermodynamic"
                statusColor="var(--color-ocean-blue)"
              />
              <HeroMetric
                label="Salinity (PSU)"
                value={activeSliceData.sal}
                subtext="Practical Salinity Units"
                statusColor="var(--color-marine-teal)"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '8px' }}>
              <MetricRow label="Velocity Magnitude" value={activeSliceData.vel} detail="068° ENE flow" />
              <MetricRow label="20°C Isotherm Depth" value="142.4 m" detail="Sector 88.3°E" />
              <MetricRow label="Stratification Phase" value={selectedSlice === 'surface' ? 'Mixed Layer' : selectedSlice === '200m' ? 'Thermocline' : 'Deep Water'} badge="Assimilated" badgeType="badge-normal" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
            <MetricRow label="Slice Depth" value={activeSliceData.depth} />
            <MetricRow label="Temp at Slice" value={activeSliceData.temp} />
          </div>
        </ScientificPanel>

        {/* Panel 2: MODEL VS OBSERVATION */}
        <ScientificPanel
          title="Model vs Observation"
          tag="Model vs Argo"
          meta="42 Active Profiles"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <HeroMetric
              label="RMSE"
              value="0.34"
              unit="°C"
              subtext="Root Mean Square Error"
              statusColor="var(--color-success)"
            />
            <HeroMetric
              label="Correlation"
              value="0.96"
              unit="Pearson"
              subtext="p < 0.001 (High agreement)"
              statusColor="var(--color-ocean-blue)"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <MetricRow label="Mean Bias" value="-0.04°C" badge="Low Bias" badgeType="badge-normal" />
            <MetricRow label="In-Situ Argo Floats" value="42 Active" detail="Sector 88.3°E" />
            <MetricRow label="Standard Deviation (σ)" value="0.28°C" />
          </div>

          {/* Profile Graph */}
          <div className="mini-profile-box">
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Temperature Profile (0 - 1000m)</span>
              <span style={{ color: 'var(--color-ocean-blue)' }}>── Model  ┄┄ Argo</span>
            </div>
            <svg viewBox="0 0 300 85" style={{ width: '100%', height: '75px' }}>
              <line x1="30" y1="10" x2="280" y2="10" stroke="#EDF4F9" strokeWidth="1" />
              <line x1="30" y1="42" x2="280" y2="42" stroke="#EDF4F9" strokeWidth="1" />
              <line x1="30" y1="75" x2="280" y2="75" stroke="#EDF4F9" strokeWidth="1" />

              <path
                d="M 30,15 C 60,18 100,50 160,65 C 220,72 260,78 280,80"
                fill="none"
                stroke="var(--color-ocean-blue)"
                strokeWidth="2.5"
              />

              <path
                d="M 30,14 C 62,20 102,48 162,67 C 218,74 258,77 280,79"
                fill="none"
                stroke="var(--color-success)"
                strokeWidth="2"
                strokeDasharray="4 3"
              />

              <text x="5" y="18" fill="var(--color-text-secondary)" fontSize="8.5">0m</text>
              <text x="0" y="48" fill="var(--color-text-secondary)" fontSize="8.5">500m</text>
              <text x="0" y="78" fill="var(--color-text-secondary)" fontSize="8.5">1km</text>

              <text x="30" y="84" fill="var(--color-text-secondary)" fontSize="8.5">28°C</text>
              <text x="150" y="84" fill="var(--color-text-secondary)" fontSize="8.5">15°C</text>
              <text x="265" y="84" fill="var(--color-text-secondary)" fontSize="8.5">4°C</text>
            </svg>
          </div>
        </ScientificPanel>

        {/* Panel 3: TREND */}
        <ScientificPanel
          title="Climatological Trend"
          tag="Trend"
          meta="1991–2020 Baseline"
        >
          <HeroMetric
            label="Thermal Trend"
            value="+0.018"
            unit="°C/year"
            subtext="Increasing [95% CI: 0.014 - 0.022]"
            statusColor="var(--color-warning)"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <MetricRow
              label="Trajectory"
              value="Increasing"
              badge="Significant"
              badgeType="badge-warning"
            />
            <MetricRow label="Cumulative 30-Yr Delta" value="+0.54°C" detail="Upper 300m" />
            <MetricRow label="Salinity Trend" value="-0.04 PSU/decade" detail="Monsoon runoff" />
          </div>

          <div className="mini-profile-box" style={{ height: '110px' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Annual SST Anomaly</span>
              <span style={{ color: '#B45309', fontWeight: 700 }}>+0.82°C Anomaly</span>
            </div>
            <svg viewBox="0 0 300 65" style={{ width: '100%', height: '65px' }}>
              <line x1="10" y1="35" x2="290" y2="35" stroke="var(--color-border)" strokeWidth="1" />

              {[
                { x: 15, h: -6, positive: false },
                { x: 35, h: -12, positive: false },
                { x: 55, h: -4, positive: false },
                { x: 75, h: 5, positive: true },
                { x: 95, h: -2, positive: false },
                { x: 115, h: 8, positive: true },
                { x: 135, h: 12, positive: true },
                { x: 155, h: 10, positive: true },
                { x: 175, h: 15, positive: true },
                { x: 195, h: 18, positive: true },
                { x: 215, h: 14, positive: true },
                { x: 235, h: 22, positive: true },
                { x: 255, h: 26, positive: true },
                { x: 275, h: 29, positive: true },
              ].map((bar, i) => (
                <rect
                  key={i}
                  x={bar.x}
                  y={bar.positive ? 35 - bar.h : 35}
                  width="12"
                  height={Math.abs(bar.h)}
                  fill={bar.positive ? 'rgba(245, 158, 11, 0.85)' : 'rgba(8, 127, 234, 0.75)'}
                  rx="1"
                />
              ))}

              <text x="15" y="60" fill="var(--color-text-secondary)" fontSize="8.5">1995</text>
              <text x="140" y="60" fill="var(--color-text-secondary)" fontSize="8.5">2010</text>
              <text x="265" y="60" fill="var(--color-text-secondary)" fontSize="8.5">2025</text>
            </svg>
          </div>
        </ScientificPanel>
      </div>

      {/* Action Bar */}
      <div className="workspace-action-bar" style={{ marginTop: '16px' }}>
        <span className="action-bar-label">Scientific Procedures:</span>
        <div className="action-buttons-group">
          {config.actions.map((act) => (
            <ActionButton
              key={act.id}
              label={act.label}
              primary={act.primary}
              onClick={() => setActiveModal(act.id)}
            />
          ))}
        </div>
      </div>

      {/* Action Modals */}
      <ActionModal
        isOpen={activeModal === 'open_3d'}
        onClose={() => setActiveModal(null)}
        title="3D High-Resolution Ocean Explorer"
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Volumetric reanalysis of temperature and salinity fields from surface to 2,000 meters depth.
        </p>
        <div style={{ background: 'var(--color-bg-page)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px' }}>
          <div><strong>Sector:</strong> 10°N – 15°N, 85°E – 90°E (Bay of Bengal)</div>
          <div><strong>20°C Isotherm Depth:</strong> 142.4 meters</div>
          <div><strong>Mixed Layer Thickness:</strong> 38.6 meters</div>
          <div style={{ color: 'var(--color-ocean-blue)', fontWeight: 600, marginTop: '8px' }}>
            Status: Volumetric model buffer ready (0.08° grid, 40 vertical sigma layers).
          </div>
        </div>
      </ActionModal>

      <ActionModal
        isOpen={activeModal === 'compare_profile'}
        onClose={() => setActiveModal(null)}
        title="In-Situ Argo vs Model Profile Comparison"
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Vertical transect validation comparing float WMO-2902189 against numerical reanalysis.
        </p>
        <div style={{ background: 'var(--color-bg-page)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px' }}>
          <div><strong>Float ID:</strong> WMO 2902189 (Apex Profiler)</div>
          <div><strong>Cycle:</strong> #142 · Maximum Depth: 2,000 dbar</div>
          <div><strong>Surface Bias:</strong> -0.02°C · Thermocline RMSE: 0.38°C</div>
          <div style={{ color: 'var(--color-success)', fontWeight: 600, marginTop: '6px' }}>
            Agreement: 0.964 Correlation (Pearson r)
          </div>
        </div>
      </ActionModal>

      <ActionModal
        isOpen={activeModal === 'view_anomaly'}
        onClose={() => setActiveModal(null)}
        title="Spatial Thermal Anomaly Distribution"
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          30-day running sea surface temperature anomaly relative to the 1991–2020 baseline.
        </p>
        <div style={{ background: 'var(--color-bg-page)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px' }}>
          <div><strong>Peak SST Anomaly:</strong> +1.4°C in Sector 4 (Thermal Front)</div>
          <div><strong>Area:</strong> 18,400 km² exceeding +1.0°C threshold</div>
          <div style={{ color: 'var(--color-warning)', fontWeight: 600, marginTop: '6px' }}>
            Note: Illustrative dataset for diagnostic demonstration.
          </div>
        </div>
      </ActionModal>

      <ActionModal
        isOpen={activeModal === 'view_trend'}
        onClose={() => setActiveModal(null)}
        title="Decadal Climatological Trend Analysis"
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Linear regression and Mann-Kendall trend assessment for the Northern Indian Ocean basin.
        </p>
        <div style={{ background: 'var(--color-bg-page)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px' }}>
          <div><strong>Slope:</strong> +0.0184°C / year (p &lt; 0.0001)</div>
          <div><strong>Upper Ocean Heat Content:</strong> +0.32 GJ/m² / decade</div>
          <div><strong>95% Confidence Interval:</strong> [0.0142, 0.0226] °C/year</div>
        </div>
      </ActionModal>
    </div>
  );
};

export default ResearcherWorkspace;
