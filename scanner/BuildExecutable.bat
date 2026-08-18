@echo off
title Build LaptopTruth Scanner EXE
color 0A
echo ================================================================
echo       LaptopTruth C# Standalone EXE Compiler
echo ================================================================
echo.

:: 1. Check if .NET SDK is installed
where dotnet >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] .NET SDK is not installed or not found in system PATH.
    echo.
    echo Please install Microsoft .NET 8.0 SDK (x64):
    echo https://dotnet.microsoft.com/download/dotnet/8.0
    echo.
    pause
    exit /b 1
)

:: 2. Check if LaptopTruthScanner.cs exists in the current folder
if not exist "%~dp0LaptopTruthScanner.cs" (
    echo [ERROR] LaptopTruthScanner.cs not found in this folder!
    echo.
    echo Make sure LaptopTruthScanner.cs, LaptopTruthScanner.csproj,
    echo and BuildExecutable.bat are all placed in the SAME folder.
    echo.
    echo Tip: Download the complete LaptopTruthScanner_Source.zip from the web app!
    echo.
    pause
    exit /b 1
)

echo [*] .NET SDK detected! Building standalone win-x64 executable...
echo [*] Compiling LaptopTruthScanner.csproj into self-contained EXE...
echo.

cd /d "%~dp0"
dotnet publish LaptopTruthScanner.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o ".\dist"

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo  [SUCCESS] LaptopTruthScanner.exe built successfully!
    echo  Location: %~dp0dist\LaptopTruthScanner.exe
    echo ================================================================
    echo.
    echo You can now copy LaptopTruthScanner.exe to ANY Windows laptop
    echo (via USB or download) and run it with 100%% native hardware access!
) else (
    echo.
    echo [ERROR] Build failed. Check the error messages above.
)

echo.
pause
