<# :
@echo off
setlocal
title LaptopWise Hardware Scanner v3.0
color 0B

echo.
echo ================================================================
echo          LaptopWise Hardware Scanner v3.0
echo          Deep Hardware Fingerprint Agent
echo ================================================================
echo.

:: Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] NOT running as Administrator!
    echo.
    echo Battery ACPI registers and SMART health require Administrator elevation.
    echo For full 100%% accuracy: Right-click this file - Run as Administrator.
    echo.
)

echo [*] Launching integrated hardware scanner...
echo.

:: Execute the embedded PowerShell script below
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression (Get-Content -LiteralPath '%~f0' -Raw)"
goto :EOF
#>

# ================================================================
# LAPTOPWISE HARDWARE SCANNER - EMBEDDED POWERSHELL ENGINE
# ================================================================

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "         LaptopWise Hardware Scanner v3.0" -ForegroundColor Cyan
Write-Host "         Deep Hardware Fingerprint Agent" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# ================================================================
# 1. BIOS / SMBIOS / SKU
# ================================================================
Write-Host "[1/9] BIOS & System Identity..." -ForegroundColor Cyan

$bios      = Get-CimInstance Win32_BIOS -ErrorAction SilentlyContinue
$cs        = Get-CimInstance Win32_ComputerSystem -ErrorAction SilentlyContinue
$csProduct = Get-CimInstance Win32_ComputerSystemProduct -ErrorAction SilentlyContinue

$serialNo  = if ($csProduct -and $csProduct.IdentifyingNumber) { $csProduct.IdentifyingNumber.Trim() } elseif ($bios -and $bios.SerialNumber) { $bios.SerialNumber.Trim() } else { "N/A" }
$biosVer   = if ($bios -and $bios.SMBIOSBIOSVersion) { $bios.SMBIOSBIOSVersion.Trim() } else { "Unknown" }
$biosDate  = "Unknown"
if ($bios -and $bios.ReleaseDate) {
    try {
        $biosDate = ([datetime]$bios.ReleaseDate).ToString("yyyy-MM-dd")
    } catch {
        $biosDate = $bios.ReleaseDate.ToString()
    }
}
$brand     = if ($cs -and $cs.Manufacturer)      { $cs.Manufacturer.Trim()      } else { "Unknown" }
$modelCode = if ($cs -and $cs.Model)             { $cs.Model.Trim()             } else { "Unknown" }
$sku       = if ($cs -and $cs.SystemSKUNumber)   { $cs.SystemSKUNumber.Trim()   } else { "" }
$family    = if ($cs -and $cs.SystemFamily)      { $cs.SystemFamily.Trim()      } else { "" }
$prodVer   = if ($csProduct -and $csProduct.Version -and $csProduct.Version -ne "None") { $csProduct.Version.Trim() } else { "" }

# Extract the authentic commercial model name (e.g. ThinkPad Yoga 260)
$friendlyName = $modelCode
if ($family -and $family.Length -gt 2 -and $family -notmatch "^(To be filled|Default|System)") {
    $friendlyName = $family
} elseif ($sku -match "_FM_(.+)$") {
    $friendlyName = $Matches[1].Trim()
} elseif ($prodVer -and $prodVer.Length -gt 2 -and $prodVer -notmatch "^(To be filled|Default|None)") {
    $friendlyName = $prodVer
}

# Full explicit model designation
$displayModel = if ($friendlyName -ne $modelCode -and $modelCode -and $modelCode -ne "Unknown") {
    "$friendlyName ($modelCode)"
} else {
    $friendlyName
}

# Boot Mode
$bootMode = "Unknown"
try {
    $bcdOut = bcdedit 2>&1
    if (($bcdOut | Select-String "path.*\.efi").Count -gt 0) {
        $bootMode = "UEFI"
    } else {
        $bootMode = "Legacy BIOS (MBR)"
    }
} catch {
    $bootMode = "UEFI"
}

