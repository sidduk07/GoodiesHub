import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlusCircle, Search, Menu, X, User, Settings, Shield, LogOut, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout, isLoading } = useAuth();
  const { toast } = useToast();

  // Dark mode state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Apply dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "See you next time! 👋",
      });
      setLocation("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not log out. Please try again.",
      });
    }
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/">
            <a className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-primary transition-colors hover:text-primary/80">
              <span className="text-2xl">⚡</span>
              GoodiesHub
            </a>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            <Link href="/">
              <a className={`text-sm font-medium transition-colors hover:text-foreground ${location === '/' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Browse
              </a>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <a className={`text-sm font-medium transition-colors hover:text-foreground flex items-center gap-1.5 ${location === '/admin' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </a>
              </Link>
            )}
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search goodies..."
              className="h-9 w-full rounded-full bg-secondary pl-9 text-sm focus-visible:ring-1"
            />
          </div>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleDarkMode}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {isAuthenticated ? (
            <>
              <Link href="/submit">
                <Button size="sm" className="gap-2 rounded-full font-medium">
                  <PlusCircle className="h-4 w-4" />
                  Submit Swag
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user ? getInitials(user.username) : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <a className="flex items-center w-full cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <a className="flex items-center w-full cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/submit">
                <Button size="sm" variant="outline" className="gap-2 rounded-full font-medium">
                  <PlusCircle className="h-4 w-4" />
                  Submit Swag
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="rounded-full font-medium">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t md:hidden p-4 space-y-4 bg-background">
          <div className="space-y-2">
            <Link href="/">
              <a className="block py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Browse</a>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <a className="block py-2 text-sm font-medium flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <Shield className="h-4 w-4" /> Admin Dashboard
                </a>
              </Link>
            )}
            {/* Mobile Dark Mode Toggle */}
            <button
              className="flex items-center gap-2 py-2 text-sm font-medium w-full"
              onClick={toggleDarkMode}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-full bg-secondary pl-9"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/submit">
              <Button className="w-full justify-start gap-2" onClick={() => setIsMenuOpen(false)}>
                <PlusCircle className="h-4 w-4" />
                Submit Swag
              </Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setIsMenuOpen(false)}>
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
