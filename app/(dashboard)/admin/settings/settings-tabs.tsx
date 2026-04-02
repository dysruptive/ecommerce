"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralForm } from "./general-form";
import { ThemeForm } from "./theme-form";
import { NotificationsForm } from "./notifications-form";
import { DomainInfo } from "./domain-info";
import { PaymentsForm } from "./payments-form";
import type { Tenant } from "@/types";

interface SettingsTabsProps {
  tenant: Tenant;
}

export function SettingsTabs({ tenant }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="domain">Domain</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-4">
        <GeneralForm tenant={tenant} />
      </TabsContent>
      <TabsContent value="theme" className="mt-4">
        <ThemeForm tenant={tenant} />
      </TabsContent>
      <TabsContent value="payments" className="mt-4">
        <PaymentsForm tenant={tenant} />
      </TabsContent>
      <TabsContent value="notifications" className="mt-4">
        <NotificationsForm tenant={tenant} />
      </TabsContent>
      <TabsContent value="domain" className="mt-4">
        <DomainInfo tenant={tenant} />
      </TabsContent>
    </Tabs>
  );
}
