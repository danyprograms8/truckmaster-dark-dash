
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusDiagnostics from '@/components/diagnostics/StatusDiagnostics';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <div className="p-6">
      <Header title="Settings" subtitle="Configure your preferences" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="bg-truckmaster-card-bg p-5 rounded-lg border border-white/5">
          <p className="text-truckmaster-gray-light">General settings will go here.</p>
        </TabsContent>
        
        <TabsContent value="diagnostics" className="bg-truckmaster-card-bg p-5 rounded-lg border border-white/5">
          <StatusDiagnostics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
