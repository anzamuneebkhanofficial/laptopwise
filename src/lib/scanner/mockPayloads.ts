import { RawFingerprint } from "@/types";

export interface MockScenario {
  id: string;
  name: string;
  badge: string;
  description: string;
  askingPricePKR: number;
  fingerprint: RawFingerprint;
}

export const MOCK_SCENARIOS: MockScenario[] = [
  {
    id: "genuine_thinkpad_t480",
    name: "Genuine Lenovo ThinkPad T480",
    badge: "High Trust (95%)",
    description: "Clean machine with original 65W USB-C charger, dual-channel RAM, and clean Samsung OEM NVMe drive.",
    askingPricePKR: 78000,
    fingerprint: {
      cpu: {
        model: "Intel(R) Core(TM) i5-8350U CPU @ 1.70GHz",
        cores: 4,
        threads: 8,
        baseClockGHz: 1.9,
      },
      ram: [
        { manufacturer: "Samsung", partNumber: "M471A1K43CB1-CTD", capacityGB: 8, speedMHz: 2400, channel: "dual" },
        { manufacturer: "Samsung", partNumber: "M471A1K43CB1-CTD", capacityGB: 8, speedMHz: 2400, channel: "dual" },
      ],
      storage: [
        {
          type: "NVMe",
          manufacturer: "Samsung",
          model: "SAMSUNG MZVLB512HAHQ-000L7 (PM981)",
          firmware: "EXD7201Q",
          capacityGB: 512,
          vendorId: "144D", // Authentic Samsung PCI Vendor ID
          smart: {
            powerOnHours: 1420,
            totalBytesWrittenGB: 12450,
            wearPercent: 96,
            hasConsistentFields: true,
          },
        },
      ],
      battery: {
        designCapacityMWh: 48000,
        fullChargeCapacityMWh: 44200,
        cycleCount: 142,
        manufacturer: "SANYO",
        modelString: "01AV423",
      },
      adapter: {
        reportedWattageW: 65,
        idString: "Lenovo 65W USB-C PD Adapter",
      },
      display: {
        resolution: "1920x1080",
        refreshHz: 60,
        panelString: "LEN40A0 (N140HCA-EAC)",
      },
      bios: {
        version: "N24ET65W (1.40)",
        date: "04/12/2022",
        serialNumber: "PF19X82K",
        oemLock: false,
        systemModel: "ThinkPad T480",
        systemBrand: "Lenovo",
      },
      windows: {
        edition: "Windows 11 Pro 64-bit",
        activationStatus: "Activated (Digital License)",
        buildNumber: "22631",
      },
      scannedAtISO: new Date().toISOString(),
    },
  },
  {
    id: "suspect_hp_elitebook_840_g5",
    name: "Suspect HP EliteBook 840 G5 (Counterfeit SSD Alert)",
    badge: "Flagged (55%)",
    description: "Contains a fake Samsung NVMe SSD drive with mismatched PCI vendor ID and a suspicious 0-cycle battery on a 6-year-old laptop.",
    askingPricePKR: 82000,
    fingerprint: {
      cpu: {
        model: "Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz",
        cores: 4,
        threads: 8,
        baseClockGHz: 1.8,
      },
      ram: [
        { manufacturer: "Kingston", partNumber: "KVR24S17S8/8", capacityGB: 8, speedMHz: 2400, channel: "single" },
      ],
      storage: [
        {
          type: "NVMe",
          manufacturer: "Samsung",
          model: "SAMSUNG 980 PRO 1TB", // Mismatched fake drive firmware combo
          firmware: "1B2Q1234",
          capacityGB: 1024,
          vendorId: "1234", // Mismatched Vendor ID (Not 144D)
          smart: {
            powerOnHours: 12,
            totalBytesWrittenGB: 50,
            wearPercent: 100,
            hasConsistentFields: false,
          },
        },
      ],
      battery: {
        designCapacityMWh: 50000,
        fullChargeCapacityMWh: 50000,
        cycleCount: 0, // Suspicious on 2018 laptop
        manufacturer: "Generic_BMS",
        modelString: "SS03XL_CLONE",
      },
      adapter: {
        reportedWattageW: 65,
        idString: "HP 65W Smart AC Adapter",
      },
      display: {
        resolution: "1920x1080",
        refreshHz: 60,
        panelString: "AUO303D",
      },
      bios: {
        version: "Q78 Ver. 01.18.00",
        date: "11/05/2021",
        serialNumber: "5CG8420XYZ",
        oemLock: false,
        systemModel: "HP EliteBook 840 G5",
        systemBrand: "HP",
      },
      windows: {
        edition: "Windows 10 Pro 64-bit",
        activationStatus: "Activated (KMS)",
        buildNumber: "19045",
      },
      scannedAtISO: new Date().toISOString(),
    },
  },
  {
    id: "underpowered_charger_dell_5490",
    name: "Dell Latitude 5490 (Underpowered Charger)",
    badge: "Warning (70%)",
    description: "Connected to a 45W slim charger instead of the required 65W/90W adapter, triggering wattage warning.",
    askingPricePKR: 72000,
    fingerprint: {
      cpu: {
        model: "Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz",
        cores: 4,
        threads: 8,
        baseClockGHz: 2.1,
      },
      ram: [
        { manufacturer: "SK Hynix", partNumber: "HMA81GS6CJR8N-VK", capacityGB: 16, speedMHz: 2400, channel: "single" },
      ],
      storage: [
        {
          type: "NVMe",
          manufacturer: "SK Hynix",
          model: "SKhynix_HFS512GD9TNG-L2A0A",
          firmware: "80002C00",
          capacityGB: 512,
          vendorId: "1C5C",
          smart: {
            powerOnHours: 2800,
            totalBytesWrittenGB: 18400,
            wearPercent: 88,
            hasConsistentFields: true,
          },
        },
      ],
      battery: {
        designCapacityMWh: 68000,
        fullChargeCapacityMWh: 51000,
        cycleCount: 285,
        manufacturer: "DELL",
        modelString: "GJKNX",
      },
      adapter: {
        reportedWattageW: 45, // Underpowered for Latitude 5490 65W spec
        idString: "Dell 45W Barrel Adapter",
      },
      display: {
        resolution: "1920x1080",
        refreshHz: 60,
      },
      bios: {
        version: "1.25.0",
        date: "01/10/2023",
        serialNumber: "8HG7TX2",
        oemLock: false,
        systemModel: "Latitude 5490",
        systemBrand: "Dell",
      },
      windows: {
        edition: "Windows 11 Pro 64-bit",
        activationStatus: "Activated (OEM key)",
        buildNumber: "22631",
      },
      scannedAtISO: new Date().toISOString(),
    },
  },
];
