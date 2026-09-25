import React from 'react';
import { motion } from 'motion/react';

interface ExerciseAnimationProps {
  animType: string;
  isActive?: boolean;
  className?: string;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({
  animType,
  isActive = true,
  className = 'w-full h-48'
}) => {
  // Render animated kinematic SVG illustrations based on animType
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 p-4 ${className}`}>
      {/* Background radial accent glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />

      {/* Grid lines floor */}
      <div className="absolute bottom-6 left-4 right-4 h-[1px] bg-slate-800" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-1 bg-emerald-500/20 rounded-full blur-sm" />

      <svg viewBox="0 0 200 160" className="w-full h-full max-h-44 text-emerald-400">
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {animType === 'squat' && (
          <motion.g
            animate={isActive ? { y: [0, 24, 0] } : { y: 0 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          >
            {/* Head */}
            <circle cx="100" cy="38" r="9" fill="url(#bodyGrad)" />
            {/* Torso */}
            <line x1="100" y1="47" x2="100" y2="85" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            {/* Arms */}
            <motion.path
              d="M 100 56 L 130 54"
              stroke="#6EE7B7"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Upper Legs */}
            <line x1="100" y1="85" x2="84" y2="110" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="85" x2="116" y2="110" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            {/* Lower Legs */}
            <line x1="84" y1="110" x2="80" y2="140" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            <line x1="116" y1="110" x2="120" y2="140" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            {/* Feet */}
            <line x1="74" y1="140" x2="84" y2="140" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
            <line x1="116" y1="140" x2="128" y2="140" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
          </motion.g>
        )}

        {animType === 'pushup' && (
          <motion.g
            animate={isActive ? { y: [0, 18, 0] } : { y: 0 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            {/* Head */}
            <circle cx="55" cy="85" r="8" fill="url(#bodyGrad)" />
            {/* Body line from head to feet */}
            <line x1="63" y1="88" x2="155" y2="116" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            {/* Arm */}
            <motion.polyline
              points="75,92 84,115 88,138"
              fill="none"
              stroke="#6EE7B7"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={isActive ? {
                points: ["75,92 84,115 88,138", "75,108 92,125 90,138", "75,92 84,115 88,138"]
              } : {}}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            />
            {/* Foot support */}
            <line x1="155" y1="116" x2="158" y2="138" stroke="url(#bodyGrad)" strokeWidth="5" strokeLinecap="round" />
          </motion.g>
        )}

        {animType === 'plank' && (
          <g>
            {/* Head */}
            <circle cx="52" cy="100" r="8" fill="url(#bodyGrad)" />
            {/* Core body */}
            <line x1="60" y1="103" x2="155" y2="108" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            {/* Forearm plank support */}
            <polyline points="72,104 72,126 86,126" fill="none" stroke="#6EE7B7" strokeWidth="5" strokeLinecap="round" />
            {/* Feet */}
            <line x1="155" y1="108" x2="157" y2="126" stroke="url(#bodyGrad)" strokeWidth="5" strokeLinecap="round" />
            {/* Subtle core tension pulse */}
            <motion.circle
              cx="105"
              cy="106"
              r="14"
              fill="none"
              stroke="#34D399"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </g>
        )}

        {animType === 'jumping_jacks' && (
          <g>
            <motion.g
              animate={isActive ? { y: [0, -14, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
            >
              {/* Head */}
              <circle cx="100" cy="40" r="9" fill="url(#bodyGrad)" />
              {/* Torso */}
              <line x1="100" y1="49" x2="100" y2="90" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            </motion.g>

            {/* Moving Arms */}
            <motion.line
              x1="100" y1="58"
              animate={isActive ? { x2: [70, 60, 70], y2: [85, 30, 85] } : { x2: 70, y2: 85 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
              stroke="#6EE7B7"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <motion.line
              x1="100" y1="58"
              animate={isActive ? { x2: [130, 140, 130], y2: [85, 30, 85] } : { x2: 130, y2: 85 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
              stroke="#6EE7B7"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Moving Legs */}
            <motion.line
              x1="100" y1="90"
              animate={isActive ? { x2: [92, 70, 92], y2: [138, 136, 138] } : { x2: 92, y2: 138 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
              stroke="url(#bodyGrad)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <motion.line
              x1="100" y1="90"
              animate={isActive ? { x2: [108, 130, 108], y2: [138, 136, 138] } : { x2: 108, y2: 138 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
              stroke="url(#bodyGrad)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        )}

        {animType === 'crunch' && (
          <g>
            {/* Legs bent on floor */}
            <polyline points="140,128 120,100 100,126" fill="none" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Animated upper body crunching up */}
            <motion.g
              animate={isActive ? { rotate: [0, -18, 0] } : {}}
              style={{ originX: '100px', originY: '126px' }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              {/* Torso */}
              <line x1="100" y1="126" x2="60" y2="122" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
              {/* Head */}
              <circle cx="50" cy="116" r="8" fill="url(#bodyGrad)" />
              {/* Hands behind head */}
              <polyline points="65,122 56,108 48,114" fill="none" stroke="#6EE7B7" strokeWidth="4" strokeLinecap="round" />
            </motion.g>
          </g>
        )}

        {animType === 'lunges' && (
          <motion.g
            animate={isActive ? { y: [0, 15, 0] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            {/* Head */}
            <circle cx="100" cy="42" r="8" fill="url(#bodyGrad)" />
            {/* Torso */}
            <line x1="100" y1="50" x2="100" y2="90" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            {/* Front Leg bent at 90 deg */}
            <polyline points="100,90 128,105 126,138" fill="none" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Back Leg stepping back */}
            <polyline points="100,90 74,115 76,138" fill="none" stroke="#059669" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        )}

        {animType === 'glute_bridge' && (
          <g>
            {/* Head and shoulders on ground */}
            <circle cx="54" cy="122" r="8" fill="url(#bodyGrad)" />
            <line x1="62" y1="124" x2="72" y2="124" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            {/* Feet firmly on floor */}
            <line x1="135" y1="120" x2="140" y2="134" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />

            {/* Rising Hips */}
            <motion.polyline
              points="72,124 105,122 135,120"
              animate={isActive ? {
                points: ["72,124 105,122 135,120", "72,124 105,92 135,120", "72,124 105,122 135,120"]
              } : {}}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              fill="none"
              stroke="#34D399"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        )}

        {animType === 'cobra_stretch' && (
          <g>
            {/* Lower body on floor */}
            <line x1="90" y1="128" x2="160" y2="132" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            {/* Hands pushing up */}
            <line x1="85" y1="104" x2="85" y2="134" stroke="#6EE7B7" strokeWidth="5" strokeLinecap="round" />
            {/* Arched back */}
            <motion.path
              d="M 100 128 Q 80 110 65 95"
              fill="none"
              stroke="url(#bodyGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              animate={isActive ? { d: ["M 100 128 Q 80 110 65 95", "M 100 128 Q 78 102 62 86", "M 100 128 Q 80 110 65 95"] } : {}}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
            {/* Head looking upward */}
            <motion.circle
              cx="60"
              cy="86"
              r="8"
              fill="url(#bodyGrad)"
              animate={isActive ? { cy: [86, 78, 86] } : {}}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
          </g>
        )}

        {/* Fallback / General Motion */}
        {!['squat', 'pushup', 'plank', 'jumping_jacks', 'crunch', 'lunges', 'glute_bridge', 'cobra_stretch'].includes(animType) && (
          <motion.g
            animate={isActive ? { y: [0, -8, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          >
            <circle cx="100" cy="50" r="10" fill="url(#bodyGrad)" />
            <line x1="100" y1="60" x2="100" y2="98" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="70" x2="75" y2="85" stroke="#6EE7B7" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="70" x2="125" y2="85" stroke="#6EE7B7" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="98" x2="82" y2="135" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="98" x2="118" y2="135" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" />
          </motion.g>
        )}
      </svg>

      {/* Floating pulse indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[10px] text-emerald-300 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Техника анимациясы</span>
      </div>
    </div>
  );
};
