# Test drive

Source: Hard Disk Sentinel 6.30 report, 2026-10-25, test PC DESKTOP-MBUQSK9.

## Disk #0: test drive (target)

| Item | Value |
| --- | --- |
| Model | ST500VT000-1DK142 (Seagate "Video 2.5", DVR/CCTV line) |
| Firmware | 0001SDC2 |
| Serial | W3P3X1KD |
| Family | Seagate F3 architecture (confirm exact family from the terminal boot banner) |
| Capacity | 500 GB, 122,096,646 sectors |
| Sector size | Reports **4096 bytes per sector**. Tools must read the sector size from IDENTIFY and never assume 512. |
| Mechanics | 1 platter, **2 heads**, 5400 RPM, 2.5" |
| Buffer | 16 MB |
| Interface | SATA II (3 Gb/s), NCQ, SCT Command Transport supported |
| Health | 98%: 0 reallocated, 0 pending, **175 reported uncorrectable** (SMART 187), 3 command timeouts |
| Power-on | ~768 days |
| Windows disk | `\\.\PhysicalDrive0`, volumes D: (empty) and E: (~64 GB used) |

Why it suits a first family: Seagate F3 drives expose a diagnostic terminal over serial (Level 3). With only 2 heads the head map is simple to check, and the error history gives real data for testing the error handling.

Before any write-stage work, back up the data on E:.

## Disk #1: system disk (never target)

| Item | Value |
| --- | --- |
| Model | WD Green 2.5" 240 GB SSD (SanDisk Z400 controller) |
| Windows disk | `\\.\PhysicalDrive1`, holds C: (Windows) |

Every tool must refuse this disk.

## Terminal access (hardware to buy)

- 3.3V USB-UART adapter (CP2102 or CH340 with 3.3V logic).
- Wiring: adapter TX → drive RX, adapter RX → drive TX, GND → GND. Do not connect the adapter's power pin.
- Usual Seagate setting: 38400 baud, 8N1. Ctrl+Z normally gives the `F3 T>` prompt.
