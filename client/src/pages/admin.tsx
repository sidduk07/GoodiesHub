import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_SWAG_ITEMS } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { toast } = useToast();

  const handleApprove = (id: string) => {
    toast({
      title: "Approved",
      description: `Item ${id} has been approved and published.`,
    });
  };

  const handleReject = (id: string) => {
    toast({
      variant: "destructive",
      title: "Rejected",
      description: `Item ${id} has been rejected.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-screen-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage submissions and inventory.</p>
            </div>
            <Button variant="outline">Export Data</Button>
          </div>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Submissions</CardTitle>
                <CardDescription>Review new opportunities submitted by users.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock Pending Items */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Community Submission #{i}</h4>
                          <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">Pending</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Submitted by user@example.com • 2 hours ago</p>
                      </div>
                      <div className="flex gap-2">
                         <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApprove(String(i))}>
                           <Check className="h-4 w-4" />
                         </Button>
                         <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleReject(String(i))}>
                           <X className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Swag</CardTitle>
                <CardDescription>Manage currently listed items.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                      <tr>
                        <th className="p-4">Item</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_SWAG_ITEMS.map((item) => (
                        <tr key={item.id} className="border-t hover:bg-muted/50 transition-colors">
                          <td className="p-4 font-medium">{item.title}</td>
                          <td className="p-4">{item.category}</td>
                          <td className="p-4">
                            <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
