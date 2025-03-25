export const CELL_COLORS = {
  // Cell types
  START: '#4CAF50',    // Bright green
  END: '#F44336',      // Bright red
  BLOCKED: '#212121',  // Dark gray

  // Algorithm states
  UNVISITED: '#FFFFFF',  // White
  VISITED: '#90CAF9',    // Light blue
  CURRENT: '#FFC107',    // Amber
  NEIGHBOR: '#B2EBF2',   // Light cyan
  PATH: '#9C27B0',       // Purple
} as const;

export const LEGEND_ITEMS = [
  { label: 'Start Node', color: CELL_COLORS.START },
  { label: 'End Node', color: CELL_COLORS.END },
  { label: 'Unvisited', color: CELL_COLORS.UNVISITED },
  { label: 'Wall', color: CELL_COLORS.BLOCKED },
  { label: 'Visited', color: CELL_COLORS.VISITED },
  { label: 'Current Node', color: CELL_COLORS.CURRENT },
  { label: 'Neighbor', color: CELL_COLORS.NEIGHBOR },
  { label: 'Path', color: CELL_COLORS.PATH },
] as const; 