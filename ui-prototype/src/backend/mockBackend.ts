import { familyProfiles } from "./capabilities";
import type { BackendStatus, DeviceInfo, DriveLabBackend, HardwarePort, OperationResult } from "./types";

/**
 * Simulation backend only. It intentionally returns no physical devices and
 * refuses sector reads. Replace with a native bridge only after vendor SDK review.
 */
export class MockDriveLabBackend implements DriveLabBackend {
  async getStatus(): Promise<BackendStatus> {
    return {
      mode: "simulation",
      connected: false,
      message: "Simulation mode: no physical hardware is connected."
    };
  }

  async listPorts(): Promise<OperationResult<HardwarePort[]>> {
    return {
      ok: true,
      data: [
        { id: "sata-0", label: "SATA 0", transport: "SATA", available: false, detail: "No vendor controller detected" },
        { id: "sata-1", label: "SATA 1", transport: "SATA", available: false, detail: "No vendor controller detected" },
        { id: "sata-2", label: "SATA 2", transport: "SATA", available: false, detail: "No vendor controller detected" },
        { id: "sata-3", label: "SATA 3", transport: "SATA", available: false, detail: "No vendor controller detected" },
        { id: "pata-0", label: "PATA 0", transport: "PATA", available: false, detail: "No vendor controller detected" }
      ],
      message: "Demo port list only. These are not physical controller ports."
    };
  }

  async listDevices(): Promise<OperationResult<DeviceInfo[]>> {
    return {
      ok: true,
      data: [],
      message: "No physical devices are exposed by the simulation backend."
    };
  }

  async listFamilyProfiles() {
    return familyProfiles;
  }

  async identifyDevice(deviceId: string): Promise<OperationResult<DeviceInfo>> {
    return {
      ok: false,
      code: "SIMULATION_ONLY",
      message: `Cannot identify device "${deviceId}": the simulation backend has no hardware access.`
    };
  }

  async readSectors(
    deviceId: string,
    _startLba: bigint,
    _sectorCount: number
  ): Promise<OperationResult<Uint8Array>> {
    return {
      ok: false,
      code: "SIMULATION_ONLY",
      message: `Sector reads are disabled for "${deviceId}" until a tested native backend is connected.`
    };
  }
}

export const driveLabBackend: DriveLabBackend = new MockDriveLabBackend();
