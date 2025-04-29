
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, User, Settings, Menu } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { MenuButtons } from "./MenuButtons";

export function NavBar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scroll position for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`w-full py-4 px-6 fixed top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-card/40 backdrop-blur-md shadow-sm" : "bg-transparent"
    }`}>
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Feedr</span>
        </Link>

        {/* Show menu buttons on larger screens */}
        <div className="hidden md:flex">
          <MenuButtons />
        </div>

        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop menu */}
          <div className={`hidden md:flex items-center space-x-4`}>
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20">Dashboard</Button>
                </Link>
                
                {user.role === 'donor' && (
                  <div className="text-sm font-medium mr-2">
                    <span className="text-muted-foreground">Points: </span>
                    <span className="text-primary">{user.points}</span>
                  </div>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass dark:glass-dark">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20">Login</Button>
                </Link>
                
                <Link to="/register">
                  <Button className="bg-primary/80 hover:bg-primary/90">Register</Button>
                </Link>
              </>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-primary bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown with glass effect */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"} mt-4 glass dark:glass-dark rounded-lg shadow-lg p-4 transition-all`}>
        {user ? (
          <div className="flex flex-col space-y-3">
            <Link to="/dashboard" className="px-4 py-2 hover:bg-white/10 dark:hover:bg-black/20 rounded-md">
              Dashboard
            </Link>
            <Link to="/profile" className="px-4 py-2 hover:bg-white/10 dark:hover:bg-black/20 rounded-md">
              Profile
            </Link>
            <button 
              onClick={logout}
              className="flex items-center px-4 py-2 hover:bg-white/10 dark:hover:bg-black/20 rounded-md text-left"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <Link to="/login" className="px-4 py-2 hover:bg-white/10 dark:hover:bg-black/20 rounded-md">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 hover:bg-white/10 dark:hover:bg-black/20 rounded-md">
              Register
            </Link>
          </div>
        )}
        
        {/* Include menu buttons in mobile menu */}
        <div className="mt-4 pt-4 border-t border-white/20 dark:border-white/10">
          <MenuButtons />
        </div>
      </div>
    </nav>
  );
}
