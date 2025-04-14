
import { AuthForm } from "@/components/auth/AuthForm";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const { register } = useAuth();
  const { toast } = useToast();

  const handleRegister = async (data: any) => {
    try {
      await register(data);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error; // Re-throw to let the form handle the error state
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-2xl">
          <AuthForm type="register" onSubmit={handleRegister} />
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-feedr hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
