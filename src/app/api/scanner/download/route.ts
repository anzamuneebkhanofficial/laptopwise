import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "LaptopTruthScanner.bat");
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Scanner script not found on server" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/x-bat",
        "Content-Disposition": 'attachment; filename="LaptopTruthScanner.bat"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to download scanner file" }, { status: 500 });
  }
}
