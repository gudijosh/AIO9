"use client";

import type { IndustryId } from "@/data/industries";
import type { Dictionary } from "@/i18n/dictionaries";
import { HealthcareDemo } from "./HealthcareDemo";
import { HospitalityDemo } from "./HospitalityDemo";
import { RealEstateDemo } from "./RealEstateDemo";
import { RetailDemo } from "./RetailDemo";
import { ServicesDemo } from "./ServicesDemo";
import { LogisticsDemo } from "./LogisticsDemo";

/** Picks the demonstration for an industry, keeping each one's copy fully typed. */
export function DemoRenderer({
  id,
  step,
  industries,
}: {
  id: IndustryId;
  step: number;
  industries: Dictionary["industries"];
}) {
  switch (id) {
    case "healthcare":
      return <HealthcareDemo step={step} t={industries.healthcare.demo} />;
    case "hospitality":
      return <HospitalityDemo step={step} t={industries.hospitality.demo} />;
    case "realEstate":
      return <RealEstateDemo step={step} t={industries.realEstate.demo} />;
    case "retail":
      return <RetailDemo step={step} t={industries.retail.demo} />;
    case "services":
      return <ServicesDemo step={step} t={industries.services.demo} />;
    case "logistics":
      return <LogisticsDemo step={step} t={industries.logistics.demo} />;
  }
}
