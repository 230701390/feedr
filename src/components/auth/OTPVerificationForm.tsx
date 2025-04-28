
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPVerificationFormProps = {
  email: string;
  onSuccess: (token: string) => void;
};

export function OTPVerificationForm({ email, onSuccess }: OTPVerificationFormProps) {
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
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate OTP (simulated)
      const isOtpValid = data.otp === "123456" || Math.random() > 0.2; // Hardcoded test OTP or 80% chance of success
      
      if (!isOtpValid) {
        throw new Error("Invalid or expired verification code");
      }
      
      // Generate a token for password reset (simulated)
      const token = `reset-token-${Date.now()}`;
      onSuccess(token);
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
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, i) => (
                        <InputOTPSlot key={i} {...slot} index={i} />
                      ))}
                    </InputOTPGroup>
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-xs text-muted-foreground mt-2">
          <p>For testing purposes, you can use "123456" as the verification code.</p>
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
