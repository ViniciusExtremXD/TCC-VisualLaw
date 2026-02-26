"use client";

import { pdf } from "@react-pdf/renderer";
import ReportDocument, { type ReportPdfInput } from "@/lib/pdf/ReportDocument";

export type { ReportPdfInput };

export async function generateReportPdfBlob(input: ReportPdfInput): Promise<Blob> {
  const instance = pdf(<ReportDocument input={input} />);
  return instance.toBlob();
}
