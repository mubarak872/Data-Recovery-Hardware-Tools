import type { Capability, FamilyProfile } from "./types";

/**
 * Demo-only catalogue. Never treat these entries as confirmed hardware support.
 * A native backend must replace/validate profiles using metadata from the vendor SDK.
 */
const mockCapabilities = (items: Array<[Capability["id"], string]>): Capability[] =>
  items.map(([id, label]) => ({
    id,
    label,
    available: false,
    reason: "Simulation profile only; hardware/SDK support has not been verified."
  }));

export const familyProfiles: FamilyProfile[] = [
  {
    id: "mock-seagate-f3",
    vendor: "Seagate",
    utility: "F3 Architecture",
    name: "Barracuda F3",
    capabilities: mockCapabilities([
      ["identify", "Identify drive"],
      ["rom-read", "ROM information"],
      ["sa-list", "Service-area module list"],
      ["terminal", "Terminal diagnostics"]
    ]),
    verification: "mock"
  },
  {
    id: "mock-wd-marvell",
    vendor: "Western Digital",
    utility: "WD Marvell",
    name: "WD Marvell",
    capabilities: mockCapabilities([
      ["identify", "Identify drive"],
      ["rom-read", "ROM information"],
      ["sa-list", "Service-area module list"]
    ]),
    verification: "mock"
  },
  {
    id: "mock-wd-royl",
    vendor: "Western Digital",
    utility: "WD ROYL",
    name: "ROYL family",
    capabilities: mockCapabilities([
      ["identify", "Identify drive"],
      ["rom-read", "ROM information"]
    ]),
    verification: "mock"
  },
  ...(["Toshiba", "HGST / Hitachi", "Samsung"] as const).map(vendor => ({
    id: "mock-" + vendor.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    vendor,
    utility: "Universal ATA",
    name: vendor + " ATA",
    capabilities: mockCapabilities([
      ["identify", "Identify drive"],
      ["smart-read", "Read SMART status"],
      ["read-sectors", "Read sectors"]
    ]),
    verification: "mock" as const
  }))
];
