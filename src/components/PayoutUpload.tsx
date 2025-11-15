import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import { useState } from "react";
import { mockPayoutFile } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PayoutUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<typeof mockPayoutFile | null>(null);

  const handleFileUpload = () => {
    // Simulate file upload
    setUploadedFile(mockPayoutFile);
  };

  const getBucketBadge = (bucket: string) => {
    switch (bucket) {
      case "EXACT_3WAY":
        return <Badge className="bg-success text-success-foreground gap-1"><CheckCircle2 className="h-3 w-3" />3-Way Match</Badge>;
      case "EXACT_2WAY":
        return <Badge className="bg-info text-info-foreground gap-1"><CheckCircle2 className="h-3 w-3" />2-Way Match</Badge>;
      case "UNMATCHED":
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Unmatched</Badge>;
      case "AMOUNT_DIFF":
        return <Badge className="bg-warning text-warning-foreground gap-1"><MinusCircle className="h-3 w-3" />Amount Diff</Badge>;
      default:
        return <Badge variant="outline">{bucket}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Payout File</CardTitle>
          <CardDescription>Upload Excel (.xlsx) files containing payout data for reconciliation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-12">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drag and drop your file here</h3>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <Button onClick={handleFileUpload} className="gap-2">
              <Upload className="h-4 w-4" />
              Browse Files
            </Button>
            <p className="text-xs text-muted-foreground mt-4">Supported format: .xlsx</p>
          </div>
        </CardContent>
      </Card>

      {uploadedFile && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>File Summary</CardTitle>
              <CardDescription>Overview of uploaded payout data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Rows</p>
                  <p className="text-2xl font-bold">{uploadedFile.summary.rowCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Net Amount</p>
                  <p className="text-2xl font-bold">£{uploadedFile.summary.totalNetAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posting Date From</p>
                  <p className="text-2xl font-bold">{new Date(uploadedFile.summary.dateRangeStart).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posting Date To</p>
                  <p className="text-2xl font-bold">{new Date(uploadedFile.summary.dateRangeEnd).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reconciliation Buckets</CardTitle>
              <CardDescription>Payout rows categorized by match status</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="EXACT_3WAY" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="EXACT_3WAY" className="gap-2">
                    3-Way <Badge variant="secondary">{uploadedFile.buckets.EXACT_3WAY.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="EXACT_2WAY" className="gap-2">
                    2-Way <Badge variant="secondary">{uploadedFile.buckets.EXACT_2WAY.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="UNMATCHED" className="gap-2">
                    Unmatched <Badge variant="secondary">{uploadedFile.buckets.UNMATCHED.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="AMOUNT_DIFF" className="gap-2">
                    Amount Diff <Badge variant="secondary">{uploadedFile.buckets.AMOUNT_DIFF.length}</Badge>
                  </TabsTrigger>
                </TabsList>

                {Object.entries(uploadedFile.buckets).map(([bucket, rows]) => (
                  <TabsContent key={bucket} value={bucket} className="mt-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Payout Reference</TableHead>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Posting Date</TableHead>
                            <TableHead>Net Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Linked Payment</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rows.map((row) => (
                            <TableRow key={row.payoutReference}>
                              <TableCell className="font-medium">{row.payoutReference}</TableCell>
                              <TableCell>{row.transactionId}</TableCell>
                              <TableCell>{new Date(row.postingDate).toLocaleDateString()}</TableCell>
                              <TableCell>£{row.netAmount.toFixed(2)}</TableCell>
                              <TableCell>{getBucketBadge(row.bucket)}</TableCell>
                              <TableCell>{row.linkedPayment || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PayoutUpload;
