import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CaptureMonitor from "@/components/CaptureMonitor";
import PayoutUpload from "@/components/PayoutUpload";
import GLUpload from "@/components/GLUpload";
import ExceptionsQueue from "@/components/ExceptionsQueue";
import { DollarSign } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("capture");

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <DollarSign className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Payment Reconciliation</h1>
              <p className="text-sm text-muted-foreground">Capture, Payout & GL Management</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="capture">Capture Monitor</TabsTrigger>
            <TabsTrigger value="payout">Payout Upload</TabsTrigger>
            <TabsTrigger value="gl">GL Upload</TabsTrigger>
            <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
          </TabsList>

          <TabsContent value="capture" className="mt-6">
            <CaptureMonitor />
          </TabsContent>

          <TabsContent value="payout" className="mt-6">
            <PayoutUpload />
          </TabsContent>

          <TabsContent value="gl" className="mt-6">
            <GLUpload />
          </TabsContent>

          <TabsContent value="exceptions" className="mt-6">
            <ExceptionsQueue />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
