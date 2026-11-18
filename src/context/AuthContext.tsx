'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { UserProfile, UserRole } from '@/types';

import {
  createClient,
  isSupabaseConfigured,
} from '@/lib/supabase/client';

interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isSupabaseLive: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (
    updates: Partial<UserProfile>
  ) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);

  // Initialize Supabase authentication and listen for auth changes.
  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured()) {
      setIsSupabaseLive(false);
      setIsLoading(false);
      return;
    }

    setIsSupabaseLive(true);

    const supabase = createClient();

    const loadProfile = async (
      userId: string,
      email: string,
      fullName?: string
    ): Promise<UserProfile> => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // A missing profile defaults to customer, never admin.
      return (
        profile || {
          id: userId,
          email,
          full_name: fullName || '',
          role: 'customer',
        }
      ) as UserProfile;
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Defer profile query outside the auth callback.
      setTimeout(() => {
        if (!mounted) return;

        loadProfile(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.full_name
        )
          .then(profile => {
            if (mounted) setUser(profile);
          })
          .catch(error => {
            console.error('Unable to load user profile:', error);
          })
          .finally(() => {
            if (mounted) setIsLoading(false);
          });
      }, 0);
    });

    const initialize = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user && mounted) {
          const profile = await loadProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.full_name
          );

          if (mounted) setUser(profile);
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void initialize();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Real Supabase login. No demo fallback.
  const login = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    if (!isSupabaseLive) {
      return {
        success: false,
        error: 'Supabase is not configured. Check your environment variables.',
      };
    }

    if (!email.trim() || !password) {
      return {
        success: false,
        error: 'Email and password are required.',
      };
    }

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Authentication failed. Please try again.',
        };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Unable to verify your account role.',
        };
      }

      const loggedInUser = (profile || {
        id: data.user.id,
        email: data.user.email || '',
        full_name: data.user.user_metadata?.full_name || '',
        role: 'customer',
      }) as UserProfile;

      setUser(loggedInUser);

      return {
        success: true,
        role: loggedInUser.role,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected login error occurred.',
      };
    }
  };

  // Public signup always creates a customer account.
  const signup = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<AuthResult> => {
    if (!isSupabaseLive) {
      return {
        success: false,
        error: 'Supabase is not configured. Check your environment variables.',
      };
    }

    if (!email.trim() || !password) {
      return {
        success: false,
        error: 'Email and password are required.',
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must contain at least 6 characters.',
      };
    }

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || '',
            role: 'customer',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Unable to create your account.',
        };
      }

      return {
        success: true,
        message: data.session
          ? 'Account created successfully!'
          : 'Please check your email to verify your account before logging in.',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected signup error occurred.',
      };
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseLive) {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout failed:', error.message);
      }
    }

    setUser(null);
  };

  const updateProfile = async (
    updates: Partial<UserProfile>
  ): Promise<AuthResult> => {
    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to update your profile.',
      };
    }

    // Prevent client-side changes to identity and authorization fields.
    const {
      id,
      role,
      email,
      created_at,
      ...safeUpdates
    } = updates;

    if (isSupabaseLive) {
      try {
        const supabase = createClient();

        const { error } = await supabase
          .from('profiles')
          .update(safeUpdates)
          .eq('id', user.id);

        if (error) {
          return { success: false, error: error.message };
        }
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Profile update failed.',
        };
      }
    }

    const updatedUser = {
      ...user,
      ...safeUpdates,
    };

    setUser(updatedUser);

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseLive,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};
