import React from 'react';
import { LEGEND_ITEMS } from '../constants/colors';

export function Legend() {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded shadow-sm">
      {LEGEND_ITEMS.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2" title={label}>
          <div className="w-4 h-4 border border-gray-300" style={{ backgroundColor: color }} />
          <span className="text-sm text-gray-700">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default React.memo(Legend);
