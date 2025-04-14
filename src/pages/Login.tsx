
import { AuthForm } from "@/components/auth/AuthForm";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error; // Re-throw to let the form handle the error state
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthForm type="login" onSubmit={handleLogin} />
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-feedr hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
