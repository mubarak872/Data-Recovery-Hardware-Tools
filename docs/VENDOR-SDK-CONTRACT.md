# Vendor SDK Integration Contract

## Purpose

Define the boundary between Begate Drive Lab's React UI and the supplier's Windows hardware SDK. This is a proposed integration contract, not a claim that a particular vendor already exposes these functions.

## Required vendor deliverables

- Hardware revision and supported interface/port matrix.
- Windows driver package and supported Windows versions.
- Native DLL plus C header and import library, if applicable.
- SDK version API and documented thread-safety rules.
- API reference, error-code list, timeout/cancellation behavior, and sample application.
- Device identification fields and a capability query per detected device/family.
- Read-only test firmware/drive matrix and reproducible test results.
- Commercial redistribution/licensing terms and a written support/update policy.

## Integration boundary

The React renderer must not call native DLLs directly. Use a typed adapter:

`React UI → typed DriveLabBackend → native bridge → vendor SDK DLL/driver → controller → drive`

The native bridge can be a C#/.NET or C++ process/service. The exact choice depends on the vendor SDK ABI, driver requirements, and whether operations need dedicated threads.

## Initial interface

The TypeScript interface lives in `src/backend/types.ts`. The first native implementation should cover only:

1. SDK version and bridge health.
2. Hardware port enumeration.
3. Device presence and ATA IDENTIFY information.
4. Read-only SMART/log access where explicitly supported.
5. Capability discovery and structured diagnostics.
6. Read-only sector imaging only after timeout, cancellation, retry, and destination handling are tested.

Do not assume that ROM, terminal, service-area, head-map, or vendor-specific commands are available just because the UI has a place for them. Enable a control only when the active SDK explicitly reports support for that device and operation.

## Error model

Every native call must return a structured result with a stable code and human-readable message. At minimum distinguish invalid arguments, bridge not initialized, device not found, unsupported capability, timeout, busy, I/O error, cancellation, permission failure, and vendor SDK internal error.

Never silently convert a failed hardware call into a successful empty result.

## Safety requirements

- Default to read-only operation.
- Do not expose firmware-write functions in the first integration milestone.
- Validate LBA ranges, sector count, integer overflow, and output buffer sizes before issuing reads.
- Serialize operations per port unless the vendor explicitly documents safe concurrency.
- Provide cancellation and bounded timeouts.
- Log timestamps, device identity, operation name, duration, status, and SDK error code. Avoid logging customer data.
- Keep ROM/service-area backup and explicit confirmation requirements for any future write-capable milestone.
- Test only on sacrificial drives, never on the workstation's operating-system disk.

## Acceptance checklist

- [ ] Vendor supplies SDK and documentation.
- [ ] SDK version and hardware revision are displayed in the UI.
- [ ] Physical devices are not listed unless the bridge actually detects them.
- [ ] Unsupported capabilities remain disabled with a reason.
- [ ] Failed operations show the real error code and never appear successful.
- [ ] Read-only tests pass on a known-good sacrificial drive.
- [ ] Timeout, disconnect, cancellation, and device-busy cases are tested.
- [ ] Sector imaging is verified against a known test image before broader testing.
