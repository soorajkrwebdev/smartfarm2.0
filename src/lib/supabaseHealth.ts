import type { PostgrestError } from '@supabase/supabase-js';
import { inspectSupabaseEnv, supabase } from './supabase';

export type SupabaseHealthCode =
  | 'missing_env'
  | 'invalid_url'
  | 'invalid_api_key'
  | 'network_error'
  | 'permission_error'
  | 'ok';

export type ConnectionUiStatus =
  | 'checking'
  | 'connected'
  | 'configuration_missing'
  | 'authentication_required'
  | 'permission_error'
  | 'connection_failed';

export interface SupabaseHealthResult {
  code: SupabaseHealthCode;
  status: ConnectionUiStatus;
  label: string;
  message: string;
}

export function connectionUiLabel(status: ConnectionUiStatus): string {
  switch (status) {
    case 'checking':
      return 'Checking connection...';
    case 'connected':
      return 'Connected';
    case 'configuration_missing':
      return 'Configuration missing';
    case 'authentication_required':
      return 'Authentication required';
    case 'permission_error':
      return 'Database permission error';
    case 'connection_failed':
      return 'Connection failed';
  }
}

function healthFromEnvIssue(): SupabaseHealthResult {
  const issue = inspectSupabaseEnv();
  if (!issue) {
    return {
      code: 'ok',
      status: 'connected',
      label: connectionUiLabel('connected'),
      message: 'Supabase client is configured.',
    };
  }

  if (issue.code === 'missing_env') {
    return {
      code: 'missing_env',
      status: 'configuration_missing',
      label: connectionUiLabel('configuration_missing'),
      message: issue.message,
    };
  }

  if (issue.code === 'invalid_url') {
    return {
      code: 'invalid_url',
      status: 'connection_failed',
      label: connectionUiLabel('connection_failed'),
      message: issue.message,
    };
  }

  return {
    code: 'invalid_api_key',
    status: 'connection_failed',
    label: connectionUiLabel('connection_failed'),
    message: issue.message,
  };
}

function classifyQueryError(error: PostgrestError): SupabaseHealthResult {
  const text = `${error.message} ${error.code ?? ''} ${error.hint ?? ''} ${error.details ?? ''}`.toLowerCase();
  const httpStatus =
    'status' in error && typeof (error as { status?: unknown }).status === 'number'
      ? (error as { status: number }).status
      : undefined;

  if (
    httpStatus === 401 ||
    error.code === 'PGRST301' ||
    text.includes('invalid api key') ||
    (text.includes('jwt') && (text.includes('invalid') || text.includes('malformed') || text.includes('expired')))
  ) {
    return {
      code: 'invalid_api_key',
      status: 'connection_failed',
      label: connectionUiLabel('connection_failed'),
      message: `Invalid API key: ${error.message}`,
    };
  }

  if (error.code === '42P01' || text.includes('does not exist')) {
    return {
      code: 'permission_error',
      status: 'permission_error',
      label: connectionUiLabel('permission_error'),
      message: `Database permission error: table or relation missing (${error.message}). Apply the existing SmartFarm migrations to this Supabase project.`,
    };
  }

  if (
    httpStatus === 403 ||
    error.code === '42501' ||
    text.includes('permission denied') ||
    text.includes('row-level security') ||
    text.includes('not allowed')
  ) {
    return {
      code: 'permission_error',
      status: 'permission_error',
      label: connectionUiLabel('permission_error'),
      message: `Database permission error: ${error.message}${error.hint ? ` (${error.hint})` : ''}`,
    };
  }

  return {
    code: 'network_error',
    status: 'connection_failed',
    label: connectionUiLabel('connection_failed'),
    message: `Connection failed: ${error.message}${error.code ? ` [${error.code}]` : ''}`,
  };
}

function classifyThrown(err: unknown): SupabaseHealthResult {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (lower.includes('failed to fetch') || lower.includes('network') || lower.includes('load failed')) {
    return {
      code: 'network_error',
      status: 'connection_failed',
      label: connectionUiLabel('connection_failed'),
      message: `Network error: could not reach the Supabase API. ${message}`,
    };
  }

  if (lower.includes('invalid url') || lower.includes('failed to construct')) {
    return {
      code: 'invalid_url',
      status: 'connection_failed',
      label: connectionUiLabel('connection_failed'),
      message: `Invalid Supabase URL: ${message}`,
    };
  }

  if (lower.includes('invalid api key') || lower.includes('jwt')) {
    return {
      code: 'invalid_api_key',
      status: 'connection_failed',
      label: connectionUiLabel('connection_failed'),
      message: `Invalid API key: ${message}`,
    };
  }

  return {
    code: 'network_error',
    status: 'connection_failed',
    label: connectionUiLabel('connection_failed'),
    message: `Connection failed: ${message}`,
  };
}

/**
 * Harmless read against `profiles` (existing RLS-protected table).
 * An empty result with no error means the API accepted the anon key (RLS hid rows).
 */
export async function checkSupabaseConnection(): Promise<SupabaseHealthResult> {
  const envResult = healthFromEnvIssue();
  if (envResult.code !== 'ok') return envResult;

  if (!supabase) {
    return {
      code: 'missing_env',
      status: 'configuration_missing',
      label: connectionUiLabel('configuration_missing'),
      message: 'Configuration missing: Supabase client was not created.',
    };
  }

  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);

    if (!error) {
      return {
        code: 'ok',
        status: 'connected',
        label: connectionUiLabel('connected'),
        message: 'Connected to Supabase. Read against public.profiles succeeded.',
      };
    }

    return classifyQueryError(error);
  } catch (err) {
    return classifyThrown(err);
  }
}
