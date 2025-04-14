
import { useState, useEffect } from "react";
import { FoodCard } from "@/components/food/FoodCard";
import { useAuth } from "@/context/AuthContext";
import { FoodItem } from "@/utils/mockData";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Filter, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentLocation, calculateDistance } from "@/utils/geoLocation";

export function ReceiverDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [foodsWithDistance, setFoodsWithDistance] = useState<(FoodItem & { distance?: number })[]>([]);
  
  // Fetch food items and user location
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch foods
        const storedFoods = localStorage.getItem("feedr-food-items");
        let parsedFoods: FoodItem[] = [];
        
        if (storedFoods) {
          parsedFoods = JSON.parse(storedFoods).map((food: any) => ({
            ...food,
            expiresAt: new Date(food.expiresAt),
            createdAt: new Date(food.createdAt),
          }));
          setFoods(parsedFoods);
        }
        
        // Get user location
        try {
          const location = await getCurrentLocation();
          setUserLocation(location);
        } catch (error) {
          console.error("Error getting user location:", error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Poll for updates every minute
    const interval = setInterval(() => fetchData(), 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate distances when foods or user location changes
  useEffect(() => {
    if (userLocation) {
      const foodsWithDistances = foods.map((food) => {
        let distance = undefined;
        
        if (food.location) {
          distance = calculateDistance(userLocation, food.location);
        }
        
        return { ...food, distance };
      });
      
      setFoodsWithDistance(foodsWithDistances);
    } else {
      setFoodsWithDistance(foods);
    }
  }, [foods, userLocation]);
  
  // Filter expired and claimed foods
  const availableFoods = foodsWithDistance.filter(
    (food) => !food.isClaimed && new Date() < new Date(food.expiresAt)
  );
  
  // Filter foods by search query
  const filteredFoods = searchQuery
    ? availableFoods.filter(
        (food) =>
          food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.address.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableFoods;
  
  // Sort by distance if user location is available
  const sortedFoods = userLocation
    ? filteredFoods.sort((a, b) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      })
    : filteredFoods;
  
  // Get claimed foods
  const claimedFoods = foodsWithDistance.filter(
    (food) => food.isClaimed && food.claimedBy === user?.id
  );
  
  // Handle claiming food
  const handleClaimFood = async (foodId: string) => {
    const updatedFoods = foods.map((food) => {
      if (food.id === foodId) {
        return {
          ...food,
          isClaimed: true,
          claimedBy: user?.id,
        };
      }
      return food;
    });
    
    setFoods(updatedFoods);
    localStorage.setItem("feedr-food-items", JSON.stringify(updatedFoods));
    
    // Update donor points
    const claimedFood = foods.find((food) => food.id === foodId);
    if (claimedFood) {
      const storedUsers = localStorage.getItem("feedr-users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: any) => {
          if (u.id === claimedFood.donorId) {
            return {
              ...u,
              points: (u.points || 0) + 5, // Bonus points when food is claimed
            };
          }
          return u;
        });
        localStorage.setItem("feedr-users", JSON.stringify(updatedUsers));
      }
    }
  };
  
  // Request location
  const requestLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      toast({
        title: "Location updated",
        description: "We've updated your location to show nearby food donations",
      });
    } catch (error) {
      toast({
        title: "Location access denied",
        description: "Please enable location access in your browser settings",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
            <p className="text-muted-foreground">
              Find available food donations near you
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={requestLocation}
            >
              <MapPin className="h-4 w-4" />
              {userLocation ? "Update Location" : "Enable Location"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <Tabs defaultValue="available">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="available">Available Food</TabsTrigger>
          <TabsTrigger value="claimed">My Claims</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for food, location, or donor..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {!userLocation && !loading && (
            <div className="flex items-center gap-2 p-3 border border-yellow-400 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                Enable location services to see food donations near you
              </p>
            </div>
          )}
          
          {/* Food listings */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-muted rounded mb-2"></div>
                <div className="h-3 w-36 bg-muted rounded"></div>
              </div>
            </div>
          ) : sortedFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onClaim={handleClaimFood}
                  distance={food.distance}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Food Available</h3>
              <p className="text-muted-foreground">
                There are no food donations available right now. Please check back later.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="claimed" className="space-y-6">
          {claimedFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {claimedFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  distance={food.distance}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Claimed Food</h3>
              <p className="text-muted-foreground">
                You haven't claimed any food donations yet. Browse available 
                donations and claim what you need.
              </p>
              <Button 
                className="mt-4" 
                variant="secondary"
                onClick={() => document.querySelector('[value="available"]')?.click()}
              >
                Find Available Food
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
