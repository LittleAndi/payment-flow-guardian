import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockCapturedTransactions } from "@/lib/mockData";
import { format } from "date-fns";
import { CalendarIcon, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentDetailDialog from "@/components/PaymentDetailDialog";
import { useNavigate } from "react-router-dom";

type SortColumn = "capturedAt" | "orderReference" | "store" | "capturedAmount" | "status";
type SortDirection = "asc" | "desc";

const CapturedTransactions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [sortColumn, setSortColumn] = useState<SortColumn>("capturedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const stores = ["all", ...Array.from(new Set(mockCapturedTransactions.map((t) => t.store)))];
  const statuses = ["all", "Settled", "Pending"];
  const paymentMethods = ["all", ...Array.from(new Set(mockCapturedTransactions.map((t) => t.paymentMethod)))];

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = mockCapturedTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.orderReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.lastFourDigits.includes(searchTerm);

      const matchesStore = storeFilter === "all" || transaction.store === storeFilter;
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
      const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter;

      const transactionDate = new Date(transaction.capturedAt);
      const matchesStartDate = !startDate || transactionDate >= startDate;
      const matchesEndDate = !endDate || transactionDate <= endDate;

      return matchesSearch && matchesStore && matchesStatus && matchesPaymentMethod && matchesStartDate && matchesEndDate;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortColumn];
      let bVal: any = b[sortColumn];

      if (sortColumn === "capturedAt") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, storeFilter, statusFilter, paymentMethodFilter, startDate, endDate, sortColumn, sortDirection]);

  const totalAmount = filteredAndSortedTransactions.reduce((sum, t) => sum + t.capturedAmount, 0);
  const settledCount = filteredAndSortedTransactions.filter((t) => t.status === "Settled").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Captured Transactions</h1>
            <p className="text-muted-foreground">View and filter all captured payment transactions</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{filteredAndSortedTransactions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">£{totalAmount.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Settled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{settledCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Input
                placeholder="Search order, transaction, card..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Select value={storeFilter} onValueChange={setStoreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store} value={store}>
                      {store === "all" ? "All Stores" : store}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Statuses" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method === "all" ? "All Methods" : method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({filteredAndSortedTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("capturedAt")} className="h-8 p-0">
                      Captured At {getSortIcon("capturedAt")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("orderReference")} className="h-8 p-0">
                      Order Reference {getSortIcon("orderReference")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("store")} className="h-8 p-0">
                      Store {getSortIcon("store")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("capturedAmount")} className="h-8 p-0">
                      Amount {getSortIcon("capturedAmount")}
                    </Button>
                  </TableHead>
                  <TableHead>Payment Details</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("status")} className="h-8 p-0">
                      Status {getSortIcon("status")}
                    </Button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="cursor-pointer" onClick={() => setSelectedPayment(transaction)}>
                    <TableCell>{format(new Date(transaction.capturedAt), "PPp")}</TableCell>
                    <TableCell className="font-medium">{transaction.orderReference}</TableCell>
                    <TableCell>{transaction.store}</TableCell>
                    <TableCell className="font-semibold">£{transaction.capturedAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {transaction.cardType} •••• {transaction.lastFourDigits}
                        </div>
                        <div className="text-muted-foreground">{transaction.paymentMethod}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{transaction.transactionId}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === "Settled" ? "default" : "secondary"}>{transaction.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPayment(transaction);
                      }}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedPayment && (
        <PaymentDetailDialog paymentId={selectedPayment.orderReference} open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)} />
      )}
    </div>
  );
};

export default CapturedTransactions;
