import React from 'react';
import { LEGEND_ITEMS } from '../constants/colors';

type LegendProps = {
  variant?: 'fixed' | 'popup';
  className?: string;
};

export function Legend({ variant = 'fixed', className = '' }: LegendProps) {
  const baseClasses =
    variant === 'fixed'
      ? 'absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700'
      : 'bg-white rounded-lg shadow-lg p-4 border border-gray-200';

  return (
    <div className={`${baseClasses} ${className}`}>
      {variant === 'popup' && <h3 className="font-semibold mb-2">Legend</h3>}
      <div className={variant === 'fixed' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
        {LEGEND_ITEMS.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2" title={label}>
            <div className={`w-4 h-4 rounded-sm`} style={{ backgroundColor: color }} />
            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Legend);
