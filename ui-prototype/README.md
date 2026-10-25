# Begate Drive Lab — UI Prototype

A professional dark-blue desktop-style interface prototype for the Begate HDD diagnostics and data recovery project.

## Run locally

Requires Node.js 20 or later.

```bash
cd ui-prototype
npm install
npm run dev
```

Build with `npm run build`.

## Included

- Workspace dashboard and device connection status
- Searchable manufacturer and family explorer
- Capability-profile placeholders
- Data-extraction workspace and sector-map visual
- Firmware lab placeholder, event log, and settings
- Read-only safety messaging

## Important

This is a **UI-only prototype**. It does not connect to a SATA controller, issue ATA or vendor-specific commands, read ROM or service-area modules, or perform recovery. Profiles and capabilities are mock data, not verified hardware support.

Next milestone: agree on the vendor SDK contract and implement a typed backend interface. Only confirmed SDK capabilities should be enabled. Keep firmware writes disabled until backup, confirmation, logging, and recovery safeguards are implemented and tested.
