
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const newPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[!@#$%^&*]/, "Password must contain at least 1 special character"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type NewPasswordFormProps = {
  resetToken: string;
  onSuccess: () => void;
};

export function NewPasswordForm({ resetToken, onSuccess }: NewPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof newPasswordSchema>) => {
    setLoading(true);
    try {
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate token and update password (simulated)
      const isTokenValid = resetToken.startsWith("reset-token-");
      
      if (!isTokenValid) {
        throw new Error("Reset session expired. Please try again");
      }
      
      onSuccess();
      toast({
        title: "Password Updated",
        description: "Your password has been successfully reset. You can now log in with your new password.",
      });
    } catch (error) {
      toast({
        title: "Password Reset Failed",
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="••••••••" 
                  type="password"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with 1 uppercase letter and 1 special character
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="••••••••" 
                  type="password"
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
              Updating Password...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </Form>
  );
}