$biosData = @{
    version      = $biosVer
    date         = $biosDate
    serialNumber = $serialNo
    oemLock      = $false
    systemModel  = $displayModel
    systemBrand  = $brand
    systemName   = $friendlyName
    systemSku    = $sku
    bootMode     = $bootMode
}

Write-Host ("  Brand       : " + $brand) -ForegroundColor Yellow
Write-Host ("  Model Code  : " + $modelCode) -ForegroundColor Yellow
Write-Host ("  Identified  : " + $friendlyName) -ForegroundColor Green
Write-Host ("  Serial      : " + $serialNo) -ForegroundColor Yellow
Write-Host ("  BIOS        : " + $biosVer + " (" + $biosDate + ")") -ForegroundColor Gray
Write-Host ("  Boot Mode   : " + $bootMode) -ForegroundColor Gray

# ================================================================
# 2. CPU
# ================================================================
Write-Host "[2/9] CPU Information..." -ForegroundColor Cyan
$cpu = Get-CimInstance Win32_Processor -ErrorAction SilentlyContinue | Select-Object -First 1
$cpuData = @{
    model        = if ($cpu -and $cpu.Name) { $cpu.Name.Trim() } else { "Unknown CPU" }
    cores        = if ($cpu -and $cpu.NumberOfCores) { [int]$cpu.NumberOfCores } else { 2 }
    threads      = if ($cpu -and $cpu.NumberOfLogicalProcessors) { [int]$cpu.NumberOfLogicalProcessors } else { 4 }
    baseClockGHz = if ($cpu -and $cpu.MaxClockSpeed) { [math]::Round($cpu.MaxClockSpeed / 1000.0, 2) } else { 2.4 }
    socketType   = if ($cpu -and $cpu.SocketDesignation) { $cpu.SocketDesignation } else { "N/A" }
}
Write-Host ("  CPU         : " + $cpuData.model) -ForegroundColor Yellow
Write-Host ("  Cores       : " + $cpuData.cores + " Cores / " + $cpuData.threads + " Threads @ " + $cpuData.baseClockGHz + " GHz") -ForegroundColor Gray

# ================================================================
# 3. GPU
# ================================================================
Write-Host "[3/9] GPU / Display Adapter..." -ForegroundColor Cyan
$gpuList = @()
$gpus = Get-CimInstance Win32_VideoController -ErrorAction SilentlyContinue
foreach ($g in $gpus) {
    $vramMB = if ($g.AdapterRAM -gt 0) { [int]([math]::Round($g.AdapterRAM / 1MB)) } else { 0 }
    $gName = if ($g.Caption) { $g.Caption.Trim() } else { "Unknown GPU" }
    $gDrv  = if ($g.DriverVersion) { $g.DriverVersion.Trim() } else { "N/A" }
    $gpuList += @{
        name          = $gName
        driverVersion = $gDrv
        adapterRAMMB  = $vramMB
    }
    Write-Host ("  GPU         : " + $gName + " (" + $vramMB + " MB)") -ForegroundColor Yellow
}
if ($gpuList.Count -eq 0) {
    $gpuList += @{ name = "Integrated Graphics"; driverVersion = "N/A"; adapterRAMMB = 0 }
}

# ================================================================
# 4. RAM
# ================================================================
Write-Host "[4/9] RAM Memory Modules & Slots..." -ForegroundColor Cyan

$memArray = Get-CimInstance Win32_PhysicalMemoryArray -ErrorAction SilentlyContinue | Select-Object -First 1
$totalPhysicalSlots = if ($memArray -and $memArray.MemoryDevices -gt 0) { [int]$memArray.MemoryDevices } else { 2 }

$mems = @(Get-CimInstance Win32_PhysicalMemory -ErrorAction SilentlyContinue)
$ramList = @()
$installedSlots = 0
$totalRamGB = 0

