import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, UserPlus, MessageSquare, CheckCircle, AlertCircle, Filter, X, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { mockExceptions } from "@/lib/mockData";
import { useState } from "react";

const ExceptionsQueue = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [selectedExceptions, setSelectedExceptions] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Advanced filters
  const [storeFilter, setStoreFilter] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<"orderReference" | "store" | "amount" | "age" | "assignedTo" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredExceptions = mockExceptions.filter((exception) => {
    const matchesSearch = exception.orderReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exception.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReason = reasonFilter === "all" || exception.reasonCode === reasonFilter;
    const matchesStore = storeFilter === "all" || exception.store === storeFilter;
    const matchesMinAmount = !minAmount || exception.amount >= parseFloat(minAmount);
    const matchesMaxAmount = !maxAmount || exception.amount <= parseFloat(maxAmount);
    const matchesMinAge = !minAge || exception.ageDays >= parseInt(minAge);
    const matchesMaxAge = !maxAge || exception.ageDays <= parseInt(maxAge);
    const matchesAssignment = assignmentFilter === "all" || 
      (assignmentFilter === "assigned" && exception.assignedTo) ||
      (assignmentFilter === "unassigned" && !exception.assignedTo);
    
    return matchesSearch && matchesReason && matchesStore && matchesMinAmount && 
           matchesMaxAmount && matchesMinAge && matchesMaxAge && matchesAssignment;
  });

  const hasActiveFilters = reasonFilter !== "all" || storeFilter !== "all" || 
    minAmount !== "" || maxAmount !== "" || minAge !== "" || maxAge !== "" || 
    assignmentFilter !== "all";

  const clearFilters = () => {
    setReasonFilter("all");
    setStoreFilter("all");
    setMinAmount("");
    setMaxAmount("");
    setMinAge("");
    setMaxAge("");
    setAssignmentFilter("all");
    setSearchTerm("");
  };

  const uniqueStores = Array.from(new Set(mockExceptions.map(e => e.store)));

  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: typeof sortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const sortedExceptions = [...filteredExceptions].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let aValue: string | number = "";
    let bValue: string | number = "";
    
    switch (sortColumn) {
      case "orderReference":
        aValue = a.orderReference;
        bValue = b.orderReference;
        break;
      case "store":
        aValue = a.store;
        bValue = b.store;
        break;
      case "amount":
        aValue = a.amount;
        bValue = b.amount;
        break;
      case "age":
        aValue = a.ageDays;
        bValue = b.ageDays;
        break;
      case "assignedTo":
        aValue = a.assignedTo || "";
        bValue = b.assignedTo || "";
        break;
    }
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === "asc" 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
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
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col gap-4 md:flex-row">
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
              <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Advanced Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1 px-1.5">
                        {[reasonFilter !== "all", storeFilter !== "all", minAmount, maxAmount, minAge, maxAge, assignmentFilter !== "all"].filter(Boolean).length}
                      </Badge>
                    )}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute z-50 mt-2 w-full md:w-auto">
                  <Card className="shadow-lg bg-background">
                    <CardContent className="p-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Reason</label>
                          <Select value={reasonFilter} onValueChange={setReasonFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Reasons" />
                            </SelectTrigger>
                            <SelectContent className="bg-background">
                              <SelectItem value="all">All Reasons</SelectItem>
                              <SelectItem value="AMOUNT_MISMATCH">Amount Mismatch</SelectItem>
                              <SelectItem value="MISSING_CAPTURE">Missing Capture</SelectItem>
                              <SelectItem value="DUPLICATE">Duplicate</SelectItem>
                              <SelectItem value="PAYOUT_MISSING">Payout Missing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Store</label>
                          <Select value={storeFilter} onValueChange={setStoreFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Stores" />
                            </SelectTrigger>
                            <SelectContent className="bg-background">
                              <SelectItem value="all">All Stores</SelectItem>
                              {uniqueStores.map(store => (
                                <SelectItem key={store} value={store}>{store}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Assignment</label>
                          <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="bg-background">
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="assigned">Assigned</SelectItem>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Min Amount (£)</label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            step="0.01"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Max Amount (£)</label>
                          <Input
                            type="number"
                            placeholder="999.99"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            step="0.01"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Min Age (days)</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={minAge}
                            onChange={(e) => setMinAge(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Max Age (days)</label>
                          <Input
                            type="number"
                            placeholder="30"
                            value={maxAge}
                            onChange={(e) => setMaxAge(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {hasActiveFilters && (
                        <div className="mt-4 flex justify-end">
                          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                            <X className="h-4 w-4" />
                            Clear All Filters
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
              
              <Button variant="outline" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Bulk Resolve ({selectedExceptions.length})
              </Button>
            </div>
            
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Showing {filteredExceptions.length} of {mockExceptions.length} exceptions</span>
              </div>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded border-input" />
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("orderReference")}
                    >
                      Order Reference
                      {getSortIcon("orderReference")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("store")}
                    >
                      Store
                      {getSortIcon("store")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("amount")}
                    >
                      Amount
                      {getSortIcon("amount")}
                    </Button>
                  </TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("age")}
                    >
                      Age
                      {getSortIcon("age")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("assignedTo")}
                    >
                      Assigned To
                      {getSortIcon("assignedTo")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedExceptions.map((exception) => (
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
