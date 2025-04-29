
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormProps = {
  onSuccess: (email: string) => void;
};

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setLoading(true);
    try {
      // In a real implementation, this would call an API endpoint to send OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll generate a "predictable" OTP based on the email
      // In a real implementation, this would be random and stored securely
      const emailHash = data.email.slice(-6).padStart(6, '0');
      console.log("Generated OTP for testing:", emailHash);
      
      // Validate email exists in the system (simulated)
      const emailExists = Math.random() > 0.1; // 90% chance of success for demo
      
      if (!emailExists) {
        throw new Error("Email not found in our records");
      }
      
      onSuccess(data.email);
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${data.email}`,
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: error instanceof Error ? error.message : "Please try again later",
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@example.com" 
                  type="email"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send Verification Code
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
