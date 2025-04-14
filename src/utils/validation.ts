
// Password validation: at least 6 characters with 1 uppercase and 1 special character
export const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
  return regex.test(password);
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Pincode validation (assuming Indian 6-digit pincode)
export const validatePincode = (pincode: string): boolean => {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pincode);
};

// Get city from pincode (mock function)
export const getCityFromPincode = async (pincode: string): Promise<string | null> => {
  // In a real app, this would be an API call
  // For now, we'll mock with some example pincodes
  const pincodeMap: Record<string, string> = {
    "110001": "New Delhi",
    "400001": "Mumbai",
    "700001": "Kolkata",
    "600001": "Chennai",
    "500001": "Hyderabad",
    "560001": "Bangalore",
  };
  
  return pincodeMap[pincode] || null;
};

// Common Indian cities for dropdown
export const commonCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
];
