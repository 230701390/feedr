
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth, generateOTP } from "@/config/firebase";
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
  const [generatedOTP, setGeneratedOTP] = useState<string>(() => {
    // Generate OTP when component mounts
    return generateOTP();
  });

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Show the generated OTP in a toast for testing purposes
  // In a real app, this would be sent via SMS/email
  useState(() => {
    toast({
      title: "Verification Code Generated",
      description: `For testing purposes, use this code: ${generatedOTP}`,
      duration: 10000,
    });
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
        // For email verification, check against our generated OTP
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if the entered OTP matches our generated one or use test codes
        const isOtpValid = data.otp === generatedOTP || data.otp === "123456";
        
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
              <p className="text-xs text-muted-foreground mt-2">
                A verification code has been generated for this demo. Check the toast notification.
              </p>
            </FormItem>
          )}
        />

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
