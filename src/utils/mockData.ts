
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
  return []; // Return an empty array instead of sample data
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
