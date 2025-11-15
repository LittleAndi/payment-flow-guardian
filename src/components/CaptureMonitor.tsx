import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { mockCaptureData } from "@/lib/mockData";
import { useState } from "react";
import PaymentDetailDialog from "./PaymentDetailDialog";

const CaptureMonitor = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const data = mockCaptureData;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const getStatusBadge = (lag: number) => {
    if (lag > 120) {
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />SLA Breach</Badge>;
    }
    if (lag > 60) {
      return <Badge className="gap-1 bg-warning text-warning-foreground"><Clock className="h-3 w-3" />Warning</Badge>;
    }
    return <Badge className="gap-1 bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3" />On Time</Badge>;
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Awaiting Capture</CardDescription>
            <CardTitle className="text-3xl font-bold">{data.kpis.awaitingCapture}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Orders delivered but not captured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Capture Lag</CardDescription>
            <CardTitle className="text-3xl font-bold">
              P50: {formatDuration(data.kpis.avgLagP50)} | P90: {formatDuration(data.kpis.avgLagP90)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Time between delivery and capture</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>SLA Breaches</CardDescription>
            <CardTitle className="text-3xl font-bold text-destructive">{data.kpis.slaBreaches}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Captures delayed &gt; 2 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery vs Capture Status</CardTitle>
          <CardDescription>Monitor orders awaiting payment capture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Reference</TableHead>
                  <TableHead>Delivered At</TableHead>
                  <TableHead>Expected Amount</TableHead>
                  <TableHead>Captured Amount</TableHead>
                  <TableHead>Lag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.orders.map((order) => (
                  <TableRow key={order.orderReference} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedPayment(order.orderReference)}>
                    <TableCell className="font-medium">{order.orderReference}</TableCell>
                    <TableCell>{new Date(order.deliveredAt).toLocaleString()}</TableCell>
                    <TableCell>£{order.expectedAmount.toFixed(2)}</TableCell>
                    <TableCell>{order.capturedAmount ? `£${order.capturedAmount.toFixed(2)}` : '-'}</TableCell>
                    <TableCell>{formatDuration(order.lagMinutes)}</TableCell>
                    <TableCell>{getStatusBadge(order.lagMinutes)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="gap-1" onClick={(e) => {
                        e.stopPropagation();
                        console.log('Retry capture for', order.orderReference);
                      }}>
                        <RefreshCw className="h-3 w-3" />
                        Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedPayment && (
        <PaymentDetailDialog
          paymentId={selectedPayment}
          open={!!selectedPayment}
          onOpenChange={(open) => !open && setSelectedPayment(null)}
        />
      )}
    </>
  );
};

export default CaptureMonitor;
