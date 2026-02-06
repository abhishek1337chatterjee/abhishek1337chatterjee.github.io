// Exploring item colors — maps to CSS classes in About.tsx
export type ExploringColor = 'cyan' | 'pink' | 'green' | 'orange' | 'purple';

export interface ExploringItem {
  name: string;
  category: 'technology' | 'concept' | 'tool';
  description?: string;
  color: ExploringColor;
}
