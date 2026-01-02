"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// Local user type stored in localStorage
export interface LocalUser {
  id: string;
  name: string;
  type: "local";
  createdAt: string;
}

// Combined user type
export type AppUser = { type: "firebase"; user: FirebaseUser } | { type: "local"; user: LocalUser };

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  // Google auth
  signInWithGoogle: () => Promise<void>;
  // Local user auth
  signInAsLocalUser: (name: string) => void;
  // Sign out
  logout: () => Promise<void>;
  // Helpers
  getUserName: () => string;
  getUserEmail: () => string;
  getUserId: () => string;
}

const LOCAL_USER_KEY = "personality-app-local-user";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for local user on mount
  useEffect(() => {
    // First check localStorage for local user
    const storedLocalUser = localStorage.getItem(LOCAL_USER_KEY);
    if (storedLocalUser) {
      try {
        const localUser: LocalUser = JSON.parse(storedLocalUser);
        setCurrentUser({ type: "local", user: localUser });
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(LOCAL_USER_KEY);
      }
    }

    // Then check Firebase auth state
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser({ type: "firebase", user: firebaseUser });
      } else {
        // Check again for local user (in case it was set while Firebase was loading)
        const localUserStr = localStorage.getItem(LOCAL_USER_KEY);
        if (localUserStr) {
          try {
            const localUser: LocalUser = JSON.parse(localUserStr);
            setCurrentUser({ type: "local", user: localUser });
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase auth not initialized");
    // Clear any local user first
    localStorage.removeItem(LOCAL_USER_KEY);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInAsLocalUser = (name: string) => {
    const localUser: LocalUser = {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      type: "local",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setCurrentUser({ type: "local", user: localUser });
  };

  const logout = async () => {
    // Clear local user
    localStorage.removeItem(LOCAL_USER_KEY);

    // Sign out from Firebase if signed in
    if (auth && currentUser?.type === "firebase") {
      await firebaseSignOut(auth);
    }

    setCurrentUser(null);
  };

  const getUserName = (): string => {
    if (!currentUser) return "";
    if (currentUser.type === "local") {
      return currentUser.user.name;
    }
    return currentUser.user.displayName || currentUser.user.email?.split("@")[0] || "";
  };

  const getUserEmail = (): string => {
    if (!currentUser) return "";
    if (currentUser.type === "local") {
      return ""; // Local users don't have email
    }
    return currentUser.user.email || "";
  };

  const getUserId = (): string => {
    if (!currentUser) return "";
    if (currentUser.type === "local") {
      return currentUser.user.id;
    }
    return currentUser.user.uid;
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInAsLocalUser,
    logout,
    getUserName,
    getUserEmail,
    getUserId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
