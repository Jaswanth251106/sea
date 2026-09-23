import React, { useState } from 'react';
import { StakeholderConfig } from '../../data/stakeholderData';
import ScientificPanel from '../common/ScientificPanel';
import { HeroMetric, MetricRow } from '../common/MetricReadout';
import ActionButton from '../common/ActionButton';
import ActionModal from '../common/ActionModal';

interface FisheriesWorkspaceProps {
  config: StakeholderConfig;
}

export const FisheriesWorkspace: React.FC<FisheriesWorkspaceProps> = ({ config }) => {
  const [selectedZone, setSelectedZone] = useState('zone_b');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const zones = config.zones || [];
  const activeZoneObj = zones.find((z) => z.id === selectedZone) || zones[1] || zones[0];

  return (
    <div className="workspace-inner">
      {/* Notice Banner */}
      <div
        style={{
          background: 'var(--color-soft-aqua)',
          border: '1px solid rgba(8, 127, 234, 0.25)',
          borderRadius: '8px',
          padding: '10px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--color-text-primary)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--color-ocean-blue)', fontWeight: 700 }}>ℹ Ocean Conditions Notice:</span>
          <span>{config.disclaimer}</span>
        </span>
        <span className="footer-disclaimer-pill">Environmental Conditions Only</span>
      </div>

      <div className="panels-grid">
        {/* Panel 1: Bay of Bengal 2D Ocean Status */}
        <ScientificPanel
          title="Bay of Bengal"
          tag="2D Ocean Map"
          meta="10°N–15°N, 85°E–90°E"
        >
          <div style={{ background: '#F8FBFE', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>SURFACE GRID SUMMARY</span>
              <span className="metric-badge badge-normal">2D Sector Scan</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <MetricRow label="Bathymetric Zone" value="Continental Shelf Break" detail="-200m to -1000m" />
              <MetricRow label="Frontal Gradient" value="+0.4°C / 10 km" detail="Thermal front active" />
              <MetricRow label="Upwelling Velocity" value="+1.2 m/day" badge="Ekman Pumping" badgeType="badge-normal" />
              <MetricRow label="Surface Turbidity" value="Low to Moderate" detail="Secchi Depth 18m" />
            </div>
          </div>

          <div style={{ padding: '10px 12px', background: 'var(--color-sky-blue)', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '12px', color: 'var(--color-primary-navy)' }}>
            <strong>Selected Zone Profile:</strong> {activeZoneObj?.name} — <span style={{ color: 'var(--color-text-secondary)' }}>{activeZoneObj?.notes}</span>
          </div>
        </ScientificPanel>

        {/* Panel 2: Compact Condition Indicators */}
        <ScientificPanel
          title="Ocean Condition Indicators"
          tag="Marine Parameters"
          meta="Integrated Telemetry"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <HeroMetric label="TEMPERATURE" value="28.4" unit="°C" subtext="Thermal front" statusColor="var(--color-ocean-blue)" />
              <HeroMetric label="CHLOROPHYLL" value="0.42" unit="mg/m³" subtext="Productivity index" statusColor="var(--color-marine-teal)" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <div style={{ background: '#F8FBFE', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>CURRENT</div>
                <div style={{ fontSize: '15px', fontWeight: 800 }}>0.62 m/s</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>045° NE drift</div>
              </div>
              <div style={{ background: '#F8FBFE', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>DEPTH</div>
                <div style={{ fontSize: '15px', fontWeight: 800 }}>48 m</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Mixed layer</div>
              </div>
              <div style={{ background: '#F8FBFE', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>ANOMALY</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-success)' }}>+0.3°C</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Seasonal baseline</div>
              </div>
            </div>
          </div>
        </ScientificPanel>

        {/* Panel 3: Potential Ocean-Condition Zones */}
        <ScientificPanel
          title="Potential Condition Zones"
          tag="Ocean-Condition Zones"
          meta={`${zones.length} Zones Defined`}
        >
          <table className="zones-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Condition</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => {
                const isSelected = selectedZone === zone.id;
                return (
                  <tr
                    key={zone.id}
                    style={isSelected ? { background: '#F8FBFE' } : {}}
                  >
                    <td style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '12px' }}>
                      {zone.name.split(' (')[0]}
                    </td>
                    <td>
                      <span className={`metric-badge ${zone.badge}`}>
                        {zone.condition}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`action-btn ${isSelected ? 'btn-primary' : ''}`}
                        style={{ padding: '3px 8px', fontSize: '10.5px' }}
                        onClick={() => setSelectedZone(zone.id)}
                      >
                        {isSelected ? 'Active' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
            Zones categorize oceanographic parameters like thermal gradients and mixed layer stability.
          </div>
        </ScientificPanel>
      </div>

      {/* Fisheries Action Bar */}
      <div className="workspace-action-bar" style={{ marginTop: '16px' }}>
        <span className="action-bar-label">Marine Advisory Deliverables:</span>
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

      {/* Advisory Modal */}
      <ActionModal
        isOpen={activeModal === 'generate_advisory'}
        onClose={() => setActiveModal(null)}
        title="Marine Ocean Conditions Advisory Bulletin"
      >
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
          <div style={{ background: '#F8FBFE', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '12px' }}>
            <div style={{ color: 'var(--color-primary-navy)', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
              OFFICIAL MARINE CONDITIONS ADVISORY · NORTH BAY OF BENGAL
            </div>
            <div><strong>Valid Period:</strong> Next 48 Hours · Reference Sector 12°N, 88°E</div>
            <div><strong>Status:</strong> Environmental Condition Broadcast</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>1. Thermal Stratification:</strong> Surface temperature averages 28.4°C with a pronounced thermal front (+0.4°C/10km) in Zone B.
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>2. Chlorophyll Gradient:</strong> Satellite ocean color indicates optimal chlorophyll signatures (0.42 mg/m³) along the 200m shelf break.
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>3. Sea State & Currents:</strong> Surface currents 0.62 m/s pushing north-eastward. Wave heights nominal at 1.4–1.8m.
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '6px', color: 'var(--color-text-secondary)', fontSize: '11px' }}>
              * DISCLAIMER: This advisory communicates physical and oceanographic parameters to support coastal and fisheries operations. It does not predict fish locations.
            </div>
          </div>
        </div>
      </ActionModal>

      <ActionModal
        isOpen={activeModal === 'print_bulletin'}
        onClose={() => setActiveModal(null)}
        title="Print Condition Bulletin Preview"
      >
        <div style={{ background: '#F8FBFE', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px' }}>
          <div><strong>Format:</strong> Standard Marine Meteorological Broadcast</div>
          <div><strong>Header:</strong> INCOIS_OCN_COND_BAY_OF_BENGAL_06Z</div>
          <div style={{ color: 'var(--color-success)', fontWeight: 600, marginTop: '8px' }}>
            ✓ Ready for export or transmission via coastal marine channels.
          </div>
        </div>
      </ActionModal>

      <ActionModal
        isOpen={activeModal === 'inspect_fronts'}
        onClose={() => setActiveModal(null)}
        title="Thermal Frontal Boundary Diagnostics"
      >
        <div style={{ background: '#F8FBFE', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px' }}>
          <div><strong>Front Intensity:</strong> 0.04°C / km horizontal gradient</div>
          <div><strong>Orientation:</strong> Southwest to Northeast transect</div>
          <div><strong>Nutrient Upwelling Index:</strong> Moderate (Ekman pumping +1.2 m/day)</div>
        </div>
      </ActionModal>
    </div>
  );
};

export default FisheriesWorkspace;
