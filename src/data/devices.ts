/** Sectors of AIO9 Devices: automation with ESP32 and Raspberry Pi hardware. */
export const deviceSectorIds = ["farms", "inventory", "fleet", "agro"] as const;
export type DeviceSectorId = (typeof deviceSectorIds)[number];

export interface DeviceSector {
  id: DeviceSectorId;
  /** Colour of this sector's software, used for its glow and accents. */
  color: string;
  /** One entry per demonstration step (ms). Must match `steps` in the dictionaries. */
  stepDurations: readonly number[];
}

export const deviceSectors: readonly DeviceSector[] = [
  { id: "farms", color: "#F2B705", stepDurations: [1100, 1200, 1300, 1200, 1300, 1400] },
  { id: "inventory", color: "#1EA7E8", stepDurations: [1000, 1400, 1200, 1300, 1200, 1400] },
  { id: "fleet", color: "#FF5A4F", stepDurations: [1100, 1300, 1300, 1300, 1200, 1400] },
  { id: "agro", color: "#8BD450", stepDurations: [1200, 1300, 1200, 1300, 1400] },
];
