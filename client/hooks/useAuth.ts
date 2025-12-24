import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      // Normalize email: trim whitespace and convert to lowercase
      const normalizedEmail = email.trim().toLowerCase();

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return { 
          success: false, 
          error: { message: "Please enter a valid email address" } 
        };
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: password.trim(),
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (authError) {
        // Provide more user-friendly error messages
        let errorMessage = authError.message;
        if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
          errorMessage = "This email is already registered. Please log in instead.";
        } else if (authError.message.includes("invalid")) {
          // Supabase blocks test domains like example.com, test.com, etc.
          if (normalizedEmail.includes("example.com") || 
              normalizedEmail.includes("test.com") || 
              normalizedEmail.includes("eventhub.com")) {
            errorMessage = "Please use a real email address (e.g., Gmail, Yahoo, Outlook). Test domains are not allowed.";
          } else {
            errorMessage = "Please enter a valid email address with a real domain (e.g., Gmail, Yahoo, Outlook).";
          }
        } else if (authError.message.includes("password")) {
          errorMessage = "Password must be at least 6 characters long.";
        } else if (authError.message.includes("rate limit")) {
          errorMessage = "Too many signup attempts. Please try again later.";
        }
        throw { ...authError, message: errorMessage };
      }

      // Only create user profile if user was created successfully
      if (authData.user) {
        // Create user profile
        // Note: password_hash is required by the database schema but Supabase Auth handles passwords
        // We use a placeholder since we should never store plain passwords
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: authData.user.id,
            email: normalizedEmail,
            full_name: fullName,
            role,
            password_hash: "", // Placeholder - Supabase Auth handles password hashing
          },
        ]);

        if (profileError) {
          // If profile creation fails, try to update instead (in case user already exists)
          const { error: updateError } = await supabase
            .from("users")
            .update({
              email: normalizedEmail,
              full_name: fullName,
              role,
            })
            .eq("id", authData.user.id);

          if (updateError) {
            console.error("Profile creation/update error:", profileError, updateError);
            // Don't fail signup - user can still authenticate via Supabase Auth
            // Profile can be created/updated later
          }
        }
      }

      return { success: true, data: authData };
    } catch (error: any) {
      console.error("Sign up error:", error);
      return { success: false, error };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Normalize email: trim whitespace and convert to lowercase
      const normalizedEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password.trim(),
      });

      if (error) {
        // Provide more user-friendly error messages
        let errorMessage = error.message;
        if (error.message.includes("Invalid login credentials") || error.code === "invalid_credentials") {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.message.includes("Email not confirmed") || error.code === "email_not_confirmed") {
          errorMessage = "Please check your email and click the confirmation link before logging in. If you didn't receive it, check your spam folder or request a new confirmation email.";
        } else if (error.message.includes("User not found")) {
          errorMessage = "No account found with this email. Please sign up first.";
        }
        throw { ...error, message: errorMessage };
      }

      // Fetch user profile after successful login
      if (data.user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (!profileError && profileData) {
            setUser(profileData);
            return { success: true, data, user: profileData };
          } else {
            // If profile doesn't exist, still allow login but fetch will happen in useEffect
            await fetchUserProfile(data.user.id);
            return { success: true, data, user: null };
          }
        } catch (err) {
          console.error("Error fetching user profile during login:", err);
          // Still allow login, profile will be fetched by useEffect
          return { success: true, data, user: null };
        }
      }

      return { success: true, data, user: null };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error };
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: normalizedEmail,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Resend confirmation error:", error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    session,
    user,
    loading,
    signUp,
    login,
    logout,
    resendConfirmationEmail,
    isAuthenticated: !!session,
  };
}
