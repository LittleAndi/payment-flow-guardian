import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { mockGLFile } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const GLUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<typeof mockGLFile | null>(null);

  const handleFileUpload = () => {
    // Simulate file upload
    setUploadedFile(mockGLFile);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload GL File</CardTitle>
          <CardDescription>Upload General Ledger data for triangulation with payouts and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drag and drop your GL file here</h3>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <Button onClick={handleFileUpload} className="gap-2">
              <Upload className="h-4 w-4" />
              Browse Files
            </Button>
            <p className="text-xs text-muted-foreground mt-4">Supported formats: .xlsx, .csv</p>
          </div>
        </CardContent>
      </Card>

      {uploadedFile && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>GL Import Summary</CardTitle>
              <CardDescription>Preview of uploaded general ledger data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold">{uploadedFile.summary.recordCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">£{uploadedFile.summary.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">3-Way Matches Created</p>
                  <p className="text-2xl font-bold text-success">{uploadedFile.summary.threeWayMatches}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-success/10 p-4">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="text-sm font-medium">GL data imported successfully. Triangulation updated existing 2-way matches to 3-way where possible.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GL Records</CardTitle>
              <CardDescription>Imported general ledger entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>GL Reference</TableHead>
                      <TableHead>Transaction Date</TableHead>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Debit</TableHead>
                      <TableHead>Credit</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedFile.records.map((record) => (
                      <TableRow key={record.glReference}>
                        <TableCell className="font-medium">{record.glReference}</TableCell>
                        <TableCell>{new Date(record.transactionDate).toLocaleDateString()}</TableCell>
                        <TableCell>{record.accountCode}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.debit ? `£${record.debit.toFixed(2)}` : '-'}</TableCell>
                        <TableCell>{record.credit ? `£${record.credit.toFixed(2)}` : '-'}</TableCell>
                        <TableCell>
                          {record.matched ? (
                            <Badge className="bg-success text-success-foreground">Matched</Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default GLUpload;
