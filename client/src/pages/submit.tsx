import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/data";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string({ required_error: "Please select a category." }),
  link: z.string().url({ message: "Please enter a valid URL." }),
  blogUrl: z.string().optional().refine((val) => !val || val.startsWith('http'), { message: "Please enter a valid URL." }),
  videoUrl: z.string().optional().refine((val) => !val || val.includes('youtube.com') || val.includes('youtu.be'), { message: "Please enter a valid YouTube URL." }),
});

export default function Submit() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      link: "",
      blogUrl: "",
      videoUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Submission Received! 🎉",
      description: "Thanks for contributing! We'll review your submission shortly.",
    });
    form.reset();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-16 px-4 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="container max-w-lg mx-auto">
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-1 text-center pb-8">
              <CardTitle className="font-display text-2xl font-bold">Submit Opportunity</CardTitle>
              <CardDescription>
                Found some cool swag? Share it with the community!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. GitHub Student Pack" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company / Organization</FormLabel>
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
                        <FormLabel>Category</FormLabel>
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
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What do students get? How do they apply?" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Link to the official landing page or application.
                        </FormDescription>
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
                          <Input placeholder="https://blog.company.com/..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Link to the official announcement or blog post about this swag.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Video URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Add a video walkthrough or review if available.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full rounded-full font-medium" size="lg">
                    Submit Opportunity
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
