
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/layout/NavBar";
import { DonorDashboard } from "@/components/dashboard/DonorDashboard";
import { ReceiverDashboard } from "@/components/dashboard/ReceiverDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { useAuth } from "@/context/AuthContext";
import { initializeMockData } from "@/utils/mockData";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    
    // Initialize mock data
    initializeMockData();
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null; // Will redirect via the useEffect
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "donor":
        return <DonorDashboard />;
      case "receiver":
        return <ReceiverDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;
