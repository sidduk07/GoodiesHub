import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, ShoppingBag, Star, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface SwagItem {
  id: string;
  title: string;
  company: string;
  summary: string;
  category: string;
  heroImage?: string;
  tags: string;
  status: string;
  isFeatured?: boolean;
}

interface SwagCardProps {
  item: SwagItem;
}

export function SwagCard({ item }: SwagCardProps) {
  // Parse tags from JSON string
  const parseTags = (): string[] => {
    try {
      return item.tags ? JSON.parse(item.tags) : [];
    } catch {
      return [];
    }
  };

  const tags = parseTags();
  const isUpcoming = item.status === 'upcoming';

  return (
    <Link href={`/swag/${item.id}`}>
      <a className="group block h-full w-full max-w-sm">
        <Card className="h-full flex flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/20">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {item.heroImage ? (
              <img
                src={item.heroImage}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center">
                <div className="text-4xl">🎁</div>
              </div>
            )}

            {/* Status badges */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
              {isUpcoming && (
                <Badge variant="outline" className="bg-black/70 text-white border-none font-medium backdrop-blur-sm">
                  <Clock className="h-3 w-3 mr-1" /> Upcoming
                </Badge>
              )}
              {item.isFeatured && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none font-medium">
                  <Star className="h-3 w-3 mr-1 fill-current" /> Featured
                </Badge>
              )}
            </div>

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
              {item.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-auto">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center text-[10px] font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border/50">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex items-center text-[10px] font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border/50">
                  +{tags.length - 3}
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
