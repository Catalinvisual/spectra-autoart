import React from 'react'
import './CinematicBackground.css'

interface CinematicBackgroundProps {
  // Fără video - doar efecte CSS cinematica
  gradientColors?: string[]
  enableParticles?: boolean
  enableLightEffects?: boolean
}

const CinematicBackground: React.FC<CinematicBackgroundProps> = ({ 
  gradientColors = ['#0a0a0f', '#1a1a2e', '#16213e', '#0f0f1a'],
  enableParticles = true,
  enableLightEffects = true
}) => {
  return (
    <div className="cinematic-background">
      {/* Gradient background cinematica */}
      <div 
        className="cinematic-gradient"
        style={{
          background: `linear-gradient(135deg, ${gradientColors.join(', ')})`
        }}
      />
      
      {/* Overlay pentru efect premium */}
      <div className="cinematic-overlay">
        <div className="overlay-gradient"></div>
        {enableParticles && <div className="overlay-particles"></div>}
      </div>
      
      {/* Efecte vizuale adiționale */}
      {enableLightEffects && (
        <div className="cinematic-effects">
          <div className="light-streak streak-1"></div>
          <div className="light-streak streak-2"></div>
          <div className="light-streak streak-3"></div>
          <div className="reflection-overlay"></div>
        </div>
      )}
    </div>
  )
}

export default CinematicBackground