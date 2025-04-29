
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmapIMcnRUXC-Z5z-IfL-W8B9T2hP7NcA",
  authDomain: "feedr-demo-app.firebaseapp.com",
  projectId: "feedr-demo-app",
  storageBucket: "feedr-demo-app.appspot.com",
  messagingSenderId: "397012985142",
  appId: "1:397012985142:web:e76a871686c2c8e869a608"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// For OTP verification
export const generateOTP = () => {
  // In a real app, this would send an OTP via SMS/email
  // For demo purposes, generate a 6-digit code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // In a production app, you would call a server function here 
  // to send the OTP via SMS or email
  console.log("Generated OTP:", otp);
  
  return otp;
};

// Send OTP to email
export const sendOTPToEmail = (email: string, otp: string) => {
  // In a real app, this would call a backend API to send an email
  console.log(`OTP ${otp} would be sent to ${email} in a production environment`);
  
  // Return a promise to simulate async operation
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log("Email sent successfully (simulation)");
      resolve();
    }, 1000);
  });
};

export default app;
