import { createContext, useContext, useEffect, useState } from "react";
import { fetchJson } from "../api/apiClient.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const normalizeUser = (user) => ({
    ...user,
    id: user.id || user._id,
  });

  const setAuthData = ({ token, user }) => {
    localStorage.setItem("authToken", token);
    setUser(normalizeUser(user));
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setNotification({ type: "success", message: "Logged out successfully" });
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await fetchJson("/auth/profile");
      setUser(normalizeUser(data));
    } catch (error) {
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(normalizeUser(userData));
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setAuthData,
        updateUser,
        refreshProfile,
        logout,
        notification,
        setNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
