export interface GuideTool {
  name: string;
  category: string;
  description: string;
  commandOrUrl: string;
  isCommand?: boolean;
  officialUrl?: string;
  whyUseIt: string;
}

export interface GuideSection {
  id: string;
  stepNumber: number;
  title: string;
  shortSummary: string;
  iconName: string;
  badge?: string;
  badgeColor?: string;
  keyTakeaway: string;
  subsections: {
    heading: string;
    description?: string;
    points?: string[];
    callout?: {
      type: "info" | "warning" | "tip" | "danger";
      title: string;
      text: string;
    };
  }[];
  tools?: GuideTool[];
}

export const BUYING_GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "purpose-and-budget",
    stepNumber: 1,
    title: "Start Here — What Do You Need?",
    shortSummary: "Decide your exact purpose, maximum budget, and whether new, used, or refurbished is best for you before visiting any shop.",
    iconName: "HelpCircle",
    badge: "Step 1 of 8",
    badgeColor: "indigo",
    keyTakeaway: "Write down your minimum specs and maximum budget on paper before leaving home so no seller can talk you into overspending.",
    subsections: [
      {
        heading: "Answer 3 Simple Questions First",
        description: "Before you go to the market or open any shopping website, answer these 3 questions clearly:",
        points: [
          "1. What will you use it for? Studying, office work, coding, gaming, or video editing? Each of these needs different hardware inside.",
          "2. What is your maximum budget? Decide the highest amount you are willing to pay before looking. This stops pushy sellers from talking you into spending more than you have.",
          "3. New, used, or refurbished? New costs more but has no past use. Used is cheaper but riskier. Refurbished is a middle option — used, but checked and repaired by a shop."
        ]
      },
      {
        heading: "Write Down Your Minimum Specs Checklist",
        description: "Before you leave home, write down the minimum hardware you need. For example:",
        points: [
          "Memory (RAM): At least 8GB RAM for normal use, or 16GB RAM for programming and multi-tasking.",
          "Storage: Always demand an SSD (at least 256GB or 512GB) — never buy a slow mechanical HDD.",
          "Processor (CPU): At least an Intel Core i5 (8th Gen or newer) or AMD Ryzen for modern work and Windows 11."
        ],
        callout: {
          type: "tip",
          title: "Buyer Rule",
          text: "Having your minimum specs written down prevents sellers from confusing you with fancy technical words or selling you old stock."
        }
      }
    ]
  },
  {
    id: "where-to-buy",
    stepNumber: 2,
    title: "Where to Buy — Market & Seller Tips",
    shortSummary: "How to safely buy from physical IT markets (like Hafeez Center, Saddar, Blue Area) and avoid common online traps.",
    iconName: "Store",
    badge: "Step 2 of 8",
    badgeColor: "emerald",
    keyTakeaway: "Always buy from an established shop with a physical address and demand a written 7 to 15-day check warranty.",
    subsections: [
      {
        heading: "Buying from a Local Physical Market (Hafeez Center, Saddar, Blue Area)",
        points: [
          "Go to a shop with a permanent physical address: Avoid random roadside stalls or persons standing outside offering 'cheap deals.' Established shops have a reputation to protect.",
          "Demand a written checking warranty: Ask for at least 7 to 15 days written check warranty on the receipt. A seller who refuses to give any warranty is hiding something.",
          "Inspect 'Box-Packed' seals yourself: If a seller claims a laptop is brand new and sealed, ask to examine the factory seal yourself. Some shops repack used laptops in fresh boxes.",
          "Check online prices before you go: Check real prices on Paklap or CZone so you know the fair market value and avoid getting overcharged.",
          "Take your time: Do not let a crowded shop or a pushy salesperson rush your decision."
        ]
      },
      {
        heading: "Buying Online (OLX, Facebook Marketplace, etc.)",
        points: [
          "Ask for real photos and a live video: Request a short video showing the exact laptop running, not stock images downloaded from Google.",
          "Choose local sellers you can visit: Prefer sellers or shops located in your own city so you can physically test the laptop before handing over cash.",
          "Meet in a safe, public place: Never send bank advance payments to strangers on OLX or Facebook.",
          "Beware of prices that are 'too good to be true': If someone offers a modern high-end laptop for half the normal price, it is almost certainly a scam or stolen device."
        ],
        callout: {
          type: "warning",
          title: "Safety Warning",
          text: "Never transfer advance token money online to an unknown seller. Always inspect and test the physical machine in person first."
        }
      }
    ]
  },
  {
    id: "physical-checklist",
    stepNumber: 3,
    title: "Physical Checklist — Look and Feel",
    shortSummary: "A 5-minute hands-on test for the laptop body, screen, keyboard, hinges, and ports.",
    iconName: "Eye",
    badge: "Step 3 of 8",
    badgeColor: "amber",
    keyTakeaway: "Check every single port, press every key in Notepad, and test the screen on both pure white and pure black backgrounds.",
    subsections: [
      {
        heading: "Check These with Your Own Eyes & Hands (In Order):",
        points: [
          "1. Body and Hinges: Look for cracks, deep dents, or loose hinges. Open and close the screen lid a few times — it should move smoothly without creaking or wobbling.",
          "2. Screen Dead Pixels & Spots: Set screen brightness to 100%. Open a full-screen pure white image to check for yellowish stains or dark patches. Then open a pure black image to check for tiny bright dots (stuck/dead pixels).",
          "3. Keyboard Typing Test: Open Notepad or a text editor and press every single key one by one (including Spacebar, Enter, Backspace, and Shift). Make sure none are sticky or loose.",
          "4. Touchpad & Gestures: Move your finger all over the touchpad and tap corners. Ensure the cursor tracks smoothly and left/right click buttons click firmly.",
          "5. All USB & Display Ports: Plug a USB drive into every single USB port on both sides of the laptop to confirm they detect storage. Test HDMI and charging port.",
          "6. Speakers & Webcam: Play any music or YouTube video to check for audio cracking. Open the Windows Camera app to make sure the webcam lens is clear.",
          "7. Rubber Feet (Bottom Case): Look at the bottom rubber strips. If they are missing or peeled off, it means the laptop was opened roughly or repaired frequently."
        ],
        callout: {
          type: "tip",
          title: "Quick Test Trick",
          text: "Open 'notepad.exe' and type every letter on the keyboard across all rows to make sure no key is dead."
        }
      }
    ]
  },
  {
    id: "software-checklist",
    stepNumber: 4,
    title: "Software Checklist — Test Before You Buy",
    shortSummary: "Free built-in tests and diagnostic tools you can run in 5 minutes right in the shop to catch hidden defects.",
    iconName: "Terminal",
    badge: "Step 4 of 8",
    badgeColor: "cyan",
    keyTakeaway: "Run the battery report and check SSD health with CrystalDiskInfo before handing over any payment.",
    subsections: [
      {
        heading: "6 Diagnostic Steps to Run on the Laptop:",
        points: [
          "1. Battery Health Report: Open Command Prompt and run 'powercfg /batteryreport'. Compare the Full Charge Capacity against Design Capacity. If health is below 60%, the battery is worn out.",
          "2. Storage Drive Health: Run CrystalDiskInfo. It will immediately show drive health as Good (Blue), Caution (Yellow), or Bad (Red). Only buy laptops showing 'Good'.",
          "3. Memory (RAM) Test: Run Windows Memory Diagnostic (search for it in the Start Menu) or MemTest86 to catch hidden memory crashes.",
          "4. Verify Real Specs: Search for 'System Information' (msinfo32) in Start Menu. Check the exact processor model, generation, and installed RAM against what the seller claims.",
          "5. Temperature & Overheating Test: Open HWMonitor. If the CPU temperature jumps above 85°C while just sitting on the desktop, the cooling fan or thermal paste is failing.",
          "6. Multi-Program Stress Test: Open 10 browser tabs and play a 1080p video simultaneously. If the laptop freezes or reboots, walk away."
        ]
      }
    ],
    tools: [
      {
        name: "Windows Battery Report",
        category: "Built-in Windows Tool",
        description: "Generates an official HTML report showing original vs current battery capacity and full charge cycles.",
        commandOrUrl: "powercfg /batteryreport",
        isCommand: true,
        whyUseIt: "Shows the exact percentage of battery life remaining without relying on the seller's verbal claims."
      },
      {
        name: "CrystalDiskInfo",
        category: "Free Storage Tool",
        description: "Reads S.M.A.R.T health directly from the SSD/HDD controller, showing total hours used and health percentage.",
        commandOrUrl: "https://crystalmark.info/en/software/crystaldiskinfo/",
        officialUrl: "https://crystalmark.info/en/software/crystaldiskinfo/",
        whyUseIt: "Instantly flags worn-out SSDs or drives with bad sectors before you buy."
      },
      {
        name: "HWMonitor",
        category: "Free Thermal Tool",
        description: "Monitors real-time temperatures, fan speeds, and voltages for CPU, GPU, and motherboard.",
        commandOrUrl: "https://www.cpuid.com/softwares/hwmonitor.html",
        officialUrl: "https://www.cpuid.com/softwares/hwmonitor.html",
        whyUseIt: "Catches laptops that overheat or have broken cooling fans."
      },
      {
        name: "CPU-Z",
        category: "Free Hardware Tool",
        description: "Inspects exact CPU model, RAM manufacturer, bus frequency, and memory channel configuration.",
        commandOrUrl: "https://www.cpuid.com/softwares/cpu-z.html",
        officialUrl: "https://www.cpuid.com/softwares/cpu-z.html",
        whyUseIt: "Verifies if the RAM stick inside is a genuine Samsung/Micron module or a fake clone."
      },
      {
        name: "MemTest86 / Windows Memory Diagnostic",
        category: "Memory Testing",
        description: "Built-in Windows diagnostic that tests RAM cells for data corruption.",
        commandOrUrl: "mdsched.exe",
        isCommand: true,
        whyUseIt: "Detects faulty RAM that causes random Blue Screen of Death (BSOD) crashes."
      }
    ]
  },
  {
    id: "fake-parts",
    stepNumber: 5,
    title: "Spotting Fake or Swapped Parts",
    shortSummary: "How dishonest sellers swap original RAM, SSDs, batteries, or chargers with cheap knock-offs — and how to spot them.",
    iconName: "ShieldAlert",
    badge: "Step 5 of 8",
    badgeColor: "rose",
    keyTakeaway: "Always check that the charger wattage matches factory specs and that storage and RAM brand names match on software diagnostic tools.",
    subsections: [
      {
        heading: "4 Parts Most Frequently Swapped by Shady Sellers:",
        points: [
          "1. Memory (RAM): Genuine RAM sticks (Samsung, Micron, SK Hynix, Crucial) have sharp, high-quality printed stickers with matching serial numbers. If the sticker looks blurry, crooked, or has spelling errors, it is a counterfeit clone.",
          "2. Storage Drive (SSD): Check the drive model reported in software. Fake Samsung SSDs often use cheap Phison or Silicon Motion controllers with spoofed firmware. Use our LaptopTruth scanner to check chip vendor IDs.",
          "3. Battery: Original OEM laptop batteries (from Dell, Lenovo, HP) show genuine manufacturer codes in the Windows battery report (like 'LGC', 'SMP', or 'Simplo'). Cheap third-party replacements often show blank or generic vendor strings and lose charge quickly.",
          "4. Charger / Power Adapter: Verify the wattage printed on the charger brick (e.g. 45W, 65W, 90W) matches the laptop's official factory requirement. Using an underpowered 15W or 30W generic charger will throttle your laptop's speed and destroy the battery."
        ],
        callout: {
          type: "danger",
          title: "Golden Rule for Original Parts",
          text: "A genuine factory part always has clean label printing, a recognized brand name, and internal chip IDs that agree with the outer label."
        }
      }
    ]
  },
  {
    id: "refurbished-grades",
    stepNumber: 6,
    title: "Understanding 'Refurbished' and Grades",
    shortSummary: "What Grade A, Grade B, and Grade C really mean in laptop markets, and what questions you must ask the seller.",
    iconName: "Layers",
    badge: "Step 6 of 8",
    badgeColor: "purple",
    keyTakeaway: "Grading letters (A, B, C) are not officially regulated — always ask the seller what was tested and what warranty they provide.",
    subsections: [
      {
        heading: "What Does 'Refurbished' Mean?",
        description: "Refurbished does NOT mean fake. It means a corporate or used laptop was inspected, cleaned, tested, and repaired to work properly again. Here is what typical market grades mean:",
        points: [
          "Grade A (Like New): The laptop body looks almost brand new with minimal to zero visible scratches. The screen is flawless and all ports work. Highest price among used options.",
          "Grade B (Good Value): May have light surface scratches or minor casing shine from past use, but 100% functional with zero structural defects. Usually the best value for your money.",
          "Grade C (Budget / Heavy Use): Visible scratches, dents, worn key legends, or small casing blemishes. It still works, but is sold at a steep discount."
        ]
      },
      {
        heading: "3 Mandatory Questions to Ask the Refurbished Seller:",
        points: [
          "1. What exact repairs or replacements were performed on this laptop (e.g. new keyboard, swapped SSD)?",
          "2. How long is your shop's testing warranty (is it at least 15 days)?",
          "3. What is the return or exchange policy if a hidden motherboard fault appears?"
        ],
        callout: {
          type: "info",
          title: "Grade Note",
          text: "Because every shop creates its own grading scale, inspect the physical unit with your own hands rather than trusting a verbal grade."
        }
      }
    ]
  },
  {
    id: "red-flags",
    stepNumber: 7,
    title: "Red Flags — When to Walk Away",
    shortSummary: "Critical warning signs that mean you should immediately stop the deal, pack your things, and walk away.",
    iconName: "AlertTriangle",
    badge: "Step 7 of 8",
    badgeColor: "rose",
    keyTakeaway: "If the seller refuses testing or pressures you to pay before inspecting, walk away immediately.",
    subsections: [
      {
        heading: "Stop the Deal Immediately If You Notice Any of These:",
        points: [
          "🚫 The seller refuses to let you test the laptop or run diagnostics before paying.",
          "🚫 The seller refuses to provide any written check warranty or receipt.",
          "🚫 The price is ridiculously low (e.g. 50% below every other shop in the market).",
          "🚫 The seller acts impatient, speaks aggressively, or rushes you to decide in 2 minutes.",
          "🚫 The hardware specs on screen (in msinfo32 or Task Manager) do not match what the seller verbally promised.",
          "🚫 Serial numbers, warranty stickers, or model badges look scratched off, peeled, or tampered with.",
          "🚫 The seller cannot explain where the laptop came from or refuses to let you restart the machine."
        ],
        callout: {
          type: "danger",
          title: "Safety Advice",
          text: "If two or more of these red flags happen at the same shop, do not compromise. Say 'Thank you, I will look around' and walk away safely."
        }
      }
    ]
  },
  {
    id: "after-you-buy",
    stepNumber: 8,
    title: "After You Buy — First Week Checklist",
    shortSummary: "What you must test during your 7 to 15-day checking warranty window once you bring the laptop home.",
    iconName: "CheckCircle",
    badge: "Step 8 of 8",
    badgeColor: "emerald",
    keyTakeaway: "Use the laptop continuously during your first week and immediately contact the seller if any hidden fault appears.",
    subsections: [
      {
        heading: "Your First Week Testing Checklist at Home:",
        points: [
          "1. Re-run Battery & SMART Tests: Run the battery report and CrystalDiskInfo again on your desk to ensure stability under your normal home usage.",
          "2. Keep All Receipts & Warranty Slips: Keep the shop's printed bill, warranty card, and any WhatsApp chat records safe in a folder.",
          "3. Stress Test with Normal Daily Work: Use the laptop for several hours every day — open multiple browser tabs, attend Zoom meetings, and compile code to make sure there are no random shutdowns or overheating freezes.",
          "4. Test Full Battery Drain & Recharging: Unplug the laptop, use it until the battery reaches 15%, then plug in the charger and verify it charges smoothly to 100% without getting burning hot.",
          "5. Contact the Seller Immediately if Any Problem Appears: If a USB port stops working, the screen flickers, or the battery drains in 30 minutes, contact the seller right away while your warranty is still active."
        ],
        callout: {
          type: "tip",
          title: "Peace of Mind",
          text: "Testing everything thoroughly in the first 7 days ensures you can get a free repair, replacement, or refund before your warranty expires."
        }
      }
    ]
  }
];
