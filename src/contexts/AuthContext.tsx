import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, FarmingType } from '../types';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  state?: string;
  district?: string;
  village?: string;
  farmingType?: FarmingType;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile from Supabase
  const fetchProfile = async (userId: string, email?: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[AuthContext] Error fetching profile:', error.message);
      }

      if (data) {
        setProfile({ ...data, email });
      } else {
        // Profile row not yet created (trigger may still be in flight on first login)
        const fallback: UserProfile = {
          id: userId,
          email,
          full_name: 'Farmer',
          preferred_language: 'en',
          farming_type: 'mixed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(fallback);
      }
    } catch (err) {
      console.error('[AuthContext] Failed to load profile:', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Supabase not configured — app shows unconfigured state
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email);
        } else {
          setProfile(null);
        }
        // Only update loading to false after initial event
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signUp = async (data: SignUpData): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase is not configured.' };

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone ?? null,
          state: data.state ?? null,
          district: data.district ?? null,
          village: data.village ?? null,
          preferred_language: 'en',
          farming_type: data.farmingType ?? 'mixed',
        },
      },
    });

    if (error) return { error: error.message };

    // If email confirmation is disabled the user is returned immediately
    if (authData.user && authData.session) {
      await fetchProfile(authData.user.id, data.email);
    }

    return { error: null };
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error ? error.message : null };
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error: string | null }> => {
    if (!supabase || !user) return { error: 'Not authenticated.' };

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) return { error: error.message };
    setProfile(prev => (prev ? { ...prev, ...updates } : null));
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
