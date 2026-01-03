import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Loader2, Settings as SettingsIcon, Bell, User, Mail, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Settings() {
    const { user, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setEmailNotifications(user.emailNotifications);
        }
    }, [user]);

    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
        setLocation("/login");
        return null;
    }

    if (authLoading) {
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

    async function handleNotificationToggle(enabled: boolean) {
        setIsSaving(true);
        try {
            await apiRequest("PUT", "/api/user/preferences", { emailNotifications: enabled });
            setEmailNotifications(enabled);
            await refreshUser();
            toast({
                title: enabled ? "Notifications enabled 🔔" : "Notifications disabled",
                description: enabled
                    ? "You'll receive emails when new swag is published."
                    : "You won't receive email notifications anymore.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Failed to update",
                description: error.message || "Could not update preferences.",
            });
            setEmailNotifications(!enabled); // Revert
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 py-12 px-4 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="container max-w-2xl">
                    <div className="mb-8">
                        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
                            <SettingsIcon className="h-8 w-8 text-primary" />
                            Settings
                        </h1>
                        <p className="text-muted-foreground mt-2">Manage your account preferences</p>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Section */}
                        <Card className="border-border/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="h-5 w-5 text-primary" />
                                    Profile
                                </CardTitle>
                                <CardDescription>Your account information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-border/50">
                                    <div>
                                        <p className="font-medium text-sm text-muted-foreground">Username</p>
                                        <p className="text-foreground">{user?.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-border/50">
                                    <div>
                                        <p className="font-medium text-sm text-muted-foreground">Email</p>
                                        <p className="text-foreground flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium text-sm text-muted-foreground">Account Type</p>
                                        <p className="text-foreground flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            {user?.role === "admin" ? (
                                                <span className="text-primary font-medium">Administrator</span>
                                            ) : (
                                                "Member"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notifications Section */}
                        <Card className="border-border/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Bell className="h-5 w-5 text-primary" />
                                    Notifications
                                </CardTitle>
                                <CardDescription>Configure how you receive updates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between py-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="email-notifications" className="text-base font-medium">
                                            Email me when new swag is posted
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive notifications when new opportunities are approved and published
                                        </p>
                                    </div>
                                    <Switch
                                        id="email-notifications"
                                        checked={emailNotifications}
                                        onCheckedChange={handleNotificationToggle}
                                        disabled={isSaving}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Quick Link */}
                        {user?.role === "admin" && (
                            <Card className="border-primary/20 bg-primary/5 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-primary">
                                        <Shield className="h-5 w-5" />
                                        Admin Access
                                    </CardTitle>
                                    <CardDescription>You have administrator privileges</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        onClick={() => setLocation("/admin")}
                                        className="rounded-full"
                                    >
                                        Go to Admin Dashboard
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
