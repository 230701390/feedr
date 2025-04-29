
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
      scrolled ? "bg-card/80 shadow-sm backdrop-blur-md" : "bg-transparent"
    }`}>
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-indigo-500">Feedr</span>
        </Link>

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
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                
                {user.role === 'donor' && (
                  <div className="text-sm font-medium mr-2">
                    <span className="text-muted-foreground">Points: </span>
                    <span className="text-indigo-500">{user.points}</span>
                  </div>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
                  <Button variant="outline">Login</Button>
                </Link>
                
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-indigo-500"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"} mt-4 bg-card rounded-lg shadow-lg p-4 transition-all`}>
        {user ? (
          <div className="flex flex-col space-y-3">
            <Link to="/dashboard" className="px-4 py-2 hover:bg-accent rounded-md">
              Dashboard
            </Link>
            <Link to="/profile" className="px-4 py-2 hover:bg-accent rounded-md">
              Profile
            </Link>
            <button 
              onClick={logout}
              className="flex items-center px-4 py-2 hover:bg-accent rounded-md text-left"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <Link to="/login" className="px-4 py-2 hover:bg-accent rounded-md">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 hover:bg-accent rounded-md">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
