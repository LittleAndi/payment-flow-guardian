import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PaymentDetailDialogProps {
  paymentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentDetailDialog = ({ paymentId, open, onOpenChange }: PaymentDetailDialogProps) => {
  const [showPII, setShowPII] = useState(false);

  // Mock payment details
  const payment = {
    orderReference: paymentId,
    status: "AWAITING_CAPTURE",
    customer: {
      name: showPII ? "John Smith" : "J*** S****",
      email: showPII ? "john.smith@example.com" : "j***@example.com",
      phone: showPII ? "+44 7700 900123" : "+44 *** ***123",
    },
    timeline: [
      { timestamp: "2024-01-15T10:30:00Z", action: "Order Created", user: "System" },
      { timestamp: "2024-01-15T10:35:00Z", action: "Payment Authorized", user: "Payment Gateway" },
      { timestamp: "2024-01-15T11:45:00Z", action: "Order Delivered", user: "Delivery Service" },
      { timestamp: "2024-01-15T13:20:00Z", action: "Capture Attempted", user: "Auto Capture Service" },
    ],
    orderLines: [
      { item: "Premium Widget", quantity: 2, unitPrice: 29.99, total: 59.98 },
      { item: "Standard Widget", quantity: 1, unitPrice: 19.99, total: 19.99 },
    ],
    amounts: {
      subtotal: 79.97,
      tax: 16.00,
      total: 95.97,
    },
    payoutReference: "PAY-2024-00234",
    glReference: null,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>{paymentId}</DialogDescription>
            </div>
            <Badge className="bg-warning text-warning-foreground">Awaiting Capture</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Customer Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPII(!showPII)}
                className="gap-2"
              >
                {showPII ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPII ? "Hide" : "Show"} PII
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="text-sm font-medium">{payment.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm font-medium">{payment.customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Phone:</span>
                <span className="text-sm font-medium">{payment.customer.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Lines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payment.orderLines.map((line, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">{line.item}</p>
                      <p className="text-xs text-muted-foreground">Qty: {line.quantity} × £{line.unitPrice.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-medium">£{line.total.toFixed(2)}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal:</span>
                  <span className="text-sm">£{payment.amounts.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tax:</span>
                  <span className="text-sm">£{payment.amounts.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-base font-semibold">Total:</span>
                  <span className="text-base font-semibold">£{payment.amounts.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payment.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {index < payment.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-border my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium">{event.action}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">By: {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Linked References</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payout Reference:</span>
                <span className="text-sm font-medium">{payment.payoutReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">GL Reference:</span>
                <span className="text-sm font-medium">{payment.glReference || "Not linked"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailDialog;
