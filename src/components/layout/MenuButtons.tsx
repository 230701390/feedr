
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";

export function MenuButtons() {
  return (
    <NavigationMenu className="max-w-full w-full justify-center">
      <NavigationMenuList className="flex-wrap gap-2 p-2">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-accent/50 hover:bg-accent/80">About Us</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 w-[400px] md:grid-cols-2">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-indigo-100 to-indigo-50 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 no-underline outline-none focus:shadow-md"
                    href="/about"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Our Mission
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      We aim to reduce food waste and feed those in need through our platform.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/team" title="Our Team">
                Meet the passionate individuals behind Feedr
              </ListItem>
              <ListItem href="/impact" title="Our Impact">
                See how we're making a difference in communities
              </ListItem>
              <ListItem href="/partners" title="Our Partners">
                Organizations we collaborate with to expand our reach
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-accent/50 hover:bg-accent/80">Get Involved</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 w-[400px] md:grid-cols-1">
              <ListItem href="/donate" title="Donate Food">
                Learn how to contribute excess food to those in need
              </ListItem>
              <ListItem href="/receive" title="Receive Food">
                Find out how to receive food donations in your area
              </ListItem>
              <ListItem href="/volunteer" title="Volunteer">
                Help us distribute food and manage collections
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Button variant="outline" asChild>
            <Link to="/faq">FAQs</Link>
          </Button>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
