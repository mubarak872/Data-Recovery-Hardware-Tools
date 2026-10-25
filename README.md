# Data Recovery Hardware Tools

Project brief for a firmware-level HDD data recovery tool in the class of PC-3000, MRT and DFL. Begate's existing software already recovers deleted and formatted data at the file-system level. This project adds hardware-level access to the drive's firmware: the Service Area (SA), RAM/buffer, ROM, head map and translator.

This repository holds the plan and the reference material. The code is not in it yet.

## Core idea

Most of the value in professional recovery tools is a library of per-family firmware knowledge. The hardware underneath is fairly ordinary: power control, a SATA host and a serial terminal. So the product is built in thin layers, and one drive family is added at a time.

## Access levels, shallow to deep

| Level | What you reach | How |
| --- | --- | --- |
| 1. Standard ATA | User data, SMART, logs, IDENTIFY | Normal ATA commands via passthrough |
| 2. Vendor-Specific Commands (VSC) | SA modules, RAM/buffer, ROM, head map, defect lists | Undocumented, vendor-specific command sets |
| 3. Diagnostic terminal (UART) | Firmware monitor: heads, SA, buffer, defects | 3.3V TTL serial on the drive's terminal pins (Seagate F3 style) |
| 4. ROM / PCB | Adaptives, firmware loader, config | VSC ROM read, or reading the SPI flash chip with a programmer |
| 5. Loader / RAM-boot | Running a drive whose SA is damaged | Load firmware into RAM, then repair SA modules |

The existing Begate software works at Level 1. This product lives at Levels 2 to 5.

## Hardware plan

### Phase 1: prototype with off-the-shelf parts
- A test PC with the target drive on a non-boot SATA port.
- A 3.3V USB-UART adapter (CP2102 or CH340) for terminal access.
- A controllable 5V/12V supply, switched by a relay or MOSFET from an Arduino or STM32, with current sensing (INA219/INA226). It handles power cycling and reads current to spot spin-up problems, clicking or a stuck motor.

### Phase 2: our own SATA host (vendor builds)
- The OS AHCI driver resets the port when a drive hangs busy, and then the tool loses control of the drive.
- Professional tools use their own SATA controller, so they control timeouts, resets, PIO vs DMA, and reading through errors.
- The route is an FPGA board with SATA-capable transceivers. An open-source SATA host core (e.g. LiteSATA) is a starting point. The board connects to the PC over USB 3 or PCIe.
- Power control, current sensing and UART go on the same board, so one device does everything.

## Software architecture

```
┌─────────────────────────────────────────────┐
│ UI / Product (head-aware imager, wizards)   │
├─────────────────────────────────────────────┤
│ Family plugins: Seagate F3 | WD ROYL |      │
│ Toshiba | HGST ...  (one at a time)         │
│  identify family · ROM · SA modules · RAM   │
│  head map · defect lists · translator       │
├─────────────────────────────────────────────┤
│ Protocol: ATA command builder, VSC sessions,│
│ terminal parser, error decoder              │
├─────────────────────────────────────────────┤
│ Transport: OS passthrough (Phase 1) →       │
│ own FPGA host (Phase 2) · UART · power      │
└─────────────────────────────────────────────┘
```

Define the transport as an interface from day one. Phase 1 code then keeps working when the FPGA host replaces the OS driver.

### Safety rules (build in from the start)
- Never touch the disk that holds the operating system.
- Read-only by default. Writes to SA or ROM need an explicit unlock, confirmed with the drive's serial number.
- Back up ROM and all SA modules automatically before any write.
- Log every command and every raw response. That log becomes the reverse-engineering record.

## Roadmap

1. **Baseline:** read-only tool for IDENTIFY, SMART, GP logs and SCT status on the test drive, with full command logging.
2. **First family: Seagate F3** (matches the test drive, see [docs/test-drive.md](docs/test-drive.md)). Buy 5 to 10 cheap used drives of the same family as test subjects.
3. **Level 2/3 access for that family:** ROM, SA module directory, module reads, head map.
4. **Head-aware imager:** imaging per head, skipping bad areas, with timeout control and handling for a degraded head. This is the feature customers pay for.
5. **Write operations:** defect list edits, head disabling, translator regeneration, module repair, loader-based boot.
6. **Phase 2 hardware** with the vendor, then the second drive family.

## Cautions

- **IP:** reverse-engineering drive firmware for interoperability is standard practice. Do not copy ACE Lab, MRT or DFL software, loaders or databases. Collect loaders and modules from your own donor drives.
- **Expect research:** most drive families have little public documentation. Each family takes months of command-level work, and that knowledge is the product's value.
