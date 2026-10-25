import { familyProfiles } from "./capabilities";
import type { BackendStatus, DeviceInfo, DriveLabBackend, OperationResult } from "./types";

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
