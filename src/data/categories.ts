export interface CategoryDefinition {
  id: string;
  name: string;
  canonicalName: string;
  count: number;
}

export const CANONICAL_CATEGORIES: CategoryDefinition[] = [
  { id: 'chinese', name: 'Chinese (33)', canonicalName: 'Chinese', count: 33 },
  { id: 'tandoori', name: 'Tandoori (20)', canonicalName: 'Tandoori', count: 20 },
  { id: 'continental', name: 'Continental (42)', canonicalName: 'Continental', count: 42 },
  { id: 'north-indian', name: 'North Indian (49)', canonicalName: 'North Indian', count: 49 },
  { id: 'cold-beverages', name: 'Cold Beverages & Shakes (22)', canonicalName: 'Cold Beverages & Shakes', count: 22 },
];

export const CANONICAL_CATEGORY_NAMES = [
  'Chinese',
  'Tandoori',
  'Continental',
  'North Indian',
  'Cold Beverages & Shakes',
] as const;

export type CanonicalCategory = (typeof CANONICAL_CATEGORY_NAMES)[number];
