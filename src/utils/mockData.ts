import { User, UserRole } from "../context/AuthContext";

export type FoodItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit?: string;
  expiresAt: Date;
  imageUrl: string;
  donorId: string;
  donorName: string;
  createdAt: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
  address: {
    street1: string;
    city: string;
    pincode: string;
  };
  isClaimed: boolean;
  claimedBy?: string;
};

// Generate mock food items
export const generateMockFoodItems = (): FoodItem[] => {
  const now = new Date();
  
  return [
    {
      id: "food-1",
      name: "Fresh Vegetables",
      description: "Assorted fresh vegetables including carrots, tomatoes, and cucumbers.",
      quantity: 5,
      expiresAt: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 hours from now
      imageUrl: "https://images.unsplash.com/photo-1466551773139-90bc9f084676",
      donorId: "user-1",
      donorName: "Green Grocers",
      createdAt: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
      },
      address: {
        street1: "123 Vegetable Market",
        city: "New Delhi",
        pincode: "110001",
      },
      isClaimed: false,
    },
    {
      id: "food-2",
      name: "Rice and Curry",
      description: "Leftover rice and curry from our restaurant. Still fresh and delicious.",
      quantity: 10,
      expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7",
      donorId: "user-2",
      donorName: "Spice Kitchen",
      createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      location: {
        latitude: 28.6129,
        longitude: 77.2295,
      },
      address: {
        street1: "45 Food Street",
        city: "New Delhi",
        pincode: "110001",
      },
      isClaimed: false,
    },
    {
      id: "food-3",
      name: "Bread and Pastries",
      description: "Assorted bread and pastries from our bakery. End of day items.",
      quantity: 15,
      expiresAt: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      donorId: "user-3",
      donorName: "Fresh Bakery",
      createdAt: new Date(now.getTime() - 120 * 60 * 1000), // 2 hours ago
      location: {
        latitude: 12.9716,
        longitude: 77.5946,
      },
      address: {
        street1: "78 Baker Street",
        city: "Bangalore",
        pincode: "560001",
      },
      isClaimed: false,
    },
  ];
};

// Initialize the mock food items in localStorage if not already there
export const initializeMockData = (): void => {
  if (!localStorage.getItem("feedr-food-items")) {
    localStorage.setItem(
      "feedr-food-items",
      JSON.stringify(generateMockFoodItems())
    );
  }

  if (!localStorage.getItem("feedr-users")) {
    const mockUsers = [
      {
        id: "user-5",
        name: "Admin User",
        email: "admin@feedr.com",
        password: "Admin@123",
        role: "admin" as UserRole,
      },
    ];

    localStorage.setItem("feedr-users", JSON.stringify(mockUsers));
  }
};
