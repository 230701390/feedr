
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { NavBar } from "@/components/layout/NavBar";
import { Heart, Apple, Utensils, MapPin, Clock, Award } from "lucide-react";

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1601758124510-52d32b081d05"
              alt="Food donation"
              className="w-full h-full object-cover opacity-10"
            />
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-background via-background/95 to-background' : 'bg-gradient-to-b from-background/50 to-background'}`}></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <div className="inline-block p-2 px-3 bg-feedr/10 rounded-full text-feedr mb-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">No food wasted, no one hungry</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Share Food, <span className="text-feedr">Share Love</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Connect excess food to those in need. Reduce waste, help your community, make a difference.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Share Food
                  </Button>
                </Link>
                
                <Link to="/register">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Find Food
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it works */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Feedr Works</h2>
              <p className="text-muted-foreground">
                Our platform connects food donors with people in need, 
                making it easy to share surplus food and reduce waste.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="p-4 bg-feedr-muted rounded-full mb-4">
                  <Utensils className="h-6 w-6 text-feedr" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. List Surplus Food</h3>
                <p className="text-muted-foreground">
                  Restaurants, event halls, and individuals can easily list their 
                  surplus food with details and photos.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="p-4 bg-feedr-muted rounded-full mb-4">
                  <MapPin className="h-6 w-6 text-feedr" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Connect Nearby</h3>
                <p className="text-muted-foreground">
                  Our geolocation features help receivers find available 
                  food donations in their vicinity.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="p-4 bg-feedr-muted rounded-full mb-4">
                  <Heart className="h-6 w-6 text-feedr" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Claim & Collect</h3>
                <p className="text-muted-foreground">
                  Receivers can claim listings and arrange pickup, ensuring 
                  food reaches those who need it most.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-muted-foreground">
                Designed to make food sharing simple, efficient, and rewarding
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="p-2 bg-feedr-muted rounded-full h-fit">
                  <Clock className="h-5 w-5 text-feedr" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Time-Limited Listings</h3>
                  <p className="text-muted-foreground">
                    Food listings are automatically removed after their expiration time 
                    (maximum 5 hours) to ensure freshness and safety.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="p-2 bg-feedr-muted rounded-full h-fit">
                  <MapPin className="h-5 w-5 text-feedr" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Geolocation</h3>
                  <p className="text-muted-foreground">
                    Find nearby food donations with our location-based search, 
                    making it easy to connect locally.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="p-2 bg-feedr-muted rounded-full h-fit">
                  <Apple className="h-5 w-5 text-feedr" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Visual Food Details</h3>
                  <p className="text-muted-foreground">
                    Upload photos of food items directly from your device camera, 
                    helping receivers see exactly what's available.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="p-2 bg-feedr-muted rounded-full h-fit">
                  <Award className="h-5 w-5 text-feedr" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Reward System</h3>
                  <p className="text-muted-foreground">
                    Donors earn points for their contributions, encouraging regular 
                    participation and building community recognition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 bg-feedr text-feedr-foreground">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join the Food Sharing Revolution</h2>
              <p className="text-feedr-foreground/90 mb-8">
                Whether you're a restaurant with surplus food or an organization that helps 
                those in need, Feedr connects you to make a difference.
              </p>
              
              <Link to="/register">
                <Button size="lg" variant="secondary" className="bg-white hover:bg-gray-100 text-feedr">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="flex items-center text-xl font-bold">
                <span className="text-feedr">Feedr</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Connect, share, reduce waste
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Feedr. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
