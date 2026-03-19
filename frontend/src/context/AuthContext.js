import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem("factoryiq.accessToken");
        if (token) {
          const res = await api.get("/api/auth/profile/");
          setUser(res.data);
        }
      } catch (err) {
        localStorage.removeItem("factoryiq.accessToken");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("factoryiq.accessToken");
    setUser(null);
  };

  const isRole = (role) => {
    if (Array.isArray(role)) {
      return role.includes(user?.role);
    }
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}
