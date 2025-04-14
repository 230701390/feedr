import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { validatePassword, validateEmail, getCityFromPincode, commonCities } from "@/utils/validation";
import { UserRole } from "@/context/AuthContext";

// Form schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .refine(
      (val) => validatePassword(val),
      "Password must contain at least 1 uppercase letter and 1 special character"
    ),
  role: z.enum(["donor", "receiver"] as const, {
    required_error: "Please select a role",
  }),
  street1: z.string().min(3, "Address must be at least 3 characters"),
  street2: z.string().optional(),
  street3: z.string().optional(),
  landmark: z.string().optional(),
  pincode: z.string().min(6, "Please enter a valid pincode"),
  city: z.string().min(1, "City is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: any) => void;
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cityFromPincode, setCityFromPincode] = useState<string | null>(null);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "donor", // Explicitly set to "donor" or "receiver"
      street1: "",
      street2: "",
      street3: "",
      landmark: "",
      pincode: "",
      city: "",
    },
  });

  // Handle pincode change to get city
  const pincode = registerForm.watch("pincode");
  
  useEffect(() => {
    if (pincode && pincode.length === 6) {
      const fetchCity = async () => {
        try {
          const city = await getCityFromPincode(pincode);
          setCityFromPincode(city);
          if (city) {
            registerForm.setValue("city", city);
          }
        } catch (error) {
          console.error("Error fetching city:", error);
        }
      };
      
      fetchCity();
    }
  }, [pincode, registerForm]);

  const handleSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    setLoading(true);
    try {
      if (type === "register") {
        const registerData = data as RegisterFormValues;
        const formattedData = {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          role: registerData.role,
          address: {
            street1: registerData.street1,
            street2: registerData.street2 || undefined,
            street3: registerData.street3 || undefined,
            landmark: registerData.landmark || undefined,
            city: registerData.city,
            pincode: registerData.pincode,
          },
        };
        await onSubmit(formattedData);
      } else {
        await onSubmit(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (type === "login") {
    return (
      <div className="w-full max-w-md space-y-6 p-6 bg-card rounded-lg shadow-md animate-fade-in">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold">Login to Feedr</h2>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      {...field} 
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      {...field} 
                      type="password"
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-6 p-6 bg-card rounded-lg shadow-md animate-fade-in">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Register with Feedr</h2>
        <p className="text-muted-foreground">Create your account to start sharing or receiving food</p>
      </div>
      
      <Form {...registerForm}>
        <form onSubmit={registerForm.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      {...field} 
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      {...field} 
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters with 1 uppercase and 1 special character
                  </p>
                </FormItem>
              )}
            />
            
            <FormField
              control={registerForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I want to</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="donor">Donate Food</SelectItem>
                      <SelectItem value="receiver">Receive Food</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Address</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={registerForm.control}
                name="street1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={registerForm.control}
                  name="street2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartment 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="street3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 3 (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Suite 100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={registerForm.control}
                  name="landmark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Landmark (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Near Post Office" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={registerForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={cityFromPincode || "Select your city"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commonCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
