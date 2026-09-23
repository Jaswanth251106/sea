import React, { useState, useEffect } from 'react';
import { StakeholderConfig } from '../../data/stakeholderData';
import ScientificPanel from '../common/ScientificPanel';
import { MetricRow, HeroMetric } from '../common/MetricReadout';
import ActionButton from '../common/ActionButton';
import ActionModal from '../common/ActionModal';

interface SearchRescueWorkspaceProps {
  config: StakeholderConfig;
}

export const SearchRescueWorkspace: React.FC<SearchRescueWorkspaceProps> = ({ config }) => {
  const [simStep, setSimStep] = useState(3);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // 5 User Input Controls State
  const [latInput, setLatInput] = useState<string>('12.45');
  const [lonInput, setLonInput] = useState<string>('88.30');
  const [utcTime, setUtcTime] = useState<string>('06:15 UTC');
  const [craftType, setCraftType] = useState<string>('Fishing Boat (FV Sagar Ratna)');
  const [currentFlow, setCurrentFlow] = useState<string>('Geostrophic Flow (0.85 m/s @ 072°)');

  const [showLatDropdown, setShowLatDropdown] = useState<boolean>(false);
  const [showLonDropdown, setShowLonDropdown] = useState<boolean>(false);

  // 5 Bay of Bengal Presets for Latitude
  const latBayOfBengalPresets = [
    { value: '12.45', label: '12.45°N (Off Visakhapatnam)' },
    { value: '13.08', label: '13.08°N (Off Chennai Port)' },
    { value: '15.80', label: '15.80°N (Off Machilipatnam)' },
    { value: '17.68', label: '17.68°N (Off Paradip Coast)' },
    { value: '11.70', label: '11.70°N (Off Port Blair)' },
  ];

  // 5 Bay of Bengal Presets for Longitude
  const lonBayOfBengalPresets = [
    { value: '88.30', label: '88.30°E (Central Bay of Bengal)' },
    { value: '80.27', label: '80.27°E (Coromandel Coast)' },
    { value: '83.21', label: '83.21°E (Northern Andhra Sector)' },
    { value: '86.90', label: '86.90°E (Odisha Coastal Sector)' },
    { value: '92.70', label: '92.70°E (Andaman Sea Trench)' },
  ];

  const craftOptions = [
    { label: 'Fishing Boat (FV Sagar Ratna)', leeway: '3.2% leeway', mult: 1.0 },
    { label: 'Life Raft (With Ballast)', leeway: '2.8% leeway', mult: 0.85 },
    { label: 'Coastal Skiff / Kayak', leeway: '4.1% leeway', mult: 1.25 },
    { label: 'Person in Water (PIW)', leeway: '1.5% leeway', mult: 0.60 },
    { label: 'Cargo Container / Debris', leeway: '2.0% leeway', mult: 0.95 },
  ];

  const currentOptions = [
    { label: 'Geostrophic Flow (0.85 m/s @ 072°)', speedText: '0.85 m/s @ 072°', detail: 'Geostrophic flow', speedMult: 1.0, dir: 'ENE', windage: '14 kt @ 245° SW' },
    { label: 'Monsoon Jet Current (1.40 m/s @ 085°)', speedText: '1.40 m/s @ 085°', detail: 'Monsoon Jet flow', speedMult: 1.65, dir: 'E', windage: '22 kt @ 260° WSW' },
    { label: 'Coastal Tidal Stream (0.50 m/s @ 030°)', speedText: '0.50 m/s @ 030°', detail: 'Tidal Stream flow', speedMult: 0.60, dir: 'NNE', windage: '08 kt @ 210° SSW' },
    { label: 'High Storm Surge (2.10 m/s @ 110°)', speedText: '2.10 m/s @ 110°', detail: 'Storm Surge flow', speedMult: 2.47, dir: 'ESE', windage: '35 kt @ 280° W' },
  ];

  const selectedCraft = craftOptions.find((c) => c.label === craftType) || craftOptions[0];
  const selectedCurrent = currentOptions.find((c) => c.label === currentFlow) || currentOptions[0];
  const baseLat = parseFloat(latInput) || 12.45;
  const baseLon = parseFloat(lonInput) || 88.30;
  const combinedMult = selectedCraft.mult * selectedCurrent.speedMult;

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isSimulating) {
      setSimStep(0);
      let step = 0;
      timer = setInterval(() => {
        step += 1;
        if (step <= 3) {
          setSimStep(step);
        } else {
          setIsSimulating(false);
          clearInterval(timer);
        }
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  const driftPoints = [
    { label: 'T+0h (LKP)', x: 70, y: 50, lat: `${baseLat.toFixed(2)}°N`, lon: `${baseLon.toFixed(2)}°E` },
    { label: 'T+6h', x: 140, y: 85, lat: `${(baseLat + 0.13 * combinedMult).toFixed(2)}°N`, lon: `${(baseLon + 0.18 * combinedMult).toFixed(2)}°E` },
    { label: 'T+12h', x: 210, y: 125, lat: `${(baseLat + 0.26 * combinedMult).toFixed(2)}°N`, lon: `${(baseLon + 0.36 * combinedMult).toFixed(2)}°E` },
    { label: 'T+14.5h (Datum)', x: 270, y: 160, lat: `${(baseLat + 0.37 * combinedMult).toFixed(2)}°N`, lon: `${(baseLon + 0.52 * combinedMult).toFixed(2)}°E` },
  ];

  const totalDisplacementKm = (44.2 * combinedMult).toFixed(1);
  const searchAreaSizes = [
    `${Math.round(320 * combinedMult).toLocaleString()} km²`,
    `${Math.round(980 * combinedMult).toLocaleString()} km²`,
    `${Math.round(1720 * combinedMult).toLocaleString()} km²`,
    `${Math.round(2340 * combinedMult).toLocaleString()} km²`,
  ];

  return (
    <div className="workspace-inner">
      {/* Disclaimer Banner */}
      <div
        style={{
          background: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: '8px',
          padding: '10px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#991B1B',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700 }}>⚠ SAR Operations Mandate:</span>
          <span>{config.disclaimer}</span>
        </span>
        <span className="footer-disclaimer-pill" style={{ background: '#FEF2F2', borderColor: '#F87171', color: '#B91C1C' }}>
          Decision Support Only
        </span>
      </div>

      <div className="panels-grid-1-2">
        {/* Left Column: Inputs, LKP & Search Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Panel 1: Interactive LKP & Incident Inputs */}
          <ScientificPanel
            title="Last Known Position & Inputs"
            tag="Origin Datum"
            meta={utcTime}
          >
            {/* 5 User Inputs Area */}
            <div style={{ background: 'var(--color-bg-page, #F8FBFE)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border, #D5E5EF)', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ocean-blue)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                ⚙ Search & Rescue Operational Parameters (5 Inputs)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                {/* Single Box Latitude Combobox */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '3px' }}>
                    Latitude (°N) — Bay of Bengal
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={latInput}
                      onChange={(e) => setLatInput(e.target.value)}
                      onFocus={() => setShowLatDropdown(true)}
                      onBlur={() => setTimeout(() => setShowLatDropdown(false), 200)}
                      placeholder="Type or pick preset..."
                      style={{
                        width: '100%',
                        padding: '5px 24px 5px 8px',
                        borderRadius: '5px',
                        border: '1px solid var(--color-border)',
                        background: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLatDropdown(!showLatDropdown)}
                      style={{
                        position: 'absolute',
                        right: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-ocean-blue)',
                        cursor: 'pointer',
                        fontSize: '10px',
                        padding: '2px',
                      }}
                      title="Toggle 5 Bay of Bengal Presets"
                    >
                      ▼
                    </button>
                  </div>
                  {showLatDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 50,
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                        marginTop: '2px',
                        maxHeight: '170px',
                        overflowY: 'auto',
                      }}
                    >
                      <div style={{ padding: '4px 8px', fontSize: '9.5px', fontWeight: 700, color: 'var(--color-ocean-blue)', background: 'var(--color-bg-page)', borderBottom: '1px solid var(--color-border)' }}>
                        Bay of Bengal Presets (5 Options)
                      </div>
                      {latBayOfBengalPresets.map((item, idx) => (
                        <div
                          key={item.value}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setLatInput(item.value);
                            setShowLatDropdown(false);
                          }}
                          style={{
                            padding: '5px 8px',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: 'var(--color-text-primary)',
                            cursor: 'pointer',
                            borderBottom: '1px solid #F0F4F8',
                          }}
                        >
                          <strong>{idx + 1}. {item.value}°N</strong> &mdash; {item.label.split('(')[1]?.replace(')', '') || item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Single Box Longitude Combobox */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '3px' }}>
                    Longitude (°E) — Bay of Bengal
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={lonInput}
                      onChange={(e) => setLonInput(e.target.value)}
                      onFocus={() => setShowLonDropdown(true)}
                      onBlur={() => setTimeout(() => setShowLonDropdown(false), 200)}
                      placeholder="Type or pick preset..."
                      style={{
                        width: '100%',
                        padding: '5px 24px 5px 8px',
                        borderRadius: '5px',
                        border: '1px solid var(--color-border)',
                        background: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLonDropdown(!showLonDropdown)}
                      style={{
                        position: 'absolute',
                        right: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-ocean-blue)',
                        cursor: 'pointer',
                        fontSize: '10px',
                        padding: '2px',
                      }}
                      title="Toggle 5 Bay of Bengal Presets"
                    >
                      ▼
                    </button>
                  </div>
                  {showLonDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 50,
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                        marginTop: '2px',
                        maxHeight: '170px',
                        overflowY: 'auto',
                      }}
                    >
                      <div style={{ padding: '4px 8px', fontSize: '9.5px', fontWeight: 700, color: 'var(--color-ocean-blue)', background: 'var(--color-bg-page)', borderBottom: '1px solid var(--color-border)' }}>
                        Bay of Bengal Presets (5 Options)
                      </div>
                      {lonBayOfBengalPresets.map((item, idx) => (
                        <div
                          key={item.value}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setLonInput(item.value);
                            setShowLonDropdown(false);
                          }}
                          style={{
                            padding: '5px 8px',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: 'var(--color-text-primary)',
                            cursor: 'pointer',
                            borderBottom: '1px solid #F0F4F8',
                          }}
                        >
                          <strong>{idx + 1}. {item.value}°E</strong> &mdash; {item.label.split('(')[1]?.replace(')', '') || item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    UTC Incident Time
                  </label>
                  <select
                    value={utcTime}
                    onChange={(e) => setUtcTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      borderRadius: '5px',
                      border: '1px solid var(--color-border)',
                      background: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <option value="06:15 UTC">06:15 UTC (Simulated Beacon)</option>
                    <option value="12:00 UTC">12:00 UTC (Midday Ping)</option>
                    <option value="18:30 UTC">18:30 UTC (Evening Alert)</option>
                    <option value="00:00 UTC">00:00 UTC (Midnight Broadcast)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Target Craft / Object Type
                  </label>
                  <select
                    value={craftType}
                    onChange={(e) => setCraftType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      borderRadius: '5px',
                      border: '1px solid var(--color-border)',
                      background: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {craftOptions.map((c) => (
                      <option key={c.label} value={c.label}>
                        {c.label} ({c.leeway})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Sea Surface Current & Flow
                  </label>
                  <select
                    value={currentFlow}
                    onChange={(e) => setCurrentFlow(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      borderRadius: '5px',
                      border: '1px solid var(--color-border)',
                      background: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {currentOptions.map((c) => (
                      <option key={c.label} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <HeroMetric
                label="Latitude"
                value={`${baseLat.toFixed(2)}°N`}
                subtext="Active LKP coordinate"
                statusColor="var(--color-ocean-blue)"
              />
              <HeroMetric
                label="Longitude"
                value={`${baseLon.toFixed(2)}°E`}
                subtext="Active LKP coordinate"
                statusColor="var(--color-ocean-blue)"
              />
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
              Origin: Simulated emergency transmitter ({utcTime}).
            </div>
          </ScientificPanel>

          {/* Panel 2: Search Area & Environmental Factors */}
          <ScientificPanel
            title="Search Area & Drift Factors"
            tag="Search Area"
            meta="95% Containment"
          >
            <HeroMetric
              label="Calculated Search Area"
              value={searchAreaSizes[simStep]}
              subtext="Expanding uncertainty boundary"
              statusColor="var(--color-danger)"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
              <MetricRow label="Current" value={selectedCurrent.speedText} detail={selectedCurrent.detail} />
              <MetricRow label="Time" value={config.factors?.timeElapsed || '14h 30m'} detail="Elapsed drift" />
              <MetricRow label="Drift Estimate" value={`${totalDisplacementKm} km total displacement`} badge={`Vector ${selectedCurrent.dir}`} badgeType="badge-warning" />
              <MetricRow label="Windage (Leeway)" value={selectedCraft.leeway} detail={selectedCurrent.windage} />
            </div>
          </ScientificPanel>
        </div>

        {/* Right Column: Trajectory Visualization */}
        <ScientificPanel
          title="Estimated Drift Trajectory & Search Grid"
          tag="Trajectory"
          meta={isSimulating ? 'Simulating Drift...' : 'Ready'}
          headerAction={
            <button
              type="button"
              className="action-btn btn-primary"
              style={{ padding: '4px 12px', fontSize: '11.5px' }}
              disabled={isSimulating}
              onClick={() => setIsSimulating(true)}
            >
              {isSimulating ? '● Running...' : '▶ Run Drift Simulation'}
            </button>
          }
        >
          <div className="trajectory-canvas-box">
            <svg viewBox="0 0 460 230" style={{ width: '100%', height: '100%' }}>
              <defs>
                <radialGradient id="searchEllipseGradLight" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E5484D" stopOpacity="0.35" />
                  <stop offset="60%" stopColor="#E5484D" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#E5484D" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              <rect x="0" y="0" width="460" height="230" fill="#F8FBFE" />

              <line x1="40" y1="50" x2="420" y2="50" stroke="#EDF4F9" strokeWidth="1" />
              <line x1="40" y1="110" x2="420" y2="110" stroke="#EDF4F9" strokeWidth="1" />
              <line x1="40" y1="170" x2="420" y2="170" stroke="#EDF4F9" strokeWidth="1" />
              <line x1="120" y1="20" x2="120" y2="210" stroke="#EDF4F9" strokeWidth="1" />
              <line x1="240" y1="20" x2="240" y2="210" stroke="#EDF4F9" strokeWidth="1" />
              <line x1="360" y1="20" x2="360" y2="210" stroke="#EDF4F9" strokeWidth="1" />

              {[
                { x: 80, y: 130 },
                { x: 180, y: 60 },
                { x: 300, y: 80 },
                { x: 380, y: 140 },
              ].map((arrow, i) => (
                <g key={i} opacity="0.45">
                  <line x1={arrow.x} y1={arrow.y} x2={arrow.x + 28} y2={arrow.y + 14} stroke="var(--color-ocean-blue)" strokeWidth="1.5" />
                  <polygon
                    points={`${arrow.x + 28},${arrow.y + 14} ${arrow.x + 22},${arrow.y + 10} ${arrow.x + 24},${arrow.y + 17}`}
                    fill="var(--color-ocean-blue)"
                  />
                </g>
              ))}

              {simStep > 0 && (
                <polygon
                  points={`70,50 ${driftPoints[simStep].x + 35},${driftPoints[simStep].y - 25} ${driftPoints[simStep].x + 20},${driftPoints[simStep].y + 40}`}
                  fill="rgba(245, 158, 11, 0.08)"
                  stroke="rgba(245, 158, 11, 0.35)"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                />
              )}

              {simStep === 3 && (
                <g opacity="0.8">
                  {[
                    { dx: -12, dy: -8 }, { dx: 15, dy: 10 }, { dx: -8, dy: 14 },
                    { dx: 22, dy: -5 }, { dx: -20, dy: 6 }, { dx: 5, dy: -18 },
                    { dx: 18, dy: 22 }, { dx: -15, dy: -16 }, { dx: 30, dy: 8 },
                    { dx: -28, dy: 2 }, { dx: 8, dy: 25 }, { dx: 2, dy: -12 },
                  ].map((p, i) => (
                    <circle
                      key={i}
                      cx={driftPoints[simStep].x + p.dx}
                      cy={driftPoints[simStep].y + p.dy}
                      r="2"
                      fill="#B45309"
                    />
                  ))}
                </g>
              )}

              <ellipse
                cx={driftPoints[simStep].x}
                cy={driftPoints[simStep].y}
                rx={simStep === 0 ? 15 : simStep === 1 ? 30 : simStep === 2 ? 48 : 65}
                ry={simStep === 0 ? 10 : simStep === 1 ? 20 : simStep === 2 ? 32 : 44}
                fill="url(#searchEllipseGradLight)"
                stroke="#E5484D"
                strokeWidth="1.8"
                strokeDasharray="4 2"
                transform={`rotate(28 ${driftPoints[simStep].x} ${driftPoints[simStep].y})`}
              />

              {simStep >= 1 && (
                <line
                  x1={driftPoints[0].x}
                  y1={driftPoints[0].y}
                  x2={driftPoints[1].x}
                  y2={driftPoints[1].y}
                  stroke="var(--color-ocean-blue)"
                  strokeWidth="2.5"
                />
              )}
              {simStep >= 2 && (
                <line
                  x1={driftPoints[1].x}
                  y1={driftPoints[1].y}
                  x2={driftPoints[2].x}
                  y2={driftPoints[2].y}
                  stroke="var(--color-ocean-blue)"
                  strokeWidth="2.5"
                />
              )}
              {simStep >= 3 && (
                <line
                  x1={driftPoints[2].x}
                  y1={driftPoints[2].y}
                  x2={driftPoints[3].x}
                  y2={driftPoints[3].y}
                  stroke="var(--color-ocean-blue)"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />
              )}

              {driftPoints.slice(0, simStep + 1).map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={idx === 0 ? 6.5 : idx === simStep ? 7 : 5}
                    fill={idx === 0 ? 'var(--color-success)' : idx === simStep ? 'var(--color-danger)' : 'var(--color-ocean-blue)'}
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                  />
                  <text
                    x={pt.x + 10}
                    y={pt.y + 4}
                    fill="var(--color-text-primary)"
                    fontSize="9.5"
                    fontWeight="700"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}

              <rect x="145" y="98" width="112" height="22" fill="#FFFFFF" stroke="var(--color-border)" rx="4" />
              <text
                x="152"
                y="113"
                fill="var(--color-ocean-blue)"
                fontSize="10"
                fontWeight="700"
              >
                Estimated Drift ➔
              </text>
            </svg>

            <div className="sar-hud-overlay">
              <div><strong>LKP:</strong> {baseLat.toFixed(2)}°N, {baseLon.toFixed(2)}°E ({utcTime})</div>
              <div style={{ color: 'var(--color-ocean-blue)', fontWeight: 600 }}>
                {driftPoints[simStep].label}: {driftPoints[simStep].lat}, {driftPoints[simStep].lon}
              </div>
            </div>

            <div className="sar-hud-legend">
              <div className="legend-item">
                <span className="legend-swatch" style={{ background: 'var(--color-success)' }} />
                <span>Last Known Position (LKP)</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch" style={{ background: 'var(--color-ocean-blue)' }} />
                <span>Estimated Drift Vector</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch" style={{ background: 'var(--color-danger)' }} />
                <span>Search Area (95% Ellipse)</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
            <span>Drift Model: {selectedCurrent.detail} + {selectedCraft.leeway}</span>
            <span style={{ color: '#B45309', fontWeight: 600 }}>Total Displacement: ~{totalDisplacementKm} km {selectedCurrent.dir}</span>
          </div>
        </ScientificPanel>
      </div>

      {/* SAR Action Bar */}
      <div className="workspace-action-bar" style={{ marginTop: '16px' }}>
        <span className="action-bar-label">Search Operations Procedures:</span>
        <div className="action-buttons-group">
          {config.actions.map((act) => (
            <ActionButton
              key={act.id}
              label={act.label}
              primary={act.primary}
              onClick={() => {
                if (act.id === 'run_drift') {
                  setIsSimulating(true);
                } else {
                  setActiveModal(act.id);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <ActionModal
        isOpen={activeModal === 'adjust_leeway'}
        onClose={() => setActiveModal(null)}
        title="Tactical Leeway & Drift Factors"
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Standard maritime search craft leeway coefficients (IAMSAR standard).
        </p>
        <div style={{ background: 'var(--color-bg-page)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px' }}>
          <div><strong>Target Craft:</strong> {selectedCraft.label}</div>
          <div><strong>Leeway Rate:</strong> {selectedCraft.leeway}</div>
          <div><strong>Surface Current:</strong> {selectedCurrent.speedText} ({selectedCurrent.detail})</div>
          <div><strong>Windage Vector:</strong> {selectedCurrent.windage}</div>
          <div style={{ color: 'var(--color-success)', fontWeight: 600, marginTop: '8px' }}>
            ✓ Hydrodynamic vectors calibrated for Active LKP Sector {baseLon.toFixed(2)}°E.
          </div>
        </div>
      </ActionModal>

      <ActionModal
        isOpen={activeModal === 'export_geojson'}
        onClose={() => setActiveModal(null)}
        title="Export Search Grid GeoJSON"
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Bounding box and 95% containment ellipse coordinates for navigational plotters.
        </p>
        <div style={{ background: 'var(--color-bg-page)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '11px', maxHeight: '180px', overflowY: 'auto' }}>
          <pre style={{ margin: 0, color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-mono, monospace)' }}>
{`{
  "type": "FeatureCollection",
  "name": "OCEANX_SAR_SEARCH_ELLIPSE_${utcTime.replace(/[^0-9]/g, '')}Z",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [${baseLon.toFixed(2)}, ${baseLat.toFixed(2)}],
          [${(baseLon + 0.18 * combinedMult).toFixed(2)}, ${(baseLat + 0.13 * combinedMult).toFixed(2)}],
          [${(baseLon + 0.52 * combinedMult).toFixed(2)}, ${(baseLat + 0.37 * combinedMult).toFixed(2)}],
          [${baseLon.toFixed(2)}, ${baseLat.toFixed(2)}]
        ]]
      },
      "properties": {
        "target_craft": "${selectedCraft.label}",
        "search_area_km2": ${Math.round(2340 * combinedMult)},
        "total_displacement_km": ${totalDisplacementKm},
        "confidence": "95%",
        "utc_time": "${utcTime}"
      }
    }
  ]
}`}
          </pre>
        </div>
      </ActionModal>
    </div>
  );
};

export default SearchRescueWorkspace;
