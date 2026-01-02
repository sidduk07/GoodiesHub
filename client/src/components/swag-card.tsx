import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SwagItem } from "@/lib/data";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface SwagCardProps {
  item: SwagItem;
}

export function SwagCard({ item }: SwagCardProps) {
  return (
    <Link href={`/swag/${item.id}`}>
      <a className="group block h-full">
        <Card className="h-full flex flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/20">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img 
              src={item.image} 
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {item.status === 'upcoming' && (
              <div className="absolute top-3 right-3 z-10">
                <Badge variant="outline" className="bg-black/70 text-white border-none font-medium backdrop-blur-sm">
                  Upcoming
                </Badge>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
               <span className="text-white font-medium text-sm flex items-center">
                  View Opportunity <ExternalLink className="ml-2 h-4 w-4" />
               </span>
            </div>
          </div>
          
          <CardContent className="flex-1 p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                {item.company}
              </span>
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                {item.category}
              </Badge>
            </div>
            
            <h3 className="font-display text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
            
            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed mb-4">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-auto">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center text-[10px] font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border/50">
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                 <span className="inline-flex items-center text-[10px] font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border/50">
                   +{item.tags.length - 3}
                 </span>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-5 pt-0 mt-auto">
             <Button className="w-full gap-2 rounded-lg font-medium group-hover:bg-primary/90" size="sm">
                <ShoppingBag className="h-4 w-4" />
                View Details
             </Button>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}
