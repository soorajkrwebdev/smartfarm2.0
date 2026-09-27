import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function readViteEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

/** JWT `anon` key (existing) or newer publishable key — never service_role. */
function readPublicApiKey(): string {
  return readViteEnv('VITE_SUPABASE_ANON_KEY') || readViteEnv('VITE_SUPABASE_PUBLISHABLE_KEY');
}

function looksLikeServiceRoleKey(key: string): boolean {
  try {
    const parts = key.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.role === 'service_role';
  } catch {
    return false;
  }
}

export type SupabaseEnvIssueCode = 'missing_env' | 'invalid_url' | 'invalid_api_key';

export interface SupabaseEnvIssue {
  code: SupabaseEnvIssueCode;
  message: string;
}

export function inspectSupabaseEnv(): SupabaseEnvIssue | null {
  const url = readViteEnv('VITE_SUPABASE_URL');
  const key = readPublicApiKey();

  if (!url || !key) {
    const missing: string[] = [];
    if (!url) missing.push('VITE_SUPABASE_URL');
    if (!key) missing.push('VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY');
    return {
      code: 'missing_env',
      message: `Configuration missing: set ${missing.join(' and ')} in .env, then restart the Vite dev server.`,
    };
  }

  if (
    url.includes('your-project-id') ||
    url.includes('your-project.supabase.co')
  ) {
    return {
      code: 'missing_env',
      message: 'Configuration missing: VITE_SUPABASE_URL is still a placeholder. Use your real project URL from Supabase Project Settings → API.',
    };
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return {
        code: 'invalid_url',
        message: `Invalid Supabase URL: "${url}" must use https://`,
      };
    }
    const host = parsed.hostname.toLowerCase();
    if (!host.endsWith('.supabase.co') && host !== 'localhost' && host !== '127.0.0.1') {
      return {
        code: 'invalid_url',
        message: `Invalid Supabase URL host: ${host}. Expected https://<project-ref>.supabase.co`,
      };
    }
  } catch {
    return {
      code: 'invalid_url',
      message: `Invalid Supabase URL: "${url}" is not a valid URL.`,
    };
  }

  if (
    key.includes('your-anon') ||
    key.includes('your-anon-public-key') ||
    key.length < 20
  ) {
    return {
      code: 'missing_env',
      message: 'Configuration missing: VITE_SUPABASE_ANON_KEY / VITE_SUPABASE_PUBLISHABLE_KEY is still a placeholder.',
    };
  }

  if (looksLikeServiceRoleKey(key)) {
    return {
      code: 'invalid_api_key',
      message: 'Invalid API key: the service_role/secret key must never be used in frontend VITE_ variables. Use the anon or publishable key.',
    };
  }

  return null;
}

const envIssue = inspectSupabaseEnv();
const supabaseUrl = readViteEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = readPublicApiKey();

export const isSupabaseConfigured = envIssue === null;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const supabaseEnvIssue = envIssue;
