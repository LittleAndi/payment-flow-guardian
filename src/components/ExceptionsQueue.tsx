import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { mockExceptions } from "@/lib/mockData";
import { useState } from "react";

const ExceptionsQueue = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [selectedExceptions, setSelectedExceptions] = useState<string[]>([]);

  const filteredExceptions = mockExceptions.filter((exception) => {
    const matchesSearch = exception.orderReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exception.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReason = reasonFilter === "all" || exception.reasonCode === reasonFilter;
    return matchesSearch && matchesReason;
  });

  const getReasonBadge = (reason: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      "AMOUNT_MISMATCH": { color: "bg-warning text-warning-foreground", label: "Amount Mismatch" },
      "MISSING_CAPTURE": { color: "bg-destructive text-destructive-foreground", label: "Missing Capture" },
      "DUPLICATE": { color: "bg-info text-info-foreground", label: "Duplicate" },
      "PAYOUT_MISSING": { color: "bg-warning text-warning-foreground", label: "Payout Missing" },
    };
    const variant = variants[reason] || { color: "bg-muted text-muted-foreground", label: reason };
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const getAgeBadge = (days: number) => {
    if (days > 7) return <Badge variant="destructive">{days}d old</Badge>;
    if (days > 3) return <Badge className="bg-warning text-warning-foreground">{days}d old</Badge>;
    return <Badge variant="outline">{days}d old</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exceptions Work Queue</CardTitle>
          <CardDescription>Review and resolve payment reconciliation exceptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by order reference or store..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="AMOUNT_MISMATCH">Amount Mismatch</SelectItem>
                <SelectItem value="MISSING_CAPTURE">Missing Capture</SelectItem>
                <SelectItem value="DUPLICATE">Duplicate</SelectItem>
                <SelectItem value="PAYOUT_MISSING">Payout Missing</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Bulk Resolve ({selectedExceptions.length})
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded border-input" />
                  </TableHead>
                  <TableHead>Order Reference</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExceptions.map((exception) => (
                  <TableRow key={exception.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={selectedExceptions.includes(exception.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExceptions([...selectedExceptions, exception.id]);
                          } else {
                            setSelectedExceptions(selectedExceptions.filter(id => id !== exception.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{exception.orderReference}</TableCell>
                    <TableCell>{exception.store}</TableCell>
                    <TableCell>£{exception.amount.toFixed(2)}</TableCell>
                    <TableCell>{getReasonBadge(exception.reasonCode)}</TableCell>
                    <TableCell>{getAgeBadge(exception.ageDays)}</TableCell>
                    <TableCell>{exception.assignedTo || <span className="text-muted-foreground">Unassigned</span>}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <UserPlus className="h-3 w-3" />
                          Assign
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Note
                        </Button>
                        <Button size="sm" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Resolve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exception Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockExceptions.length}</p>
                <p className="text-sm text-muted-foreground">Total Exceptions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockExceptions.filter(e => e.ageDays > 7).length}</p>
                <p className="text-sm text-muted-foreground">Aged &gt; 7 days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <UserPlus className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockExceptions.filter(e => !e.assignedTo).length}</p>
                <p className="text-sm text-muted-foreground">Unassigned</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExceptionsQueue;
