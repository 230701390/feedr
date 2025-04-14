
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { FoodItem } from "@/utils/mockData";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FoodCardProps {
  food: FoodItem;
  onClaim?: (foodId: string) => void;
  onDelete?: (foodId: string) => void;
  distance?: number;
}

export function FoodCard({ food, onClaim, onDelete, distance }: FoodCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const handleClaim = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to claim food items",
        variant: "destructive",
      });
      return;
    }
    
    if (user.role !== "receiver") {
      toast({
        title: "Not authorized",
        description: "Only receivers can claim food items",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      if (onClaim) {
        await onClaim(food.id);
      }
      toast({
        title: "Food claimed successfully",
        description: "Please contact the donor to arrange pickup",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim food item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setLoading(true);
    try {
      if (onDelete) {
        await onDelete(food.id);
      }
      toast({
        title: "Food listing deleted",
        description: "Your food listing has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete food item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate time remaining
  const now = new Date();
  const expiryTime = new Date(food.expiresAt);
  const timeRemaining = Math.max(0, Math.floor((expiryTime.getTime() - now.getTime()) / (1000 * 60)));
  const hoursRemaining = Math.floor(timeRemaining / 60);
  const minutesRemaining = timeRemaining % 60;
  
  // Format time remaining
  const timeRemainingText = 
    timeRemaining <= 0 
      ? "Expired" 
      : `${hoursRemaining}h ${minutesRemaining}m remaining`;
  
  // Check if expired
  const isExpired = timeRemaining <= 0;
  
  return (
    <Card className="overflow-hidden food-card-hover w-full">
      <div className="aspect-video w-full relative">
        <img
          src={food.imageUrl}
          alt={food.name}
          className="object-cover w-full h-full"
        />
        
        {isExpired ? (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive">Expired</Badge>
          </div>
        ) : food.isClaimed ? (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">Claimed</Badge>
          </div>
        ) : (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-feedr text-feedr-foreground">Available</Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{food.name}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <MapPin className="h-3 w-3" />
          {food.address.street1}, {food.address.city}
          {distance !== undefined && (
            <span className="ml-1">({distance.toFixed(1)} km away)</span>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm mb-3 line-clamp-2">{food.description}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{timeRemainingText}</span>
          </div>
          
          <div>Quantity: {food.quantity}</div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <p className="text-sm">By: {food.donorName}</p>
        
        {user && (
          user.role === "receiver" && !food.isClaimed && !isExpired ? (
            <Button
              size="sm"
              onClick={handleClaim}
              disabled={loading || food.isClaimed || isExpired}
            >
              Claim
            </Button>
          ) : user.id === food.donorId ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          ) : null
        )}
      </CardFooter>
    </Card>
  );
}
