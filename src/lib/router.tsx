import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Minimal dependency-free client router.
 *
 * The application needs real, deep-linkable URLs (public farm work board, public
 * knowledge hub, farmer modules) without pulling in an extra routing dependency.
 * It uses the History API + popstate so that refresh and deep links work when the
 * host performs an SPA rewrite to index.html (see vercel.json).
 */

export interface RouterValue {
  path: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterValue>({
  path: '/',
  navigate: () => undefined,
});

export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const expected = patternParts[i];
    const actual = pathParts[i];
    if (expected.startsWith(':')) {
      params[expected.slice(1)] = decodeURIComponent(actual);
    } else if (expected !== actual) {
      return null;
    }
  }
  return params;
}

const normalize = (to: string) => {
  const value = to.split('?')[0] || '/';
  if (value.length > 1 && value.endsWith('/')) return value.slice(0, -1);
  return value;
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => normalize(window.location.pathname || '/'));

  useEffect(() => {
    const handlePopState = () => setPath(normalize(window.location.pathname || '/'));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const target = normalize(to.startsWith('/') ? to : `/${to}`);
    if (target === normalize(window.location.pathname) && !options?.replace) return;
    if (options?.replace) {
      window.history.replaceState({}, '', target);
    } else {
      window.history.pushState({}, '', target);
    }
    setPath(target);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const value = useMemo<RouterValue>(() => ({ path, navigate }), [path, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export const useRouter = () => useContext(RouterContext);

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  title?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Accessible in-app link that keeps real href semantics (middle-click / copy link
 * still works) while routing client-side on a normal click.
 */
export const Link: React.FC<LinkProps> = ({ to, children, className, ariaLabel, title, onClick }) => {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      title={title}
      aria-label={ariaLabel}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
};
