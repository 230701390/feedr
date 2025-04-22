
import React from 'react';
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, MapPin, Award } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // Or redirect to login
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">User Profile</h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span><strong>Name:</strong> {user.name}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span><strong>Email:</strong> {user.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span><strong>Role:</strong> {user.role}</span>
                </div>
                
                {user.points !== undefined && (
                  <div className="flex items-center">
                    <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span><strong>Points:</strong> {user.points}</span>
                  </div>
                )}
                
                {user.address && (
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Address:</strong>{" "}
                      {`${user.address.street1}, ${user.address.city}, ${user.address.pincode}`}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
