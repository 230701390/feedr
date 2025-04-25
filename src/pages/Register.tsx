
import { AuthForm } from "@/components/auth/AuthForm";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-2xl">
          <Alert className="mb-6 bg-purple-500/5 border-purple-500/20">
            <Shield className="h-4 w-4 text-purple-500" />
            <AlertTitle>Admin Registration Information</AlertTitle>
            <AlertDescription className="text-sm">
              To register as an admin, select "Manage Platform" role and enter the provided admin code in the form below.
            </AlertDescription>
          </Alert>
          
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
