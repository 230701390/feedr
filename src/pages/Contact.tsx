
import { NavBar } from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We've received your message and will respond shortly.",
    });
    setFormData({ name: "", email: "", message: "" });
  };
  
  return (
    <div className="min-h-screen relative">
      <NavBar />
      
      <main className="container mx-auto px-4 py-20 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-primary">Contact Us</h1>
        
        <div className="bg-card p-8 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Your Name</label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Your Message</label>
              <Textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="How can we help you?"
                rows={5}
              />
            </div>
            
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
          
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> support@feedr.org</p>
              <p><strong>Phone:</strong> (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Food Street, Caring City, FC 12345</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
