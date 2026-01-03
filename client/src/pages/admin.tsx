import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import {
  Check,
  X,
  Clock,
  FileText,
  Loader2,
  ExternalLink,
  Shield,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Edit,
  Eye,
  AlertTriangle
} from "lucide-react";

interface SwagItem {
  id: string;
  title: string;
  company: string;
  summary: string;
  category: string;
  status: "pending" | "published" | "rejected";
  rejectionReason?: string;
  heroImage?: string;
  createdAt: string;
  submittedBy?: string;
}

export default function Admin() {
  const { isAdmin, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<SwagItem[]>([]);
  const [activeTab, setActiveTab] = useState("pending");

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingItem, setRejectingItem] = useState<SwagItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Fetch items
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/swag", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch submissions",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchItems();
    }
  }, [isAdmin]);

  // Redirect if not admin
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
              <CardDescription>
                You don't have permission to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button className="rounded-full">Go Home</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Loading state
  if (authLoading || isLoading) {
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

  // Filter items by status
  const pendingItems = items.filter(i => i.status === "pending");
  const publishedItems = items.filter(i => i.status === "published");
  const rejectedItems = items.filter(i => i.status === "rejected");

  // Actions
  const handleApprove = async (item: SwagItem) => {
    setIsProcessing(item.id);
    try {
      await apiRequest("PUT", `/api/admin/swag/${item.id}/approve`);
      toast({
        title: "Approved! ✅",
        description: `"${item.title}" is now published and visible to users.`,
      });
      fetchItems();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to approve",
        description: error.message,
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const openRejectModal = (item: SwagItem) => {
    setRejectingItem(item);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectingItem || !rejectReason.trim()) return;

    setIsProcessing(rejectingItem.id);
    try {
      await apiRequest("PUT", `/api/admin/swag/${rejectingItem.id}/reject`, {
        reason: rejectReason.trim(),
      });
      toast({
        title: "Rejected",
        description: `"${rejectingItem.title}" has been rejected.`,
      });
      setRejectModalOpen(false);
      fetchItems();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to reject",
        description: error.message,
      });
    } finally {
      setIsProcessing(null);
    }
  };

  // Card component
  const SubmissionCard = ({ item, showActions = true }: { item: SwagItem; showActions?: boolean }) => (
    <div className="flex flex-col sm:flex-row gap-4 p-5 border border-border rounded-xl bg-card hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      {item.heroImage && (
        <div className="w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-muted shrink-0">
          <img src={item.heroImage} alt={item.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-foreground truncate">{item.title}</h4>
              <Badge variant="secondary" className="text-xs">{item.category}</Badge>
              {item.status === "pending" && (
                <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">
                  <Clock className="h-3 w-3 mr-1" /> Pending
                </Badge>
              )}
              {item.status === "published" && (
                <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Published
                </Badge>
              )}
              {item.status === "rejected" && (
                <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">
                  <XCircle className="h-3 w-3 mr-1" /> Rejected
                </Badge>
              )}
            </div>
            <p className="text-sm text-primary font-medium">{item.company}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.summary}</p>

        {item.rejectionReason && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg mb-3">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{item.rejectionReason}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Submitted {new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex sm:flex-col gap-2 shrink-0">
          <Link href={`/swag/${item.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">View</span>
            </Button>
          </Link>

          {item.status === "pending" && (
            <>
              <Link href={`/admin/edit/${item.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </Link>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleApprove(item)}
                disabled={isProcessing === item.id}
              >
                {isProcessing === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Approve</span>
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => openRejectModal(item)}
                disabled={isProcessing === item.id}
              >
                <X className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Reject</span>
              </Button>
            </>
          )}

          {item.status !== "pending" && (
            <Link href={`/admin/edit/${item.id}`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 px-4 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="container max-w-screen-lg">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Manage submissions and content.</p>
            </div>
            <Button onClick={fetchItems} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{pendingItems.length}</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-500">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{publishedItems.length}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-500">Published</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">{rejectedItems.length}</p>
                    <p className="text-sm text-red-600 dark:text-red-500">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                Pending
                {pendingItems.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{pendingItems.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="published" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Published
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <XCircle className="h-4 w-4" />
                Rejected
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingItems.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No Pending Submissions</h3>
                    <p className="text-muted-foreground">All submissions have been reviewed. Check back later!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingItems.map(item => (
                    <SubmissionCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="published">
              {publishedItems.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No Published Items</h3>
                    <p className="text-muted-foreground">Approve pending submissions to see them here.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {publishedItems.map(item => (
                    <SubmissionCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedItems.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <XCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No Rejected Items</h3>
                    <p className="text-muted-foreground">All submissions have been approved or are pending.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {rejectedItems.map(item => (
                    <SubmissionCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Rejection Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{rejectingItem?.title}". This will be visible to the submitter.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || isProcessing === rejectingItem?.id}
            >
              {isProcessing === rejectingItem?.id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Reject Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
