import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DemoStorage } from '../lib/demoStorage';
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
  isDemoMode: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
  toggleDemoMode: (enable: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  // Load profile from Supabase
  const fetchSupabaseProfile = async (userId: string, email?: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        setProfile({ ...data, email });
      } else {
        // Fallback profile if row hasn't been created yet
        const defaultProfile: UserProfile = {
          id: userId,
          email,
          full_name: 'Farmer',
          preferred_language: 'en',
          farming_type: 'mixed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(defaultProfile);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured && supabase && !isDemoMode) {
      // Check active session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchSupabaseProfile(session.user.id, session.user.email);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchSupabaseProfile(session.user.id, session.user.email);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Demo / Local storage mode
      const demoProf = DemoStorage.getProfile();
      setProfile(demoProf);
      // Mock user object for demo mode
      setUser({
        id: demoProf.id,
        app_metadata: {},
        user_metadata: { full_name: demoProf.full_name },
        aud: 'authenticated',
        created_at: demoProf.created_at,
        email: demoProf.email,
      } as unknown as User);
      setLoading(false);
    }
  }, [isDemoMode]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (isSupabaseConfigured && supabase && !isDemoMode) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? error.message : null };
    } else {
      // Demo sign in
      const current = DemoStorage.getProfile();
      const updated = DemoStorage.updateProfile({ email });
      setProfile(updated);
      setUser({
        id: current.id,
        app_metadata: {},
        user_metadata: { full_name: updated.full_name },
        aud: 'authenticated',
        created_at: updated.created_at,
        email,
      } as unknown as User);
      return { error: null };
    }
  };

  const signUp = async (data: SignUpData): Promise<{ error: string | null }> => {
    if (isSupabaseConfigured && supabase && !isDemoMode) {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            state: data.state,
            district: data.district,
            village: data.village,
            farming_type: data.farmingType || 'mixed',
          }
        }
      });
      if (error) return { error: error.message };
      if (authData.user) {
        await fetchSupabaseProfile(authData.user.id, data.email);
      }
      return { error: null };
    } else {
      // Demo sign up
      const newProf: UserProfile = {
        id: `demo-${Date.now()}`,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        state: data.state,
        district: data.district,
        village: data.village,
        preferred_language: 'en',
        farming_type: data.farmingType || 'organic',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      DemoStorage.updateProfile(newProf);
      setProfile(newProf);
      setUser({
        id: newProf.id,
        app_metadata: {},
        user_metadata: { full_name: newProf.full_name },
        aud: 'authenticated',
        created_at: newProf.created_at,
        email: data.email,
      } as unknown as User);
      return { error: null };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase && !isDemoMode) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error: string | null }> => {
    if (isSupabaseConfigured && supabase && user && !isDemoMode) {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) return { error: error.message };
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } else {
      const updated = DemoStorage.updateProfile(updates);
      setProfile(updated);
      return { error: null };
    }
  };

  const toggleDemoMode = (enable: boolean) => {
    setIsDemoMode(enable);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isDemoMode,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        updateProfile,
        toggleDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
