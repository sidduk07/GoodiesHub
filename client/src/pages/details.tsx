import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MOCK_SWAG_ITEMS } from "@/lib/data";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, ExternalLink, Share2 } from "lucide-react";
import { Link } from "wouter";
import NotFound from "@/pages/not-found";

export default function Details() {
  const [match, params] = useRoute("/swag/:id");
  const id = params?.id;
  
  const item = MOCK_SWAG_ITEMS.find(i => i.id === id);

  if (!match || !item) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pb-16">
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-border/40 py-8">
            <div className="container max-w-screen-lg px-4">
                <Link href="/">
                    <a className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to browse
                    </a>
                </Link>
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden border border-border bg-white shadow-sm">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="font-medium">
                                    {item.category}
                                </Badge>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm font-medium text-primary">{item.company}</span>
                            </div>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                                {item.title}
                            </h1>
                        </div>
                        
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {item.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                            {item.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-muted-foreground">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button size="lg" className="rounded-full px-8 text-base">
                                Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full px-8">
                                Share <Share2 className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="container max-w-screen-lg px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-10">
                    <section>
                        <h3 className="font-display text-xl font-bold mb-4">How to earn</h3>
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <ul className="space-y-4">
                                {item.requirements.map((req, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-foreground">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section>
                      <h3 className="font-display text-xl font-bold mb-4">Video Review</h3>
                      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm aspect-video flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                        {item.videoUrl ? (
                          <iframe 
                            width="100%" 
                            height="100%" 
                            src={item.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="border-0"
                          ></iframe>
                        ) : (
                          <div className="text-center p-6">
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                            </div>
                            <p className="text-muted-foreground font-medium">Video coming soon</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">Review is currently being filmed</p>
                          </div>
                        )}
                      </div>
                    </section>
                    
                    <section>
                        <h3 className="font-display text-xl font-bold mb-4">About the Company</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {item.company} is a leading technology company offering opportunities for students to learn, grow, and build amazing things. Join their program to connect with other developers and access exclusive resources.
                        </p>
                    </section>
                </div>
                
                <aside className="md:col-span-1 space-y-6">
                   <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-border/50">
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {item.tags.map(tag => (
                                <span key={tag} className="text-sm text-foreground hover:underline cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                        </div>
                   </div>
                   
                   <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                        <h4 className="font-bold text-primary mb-2">Student Tip 💡</h4>
                        <p className="text-sm text-muted-foreground">
                            Make sure to complete the requirements before the deadline. Supplies are usually limited!
                        </p>
                   </div>
                </aside>
            </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
