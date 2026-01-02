import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SwagCard } from "@/components/swag-card";
import { Button } from "@/components/ui/button";
import { MOCK_SWAG_ITEMS, HERO_IMAGE, CATEGORIES } from "@/lib/data";
import { useState } from "react";
import { ArrowRight, Filter, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = selectedCategory
    ? MOCK_SWAG_ITEMS.filter(item => item.category === selectedCategory)
    : MOCK_SWAG_ITEMS;

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
                  <Button size="lg" className="rounded-full px-8 h-12 font-medium text-base">
                    Explore Swag
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-12 font-medium text-base bg-background/50 backdrop-blur-sm">
                    Submit Opportunity
                  </Button>
                </div>
              </div>
              <div className="relative hidden md:block">
                 <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 rotate-3 transition-transform hover:rotate-0 duration-500">
                    <img src={HERO_IMAGE} alt="Swag Preview" className="w-full h-auto object-cover aspect-[4/3]" />
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container max-w-screen-xl px-4 py-16">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <SwagCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
