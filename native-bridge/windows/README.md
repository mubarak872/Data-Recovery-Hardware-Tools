# Windows Native Bridge Skeleton

This folder documents the future Windows-native boundary between Begate Drive Lab and the hardware supplier SDK. It currently performs no physical disk I/O and contains no vendor commands.

## Next integration step

Request the supplier's official Windows SDK, DLL and header, driver requirements, supported Windows versions, port enumeration and device identification APIs, error codes, timeout behavior, and redistribution license. Implement an adapter only against the documented SDK.

The application must remain in simulation mode until the vendor SDK is installed and the physical controller is verified. Firmware writes are outside the first milestone.