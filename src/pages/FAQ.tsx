
import { NavBar } from "@/components/layout/NavBar";

const FAQ = () => {
  return (
    <div className="min-h-screen relative">
      <NavBar />
      
      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-primary">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">How does Feedr work?</h2>
            <p className="text-muted-foreground">
              Feedr connects food donors with organizations and individuals who need food. 
              Donors can list their excess food, and receivers can request it. We handle the 
              logistics and ensure the food reaches those who need it most.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Who can donate food?</h2>
            <p className="text-muted-foreground">
              Anyone can donate food! Restaurants, grocery stores, event venues, offices, 
              and even individuals with excess food can all use our platform to reduce waste 
              and help those in need.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Is the food safe to eat?</h2>
            <p className="text-muted-foreground">
              Yes, all food must meet safety standards. We provide guidelines for donors 
              on proper food handling and storage. Food is inspected before distribution 
              to ensure quality and safety.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">How do I earn points as a donor?</h2>
            <p className="text-muted-foreground">
              Donors earn points for each successful donation. These points can be redeemed 
              for rewards, tax deduction certificates, or promotional opportunities. The more 
              you donate, the more points you earn!
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">How can I volunteer with Feedr?</h2>
            <p className="text-muted-foreground">
              We're always looking for volunteers to help with food collection, sorting, 
              and distribution. Sign up on our volunteer page to get started. You can 
              choose how much time you want to commit.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
