import React, { createContext, useContext, useState } from 'react';
import client from '../api/axiosClient';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // auth = { token: "...", user: {...} }
  const [auth, setAuth] = useLocalStorage('auth', { token: null, user: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ensure we always return the token to axios
  console.log("AUTH CONTEXT TOKEN:", auth.token);

  // FIX #1 — Normalize login() signature
  // so login({email, password}) OR login(email, password) both work
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    // If called as login({ email, password })
    if (typeof email === "object") {
      password = email.password;
      email = email.email;
    }

    try {
      const r = await client.post('/auth/login', { email, password });

      // Save to localStorage via your useLocalStorage hook
      setAuth({ token: r.data.token, user: r.data.user });

      console.log("LOGIN SUCCESS — TOKEN SET:", r.data.token);
      return r.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // FIX #2 — Same normalization for signup
  const signup = async (email, password) => {
    setLoading(true);
    setError(null);

    if (typeof email === "object") {
      password = email.password;
      email = email.email;
    }

    try {
      const r = await client.post('/auth/signup', { email, password });
      setAuth({ token: r.data.token, user: r.data.user });

      console.log("SIGNUP SUCCESS — TOKEN SET:", r.data.token);
      return r.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        login,
        signup,
        logout,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
