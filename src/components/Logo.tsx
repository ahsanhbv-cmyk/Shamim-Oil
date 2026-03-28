export default function Logo({ size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg' | 'xl'; showText?: boolean }) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-lg', letter: 'text-sm' },
    md: { container: 'w-12 h-12', text: 'text-xl', letter: 'text-lg' },
    lg: { container: 'w-16 h-16', text: 'text-2xl', letter: 'text-xl' },
    xl: { container: 'w-24 h-24', text: 'text-4xl', letter: 'text-3xl' },
  }

  const s = sizes[size]

  return (
    <div className="flex items-center gap-3">
      {/* Oil Drop with S */}
      <div className={`${s.container} relative`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Oil Drop Shape */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9C31D" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8960F" />
            </linearGradient>
            <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          
          {/* Main Drop */}
          <path
            d="M50 5 C50 5 15 45 15 65 C15 85 30 95 50 95 C70 95 85 85 85 65 C85 45 50 5 50 5"
            fill="url(#goldGradient)"
          />
          
          {/* Shine Effect */}
          <ellipse cx="35" cy="55" rx="12" ry="18" fill="url(#shineGradient)" opacity="0.6" />
          
          {/* Letter S */}
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fill="#074C2A"
            fontFamily="Cinzel, serif"
            fontWeight="700"
            fontSize="40"
          >
            S
          </text>
        </svg>
      </div>
      
      {showText && (
        <div>
          <h1 className={`font-display ${s.text} font-bold text-white tracking-wide leading-tight`}>
            SHAMIM OIL
          </h1>
          <p className="text-xs text-gold-400 font-medium tracking-widest">DEPO</p>
        </div>
      )}
    </div>
  )
}

export function LogoDark({ size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg' | 'xl'; showText?: boolean }) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-lg', letter: 'text-sm' },
    md: { container: 'w-12 h-12', text: 'text-xl', letter: 'text-lg' },
    lg: { container: 'w-16 h-16', text: 'text-2xl', letter: 'text-xl' },
    xl: { container: 'w-24 h-24', text: 'text-4xl', letter: 'text-3xl' },
  }

  const s = sizes[size]

  return (
    <div className="flex items-center gap-3">
      {/* Oil Drop with S */}
      <div className={`${s.container} relative`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          <defs>
            <linearGradient id="goldGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9C31D" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8960F" />
            </linearGradient>
            <linearGradient id="shineGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          
          <path
            d="M50 5 C50 5 15 45 15 65 C15 85 30 95 50 95 C70 95 85 85 85 65 C85 45 50 5 50 5"
            fill="url(#goldGradientDark)"
          />
          
          <ellipse cx="35" cy="55" rx="12" ry="18" fill="url(#shineGradientDark)" opacity="0.6" />
          
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fill="#074C2A"
            fontFamily="Cinzel, serif"
            fontWeight="700"
            fontSize="40"
          >
            S
          </text>
        </svg>
      </div>
      
      {showText && (
        <div>
          <h1 className={`font-display ${s.text} font-bold text-forest-700 tracking-wide leading-tight`}>
            SHAMIM OIL
          </h1>
          <p className="text-xs text-gold-600 font-medium tracking-widest">DEPO</p>
        </div>
      )}
    </div>
  )
}