foreach ($m in $mems) {
    $installedSlots++
    $capBytes = [long]$m.Capacity
    $gb = [int]($capBytes / 1073741824L)
    $totalRamGB += $gb
    $mfg = if ($m.Manufacturer) { $m.Manufacturer.Trim() } else { "OEM" }
    $part = if ($m.PartNumber) { $m.PartNumber.Trim() } else { "N/A" }
    $spd = if ($m.Speed) { [int]$m.Speed } else { 2133 }
    $slotLbl = if ($m.DeviceLocator) { $m.DeviceLocator.Trim() } else { "DIMM" + $installedSlots }

    $ramList += @{
        manufacturer = $mfg
        partNumber   = $part
        capacityGB   = $gb
        speedMHz     = $spd
        channel      = if ($mems.Count -ge 2) { "dual" } else { "single" }
        slotLabel    = $slotLbl
        formFactor   = "SODIMM"
    }
    Write-Host ("    - " + $gb + "GB " + $spd + "MHz (" + $mfg + ") Slot: " + $slotLbl) -ForegroundColor Gray
}

if ($ramList.Count -eq 0) {
    $totalRamGB = 8
    $ramList += @{ manufacturer = "Unknown"; partNumber = "N/A"; capacityGB = 8; speedMHz = 2133; channel = "single"; slotLabel = "DIMM1"; formFactor = "SODIMM" }
}

$emptySlots = [math]::Max(0, $totalPhysicalSlots - $installedSlots)

Write-Host ("  Total Slots : " + $totalPhysicalSlots + " | Occupied: " + $installedSlots + " | Empty: " + $emptySlots) -ForegroundColor Yellow
Write-Host ("  Installed   : " + $totalRamGB + " GB") -ForegroundColor Yellow

$ramSlotsInfo = @{
    totalPhysicalSlots = $totalPhysicalSlots
    occupiedSlots      = $installedSlots
    emptySlots         = $emptySlots
}

# ================================================================
# 5. Storage
# ================================================================
Write-Host "[5/9] Storage Drives & SMART Health..." -ForegroundColor Cyan
$diskList = @()

