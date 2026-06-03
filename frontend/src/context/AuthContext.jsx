import React from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("expenseUser") || "null"));

  const saveUser = useCallback((data) => {
    localStorage.setItem("expenseUser", JSON.stringify(data));
    setUser(data);
  }, []);

  const login = useCallback(async (payload, mode) => {
    const { data } = await api.post(`/auth/${mode}`, payload);
    saveUser(data);
  }, [saveUser]);

  const loginWithGoogle = useCallback(async (credential) => {
    const { data } = await api.post("/auth/google", { credential });
    saveUser(data);
  }, [saveUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("expenseUser");
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, loginWithGoogle, logout }), [user, login, loginWithGoogle, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
