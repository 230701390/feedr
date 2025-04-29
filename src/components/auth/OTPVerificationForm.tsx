
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/config/firebase";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPVerificationFormProps = {
  email: string;
  verificationId?: string;
  onSuccess: (token: string) => void;
};

export function OTPVerificationForm({ email, verificationId, onSuccess }: OTPVerificationFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof otpSchema>) => {
    setLoading(true);
    try {
      // If we have a verificationId, use Firebase phone auth
      if (verificationId) {
        const credential = PhoneAuthProvider.credential(verificationId, data.otp);
        await signInWithCredential(auth, credential);
        const token = await auth.currentUser?.getIdToken();
        onSuccess(token || "firebase-auth-token");
        toast({
          title: "Verification Successful",
          description: "Your identity has been verified successfully."
        });
      } else {
        // For email, we'll use a simulated approach for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Demo validation logic - in a real app, this would validate against a backend
        // For demo, either "123456" or if the OTP equals the last 6 chars of the email
        const emailCode = email.slice(-6).padStart(6, '0');
        const isOtpValid = data.otp === "123456" || data.otp === emailCode;
        
        if (!isOtpValid) {
          throw new Error("Invalid verification code");
        }
        
        // Generate a token for password reset
        const token = `reset-token-${Date.now()}`;
        onSuccess(token);
        toast({
          title: "Verification Successful",
          description: "Your identity has been verified successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid OTP. Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, i) => (
                        <InputOTPSlot key={i} {...slot} index={i} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-xs text-muted-foreground mt-2">
          <p>For testing purposes, you can use "123456" as the verification code.</p>
          <p>Or use the last 6 characters of your email if longer than 6 characters.</p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Verify
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
