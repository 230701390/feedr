
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_placeHolderKey_forDemo",
  authDomain: "feedr-app-demo.firebaseapp.com",
  projectId: "feedr-app-demo",
  storageBucket: "feedr-app-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// For OTP verification
export const generateOTP = () => {
  // In a real app, this would send an OTP via SMS/email
  // For demo purposes, let's generate a 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default app;
