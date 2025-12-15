import React from 'react';

// Progress Bar Component
interface StatBarProps {
  label?: string;
  value: number;
  max: number;
  color: 'red' | 'blue' | 'amber' | 'purple' | 'emerald';
  className?: string;
  showValue?: boolean;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, max, color, className, showValue = true }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorMap = {
    red: 'from-[#ff6961] via-[#d43c2f] to-[#8b1c12]',
    blue: 'from-[#6cb8ff] via-[#2e6ad4] to-[#123c8b]',
    amber: 'from-[#ffd27a] via-[#d6a74f] to-[#8b6b2c]',
    purple: 'from-[#d6b6ff] via-[#8b5ccf] to-[#4a2c88]',
    emerald: 'from-[#9bf0c0] via-[#34c759] to-[#0f6b34]',
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-xs font-serif text-[var(--gold-300)] tracking-wider drop-shadow">
          <span>{label}</span>
          {showValue && <span className="font-mono text-[var(--gold-100)]">{value} / {max}</span>}
        </div>
      )}
      <div className="relative h-3 w-full bg-[#0f1018] border border-[#252736] rounded-md overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur">
        <div
          className={`h-full bg-gradient-to-r ${colorMap[color]} transition-all duration-500 ease-out shadow-[0_0_16px_rgba(214,167,79,0.35)]`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/12 via-transparent to-black/40 pointer-events-none" />
        <div className="absolute inset-0 blur-[10px] opacity-50 bg-white/10 pointer-events-none" />
      </div>
    </div>
  );
};

// Panel Component (The Glass/Gold Box)
export const Panel: React.FC<{ children: React.ReactNode; title?: string; className?: string }> = ({ children, title, className = '' }) => {
  return (
    <div
      className={`
        relative rounded-xl p-4
        bg-gradient-to-br from-[#0f1018cc] via-[#0b0d13cc] to-[#050507cc]
        border border-[#2f3040] shadow-[0_20px_60px_rgba(0,0,0,0.65)]
        backdrop-blur-xl
        ${className}
      `}
    >
      <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-[var(--gold-500)]/60 opacity-80" />
      <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t border-r border-[var(--gold-500)]/60 opacity-80" />
      <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b border-l border-[var(--gold-500)]/60 opacity-80" />
      <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-[var(--gold-500)]/60 opacity-80" />

      {title && (
        <div className="mb-3 pb-2 border-b border-[#2f3040]">
           <h3 className="text-[var(--gold-100)] font-display font-semibold tracking-widest text-sm uppercase text-center shadow-black drop-shadow-xl">
             {title}
           </h3>
        </div>
      )}
      {children}
    </div>
  );
};

// Action Button
export const GoldButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }> = ({ children, icon, className, ...props }) => {
  return (
    <button
      className={`
        group relative flex items-center justify-center gap-2 px-4 py-2 w-full
        bg-gradient-to-b from-[#1d1f2a] via-[#0f1018] to-[#0b0d13]
        hover:from-[#242734] hover:via-[#141722] hover:to-[#0f1018]
        border border-[var(--gold-700)]/60 hover:border-[var(--gold-500)]
        text-[var(--gold-100)] font-serif text-sm tracking-wide
        shadow-[0_12px_30px_rgba(0,0,0,0.55),0_0_12px_rgba(214,167,79,0.35)]
        transition-all duration-200
        active:translate-y-[1px]
        rounded-md
        ${className}
      `}
      {...props}
    >
      {icon && <span className="text-[var(--gold-300)] group-hover:text-[var(--gold-100)] transition-colors">{icon}</span>}
      <span className="relative z-10 drop-shadow">{children}</span>

      <div className="absolute inset-0 bg-[var(--gold-500)]/6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      <div className="absolute inset-0 border border-white/5 rounded-md pointer-events-none" />
    </button>
  );
};
