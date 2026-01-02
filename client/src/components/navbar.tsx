import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/">
            <a className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-primary transition-colors hover:text-primary/80">
              <span className="text-2xl">⚡</span>
              SwagList
            </a>
          </Link>
          
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link href="/">
              <a className={`text-sm font-medium transition-colors hover:text-foreground ${location === '/' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Browse
              </a>
            </Link>
            <Link href="/about">
              <a className={`text-sm font-medium transition-colors hover:text-foreground ${location === '/about' ? 'text-foreground' : 'text-muted-foreground'}`}>
                About
              </a>
            </Link>
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
          <Link href="/submit">
            <Button size="sm" className="gap-2 rounded-full font-medium">
              <PlusCircle className="h-4 w-4" />
              Submit Swag
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">
              Log in
            </Button>
          </Link>
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
            <Link href="/about">
              <a className="block py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>About</a>
            </Link>
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
            <Link href="/login">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                Log in
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
