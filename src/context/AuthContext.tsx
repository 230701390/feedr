import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "donor" | "receiver" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  points?: number; // For reward system
  address?: {
    street1: string;
    street2?: string;
    street3?: string;
    landmark?: string;
    city: string;
    pincode: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: Omit<User, "id"> & { password: string, adminCode?: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
};

const ADMIN_CODE = "FEEDR2025"; // This is the code you'll need to use to register as admin

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("feedr-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    // In a real app, this would be an API call
    // For now, we'll mock this with localStorage
    const storedUsers = localStorage.getItem("feedr-users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const foundUser = users.find((u: any) => 
      u.email === email && u.password === password
    );
    
    if (!foundUser) {
      throw new Error("Invalid email or password");
    }
    
    // Remove password from user object before storing in state
    const { password: _, ...userWithoutPassword } = foundUser;
    
    setUser(userWithoutPassword);
    
    // Store user in local storage based on rememberMe option
    if (rememberMe) {
      localStorage.setItem("feedr-user", JSON.stringify(userWithoutPassword));
    } else {
      // For session-only storage, we could use sessionStorage instead
      // But for this demo, we'll still use localStorage but clear it on browser close
      // This is simulated and would require additional handling in a real app
      localStorage.setItem("feedr-user", JSON.stringify(userWithoutPassword));
    }
    
    // Redirect based on role
    navigate("/dashboard");
  };
  
  const register = async (userData: Omit<User, "id"> & { password: string; adminCode?: string }) => {
    const storedUsers = localStorage.getItem("feedr-users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if email already exists
    if (users.some((u: any) => u.email === userData.email)) {
      throw new Error("Email already in use");
    }
    
    // Check admin registration
    if (userData.role === "admin" && userData.adminCode !== ADMIN_CODE) {
      throw new Error("Invalid admin registration");
    }
    
    const newUser = {
      ...userData,
      id: `user-${Date.now()}`,
      points: userData.role === "donor" ? 0 : undefined,
    };
    
    users.push(newUser);
    localStorage.setItem("feedr-users", JSON.stringify(users));
    
    // Auto login after registration
    const { password: _, adminCode: __, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("feedr-user", JSON.stringify(userWithoutPassword));
    
    // Redirect based on role
    navigate("/dashboard");
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("feedr-user");
    navigate("/");
  };
  
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("feedr-user", JSON.stringify(updatedUser));
    
    // Update user in users array
    const storedUsers = localStorage.getItem("feedr-users");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, ...userData } : u
      );
      localStorage.setItem("feedr-users", JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        isAuthenticated: !!user,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
