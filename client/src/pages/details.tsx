import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ApprovalBadge } from "@/components/approval-badge";
import { useRoute, Link } from "wouter";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Share2,
  CheckCircle2,
  Gift,
  ClipboardList,
  Users,
  HelpCircle,
  Play,
  BookOpen,
  Loader2,
  Clock,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SwagItem {
  id: string;
  title: string;
  company: string;
  summary: string;
  content: string;
  heroImage?: string;
  galleryImages?: string;
  category: string;
  tags: string;
  eligibility?: string;
  requirements?: string;
  perks?: string;
  faq?: string;
  officialLink?: string;
  blogUrl?: string;
  videoUrl?: string;
  status: "pending" | "published" | "rejected";
  isFeatured: boolean;
  createdAt: string;
  publishedAt?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface PerkItem {
  icon?: string;
  title: string;
  description?: string;
}

interface RequirementStep {
  step: number;
  title: string;
  description?: string;
}

export default function Details() {
  const [match, params] = useRoute("/swag/:id");
  const id = params?.id;
  const { toast } = useToast();

  const [item, setItem] = useState<SwagItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/swag/${id}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setItem(data);
        } else if (res.status === 404) {
          setNotFound(true);
        }
      } catch (error) {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Parse JSON safely
  const parseTags = (): string[] => {
    try {
      return item?.tags ? JSON.parse(item.tags) : [];
    } catch {
      return [];
    }
  };

  const parsePerks = (): PerkItem[] => {
    try {
      return item?.perks ? JSON.parse(item.perks) : [];
    } catch {
      return [];
    }
  };

  const parseRequirements = (): RequirementStep[] => {
    try {
      return item?.requirements ? JSON.parse(item.requirements) : [];
    } catch {
      return [];
    }
  };

  const parseFaq = (): FaqItem[] => {
    try {
      return item?.faq ? JSON.parse(item.faq) : [];
    } catch {
      return [];
    }
  };

  const parseGallery = (): string[] => {
    try {
      return item?.galleryImages ? JSON.parse(item.galleryImages) : [];
    } catch {
      return [];
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item?.title,
          text: item?.summary,
          url,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied! 📋",
        description: "Share this opportunity with friends.",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (notFound || !item) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <Card className="max-w-md text-center">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Not Found</h2>
              <p className="text-muted-foreground mb-6">
                This swag opportunity doesn't exist or is not available.
              </p>
              <Link href="/">
                <Button className="rounded-full">Browse All Swag</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const tags = parseTags();
  const perks = parsePerks();
  const requirements = parseRequirements();
  const faqItems = parseFaq();
  const gallery = parseGallery();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Hero - Video or Image with Gradient Overlay */}
          <div className="relative h-[300px] md:h-[450px] w-full">
            {item.videoUrl ? (
              // Show YouTube video as hero when available
              <div className="w-full h-full bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={item.videoUrl
                    .replace('watch?v=', 'embed/')
                    .replace('youtu.be/', 'youtube.com/embed/')
                    .split('?')[0] + '?autoplay=0&rel=0&modestbranding=1'}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0 w-full h-full"
                />
              </div>
            ) : item.heroImage ? (
              <img
                src={item.heroImage}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20" />
            )}
            {/* Gradient overlay - only show when not video */}
            {!item.videoUrl && (
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            )}
          </div>

          {/* Subscribe Button - Show when video is present */}
          {item.videoUrl && (
            <div className="bg-gradient-to-b from-black/80 to-background py-4 px-4">
              <div className="container max-w-screen-lg flex items-center justify-center gap-4">
                <span className="text-sm text-muted-foreground">Enjoyed this video?</span>
                <a
                  href="https://www.youtube.com/@GoodiesHub?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg hover:shadow-red-500/30"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                  Subscribe
                </a>
                <span className="text-xs text-muted-foreground hidden sm:block">to GoodiesHub for more!</span>
              </div>
            </div>
          )}

          {/* Content below hero */}
          <div className={`container max-w-screen-lg px-4 relative z-10 ${item.videoUrl ? 'mt-6' : '-mt-32'}`}>
            <Link href="/">
              <a className={`inline-flex items-center text-sm mb-6 transition-colors px-3 py-1.5 rounded-full ${item.videoUrl ? 'text-muted-foreground hover:text-foreground bg-secondary' : 'text-white/80 hover:text-white bg-black/30 backdrop-blur-sm'}`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to browse
              </a>
            </Link>

            <div className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-10">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {item.status === "published" && <ApprovalBadge />}
                {item.status === "pending" && (
                  <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">
                    <Clock className="h-3 w-3 mr-1" /> Pending Approval
                  </Badge>
                )}
                <Badge variant="secondary" className="font-medium">
                  {item.category}
                </Badge>
                {item.isFeatured && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    ⭐ Featured
                  </Badge>
                )}
              </div>

              {/* Company */}
              <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-2">
                {item.company}
              </p>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                {item.title}
              </h1>

              {/* Summary */}
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {item.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-muted-foreground">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {item.officialLink && (
                  <Button
                    size="lg"
                    className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    asChild
                  >
                    <a href={item.officialLink} target="_blank" rel="noopener noreferrer">
                      Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                {item.blogUrl && (
                  <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                    <a href={item.blogUrl} target="_blank" rel="noopener noreferrer">
                      <BookOpen className="mr-2 h-4 w-4" /> Read Announcement
                    </a>
                  </Button>
                )}
                <Button size="lg" variant="outline" className="rounded-full px-8" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container max-w-screen-lg px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">

              {/* Overview Section */}
              <section>
                <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  Overview
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div
                    className="text-foreground leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br/>') }}
                  />
                </div>
              </section>

              {/* Eligibility Section */}
              {item.eligibility && (
                <section>
                  <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    Eligibility
                  </h2>
                  <Card className="border-border/50">
                    <CardContent className="pt-6">
                      <p className="text-foreground leading-relaxed">{item.eligibility}</p>
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* How to Earn Section */}
              {requirements.length > 0 && (
                <section>
                  <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-emerald-500" />
                    </div>
                    How to Earn
                  </h2>
                  <Card className="border-border/50">
                    <CardContent className="pt-6">
                      <ol className="space-y-4">
                        {requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-4 group">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors font-bold">
                              {req.step || i + 1}
                            </div>
                            <div>
                              <p className="text-foreground font-medium">{req.title}</p>
                              {req.description && (
                                <p className="text-sm text-muted-foreground mt-1">{req.description}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* Perks Section */}
              {perks.length > 0 && (
                <section>
                  <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Gift className="h-5 w-5 text-purple-500" />
                    </div>
                    Perks & Goodies
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {perks.map((perk, i) => (
                      <Card key={i} className="border-border/50 hover:shadow-md transition-shadow">
                        <CardContent className="pt-6 flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-2xl shrink-0">
                            {perk.icon || "🎁"}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{perk.title}</h4>
                            {perk.description && (
                              <p className="text-sm text-muted-foreground mt-1">{perk.description}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Video Section */}
              {item.videoUrl && (
                <section>
                  <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Play className="h-5 w-5 text-red-500" />
                    </div>
                    Video
                  </h2>
                  <Card className="border-border/50 overflow-hidden">
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={item.videoUrl
                          .replace('watch?v=', 'embed/')
                          .replace('youtu.be/', 'youtube.com/embed/')}
                        title="Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="border-0"
                      />
                    </div>
                  </Card>
                </section>
              )}

              {/* FAQ Section */}
              {faqItems.length > 0 && (
                <section>
                  <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-amber-500" />
                    </div>
                    Frequently Asked Questions
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {faqItems.map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="sticky top-24 space-y-6">

                {/* At a Glance Card */}
                <Card className="border-border/50 shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    <h4 className="font-display font-bold text-lg">At a Glance</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</span>
                        <p className="font-medium text-foreground">{item.company}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</span>
                        <p className="font-medium text-foreground">{item.category}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                        <div className="mt-1">
                          <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      {item.publishedAt && (
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Published</span>
                          <p className="font-medium text-foreground">
                            {new Date(item.publishedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Tags Card */}
                {tags.length > 0 && (
                  <Card className="border-border/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tip Card */}
                <Card className="bg-primary/5 border-primary/10">
                  <CardContent className="pt-6">
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                      <span className="text-xl">💡</span> Student Tip
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Make sure to complete the requirements before the deadline. Supplies are usually limited! Always double-check eligibility rules on the official site.
                    </p>
                  </CardContent>
                </Card>

                {/* Gallery */}
                {gallery.length > 0 && (
                  <Card className="border-border/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Gallery</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {gallery.map((img, i) => (
                          <div key={i} className="aspect-square rounded-lg overflow-hidden">
                            <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