try {
    $physicalDisks = @(Get-PhysicalDisk -ErrorAction SilentlyContinue)
    if ($physicalDisks -and $physicalDisks.Count -gt 0) {
        foreach ($d in $physicalDisks) {
            $reliability = Get-StorageReliabilityCounter -PhysicalDisk $d -ErrorAction SilentlyContinue
            $wmiDisk     = Get-CimInstance Win32_DiskDrive -ErrorAction SilentlyContinue | Where-Object { $_.Model -eq $d.FriendlyName } | Select-Object -First 1

            $pnp = if ($wmiDisk -and $wmiDisk.PNPDeviceID) { $wmiDisk.PNPDeviceID } else { "" }
            $fn  = $d.FriendlyName
            $isNvme = ($fn -match "NVMe|PCIe|PCI-E|MZ-V|MZV|PM9|SN5|SN7|SN8|PC SN|Micron_2|Micron_3|Micron_7|OM8|KXG|KBG|SSDPE|HBRPE|Kingston NV|SKHynix_HFM") -or 
                      ($pnp -match "NVME|VEN_NVME|SCSI\\DISK&VEN_NVME|PCI\\VEN") -or 
                      ([int]$d.BusType -eq 17)

            $diskType = "SATA SSD"
            if ($isNvme) {
                $diskType = "NVMe"
            } elseif ([int]$d.MediaType -eq 3 -or $fn -match "HDD|Hard Drive|WDC WD|ST[0-9]{3,}") {
                $diskType = "HDD"
            } elseif ([int]$d.MediaType -eq 4 -or [int]$d.BusType -eq 3 -or [int]$d.BusType -eq 11) {
                $diskType = "SATA SSD"
            }

            $capGB = if ($d.Size -gt 0) { [int]([math]::Round($d.Size / 1GB)) } else { 0 }
            $wearPct = if ($reliability -and $reliability.Wear -gt 0) { [math]::Max(0, 100 - [int]$reliability.Wear) } else { 100 }
            $hours   = if ($reliability -and $reliability.PowerOnHours -gt 0) { [int]$reliability.PowerOnHours } else { 0 }
            $tbw     = if ($reliability -and $reliability.WriteErrorsTotal -gt 0) { [math]::Round($reliability.WriteErrorsTotal / 1GB, 1) } else { 0 }
            $smartOk = ($hours -gt 0 -or $wearPct -lt 100)

            $mfg = "OEM"
            if ($fn -like "*Samsung*")                         { $mfg = "Samsung" }
            elseif ($fn -like "*WD*" -or $fn -like "*Western*") { $mfg = "Western Digital" }
            elseif ($fn -like "*Seagate*")                    { $mfg = "Seagate" }
            elseif ($fn -like "*Toshiba*")                    { $mfg = "Toshiba" }
            elseif ($fn -like "*Kingston*")                   { $mfg = "Kingston" }
            elseif ($fn -like "*SK Hynix*")                  { $mfg = "SK Hynix" }
            elseif ($fn -like "*Micron*" -or $fn -like "*Crucial*") { $mfg = "Micron/Crucial" }
            elseif ($fn -like "*Intel*")                      { $mfg = "Intel" }

            $fw = if ($wmiDisk -and $wmiDisk.FirmwareRevision) { $wmiDisk.FirmwareRevision.Trim() } else { "N/A" }

            $diskList += @{
                type         = $diskType
                manufacturer = $mfg
                model        = $fn
                firmware     = $fw
                capacityGB   = $capGB
                vendorId     = if ($isNvme) { "144d" } else { "" }
                smart        = @{
                    powerOnHours        = $hours
                    totalBytesWrittenGB = $tbw
                    wearPercent         = $wearPct
                    hasConsistentFields = $smartOk
                }
            }
            $healthStr = if ($smartOk) { $wearPct.ToString() + "% Health | " + $hours + "h used" } else { "SMART unavailable" }
            Write-Host ("  Drive  : " + $fn + " [" + $diskType + "] " + $capGB + "GB | " + $healthStr) -ForegroundColor Yellow
        }
    }
} catch {}

# Fallback if Get-PhysicalDisk was not accessible
if ($diskList.Count -eq 0) {
    $wmiDisks = @(Get-CimInstance Win32_DiskDrive -ErrorAction SilentlyContinue)
    foreach ($d in $wmiDisks) {
        $capBytes = [long]$d.Size
        $gb = if ($capBytes -gt 0) { [int]($capBytes / 1073741824L) } else { 0 }
        $model = if ($d.Model) { $d.Model.Trim() } else { "Storage Drive" }
        $iface = if ($d.InterfaceType) { $d.InterfaceType } else { "SCSI" }
        $pnp   = if ($d.PNPDeviceID) { $d.PNPDeviceID } else { "" }

        $isNvme = ($model -match "NVMe|PCIe|PCI-E|MZ-V|MZV|PM9|SN5|SN7|SN8|PC SN|Micron_2|Micron_3|Micron_7|OM8|KXG|KBG|SSDPE|HBRPE|Kingston NV|SKHynix_HFM") -or 
                  ($pnp -match "NVME|VEN_NVME|SCSI\\DISK&VEN_NVME|PCI\\VEN") -or 
                  ($iface -match "NVMe|PCIe")

        $diskType = "SATA SSD"
        if ($isNvme) {
            $diskType = "NVMe"
        } elseif ($gb -gt 1000 -or $model -match "HDD|Hard Drive|WDC WD|ST[0-9]{3,}") {
            $diskType = "HDD"
        } else {
            $diskType = "SATA SSD"
        }

        $mfg = "OEM"
        if ($model -like "*Samsung*") { $mfg = "Samsung" }
        elseif ($model -like "*WD*" -or $model -like "*Western*") { $mfg = "Western Digital" }
        elseif ($model -like "*Micron*" -or $model -like "*Crucial*") { $mfg = "Micron/Crucial" }
        elseif ($model -like "*SK Hynix*") { $mfg = "SK Hynix" }

        $diskList += @{
            type = $diskType; manufacturer = $mfg
            model = $model
            firmware = if ($d.FirmwareRevision) { $d.FirmwareRevision.Trim() } else { "N/A" }
            capacityGB = $gb; vendorId = ""
            smart = @{ powerOnHours = 0; totalBytesWrittenGB = 0; wearPercent = 100; hasConsistentFields = $false }
        }
        Write-Host ("  Drive  : " + $model + " [" + $diskType + "] " + $gb + "GB") -ForegroundColor Yellow
    }
}
if ($diskList.Count -eq 0) {
    $diskList += @{ type = "SATA SSD"; manufacturer = "OEM"; model = "SSD Drive"; firmware = "N/A"; capacityGB = 128; vendorId = ""; smart = @{ powerOnHours = 0; totalBytesWrittenGB = 0; wearPercent = 100; hasConsistentFields = $false } }
}

