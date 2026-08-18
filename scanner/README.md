# LaptopTruth Scanner — Complete File Guide

## What Files Exist and What Each One Does

```
laptop/
├── public/
│   ├── LaptopTruthScanner.bat   ← DOUBLE-CLICK THIS to scan (just a launcher)
│   └── LaptopTruthScanner.ps1   ← The actual scanner code (PowerShell)
│
└── scanner/
    ├── LaptopTruthScanner.cs    ← C# version of the scanner (source code only)
    ├── LaptopTruthScanner.csproj← C# project config (needed to compile)
    └── README.md                ← This file
```

---

## File 1: `public/LaptopTruthScanner.bat`

**What it is:** A simple launcher script. Its only job is to start the PowerShell file.

**How to run:** Double-click it. For best results: Right-click → Run as Administrator.

**Does it depend on the .cs file?** NO. It only calls the `.ps1` file.

**Why does it exist?** Because Windows users can double-click a `.bat` file easily.
PowerShell files sometimes have execution policy restrictions that prevent direct running.
The BAT file bypasses those restrictions automatically.

---

## File 2: `public/LaptopTruthScanner.ps1`

**What it is:** The ACTUAL scanner. Contains all hardware reading logic:
- Reads BIOS/SMBIOS serial number and model
- Reads System SKU to identify exact model (e.g. ThinkPad Yoga 260)
- Reads RAM modules and slot count from Win32_PhysicalMemoryArray
- Reads SSD health via Get-StorageReliabilityCounter (SMART data)
- Reads battery health via root\WMI BatteryStaticData + BatteryFullChargedCapacity
- Reads GPU, CPU, Display, Windows license status
- Uploads JSON fingerprint to Next.js API

**Can you run it directly?** YES — but you need Admin rights:
Right-click → Open with PowerShell (as Administrator)

**Does it depend on the .cs file?** NO. Completely independent.

---

## File 3: `scanner/LaptopTruthScanner.cs`

**What it is:** A C# language version of the same scanner. C# has slightly deeper
hardware access than PowerShell and produces a native Windows EXE.

**Can you run it directly?** NO. A `.cs` file is SOURCE CODE — like a cooking recipe.
You cannot eat a recipe. You must first COOK it (compile it) to get food (an EXE).

**Does the BAT or PS1 depend on it?** NO. They are completely separate implementations.

**How to compile it into a runnable EXE:**

Step 1: Install .NET 8 SDK (free from Microsoft):
   https://dotnet.microsoft.com/download/dotnet/8.0

Step 2: Open PowerShell/CMD in the `scanner/` folder:
   ```
   cd C:\Users\anzamuneebkhan\Desktop\chat_bot\laptop\scanner
   ```

Step 3: Build the EXE:
   ```
   dotnet publish -c Release -r win-x64 --self-contained true
   ```

Step 4: Find your EXE at:
   ```
   scanner\bin\Release\net8.0-windows\win-x64\publish\LaptopTruthScanner.exe
   ```

Step 5: Run it as Administrator.

---

## Which One Should You Use TODAY?

| You want to... | Use this file | Command |
|---|---|---|
| Scan a laptop right now | `public/LaptopTruthScanner.bat` | Double-click → Run as Admin |
| Scan via PowerShell directly | `public/LaptopTruthScanner.ps1` | Right-click → Run as Admin |
| Get a standalone EXE (requires .NET SDK) | `scanner/LaptopTruthScanner.cs` | `dotnet publish` then run EXE |

**Recommended: Use the BAT file.** It requires zero installation and works on any Windows 10/11 machine.

---

## Why Two Implementations (PS1 and CS)?

| Feature | PowerShell (.ps1) | C# (.cs → .exe) |
|---|---|---|
| Installation needed | None (built into Windows) | .NET SDK to compile |
| Run on any machine | Yes, immediately | Yes, after compiling as self-contained EXE |
| Hardware access | Very good (WMI, ACPI) | Excellent (WMI + P/Invoke + IOCTL) |
| SMART data | Via Get-StorageReliabilityCounter | Via Win32_DiskDrive WMI |
| Readable/editable | Yes (plain text) | Yes (plain text, but needs IDE) |
| Best for | Quick testing, development | Final product distribution |

---

## How the Scan Works (Both Methods)

```
Your Laptop
    │
    │ [Administrator PowerShell or EXE]
    ▼
Reads Hardware via Windows WMI / ACPI:
  • BIOS Serial Number, Model Code, System SKU → identifies exact model
  • Win32_Processor → CPU model, cores, speed
  • Win32_PhysicalMemoryArray → total RAM slot count
  • Win32_PhysicalMemory → installed RAM modules
  • Get-StorageReliabilityCounter → SSD health %, hours, TBW
  • root\WMI BatteryStaticData → battery design capacity (mWh)
  • root\WMI BatteryFullChargedCapacity → current max charge (mWh)
  • root\WMI BatteryCycleCount → charge cycles
  • Win32_VideoController → GPU model, VRAM
  • SoftwareLicensingProduct → Windows activation status
    │
    │ [HTTP POST as JSON]
    ▼
Next.js API: /api/scan/upload
    │
    ├── Matches model to spec database (max RAM, slot count, charger wattage, Pakistan price)
    ├── Calculates trust score
    ├── Asks AI (Gemini or Groq) to generate human-readable verdict
    │
    ▼
Report page: http://localhost:3000/report/[scanId]
Shows: battery health, RAM slots, SSD SMART, GPU, Pakistan market price, red flags
```
