import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitCompare, BarChart3, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import oceanViz from '../../assets/ocean-visualization.jpeg';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        maxWidth: 1300,
        margin: '0 auto',
        paddingBottom: '2.5rem',
      }}
    >
      {/* 1. TOP 20% — OCEANX INTRODUCTION BLUE BOX */}
      <div
        style={{
          position: 'relative',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #062B4F 0%, #0B3B66 40%, #087FEA 80%, #00B8D9 100%)',
          color: '#FFFFFF',
          padding: '2.25rem 3rem',
          boxShadow: '0 16px 36px -10px rgba(6, 43, 79, 0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Background Subtle Wave Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="%2300B8D9" stroke-opacity="0.18" stroke-width="2.5" d="M-100,150 Q250,30 600,180 T1300,80 M-100,220 Q250,90 600,240 T1300,140"/></svg>')`,
            backgroundSize: 'cover',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Header Row: INCOIS | OCEANX + Tagline Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#00B8D9',
                  textTransform: 'uppercase',
                  backgroundColor: 'rgba(0, 184, 217, 0.15)',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 184, 217, 0.3)',
                }}
              >
                OCEANX
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF' }}>
                3D Ocean Explorer
              </span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#E6F7FB',
                letterSpacing: '0.05em',
              }}
            >
              <ShieldCheck size={14} color="#00B8D9" />
              Explore &bull; Understand &bull; Protect
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '1.025rem',
              lineHeight: 1.6,
              color: 'rgba(234, 246, 255, 0.92)',
              maxWidth: '960px',
              margin: 0,
            }}
          >
            OceanX is an advanced 3D Ocean Exploration and Analytical Platform.
            It integrates spatial ocean bathymetry, real-time in-situ telemetry from floats and gliders,
            numerical ocean model validation engines, and multi-decade climate trend analytics into a unified operational ecosystem.
          </p>
        </div>
      </div>

      {/* 2. MIDDLE 40% — OCEAN VISUALIZATION DISPLAY IMAGE (CLICKABLE -> /explore) */}
      <div
        onClick={() => navigate('/explore')}
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#062B4F',
          boxShadow: '0 8px 30px rgba(6, 43, 79, 0.15)',
          cursor: 'pointer',
          border: '1px solid #D5E5EF',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(8, 127, 234, 0.25)';
          e.currentTarget.style.borderColor = '#00B8D9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(6, 43, 79, 0.15)';
          e.currentTarget.style.borderColor = '#D5E5EF';
        }}
        title="Click to launch Ocean Explorer"
      >
        <img
          src={oceanViz}
          alt="Ocean Visualization"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '450px',
            objectFit: 'contain',
            display: 'block',
            borderRadius: '16px',
          }}
        />
      </div>

      {/* 3. BOTTOM 40% — 3 MODULE CARDS IN ONE HORIZONTAL ROW */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
        }}
      >

        {/* Module 2: Compare */}
        <ModuleNavCard
          title="Compare"
          description="Compare ocean observations with numerical model outputs for validation and insights."
          icon={<GitCompare size={24} color="#0B3B66" />}
          accentColor="#0B3B66"
          onClick={() => navigate('/compare')}
        />

        {/* Module 3: Analytics */}
        <ModuleNavCard
          title="Analytics"
          description="Analyse trends, patterns and anomalies to understand ocean dynamics."
          icon={<BarChart3 size={24} color="#00B8D9" />}
          accentColor="#00B8D9"
          onClick={() => navigate('/analytics')}
        />

        {/* Module 4: Stakeholders */}
        <ModuleNavCard
          title="Stakeholders"
          description="Connect with researchers, policymakers and communities for a sustainable ocean future."
          icon={<Users size={24} color="#0B2A4A" />}
          accentColor="#0B2A4A"
          onClick={() => navigate('/stakeholders')}
        />
      </div>
    </div>
  );
};

// Sub-component for Module Navigation Cards
interface ModuleNavCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  onClick: () => void;
}

const ModuleNavCard: React.FC<ModuleNavCardProps> = ({
  title,
  description,
  icon,
  accentColor,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D5E5EF',
        borderRadius: '14px',
        padding: '1.5rem',
        boxShadow: '0 4px 16px rgba(8, 127, 234, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '190px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = accentColor;
        e.currentTarget.style.boxShadow = `0 12px 24px -4px rgba(6, 43, 79, 0.1), 0 0 0 1px ${accentColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#D5E5EF';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(8, 127, 234, 0.04)';
      }}
    >
      {/* Top Accent Strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: accentColor,
        }}
      />

      <div>
        {/* Header Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.85rem' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '10px',
              backgroundColor: '#F3F9FC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B2A4A', margin: 0 }}>
            {title}
          </h3>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.875rem', color: '#58708A', lineHeight: 1.5, margin: 0 }}>
          {description}
        </p>
      </div>

      {/* Footer link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.8rem',
          marginTop: '1rem',
          borderTop: '1px solid #F3F9FC',
          fontSize: '0.825rem',
          fontWeight: 700,
          color: accentColor,
        }}
      >
        <span>View {title}</span>
        <ArrowRight size={16} />
      </div>
    </div>
  );
};
