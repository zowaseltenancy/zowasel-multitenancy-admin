"use client";

import { X, Download, Landmark, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatUSD } from "../utils/currency";

interface WhtCertificateModalProps {
  vendorName: string;
  countryCode: string;
  countryName: string;
  grossAmountUSD: number;
  whtRatePct: number;
  onClose: () => void;
}

export default function WhtCertificateModal({
  vendorName,
  countryCode,
  countryName,
  grossAmountUSD,
  whtRatePct,
  onClose,
}: WhtCertificateModalProps) {
  const whtAmountUSD = (grossAmountUSD * whtRatePct) / 100;
  const netPaidUSD = grossAmountUSD - whtAmountUSD;
  const certNumber = `WHT-CERT-${countryCode}-${Date.now().toString().slice(-6)}`;
  const issueDate = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const handlePrintDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-muted/30 print:hidden">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-base font-extrabold text-foreground">Withholding Tax (WHT) Credit Certificate</h2>
              <p className="text-xs font-mono text-muted-foreground">{certNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Certificate Paper Content */}
        <div className="p-8 space-y-6 text-xs bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h1 className="text-lg font-black tracking-tight text-primary uppercase">ZOWASEL PLATFORM LIMITED</h1>
              <p className="text-[11px] font-semibold text-muted-foreground">Corporate Tax & Regulatory Compliance Division</p>
              <p className="text-[10px] text-muted-foreground font-mono">Tax ID / TIN: 109281-ZOWASEL-GLOBAL</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" /> Official Tax Credit
              </span>
              <p className="text-[11px] font-mono text-muted-foreground mt-1">Date: {issueDate}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-foreground underline decoration-primary underline-offset-4">
              WITHHOLDING TAX DEDUCTION CERTIFICATE
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This document certifies that statutory Withholding Tax (WHT) has been deducted at source by Zowasel Platform Limited in accordance with the tax revenue laws of <span className="font-bold text-foreground">{countryName}</span> and remitted to the relevant Inland Revenue Authority.
            </p>
          </div>

          {/* Certificate Table */}
          <div className="border rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y font-semibold">
                <tr>
                  <td className="p-3 text-muted-foreground uppercase text-[10px] font-bold">Taxpayer / Vendor Name</td>
                  <td className="p-3 font-bold text-foreground">{vendorName}</td>
                </tr>
                <tr>
                  <td className="p-3 text-muted-foreground uppercase text-[10px] font-bold">Tax Jurisdiction</td>
                  <td className="p-3 font-mono font-bold text-foreground">{countryName} ({countryCode})</td>
                </tr>
                <tr>
                  <td className="p-3 text-muted-foreground uppercase text-[10px] font-bold">Gross Contract Amount</td>
                  <td className="p-3 font-mono font-bold text-foreground">{formatUSD(grossAmountUSD)}</td>
                </tr>
                <tr>
                  <td className="p-3 text-muted-foreground uppercase text-[10px] font-bold">Statutory WHT Rate</td>
                  <td className="p-3 font-mono font-bold text-amber-600">{whtRatePct}%</td>
                </tr>
                <tr>
                  <td className="p-3 text-muted-foreground uppercase text-[10px] font-bold">Total Tax Withheld at Source</td>
                  <td className="p-3 font-mono font-extrabold text-rose-600">{formatUSD(whtAmountUSD)}</td>
                </tr>
                <tr>
                  <td className="p-3 text-muted-foreground uppercase text-[10px] font-bold">Net Amount Disbursed</td>
                  <td className="p-3 font-mono font-extrabold text-emerald-600">{formatUSD(netPaidUSD)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Seals */}
          <div className="pt-4 border-t flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Verified & Stamp Authenticated</span>
            </div>
            <p className="font-mono">Ref: {certNumber}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-muted/30 flex items-center justify-between print:hidden">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs font-bold">
            Close
          </Button>
          <Button size="sm" onClick={handlePrintDownload} className="h-8 text-xs bg-primary font-bold gap-1.5">
            <Download className="h-4 w-4" /> Print / Download Tax Certificate (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
}
