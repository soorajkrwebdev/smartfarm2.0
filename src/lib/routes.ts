/**
 * Single source of truth for application navigation: tabs <-> URL paths.
 *
 * Public routes are reachable without authentication. Private farmer modules
 * require an authenticated session.
 */

export type NavigationTab =
  | 'dashboard'
  | 'farms'
  | 'crops'
  | 'activities'
  | 'inputs'
  | 'organic'
  | 'pest-ipm'
  | 'tests'
  | 'waste'
  | 'sustainability'
  | 'weather'
  | 'market'
  | 'farm-work'
  | 'expenses'
  | 'harvests'
  | 'analytics'
  | 'farm-ai'
  | 'knowledge'
  | 'reports'
  | 'notifications'
  | 'profile';

export const TAB_PATHS: Record<NavigationTab, string> = {
  dashboard: '/dashboard',
  farms: '/farms',
  crops: '/crops',
  activities: '/activities',
  inputs: '/inputs',
  organic: '/organic-farming',
  'pest-ipm': '/pest-ipm',
  tests: '/soil-water-tests',
  waste: '/waste-compost',
  sustainability: '/sustainability',
  weather: '/weather',
  market: '/market',
  'farm-work': '/farm-work',
  expenses: '/expenses',
  harvests: '/harvests',
  analytics: '/analytics',
  'farm-ai': '/farm-ai',
  knowledge: '/knowledge',
  reports: '/reports',
  notifications: '/notifications',
  profile: '/settings',
};

export function pathForTab(tab: NavigationTab): string {
  return TAB_PATHS[tab];
}

const PATH_LOOKUP: Record<string, NavigationTab> = Object.entries(TAB_PATHS).reduce(
  (acc, [tab, path]) => ({ ...acc, [path]: tab as NavigationTab }),
  {} as Record<string, NavigationTab>
);

export function tabFromPath(path: string): NavigationTab | null {
  return PATH_LOOKUP[path] ?? null;
}

/** Routes that must work without a farmer account. */
export const PUBLIC_ROUTES = [
  '/',
  '/farm-work',
  '/farm-work/:id',
  '/knowledge',
  '/login',
  '/register',
  '/reset-password',
];

export function isPublicPath(path: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    const parts = route.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);
    if (parts.length !== pathParts.length) return false;
    return parts.every((part, index) => part.startsWith(':') || part === pathParts[index]);
  });
}

export const AUTH_PATHS = {
  login: '/login',
  register: '/register',
  resetPassword: '/reset-password',
} as const;

export const PUBLIC_PATHS = {
  landing: '/',
  farmWork: '/farm-work',
  knowledge: '/knowledge',
} as const;

/** Farmer work-board tab, used both publicly and inside the authenticated shell. */
export const FARM_WORK_PATH = '/farm-work';
