
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2, Upload } from "lucide-react";
import { getCurrentLocation } from "@/utils/geoLocation";

const foodFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  expiryHours: z.number().min(1).max(5, "Expiry time must be between 1 and 5 hours"),
});

type FoodFormValues = z.infer<typeof foodFormSchema>;

interface FoodFormProps {
  onSubmit: (data: any) => Promise<void>;
  userAddress?: {
    street1: string;
    city: string;
    pincode: string;
  };
}

export function FoodForm({ onSubmit, userAddress }: FoodFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const form = useForm<FoodFormValues>({
    resolver: zodResolver(foodFormSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: 1,
      expiryHours: 3,
    },
  });
  
  // Function to handle camera capture
  const handleCameraCapture = () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment"; // Use the environment-facing camera (if available)
    
    // Handle file selection
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setImageFile(file);
        
        // Create a preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    // Trigger the file input
    input.click();
  };
  
  // Function to handle file upload
  const handleFileUpload = () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    
    // Handle file selection
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setImageFile(file);
        
        // Create a preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    // Trigger the file input
    input.click();
  };
  
  const handleSubmit = async (formData: FoodFormValues) => {
    setLoading(true);
    
    try {
      if (!imagePreview) {
        throw new Error("Please upload an image of the food");
      }
      
      // Get current location
      let location;
      try {
        location = await getCurrentLocation();
      } catch (error) {
        toast({
          title: "Location access denied",
          description: "We couldn't access your location. Default location will be used.",
          variant: "destructive",
        });
      }
      
      // Calculate expiry time
      const now = new Date();
      const expiresAt = new Date(now.getTime() + formData.expiryHours * 60 * 60 * 1000);
      
      const foodData = {
        ...formData,
        imageUrl: imagePreview,
        expiresAt,
        location,
        address: userAddress,
      };
      
      await onSubmit(foodData);
      
      form.reset();
      setImagePreview(null);
      setImageFile(null);
      
      toast({
        title: "Food listed successfully",
        description: "Your food listing has been published",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list food",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Donate Food</h3>
        <p className="text-muted-foreground">Share your excess food with those who need it</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Image upload section */}
          <div className="space-y-3">
            <Label>Food Image</Label>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Food preview"
                    className="w-full max-h-60 object-contain rounded-md"
                  />
                  
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-muted rounded-full mb-2">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Upload a photo of the food</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF, up to 10MB</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCameraCapture}
                      className="flex items-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      Take Photo
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFileUpload}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Food details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Food Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Fresh Vegetables" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quantity (Servings): {field.value}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the food items, freshness, special instructions, etc." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expiryHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Available for: {field.value} hours
                </FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormMessage />
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>1 hour</span>
                  <span>5 hours</span>
                </div>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Listing Food...
              </>
            ) : (
              "List Food"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </div>
  );
}
