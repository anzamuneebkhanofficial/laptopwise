import { ScanReportDocument } from "@/types";

/**
 * Global In-Memory Session Store for Active Reports
 * Provides zero-configuration, database-free transient storage for generated reports.
 */
declare global {
  // eslint-disable-next-line no-var
  var __LAPTOP_TRUTH_STORE: Map<string, ScanReportDocument> | undefined;
}

if (!global.__LAPTOP_TRUTH_STORE) {
  global.__LAPTOP_TRUTH_STORE = new Map<string, ScanReportDocument>();
}

export const MEMORY_SCANS_STORE = global.__LAPTOP_TRUTH_STORE;
