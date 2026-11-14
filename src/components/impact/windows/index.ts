import type { ComponentType } from "react";
import type { IndustryId } from "@/data/industries";
import type { DeviceSectorId } from "@/data/devices";
import type { WindowProps } from "./kit";
import { HealthcareWindow } from "./HealthcareWindow";
import { HospitalityWindow } from "./HospitalityWindow";
import { RealEstateWindow } from "./RealEstateWindow";
import { RetailWindow } from "./RetailWindow";
import { ServicesWindow } from "./ServicesWindow";
import { OperationsWindow } from "./OperationsWindow";
import { FarmsWindow } from "./FarmsWindow";
import { InventoryWindow } from "./InventoryWindow";
import { FleetWindow } from "./FleetWindow";
import { AgroWindow } from "./AgroWindow";

/** The software window of each industry and of each AIO9 Devices sector. */
export const industryWindows: Record<IndustryId, ComponentType<WindowProps>> = {
  healthcare: HealthcareWindow,
  hospitality: HospitalityWindow,
  realEstate: RealEstateWindow,
  retail: RetailWindow,
  services: ServicesWindow,
  logistics: OperationsWindow,
};

export const deviceWindows: Record<DeviceSectorId, ComponentType<WindowProps>> = {
  farms: FarmsWindow,
  inventory: InventoryWindow,
  fleet: FleetWindow,
  agro: AgroWindow,
};
