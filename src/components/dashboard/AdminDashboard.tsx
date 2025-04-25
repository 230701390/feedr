import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, ShoppingBag, Clock, AlertTriangle, Check, X, Mail, Shield } from "lucide-react";
import { FoodItem } from "@/utils/mockData";
import { UserRole, User } from "@/context/AuthContext";
import { DataTable } from "@/components/ui/table";

export function AdminDashboard() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Fetch data
  useEffect(() => {
    const fetchData = () => {
      try {
        // Fetch foods
        const storedFoods = localStorage.getItem("feedr-food-items");
        if (storedFoods) {
          const parsedFoods = JSON.parse(storedFoods).map((food: any) => ({
            ...food,
            expiresAt: new Date(food.expiresAt),
            createdAt: new Date(food.createdAt),
            unit: food.unit || "items" // Add default value for unit
          }));
          setFoods(parsedFoods);
        }
        
        // Fetch users
        const storedUsers = localStorage.getItem("feedr-users");
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          setUsers(parsedUsers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter users by search query
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.mobile && user.mobile.includes(searchQuery)) ||
          (user.address?.city && user.address.city.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : users;
  
  // Get donors for more detailed view
  const donors = users.filter(user => user.role === "donor");
  
  // Get counts for dashboard
  const donorCount = users.filter((user) => user.role === "donor").length;
  const receiverCount = users.filter((user) => user.role === "receiver").length;
  
  // Helper function to check if a food item is expired
  const isExpired = (food: FoodItem) => new Date() > new Date(food.expiresAt);

  // Update activeFoodCount calculation
  const activeFoodCount = foods.filter(
    (food) => !food.isClaimed && !isExpired(food)
  ).length;

  const claimedFoodCount = foods.filter((food) => food.isClaimed).length;
  const expiredFoodCount = foods.filter(
    (food) => !food.isClaimed && isExpired(food)
  ).length;
  
  // Filter foods by search query and remove expired ones
  const filteredFoods = searchQuery
    ? foods.filter(
        (food) =>
          !isExpired(food) &&
          (food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.address.city.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : foods.filter(food => !isExpired(food));
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage users, monitor food listings, and oversee platform activity
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{users.length}</div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <div>
                <span className="text-muted-foreground">Donors:</span> {donorCount}
              </div>
              <div>
                <span className="text-muted-foreground">Receivers:</span> {receiverCount}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Food Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{foods.length}</div>
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <div>
                <span className="text-muted-foreground">Active:</span> {activeFoodCount}
              </div>
              <div>
                <span className="text-muted-foreground">Claimed:</span> {claimedFoodCount}
              </div>
              <div>
                <span className="text-muted-foreground">Expired:</span> {expiredFoodCount}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Platform Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                {Math.floor(claimedFoodCount / Math.max(1, foods.length) * 100)}%
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Success Rate (Claimed / Total)
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content */}
      <Tabs defaultValue="users">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="donors">Donors</TabsTrigger>
          <TabsTrigger value="foods">Food Listings</TabsTrigger>
        </TabsList>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <TabsContent value="users" className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-muted rounded mb-2"></div>
                <div className="h-3 w-36 bg-muted rounded"></div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.mobile || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.address?.city || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.points || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="donors" className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-muted rounded mb-2"></div>
                <div className="h-3 w-36 bg-muted rounded"></div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Donor Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Points Earned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Donations
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {donors.map((donor) => {
                    // Count donations from this donor
                    const donorFoods = foods.filter(food => food.donorId === donor.id);
                    
                    return (
                      <tr key={donor.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {donor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            {donor.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {donor.mobile || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {donor.address?.street1 || "—"}
                          {donor.address?.street2 && <span>, {donor.address.street2}</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {donor.address?.city || "—"} 
                          {donor.address?.pincode && <span>, {donor.address.pincode}</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="font-bold text-feedr">{donor.points || 0}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="font-medium">{donorFoods.length}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="foods" className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-muted rounded mb-2"></div>
                <div className="h-3 w-36 bg-muted rounded"></div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Food Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Listed On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Expiry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredFoods.map((food) => {
                    const now = new Date();
                    const isExpired = now > new Date(food.expiresAt);
                    
                    return (
                      <tr key={food.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {food.name}
                        </td>
                        <td className="px-6 py-4 text-sm max-w-xs">
                          <div className="truncate">
                            {food.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {food.donorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {food.quantity} {food.unit || "items"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-col">
                            <span>{food.address.street1}</span>
                            <span className="text-muted-foreground">{food.address.city}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(food.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(food.expiresAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <StatusBadge status={food.isClaimed ? "claimed" : isExpired ? "expired" : "active"} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const badge = {
    donor: { bg: "bg-feedr/10 text-feedr", label: "Donor" },
    receiver: { bg: "bg-blue-500/10 text-blue-500", label: "Receiver" },
    admin: { bg: "bg-purple-500/10 text-purple-500", label: "Admin" },
  };
  
  const { bg, label } = badge[role];
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: "active" | "claimed" | "expired" }) {
  const badge = {
    active: { bg: "bg-green-500/10 text-green-500", label: "Active", icon: Check },
    claimed: { bg: "bg-blue-500/10 text-blue-500", label: "Claimed", icon: Check },
    expired: { bg: "bg-red-500/10 text-red-500", label: "Expired", icon: X },
  };
  
  const { bg, label, icon: Icon } = badge[status];
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg}`}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </span>
  );
}