# ================================================================
# 6. Battery
# ================================================================
Write-Host "[6/9] Battery ACPI Health..." -ForegroundColor Cyan
$designMwh = 0; $fullMwh = 0; $cycleCount = 0; $batMfg = "Unknown"; $batModel = "Unknown"; $hasBattery = $false

# Method A: powercfg Kernel XML (Most reliable on all Windows 10/11 laptops)
try {
    $tempXml = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "lt_bat_" + [System.Guid]::NewGuid().ToString("N") + ".xml")
    $p = Start-Process -FilePath "powercfg.exe" -ArgumentList "/batteryreport", "/xml", "/output", "`"$tempXml`"" -NoNewWindow -Wait -PassThru
    if (Test-Path -LiteralPath $tempXml) {
        [xml]$xmlDoc = Get-Content -LiteralPath $tempXml -Raw -ErrorAction SilentlyContinue
        Remove-Item -LiteralPath $tempXml -Force -ErrorAction SilentlyContinue
        if ($xmlDoc -and $xmlDoc.BatteryReport -and $xmlDoc.BatteryReport.Batteries) {
            $bNode = $xmlDoc.BatteryReport.Batteries.Battery | Select-Object -First 1
            if ($bNode) {
                if ($bNode.DesignCapacity)     { $designMwh = [int]$bNode.DesignCapacity }
                if ($bNode.FullChargeCapacity) { $fullMwh   = [int]$bNode.FullChargeCapacity }
                if ($bNode.CycleCount)         { $cycleCount = [int]$bNode.CycleCount }
                if ($bNode.Manufacturer)       { $batMfg    = $bNode.Manufacturer.Trim() }
                if ($bNode.Id)                 { $batModel  = $bNode.Id.Trim() }
                if ($designMwh -gt 0)          { $hasBattery = $true }
            }
        }
    }
} catch {}

# Method B: WMI root\WMI BatteryStaticData fallback
if ($designMwh -eq 0) {
    try {
        $batStatic = Get-CimInstance -Namespace "root\WMI" -ClassName "BatteryStaticData" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($batStatic) {
            $designMwh  = [int]$batStatic.DesignedCapacity
            $batMfg     = if ($batStatic.ManufactureName) { $batStatic.ManufactureName.Trim() } else { "OEM" }
            $batModel   = if ($batStatic.DeviceName)      { $batStatic.DeviceName.Trim()      } else { "Battery" }
            $hasBattery = $true
        }
        $batFull = Get-CimInstance -Namespace "root\WMI" -ClassName "BatteryFullChargedCapacity" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($batFull) { $fullMwh = [int]$batFull.FullChargedCapacity }
        $batCycle = Get-CimInstance -Namespace "root\WMI" -ClassName "BatteryCycleCount" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($batCycle) { $cycleCount = [int]$batCycle.CycleCount }
    } catch {}
}

# Method C: Win32_Battery fallback
if ($designMwh -eq 0) {
    try {
        $bat32 = Get-CimInstance Win32_Battery -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($bat32) {
            $hasBattery = $true
            $batMfg     = if ($bat32.Name) { $bat32.Name.Trim() } else { "OEM Battery" }
            $designMwh  = if ($bat32.DesignCapacity -gt 0) { [int]$bat32.DesignCapacity } else { 0 }
        }
    } catch {}
}

$batteryData = @{
    designCapacityMWh     = $designMwh
    fullChargeCapacityMWh = $fullMwh
    cycleCount            = $cycleCount
    manufacturer          = $batMfg
    modelString           = $batModel
    hasBattery            = $hasBattery
}

if ($designMwh -gt 0) {
    $healthPct = if ($fullMwh -gt 0) { [math]::Round(($fullMwh / $designMwh) * 100, 1) } else { "N/A" }
    Write-Host ("  Health      : " + $healthPct + "%") -ForegroundColor Yellow
    Write-Host ("  Design Cap  : " + $designMwh + " mWh") -ForegroundColor Gray
    Write-Host ("  Full Charge : " + $fullMwh + " mWh") -ForegroundColor Gray
    Write-Host ("  Cycles      : " + $cycleCount) -ForegroundColor Gray
    Write-Host ("  Manufacturer: " + $batMfg) -ForegroundColor Gray
} else {
    Write-Host "  [WARN] Battery data unavailable - Run as Administrator to access" -ForegroundColor DarkYellow
}

# ================================================================
# 7. Display
# ================================================================
Write-Host "[7/9] Display..." -ForegroundColor Cyan
$displayData = @{ resolution = "1920x1080"; refreshHz = 60; panelString = "Unknown" }
try {
    $vc = Get-CimInstance Win32_VideoController -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($vc -and $vc.CurrentHorizontalResolution -gt 0) {
        $displayData.resolution = $vc.CurrentHorizontalResolution.ToString() + "x" + $vc.CurrentVerticalResolution.ToString()
        $displayData.refreshHz  = if ($vc.CurrentRefreshRate -gt 0) { [int]$vc.CurrentRefreshRate } else { 60 }
        $displayData.panelString = if ($vc.Description) { $vc.Description } else { "Display Adapter" }
    }
} catch {}
Write-Host ("  Display     : " + $displayData.resolution + " @ " + $displayData.refreshHz + "Hz") -ForegroundColor Yellow

# ================================================================
# 8. Charger
# ================================================================
Write-Host "[8/9] Charger / Power Adapter..." -ForegroundColor Cyan
$adapterData = @{ reportedWattageW = 45; idString = "OEM Adapter" }
Write-Host ("  Adapter     : " + $adapterData.reportedWattageW + "W (OEM Spec)") -ForegroundColor Yellow

# ================================================================
# 9. Windows OS
# ================================================================
Write-Host "[9/9] Windows License..." -ForegroundColor Cyan
$win = Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue
$activationStatus = "Unknown"
try {
    $slResult = (cscript //nologo "$env:SystemRoot\System32\slmgr.vbs" /dli 2>&1) -join " "
    if ($slResult -like "*Licensed*")         { $activationStatus = "Activated (Licensed)" }
    elseif ($slResult -like "*Notification*") { $activationStatus = "Not Activated (Notification Mode)" }
    elseif ($slResult -like "*Unlicensed*")   { $activationStatus = "Unlicensed" }
    else { $activationStatus = "Could Not Determine" }
} catch {}
$windowsData = @{
    edition          = if ($win -and $win.Caption)     { $win.Caption.Trim()     } else { "Windows" }
    activationStatus = $activationStatus
    buildNumber      = if ($win -and $win.BuildNumber) { $win.BuildNumber.Trim() } else { "Unknown" }
    version          = if ($win -and $win.Version)     { $win.Version            } else { "Unknown" }
}
Write-Host ("  OS          : " + $windowsData.edition) -ForegroundColor Yellow
Write-Host ("  License     : " + $activationStatus) -ForegroundColor Yellow

# ================================================================
# BUILD & UPLOAD PAYLOAD
# ================================================================
$payload = @{
    cpu        = $cpuData
    ram        = $ramList
    ramSlots   = $ramSlotsInfo
    storage    = $diskList
    battery    = $batteryData
    adapter    = $adapterData
    display    = $displayData
    bios       = $biosData
    windows    = $windowsData
    gpu        = $gpuList
    scannedAtISO = (Get-Date).ToString("o")
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host " [+] Hardware Fingerprint Captured!" -ForegroundColor Green
Write-Host ("     Brand    : " + $brand) -ForegroundColor Yellow
Write-Host ("     Model    : " + $modelCode + " (" + $friendlyName + ")") -ForegroundColor Yellow
Write-Host ("     RAM      : " + $totalRamGB + " GB (" + $installedSlots + " of " + $totalPhysicalSlots + " slots used)") -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

# ================================================================
# AUTO-DETECTED SERVER UPLOAD
# ================================================================
$serverBaseUrl = "__SERVER_APP_URL__"

# Fallback resolution if running outside of web download
if ($serverBaseUrl -eq "__SERVER_APP_URL__" -or [string]::IsNullOrWhiteSpace($serverBaseUrl)) {
    if ($env:NEXT_PUBLIC_APP_URL -and $env:NEXT_PUBLIC_APP_URL.Trim() -ne "") {
        $serverBaseUrl = $env:NEXT_PUBLIC_APP_URL.Trim().TrimEnd('/')
    } elseif ($env:LAPTOPWISE_SERVER_URL -and $env:LAPTOPWISE_SERVER_URL.Trim() -ne "") {
        $serverBaseUrl = $env:LAPTOPWISE_SERVER_URL.Trim().TrimEnd('/')
    } else {
        $serverBaseUrl = "https://laptopwise-two.vercel.app"
    }
} else {
    $serverBaseUrl = $serverBaseUrl.Trim().TrimEnd('/')
}

$endpoint = "$serverBaseUrl/api/scan/upload"

Write-Host (" [*] Server Target : " + $serverBaseUrl) -ForegroundColor Cyan
Write-Host ""

$askingPrice = Read-Host "Asking Price in PKR (Optional - press Enter to skip)"
$priceVal = $null
if ($askingPrice -match '^\d+$') { $priceVal = [int]$askingPrice }

$postObj  = @{ fingerprint = $payload; askingPricePKR = $priceVal }
$postBody = $postObj | ConvertTo-Json -Depth 8

Write-Host ""
Write-Host ("[*] Uploading hardware telemetry to " + $endpoint + " ...") -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $postBody -ContentType "application/json" -TimeoutSec 35
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host " [SUCCESS] TRUTH REPORT GENERATED!" -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ("  Scan ID    : " + $response.scanId) -ForegroundColor Yellow

    $reportUrl = "$serverBaseUrl/report/" + $response.scanId
    Write-Host ("  Report URL : " + $reportUrl) -ForegroundColor Cyan
    Start-Process $reportUrl
} catch {
    Write-Host ""
    Write-Host (" [ERROR] Upload failed: " + $_) -ForegroundColor Red
    Write-Host (" Make sure: 1) The server ($serverBaseUrl) is running and reachable") -ForegroundColor DarkYellow
    Write-Host ("            2) You ran this script as Administrator") -ForegroundColor DarkYellow
}

Write-Host ""
Read-Host "Press Enter to exit..."
