import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ImageUpload, GalleryUpload } from "@/components/image-upload";
import { TagInput } from "@/components/tag-input";
import { apiRequest } from "@/lib/queryClient";
import {
  Loader2,
  Send,
  FileText,
  Image as ImageIcon,
  Tags,
  Link as LinkIcon,
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from "lucide-react";

const CATEGORIES = ["Hackathon", "Internship", "Open Source", "Conference", "Program"] as const;

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  company: z.string().min(2, { message: "Company name is required." }),
  summary: z.string().min(20, { message: "Summary must be at least 20 characters." }).max(300, { message: "Summary must be under 300 characters." }),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
  category: z.enum(CATEGORIES, { required_error: "Please select a category." }),
  tags: z.array(z.string()).min(1, { message: "Add at least one tag." }).max(10),
  heroImage: z.string().nullable().optional(),
  galleryImages: z.array(z.string()).optional(),
  eligibility: z.string().optional(),
  requirements: z.string().optional(),
  perks: z.string().optional(),
  faq: z.string().optional(),
  officialLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  blogUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  videoUrl: z.string().optional().refine((val) => !val || val.includes('youtube.com') || val.includes('youtu.be') || val === "", { message: "Please enter a valid YouTube URL." }),
});

type FormData = z.infer<typeof formSchema>;

export default function Submit() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      summary: "",
      content: "",
      tags: [],
      heroImage: null,
      galleryImages: [],
      eligibility: "",
      requirements: "",
      perks: "",
      faq: "",
      officialLink: "",
      blogUrl: "",
      videoUrl: "",
    },
  });

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <Card className="max-w-md text-center">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                You need to be logged in to submit swag opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/login">
                <Button className="w-full rounded-full">Sign In</Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16 px-4 bg-slate-50/50 dark:bg-slate-950/50">
          <Card className="max-w-lg text-center border-border/50 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="font-display text-2xl">Submitted Successfully! 🎉</CardTitle>
              <CardDescription className="text-base mt-2">
                Your swag opportunity has been submitted and is waiting for admin approval.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⏳ <strong>Pending Review</strong> — Our team will review your submission shortly. You'll see it on the site once approved.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => { setIsSubmitted(false); form.reset(); }}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  Submit Another
                </Button>
                <Link href="/" className="flex-1">
                  <Button className="w-full rounded-full">
                    Browse Swag
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      // Format the data for submission
      const submissionData = {
        title: values.title,
        company: values.company,
        summary: values.summary,
        content: values.content,
        category: values.category,
        tags: JSON.stringify(values.tags),
        heroImage: values.heroImage || null,
        galleryImages: values.galleryImages?.length ? JSON.stringify(values.galleryImages) : null,
        eligibility: values.eligibility || null,
        requirements: values.requirements ? JSON.stringify(parseRequirements(values.requirements)) : null,
        perks: values.perks ? JSON.stringify(parsePerks(values.perks)) : null,
        faq: values.faq ? JSON.stringify(parseFaq(values.faq)) : null,
        officialLink: values.officialLink || null,
        blogUrl: values.blogUrl || null,
        videoUrl: values.videoUrl || null,
      };

      await apiRequest("POST", "/api/swag", submissionData);
      setIsSubmitted(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "Could not submit. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Helper functions to parse text inputs into structured data
  function parseRequirements(text: string) {
    return text.split('\n').filter(Boolean).map((line, i) => ({
      step: i + 1,
      title: line.trim(),
    }));
  }

  function parsePerks(text: string) {
    return text.split('\n').filter(Boolean).map(line => ({
      title: line.trim(),
    }));
  }

  function parseFaq(text: string) {
    const lines = text.split('\n').filter(Boolean);
    const faqs = [];
    for (let i = 0; i < lines.length; i += 2) {
      if (lines[i]) {
        faqs.push({
          question: lines[i].replace(/^Q:\s*/i, '').trim(),
          answer: lines[i + 1]?.replace(/^A:\s*/i, '').trim() || '',
        });
      }
    }
    return faqs;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 px-4 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <a className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to browse
              </a>
            </Link>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold">Submit Swag Opportunity</h1>
                <p className="text-muted-foreground mt-1">
                  Share a swag opportunity with the community. All submissions are reviewed before publishing.
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* Basic Info Section */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. GitHub Student Developer Pack" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company / Organization *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. GitHub" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Summary * <span className="text-muted-foreground font-normal">({field.value?.length || 0}/300)</span></FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief description that will appear on cards..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This appears on swag cards. Keep it concise and engaging.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description *</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Write a detailed description of the program..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Images Section */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="heroImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Image</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value || undefined}
                            onChange={(url) => field.onChange(url)}
                            label="Upload Hero Image"
                          />
                        </FormControl>
                        <FormDescription>
                          Main image for the swag post. Recommended: 16:9 aspect ratio.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="galleryImages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gallery Images (Optional)</FormLabel>
                        <FormControl>
                          <GalleryUpload
                            value={field.value || []}
                            onChange={field.onChange}
                            maxImages={6}
                          />
                        </FormControl>
                        <FormDescription>
                          Additional images showcasing the swag items.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Tags Section */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Tags className="h-5 w-5 text-primary" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags * <span className="font-normal text-muted-foreground">(1-10 tags)</span></FormLabel>
                        <FormControl>
                          <TagInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Additional Details (Collapsible) */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Additional Details (Optional)</CardTitle>
                  <CardDescription>Add more structured information to help users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="eligibility">
                      <AccordionTrigger>Eligibility Requirements</AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="eligibility"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Who can apply? e.g. 'Must be a student enrolled in an accredited institution...'"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="requirements">
                      <AccordionTrigger>How to Earn (Steps)</AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="requirements"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter each step on a new line:
Register on the official website
Complete the required tasks
Submit your application"
                                  className="min-h-[120px] font-mono text-sm"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                One step per line. These will be displayed as numbered steps.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="perks">
                      <AccordionTrigger>Perks / Goodies</AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="perks"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter each perk on a new line:
T-Shirt
Stickers pack
GitHub Copilot access"
                                  className="min-h-[120px] font-mono text-sm"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                One perk per line.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="faq">
                      <AccordionTrigger>FAQ</AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="faq"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Alternate questions and answers:
Q: Is this program free?
A: Yes, completely free for students.
Q: How long does verification take?
A: Usually 1-7 days."
                                  className="min-h-[150px] font-mono text-sm"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Alternate lines: Question, then Answer. Start questions with "Q:" and answers with "A:".
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Links Section */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="officialLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Official Website / Sign-up Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/apply" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="blogUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Official Announcement / Blog Post (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://blog.example.com/announcement" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Video (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        <FormDescription>
                          A video walkthrough or review of the program.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="rounded-full px-8"
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  className="rounded-full px-8 shadow-lg shadow-primary/20"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit for Review
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
