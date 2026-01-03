import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SwagCard } from "@/components/swag-card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ArrowRight, Filter, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const CATEGORIES = ["Hackathon", "Internship", "Open Source", "Conference", "Program"] as const;

interface SwagItem {
  id: string;
  title: string;
  company: string;
  summary: string;
  category: string;
  heroImage?: string;
  tags: string;
  status: string;
  isFeatured: boolean;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<SwagItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/swag");
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch swag items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/40 bg-slate-50 dark:bg-slate-950/50">
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 blur-3xl transform -translate-y-1/2"></div>
          </div>

          <div className="container relative z-10 max-w-screen-xl px-4 py-20 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 bg-primary/5 text-primary animate-in fade-in slide-in-from-bottom-4">
                  <Sparkles className="w-3 h-3 mr-2 fill-current" />
                  Curated for Students
                </Badge>
                <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                  Discover the best <span className="text-primary">Tech Swag</span> & Opportunities
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                  Your ultimate directory for hackathon goodies, internship perks, and open source rewards.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button size="lg" className="rounded-full px-8 h-12 font-medium text-base" onClick={() => {
                    document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    Explore Swag
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Link href="/submit">
                    <Button size="lg" variant="outline" className="rounded-full px-8 h-12 font-medium text-base bg-background/50 backdrop-blur-sm">
                      Submit Opportunity
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 rotate-3 transition-transform hover:rotate-0 duration-500">
                  <img
                    src="/attached_assets/generated_images/ChatGPT Image Jan 2, 2026 at 02_20_16 PM.png"
                    alt="Free Swag for developers and students"
                    className="w-full h-auto aspect-[4/3] object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section id="browse-section" className="container max-w-screen-xl px-4 py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="font-display text-2xl font-bold">Latest Opportunities</h2>
              <p className="text-muted-foreground mt-1">Freshly added swag drops and programs.</p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                size="sm"
                className="rounded-full whitespace-nowrap"
              >
                All
              </Button>
              {CATEGORIES.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  size="sm"
                  className="rounded-full whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
              <Button variant="ghost" size="icon" className="rounded-full shrink-0 ml-2">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No swag found</h3>
              <p className="text-muted-foreground">
                {selectedCategory
                  ? `No ${selectedCategory} opportunities available yet.`
                  : "Be the first to submit a swag opportunity!"}
              </p>
              <Link href="/submit">
                <Button className="mt-4 rounded-full">Submit Opportunity</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {filteredItems.map(item => (
                <SwagCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
