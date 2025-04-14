
import { useState, useEffect } from "react";
import { FoodCard } from "@/components/food/FoodCard";
import { FoodForm } from "@/components/food/FoodForm";
import { useAuth } from "@/context/AuthContext";
import { FoodItem } from "@/utils/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Award, ChefHat } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export function DonorDashboard() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Fetch food items
  useEffect(() => {
    const fetchFoods = () => {
      try {
        const storedFoods = localStorage.getItem("feedr-food-items");
        if (storedFoods) {
          const parsedFoods = JSON.parse(storedFoods);
          // Convert string dates to Date objects
          const foodsWithDates = parsedFoods.map((food: any) => ({
            ...food,
            expiresAt: new Date(food.expiresAt),
            createdAt: new Date(food.createdAt),
          }));
          setFoods(foodsWithDates);
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoods();
    
    // Poll for updates every minute
    const interval = setInterval(fetchFoods, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Filter for donor's foods
  const myFoods = foods.filter((food) => food.donorId === user?.id);
  
  // Handle adding new food item
  const handleAddFood = async (foodData: any) => {
    if (!user) return;
    
    const now = new Date();
    const newFood: FoodItem = {
      id: `food-${Date.now()}`,
      name: foodData.name,
      description: foodData.description,
      quantity: foodData.quantity,
      expiresAt: foodData.expiresAt,
      imageUrl: foodData.imageUrl,
      donorId: user.id,
      donorName: user.name,
      createdAt: now,
      location: foodData.location,
      address: foodData.address || {
        street1: user.address?.street1 || "",
        city: user.address?.city || "",
        pincode: user.address?.pincode || "",
      },
      isClaimed: false,
    };
    
    // Add to foods list
    const updatedFoods = [newFood, ...foods];
    setFoods(updatedFoods);
    localStorage.setItem("feedr-food-items", JSON.stringify(updatedFoods));
    
    // Add reward points
    if (user) {
      const points = (user.points || 0) + 10;
      updateUser({ points });
    }
    
    setIsFormOpen(false);
  };
  
  // Handle deleting food item
  const handleDeleteFood = async (foodId: string) => {
    const updatedFoods = foods.filter((food) => food.id !== foodId);
    setFoods(updatedFoods);
    localStorage.setItem("feedr-food-items", JSON.stringify(updatedFoods));
  };
  
  // Calculate user level based on points
  const getUserLevel = (points: number) => {
    if (points >= 100) return "Gold";
    if (points >= 50) return "Silver";
    return "Bronze";
  };
  
  const userLevel = getUserLevel(user?.points || 0);
  
  return (
    <div className="space-y-6">
      {/* Header with profile summary */}
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
            <p className="text-muted-foreground">
              Thank you for helping to reduce food waste and feed those in need
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-secondary p-2 px-4 rounded-full">
            <Award className="h-5 w-5 text-feedr" />
            <div>
              <span className="font-medium">{userLevel} Donor</span>
              <span className="text-sm text-muted-foreground ml-2">
                {user?.points} points
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <Tabs defaultValue="my-donations">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="my-donations">My Donations</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-donations" className="space-y-6">
          {/* Add new food button */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">My Food Donations</h3>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 btn-hover">
                  <PlusCircle className="h-4 w-4" />
                  Donate Food
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <FoodForm
                  onSubmit={handleAddFood}
                  userAddress={user?.address}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Food listings */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-muted rounded mb-2"></div>
                <div className="h-3 w-36 bg-muted rounded"></div>
              </div>
            </div>
          ) : myFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onDelete={handleDeleteFood}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <ChefHat className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Donations Yet</h3>
              <p className="text-muted-foreground">
                Start sharing your excess food with those who need it
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setIsFormOpen(true)}
              >
                Donate Food
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-6">
          <div className="bg-card p-6 rounded-lg">
            <div className="text-center mb-6">
              <Award className="h-12 w-12 mx-auto mb-2 text-feedr" />
              <h3 className="text-2xl font-bold">
                {user?.points} Points
              </h3>
              <p className="text-muted-foreground">
                {userLevel} Donor Level
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">How to Earn Points</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Donate Food: +10 points per donation</li>
                  <li>Food claimed: +5 additional points</li>
                  <li>Complete your profile: +20 points</li>
                  <li>Share on social media: +5 points</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Rewards</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Bronze Badge</p>
                      <p className="text-xs text-muted-foreground">0 points</p>
                    </div>
                    <Badge userLevel={userLevel} level="Bronze" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Silver Badge</p>
                      <p className="text-xs text-muted-foreground">50 points</p>
                    </div>
                    <Badge userLevel={userLevel} level="Silver" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Gold Badge</p>
                      <p className="text-xs text-muted-foreground">100 points</p>
                    </div>
                    <Badge userLevel={userLevel} level="Gold" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Badge({ userLevel, level }: { userLevel: string; level: string }) {
  const isEarned = userLevel === level || 
    (userLevel === "Gold" && level === "Silver") || 
    (userLevel === "Gold" && level === "Bronze") ||
    (userLevel === "Silver" && level === "Bronze");
  
  const bgColor = isEarned 
    ? level === "Gold" 
      ? "bg-yellow-400" 
      : level === "Silver" 
        ? "bg-gray-300" 
        : "bg-amber-700"
    : "bg-muted";
  
  return (
    <div 
      className={`${bgColor} w-10 h-10 rounded-full flex items-center justify-center text-white`}
    >
      <Award className="h-5 w-5" />
    </div>
  );
}
