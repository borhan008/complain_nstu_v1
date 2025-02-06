import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../../config";
import { toast } from "react-toastify";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("notfound");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      setUser(user);
      await findRole();
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const findRole = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user/check", {
        headers: {
          Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
        },
      });
      const data = await response.json();
      if (response.status === 401) {
        if (data.logout) {
          toast.error("You are blocked.", {
            toastId: "logout",
          });
          await auth.signOut();
        }
      }
      setRole(data.user[0].role);
    } catch (error) {
      setRole("notfound", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
