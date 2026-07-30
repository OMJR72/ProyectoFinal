import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    const savedToken = sessionStorage.getItem("token");
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, token) => {
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("activeTab");
    setUser(null);
  }, []);

  const actualizarPerfil = useCallback((datos) => {
    setUser((prev) => {
      const actualizado = { ...prev, ...datos };
      sessionStorage.setItem("user", JSON.stringify(actualizado));
      return actualizado;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, actualizarPerfil }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
