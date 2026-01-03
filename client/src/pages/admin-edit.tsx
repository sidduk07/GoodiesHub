import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Shield, Trash2 } from "lucide-react";

interface SwagItem {
    id: string;
    title: string;
    company: string;
    summary: string;
    content: string;
    heroImage?: string;
    category: string;
    tags: string;
    eligibility?: string;
    requirements?: string;
    perks?: string;
    faq?: string;
    officialLink?: string;
    blogUrl?: string;
    videoUrl?: string;
    status: string;
    isFeatured: boolean;
}

export default function AdminEdit() {
    const { isAdmin, isLoading: authLoading, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const [location, setLocation] = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Get ID from URL
    const id = location.split("/").pop();

    // Form state
    const [form, setForm] = useState<SwagItem>({
        id: "",
        title: "",
        company: "",
        summary: "",
        content: "",
        heroImage: "",
        category: "Program",
        tags: "[]",
        eligibility: "",
        requirements: "[]",
        perks: "[]",
        faq: "[]",
        officialLink: "",
        blogUrl: "",
        videoUrl: "",
        status: "pending",
        isFeatured: false,
    });

    // Helper to parse tags
    const [tagsInput, setTagsInput] = useState("");

    // Fetch item data
    useEffect(() => {
        if (isAdmin && id) {
            fetchItem();
        }
    }, [isAdmin, id]);

    const fetchItem = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/swag/${id}`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setForm(data);
                // Parse tags for display
                try {
                    const parsedTags = JSON.parse(data.tags || "[]");
                    setTagsInput(Array.isArray(parsedTags) ? parsedTags.join(", ") : "");
                } catch {
                    setTagsInput("");
                }
            } else {
                toast({ variant: "destructive", title: "Item not found" });
                setLocation("/admin");
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Failed to load item" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Convert tags input to JSON array
            const tagsArray = tagsInput.split(",").map(t => t.trim()).filter(t => t);

            const updateData = {
                ...form,
                tags: JSON.stringify(tagsArray),
            };

            const res = await fetch(`/api/admin/swag/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updateData),
            });

            if (res.ok) {
                toast({ title: "✅ Saved!", description: "Item updated successfully" });
                setLocation("/admin");
            } else {
                const err = await res.json();
                toast({ variant: "destructive", title: "Error", description: err.message });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Failed to save" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this item? This cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/swag/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                toast({ title: "🗑️ Deleted", description: "Item removed successfully" });
                setLocation("/admin");
            } else {
                toast({ variant: "destructive", title: "Failed to delete" });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Failed to delete" });
        } finally {
            setIsDeleting(false);
        }
    };

    // Auth check
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-1 flex items-center justify-center py-16 px-4">
                    <Card className="max-w-md text-center">
                        <CardHeader>
                            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-destructive" />
                            </div>
                            <CardTitle>Admin Access Required</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Link href="/">
                                <Button>Go Home</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 container max-w-4xl py-8 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" /> Back
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Edit Swag Item</h1>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                        Delete
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company *</Label>
                                    <Input
                                        id="company"
                                        value={form.company}
                                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="summary">Summary *</Label>
                                <Textarea
                                    id="summary"
                                    value={form.summary}
                                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                                    rows={2}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Full Content *</Label>
                                <Textarea
                                    id="content"
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    rows={8}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category & Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Classification</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Program">Program</SelectItem>
                                            <SelectItem value="Hackathon">Hackathon</SelectItem>
                                            <SelectItem value="Internship">Internship</SelectItem>
                                            <SelectItem value="Conference">Conference</SelectItem>
                                            <SelectItem value="Open Source">Open Source</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Featured</Label>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Switch
                                            checked={form.isFeatured}
                                            onCheckedChange={(v) => setForm({ ...form, isFeatured: v })}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {form.isFeatured ? "Yes" : "No"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (comma-separated)</Label>
                                <Input
                                    id="tags"
                                    value={tagsInput}
                                    onChange={(e) => setTagsInput(e.target.value)}
                                    placeholder="e.g. T-Shirt, Stickers, Certificate"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media & Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Media & Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="heroImage">Hero Image URL</Label>
                                <Input
                                    id="heroImage"
                                    value={form.heroImage || ""}
                                    onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                                    placeholder="/attached_assets/generated_images/example.png"
                                />
                                {form.heroImage && (
                                    <img src={form.heroImage} alt="Preview" className="h-32 object-cover rounded-lg mt-2" />
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="officialLink">Official Link</Label>
                                    <Input
                                        id="officialLink"
                                        value={form.officialLink || ""}
                                        onChange={(e) => setForm({ ...form, officialLink: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="videoUrl">YouTube Video URL</Label>
                                    <Input
                                        id="videoUrl"
                                        value={form.videoUrl || ""}
                                        onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                                        placeholder="https://youtu.be/..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="eligibility">Eligibility</Label>
                                <Textarea
                                    id="eligibility"
                                    value={form.eligibility || ""}
                                    onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="requirements">Requirements (JSON array)</Label>
                                <Textarea
                                    id="requirements"
                                    value={form.requirements || "[]"}
                                    onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                                    rows={4}
                                    className="font-mono text-sm"
                                    placeholder='[{"step": 1, "title": "Register", "description": "..."}]'
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="perks">Perks (JSON array)</Label>
                                <Textarea
                                    id="perks"
                                    value={form.perks || "[]"}
                                    onChange={(e) => setForm({ ...form, perks: e.target.value })}
                                    rows={4}
                                    className="font-mono text-sm"
                                    placeholder='[{"icon": "👕", "title": "T-Shirt", "description": "..."}]'
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Button type="submit" className="flex-1" disabled={isSaving}>
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Save Changes
                        </Button>
                        <Link href="/admin">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}
