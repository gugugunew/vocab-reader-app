import React from 'react';

interface PrimaryButtonProps {
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  id,
  onClick,
  disabled = false,
  children,
  icon,
  className = '',
  ariaLabel,
}) => {
  return (
    <button
      id={id}
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`h-14 px-7 rounded-full bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center space-x-2.5 transition-all select-none ${
        disabled
          ? 'opacity-40 cursor-not-allowed pointer-events-none text-neutral-400'
          : 'text-neutral-900 font-medium active:scale-[0.98] active:bg-gray-50/90 cursor-pointer'
      } ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap">
        {children}
      </span>
    </button>
  );
};
