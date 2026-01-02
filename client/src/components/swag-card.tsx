import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SwagItem } from "@/lib/data";
import { ExternalLink, Tag } from "lucide-react";
import { Link } from "wouter";

interface SwagCardProps {
  item: SwagItem;
}

export function SwagCard({ item }: SwagCardProps) {
  return (
    <Link href={`/swag/${item.id}`}>
      <a className="group block h-full">
        <Card className="h-full overflow-hidden border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
          <div className="relative aspect-video overflow-hidden bg-muted">
            <img 
              src={item.image} 
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-black font-semibold shadow-sm">
                {item.company}
              </Badge>
            </div>
            {item.status === 'upcoming' && (
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="bg-black/50 text-white backdrop-blur-sm border-none">
                  Upcoming
                </Badge>
              </div>
            )}
          </div>
          
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {item.category}
              </span>
            </div>
            <h3 className="font-display text-xl font-bold leading-tight group-hover:text-primary transition-colors">
              {item.title}
            </h3>
          </CardHeader>
          
          <CardContent className="p-5 pt-2 pb-4">
            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                  <Tag className="mr-1 h-3 w-3 opacity-50" />
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>

          <CardFooter className="p-5 pt-0 mt-auto">
            <div className="flex w-full items-center text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              View Details <ExternalLink className="ml-1 h-3 w-3" />
            </div>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}
