
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { OTPVerificationForm } from "@/components/auth/OTPVerificationForm";
import { NewPasswordForm } from "@/components/auth/NewPasswordForm";

const Login = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isOtpVerificationOpen, setIsOtpVerificationOpen] = useState(false);
  const [isNewPasswordOpen, setIsNewPasswordOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleForgotPasswordSuccess = (email: string) => {
    setEmail(email);
    setIsForgotPasswordOpen(false);
    setIsOtpVerificationOpen(true);
  };

  const handleOtpVerificationSuccess = (token: string) => {
    setOtpToken(token);
    setIsOtpVerificationOpen(false);
    setIsNewPasswordOpen(true);
  };

  const handleNewPasswordSuccess = () => {
    setIsNewPasswordOpen(false);
    setEmail("");
    setOtpToken("");
  };

  return (
    <div className="min-h-screen flex flex-col relative animated-bg bg-gradient-subtle">
      <NavBar />
      
      {/* Animated wave background */}
      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-lg animate-fade-in">
          <AuthForm type="login" onSubmit={handleLogin} />
          
          <div className="mt-4 text-center space-y-2">
            <Button
              variant="link"
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={() => setIsForgotPasswordOpen(true)}
            >
              Forgot password?
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-feedr hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Forgot Password Dialog */}
      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a verification code.
            </DialogDescription>
          </DialogHeader>
          <ForgotPasswordForm onSuccess={handleForgotPasswordSuccess} />
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={isOtpVerificationOpen} onOpenChange={setIsOtpVerificationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Verification Code</DialogTitle>
            <DialogDescription>
              We've sent a code to {email}. Please enter it below.
            </DialogDescription>
          </DialogHeader>
          <OTPVerificationForm 
            email={email} 
            onSuccess={handleOtpVerificationSuccess} 
          />
        </DialogContent>
      </Dialog>
      
      {/* New Password Dialog */}
      <Dialog open={isNewPasswordOpen} onOpenChange={setIsNewPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set New Password</DialogTitle>
            <DialogDescription>
              Create a strong password for your account.
            </DialogDescription>
          </DialogHeader>
          <NewPasswordForm 
            resetToken={otpToken} 
            onSuccess={handleNewPasswordSuccess} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
