"use client";

import { useState } from "react";
import { GeneralForm } from "./general-form";
import { ThemeForm } from "./theme-form";
import { NotificationsForm } from "./notifications-form";
import { DomainInfo } from "./domain-info";
import { PaymentsForm } from "./payments-form";
import type { Tenant } from "@/types";

const TABS = [
  { key: "general", label: "General" },
  { key: "theme", label: "Theme" },
  { key: "payments", label: "Payments" },
  { key: "notifications", label: "Notifications" },
  { key: "domain", label: "Domain" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function SettingsTabs({ tenant }: { tenant: Tenant }) {
  const [active, setActive] = useState<TabKey>("general");

  return (
    <div className="space-y-5">
      <div className="flex gap-1 rounded-xl border border-[#E5E2DB] bg-white p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              active === tab.key
                ? "bg-[#FEF3C7] text-[#92400E]"
                : "text-[#78716C] hover:text-[#1C1917]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "general" && <GeneralForm tenant={tenant} />}
      {active === "theme" && <ThemeForm tenant={tenant} />}
      {active === "payments" && <PaymentsForm tenant={tenant} />}
      {active === "notifications" && <NotificationsForm tenant={tenant} />}
      {active === "domain" && <DomainInfo tenant={tenant} />}
    </div>
  );
}
