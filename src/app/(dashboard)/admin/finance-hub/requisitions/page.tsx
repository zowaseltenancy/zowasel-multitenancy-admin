"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Paperclip,
  ShieldAlert,
  Printer,
  Download,
  PlusCircle,
  AlertTriangle,
  UserCheck,
  Building2,
  Lock,
  ArrowRight,
  FileCheck,
  X,
  Search,
  Filter,
  ShieldCheck,
  CheckSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useActingFinanceOfficer } from "@/features/finance-hub/context/FinanceOfficerContext";
import { useFinanceAuditLog } from "@/features/finance-hub/context/FinanceAuditLogContext";
import { formatUSD } from "@/features/finance-hub/utils/currency";
import SubSectionPillNav from "@/features/finance-hub/components/SubSectionPillNav";
import PageHeaderInfo from "@/components/shared/PageHeaderInfo";

interface RequisitionLineItem {
  sNo: number;
  qty?: string;
  description: string;
  amountNative: number;
  acctNumber: string;
  acctName: string;
  bankName: string;
}

interface RequisitionSignatoryBlock {
  roleLabel: "Requested by" | "Authorized by" | "Approved by (H.O.D Finance)" | "Approved by (C.E.O)";
  name: string;
  status: "approved" | "pending" | "rejected" | "awaiting";
  timestamp?: string;
  signatureText?: string;
  comment?: string;
}

interface ZowaselOfficialRequisition {
  id: string;
  refNo: string;
  dept: string;
  program: string;
  location: string;
  staffName: string;
  date: string;
  currencyCode: string;
  currencySymbol: string;
  items: RequisitionLineItem[];
  totalAmountNative: number;
  totalAmountUSD: number;
  status: "Pending Signatures" | "Fully Approved" | "Rejected";
  signatories: RequisitionSignatoryBlock[];
  attachments: { name: string; type: string; status: "Verified" | "Pending Review" }[];
  isAccountNameChange?: boolean;
  policeReportAttached?: boolean;
  confirmationLetterAttached?: boolean;
  appendixRetirementNotice?: string;
  acquittalStatus: "Not Retired" | "Partially Retired" | "Fully Retired";
  requestedDocs: string[];
}

const mockOfficialRequisitions: ZowaselOfficialRequisition[] = [
  {
    id: "REQ-2026-0801",
    refNo: "ZOW/MECH/2026/08-01",
    dept: "Supply Chain",
    program: "Mechanization",
    location: "Nasarawa State (Doma -> Ibadan)",
    staffName: "Michael Sotubo",
    date: "2026-08-09",
    currencyCode: "NGN",
    currencySymbol: "₦",
    items: [
      {
        sNo: 1,
        qty: "1 Unit",
        description: "Cost for Freight & Transport — Deployment of Hand Tiller from Doma to Ibadan",
        amountNative: 84000,
        acctNumber: "1039361671",
        acctName: "Sotubo Michael Olusesan",
        bankName: "VFD Microfinance Bank",
      },
    ],
    totalAmountNative: 84000,
    totalAmountUSD: 54.19,
    status: "Pending Signatures",
    signatories: [
      { roleLabel: "Requested by", name: "Patience Dalyop", status: "approved", timestamp: "Aug 9, 10:30 AM", signatureText: "P. Dalyop (Signed)" },
      { roleLabel: "Authorized by", name: "Michael Sotubo", status: "approved", timestamp: "Aug 9, 11:15 AM", signatureText: "M. Sotubo (Signed)", comment: "Verified hand tiller serial and driver manifest." },
      { roleLabel: "Approved by (H.O.D Finance)", name: "Adeola Bamgbose", status: "pending" },
      { roleLabel: "Approved by (C.E.O)", name: "Jerry Oche", status: "awaiting" },
    ],
    attachments: [
      { name: "Freight_Invoice_HandTiller_Doma.pdf", type: "application/pdf", status: "Verified" },
      { name: "Waybill_Manifest_10092.pdf", type: "application/pdf", status: "Verified" },
    ],
    appendixRetirementNotice: "Additional invoice and driver receipt required for retirement upon delivery at Ibadan hub.",
    acquittalStatus: "Partially Retired",
    requestedDocs: ["Stamped Driver Delivery Confirmation Sheet"],
  },
  {
    id: "REQ-2026-0802",
    refNo: "ZOW/FIN/2026/08-02",
    dept: "Finance & Ops",
    program: "Payment Gateway",
    location: "Lagos State Headquarters",
    staffName: "Bisi Akande",
    date: "2026-08-10",
    currencyCode: "NGN",
    currencySymbol: "₦",
    items: [
      {
        sNo: 1,
        qty: "Monthly Batch",
        description: "Vendor Account Swap Disbursement — Termii SMS API Route",
        amountNative: 69750000,
        acctNumber: "0029104819",
        acctName: "Termii Technologies Ltd",
        bankName: "Access Bank Commercial",
      },
    ],
    totalAmountNative: 69750000,
    totalAmountUSD: 45000,
    status: "Pending Signatures",
    isAccountNameChange: true,
    policeReportAttached: true,
    confirmationLetterAttached: true,
    signatories: [
      { roleLabel: "Requested by", name: "Bisi Akande", status: "approved", timestamp: "Aug 10, 02:15 PM", signatureText: "B. Akande (Signed)" },
      { roleLabel: "Authorized by", name: "Tunde Ednut", status: "approved", timestamp: "Aug 10, 03:00 PM", signatureText: "T. Ednut (Signed)", comment: "Affidavit and police report cleared." },
      { roleLabel: "Approved by (H.O.D Finance)", name: "Adeola Bamgbose", status: "pending" },
      { roleLabel: "Approved by (C.E.O)", name: "Jerry Oche", status: "awaiting" },
    ],
    attachments: [
      { name: "Police_Report_Fraud_Clearance_Ref882.pdf", type: "application/pdf", status: "Verified" },
      { name: "Bank_Confirmation_Letter_Access.pdf", type: "application/pdf", status: "Verified" },
    ],
    appendixRetirementNotice: "Must attach official tax clearance & stamped bank change confirmation letter.",
    acquittalStatus: "Not Retired",
    requestedDocs: [],
  },
];

export default function DigitalRequisitionsPage() {
  const { actingOfficer } = useActingFinanceOfficer();
  const { logAction } = useFinanceAuditLog();
  const [activeTab, setActiveTab] = useState("forms");
  const [requisitions, setRequisitions] = useState<ZowaselOfficialRequisition[]>(mockOfficialRequisitions);
  const [activeReq, setActiveReq] = useState<ZowaselOfficialRequisition | null>(mockOfficialRequisitions[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [docRequestModalReqId, setDocRequestModalReqId] = useState<string | null>(null);
  const [newRequestedDocName, setNewRequestedDocName] = useState("");
  const [commentInput, setCommentInput] = useState("");

  // Create Form State
  const [newRefNo, setNewRefNo] = useState(`ZOW/OPS/${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`);
  const [newDept, setNewDept] = useState("Supply Chain");
  const [newProgram, setNewProgram] = useState("Mechanization");
  const [newLocation, setNewLocation] = useState("Nasarawa State");
  const [newStaffName, setNewStaffName] = useState(actingOfficer ? `${actingOfficer.firstName} ${actingOfficer.lastName}` : "Michael Sotubo");
  const [newDesc, setNewDesc] = useState("");
  const [newQty, setNewQty] = useState("1 Unit");
  const [newAmount, setNewAmount] = useState("");
  const [newAcctNum, setNewAcctNum] = useState("");
  const [newAcctName, setNewAcctName] = useState("");
  const [newBank, setNewBank] = useState("");
  const [isAccountEditToggle, setIsAccountEditToggle] = useState(false);

  const actorName = `${actingOfficer.firstName} ${actingOfficer.lastName} (${actingOfficer.position || "Officer"})`;

  const requisitionsPills = [
    { id: "forms", label: "Official Requisition Forms", icon: FileText, badge: requisitions.length },
    { id: "approval_queue", label: "Multi-Stage Approval Queue", icon: Clock, badge: requisitions.filter(r => r.status === "Pending Signatures").length },
    { id: "documents", label: "Document Requests & Attachments", icon: Paperclip },
    { id: "safeguards", label: "Bank Account Change Safeguards", icon: ShieldAlert, badge: requisitions.filter(r => r.isAccountNameChange).length },
    { id: "retirement", label: "Retirement & Acquittal Audit", icon: FileCheck },
  ];

  const handleApproveStage = (reqId: string) => {
    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;

        if (r.isAccountNameChange && (!r.policeReportAttached || !r.confirmationLetterAttached)) {
          toast.error("SAFEGUARD BLOCKED: Police Report and Stamped Bank Confirmation Letter are MANDATORY for Account Name Changes.");
          return r;
        }

        let signedOne = false;
        const newSignatories = r.signatories.map((s) => {
          if (!signedOne && s.status === "pending") {
            signedOne = true;
            return {
              ...s,
              status: "approved" as const,
              timestamp: new Date().toLocaleTimeString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
              signatureText: `${actorName.split(" ")[0]} (Digital Sign)`,
              comment: commentInput || s.comment || "Stage approved.",
            };
          }
          return s;
        });

        let foundNext = false;
        const finalSignatories = newSignatories.map((s) => {
          if (s.status === "awaiting" && !foundNext) {
            foundNext = true;
            return { ...s, status: "pending" as const };
          }
          return s;
        });

        const allApproved = finalSignatories.every((s) => s.status === "approved");

        const updatedReq = {
          ...r,
          status: allApproved ? ("Fully Approved" as const) : ("Pending Signatures" as const),
          signatories: finalSignatories,
        };

        if (activeReq?.id === reqId) setActiveReq(updatedReq);
        return updatedReq;
      })
    );

    logAction(actorName, "Signed Official Zowasel Requisition Stage", reqId, commentInput || "Approved");
    toast.success(`Requisition stage digitally signed by ${actorName}.`);
    setCommentInput("");
  };

  const handleRejectStage = (reqId: string) => {
    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        const updated = {
          ...r,
          status: "Rejected" as const,
          signatories: r.signatories.map((s) => (s.status === "pending" ? { ...s, status: "rejected" as const, comment: commentInput || "Rejected" } : s)),
        };
        if (activeReq?.id === reqId) setActiveReq(updated);
        return updated;
      })
    );

    logAction(actorName, "Rejected Requisition Stage", reqId, commentInput || "Rejected");
    toast.error(`Requisition ${reqId} rejected.`);
    setCommentInput("");
  };

  const handleRequestDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docRequestModalReqId || !newRequestedDocName) return;

    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id !== docRequestModalReqId) return r;
        return {
          ...r,
          requestedDocs: [...r.requestedDocs, newRequestedDocName],
        };
      })
    );

    logAction(actorName, "Requested Additional Requisition Document", docRequestModalReqId, newRequestedDocName);
    toast.info(`Requested document '${newRequestedDocName}' from requester.`);
    setDocRequestModalReqId(null);
    setNewRequestedDocName("");
  };

  const handleCreateRequisitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(newAmount) || 0;

    const newEntry: ZowaselOfficialRequisition = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      refNo: newRefNo,
      dept: newDept,
      program: newProgram,
      location: newLocation,
      staffName: newStaffName,
      date: new Date().toISOString().split("T")[0],
      currencyCode: "NGN",
      currencySymbol: "₦",
      items: [
        {
          sNo: 1,
          qty: newQty,
          description: newDesc,
          amountNative: amountVal,
          acctNumber: newAcctNum,
          acctName: newAcctName,
          bankName: newBank,
        },
      ],
      totalAmountNative: amountVal,
      totalAmountUSD: amountVal / 1550,
      status: "Pending Signatures",
      isAccountNameChange: isAccountEditToggle,
      policeReportAttached: !isAccountEditToggle,
      confirmationLetterAttached: !isAccountEditToggle,
      acquittalStatus: "Not Retired",
      requestedDocs: [],
      signatories: [
        { roleLabel: "Requested by", name: newStaffName, status: "approved", timestamp: "Just now", signatureText: `${newStaffName} (Signed)` },
        { roleLabel: "Authorized by", name: "Department Lead", status: "pending" },
        { roleLabel: "Approved by (H.O.D Finance)", name: "Adeola Bamgbose", status: "awaiting" },
        { roleLabel: "Approved by (C.E.O)", name: "Jerry Oche", status: "awaiting" },
      ],
      attachments: [{ name: "Supporting_Requisition_Doc.pdf", type: "application/pdf", status: "Pending Review" }],
      appendixRetirementNotice: "Additional information (Invoice, Receipt, Name, Address, Phone number, and Account details) must be provided for retirement.",
    };

    setRequisitions((prev) => [newEntry, ...prev]);
    setActiveReq(newEntry);
    logAction(actorName, "Created Official Zowasel Requisition Form", newEntry.refNo, `${formatUSD(newEntry.totalAmountUSD)}`);
    toast.success("Official Zowasel Requisition Form successfully created.");
    setShowCreateModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Requisitions & Sign-Off Hub</h1>
            <PageHeaderInfo
              title="Digital Requisitions Hub Overview"
              description="Complete digital requisition workspace featuring official company templates, multi-stage approval workflows (Requester → Approver 1 → Approver 2 → Finance → CEO), document requests, bank account safeguards, and Appendix 2 acquittal audits."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreateModal(true)} className="h-9 bg-primary font-bold text-xs gap-2 shadow-2xs">
            <PlusCircle className="h-4 w-4" /> Create Requisition Form
          </Button>
          <Button onClick={handlePrint} variant="outline" className="h-9 font-bold text-xs gap-2">
            <Printer className="h-4 w-4" /> Print Form PDF
          </Button>
        </div>
      </div>

      {/* Sub-Section Pill Navigation Bar */}
      <SubSectionPillNav items={requisitionsPills} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* TAB 1: OFFICIAL REQUISITION FORMS */}
      {activeTab === "forms" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Requisition Selectors */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Company Requisitions</p>
            {requisitions.map((req) => (
              <Card
                key={req.id}
                onClick={() => setActiveReq(req)}
                className={`border cursor-pointer transition-all ${
                  activeReq?.id === req.id ? "ring-2 ring-primary bg-primary/5 shadow-md" : "hover:bg-muted/40"
                }`}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">{req.refNo}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === "Fully Approved"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="font-bold text-sm text-foreground line-clamp-1">{req.items[0]?.description || "Requisition"}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                    <span>{req.dept} &bull; {req.staffName}</span>
                    <span className="font-mono font-bold text-foreground">₦{req.totalAmountNative.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right: Pixel-Perfect Official Zowasel Requisition Form Document */}
          {activeReq && (
            <div className="lg:col-span-2 space-y-6">
              <Card className="border shadow-lg bg-card overflow-hidden">
                <CardContent className="p-8 space-y-6 bg-white text-black font-sans text-xs">
                  {/* Official Header with Actual /zowasel-logo-grey.png */}
                  <div className="flex items-start justify-between border-b pb-4">
                    <div className="space-y-2">
                      <Image
                        src="/zowasel-logo-grey.png"
                        alt="Zowasel Logo"
                        width={160}
                        height={45}
                        className="object-contain"
                      />
                      <h2 className="text-sm font-extrabold tracking-wider uppercase text-gray-800 pt-1">
                        REQUISITION FORM
                      </h2>
                    </div>
                    <div className="text-right space-y-1 font-semibold text-gray-700">
                      <p><strong className="text-gray-900">REF NO.:</strong> <span className="font-mono font-bold">{activeReq.refNo}</span></p>
                      <p><strong className="text-gray-900">DATE:</strong> {activeReq.date}</p>
                    </div>
                  </div>

                  {/* Meta Grid */}
                  <div className="grid grid-cols-2 gap-4 border p-3 rounded-lg bg-gray-50 text-xs font-semibold text-gray-800">
                    <div><strong className="text-gray-900">DEPT:</strong> {activeReq.dept}</div>
                    <div><strong className="text-gray-900">LOCATION:</strong> {activeReq.location}</div>
                    <div><strong className="text-gray-900">PROGRAM:</strong> {activeReq.program}</div>
                    <div><strong className="text-gray-900">STAFF:</strong> {activeReq.staffName}</div>
                  </div>

                  {/* Account Change Alert on Form */}
                  {activeReq.isAccountNameChange && (
                    <div className="p-3 border border-rose-400 bg-rose-50 rounded-lg text-rose-800 space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-xs">
                        <ShieldAlert className="h-4 w-4 text-rose-600" />
                        BANK ACCOUNT MODIFICATION SAFEGUARD ACTIVE
                      </p>
                      <p className="text-[11px]">
                        Police Fraud Clearance Report: {activeReq.policeReportAttached ? "ATTACHED ✅" : "MISSING ❌"} &bull; Stamped Bank Confirmation Letter: {activeReq.confirmationLetterAttached ? "ATTACHED ✅" : "MISSING ❌"}
                      </p>
                    </div>
                  )}

                  {/* Line Items Table */}
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-100 border-b text-gray-700 font-bold uppercase">
                        <tr>
                          <th className="p-2 border-r text-center w-12">S/NO</th>
                          <th className="p-2 border-r w-20">QTY</th>
                          <th className="p-2 border-r">DESCRIPTION</th>
                          <th className="p-2 border-r text-right">AMOUNT</th>
                          <th className="p-2 border-r">Acct. Number</th>
                          <th className="p-2 border-r">Acct. Name</th>
                          <th className="p-2">Bank</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-gray-900">
                        {activeReq.items.map((item) => (
                          <tr key={item.sNo}>
                            <td className="p-2 border-r text-center font-bold">{item.sNo}</td>
                            <td className="p-2 border-r">{item.qty || "—"}</td>
                            <td className="p-2 border-r font-semibold">{item.description}</td>
                            <td className="p-2 border-r text-right font-mono font-bold">₦{item.amountNative.toLocaleString()}</td>
                            <td className="p-2 border-r font-mono">{item.acctNumber}</td>
                            <td className="p-2 border-r font-semibold">{item.acctName}</td>
                            <td className="p-2">{item.bankName}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-bold border-t">
                          <td colSpan={3} className="p-2 text-right uppercase border-r">TOTAL</td>
                          <td className="p-2 text-right font-mono text-emerald-700 text-sm border-r">
                            ₦{activeReq.totalAmountNative.toLocaleString()}
                          </td>
                          <td colSpan={3} className="p-2 text-gray-500 text-[10px]">
                            ({formatUSD(activeReq.totalAmountUSD)} USD equivalent)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 4-Signatory Authorization Blocks */}
                  <div className="pt-2">
                    <p className="font-bold text-xs uppercase tracking-wider text-gray-600 mb-2">AUTHORIZATION & SIGN-OFF BLOCKS</p>
                    <div className="grid grid-cols-4 gap-3 text-center">
                      {activeReq.signatories.map((sig) => (
                        <div key={sig.roleLabel} className="border p-2.5 rounded-lg bg-gray-50 space-y-1">
                          <p className="text-[10px] font-extrabold uppercase text-gray-500">{sig.roleLabel}</p>
                          <p className="font-bold text-gray-900 text-xs truncate" title={sig.name}>{sig.name}</p>
                          
                          <div className="h-10 flex items-center justify-center border-t border-dashed my-1">
                            {sig.status === "approved" ? (
                              <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {sig.signatureText || "DIGITALLY SIGNED"}
                              </span>
                            ) : sig.status === "pending" ? (
                              <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                PENDING SIGNATURE
                              </span>
                            ) : (
                              <span className="font-mono text-[10px] text-gray-400">.......................</span>
                            )}
                          </div>
                          {sig.timestamp && <p className="text-[9px] text-gray-500 font-mono">{sig.timestamp}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* APPENDIX 2 */}
                  <div className="border-t pt-3 text-[10px] text-gray-600 space-y-1">
                    <p className="font-bold text-gray-800 uppercase tracking-wider">APPENDIX 2: ADDITIONAL INFORMATION TO ACCOMPANY THE RF NO. FOR RETIREMENT PURPOSE</p>
                    <p>
                      The following additional information where applicable must be provided in respect of retirement of each item on the RF: (Invoice, Receipt, Name, Address, Phone number, and Account details). Please use the S/N to indicate which item you are providing additional information for.
                    </p>
                  </div>
                </CardContent>

                {/* Sign-Off Footer */}
                {activeReq.status === "Pending Signatures" && (
                  <div className="bg-muted/30 p-4 border-t space-y-3">
                    <p className="text-xs font-bold text-foreground">Sign-Off Action Bar — Logged as {actorName}:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Optional sign-off comment or approval note..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="w-full rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold focus:outline-none"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleApproveStage(activeReq.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 gap-1.5 shrink-0"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Sign & Approve Stage
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectStage(activeReq.id)}
                        className="text-rose-600 border-rose-200 font-bold text-xs h-8 gap-1.5 shrink-0"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MULTI-STAGE APPROVAL QUEUE */}
      {activeTab === "approval_queue" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Multi-Stage Requisition Sign-Off Pipeline (5-Tier Chain)
            </CardTitle>
            <CardDescription className="text-xs">
              Sequential authorization workflow: Requester &rarr; Approver 1 &rarr; Approver 2 &rarr; H.O.D Finance &rarr; C.E.O.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {requisitions.map((req) => (
              <div key={req.id} className="p-4 border rounded-xl bg-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {req.refNo}
                    </span>
                    <h3 className="text-sm font-bold text-foreground mt-1">{req.items[0]?.description}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Requester: <strong>{req.staffName}</strong> &bull; Dept: <strong>{req.dept}</strong> &bull; Amount: <strong className="font-mono text-foreground">₦{req.totalAmountNative.toLocaleString()}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveStage(req.id)}
                      disabled={req.status !== "Pending Signatures"}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Sign Current Stage
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectStage(req.id)}
                      disabled={req.status !== "Pending Signatures"}
                      className="text-rose-600 border-rose-200 font-bold text-xs h-8 gap-1.5"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>

                {/* 4 Signatory Cards */}
                <div className="grid gap-3 sm:grid-cols-4">
                  {req.signatories.map((sig, idx) => (
                    <div
                      key={sig.roleLabel}
                      className={`p-3 border rounded-lg space-y-1 text-xs ${
                        sig.status === "approved"
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : sig.status === "pending"
                          ? "bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/50"
                          : "bg-muted/20 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Stage {idx + 1}</span>
                        {sig.status === "approved" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                        {sig.status === "pending" && <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />}
                      </div>
                      <p className="font-bold text-foreground text-[11px]">{sig.roleLabel}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{sig.name}</p>
                      {sig.comment && <p className="text-[10px] italic text-muted-foreground border-t pt-1">&ldquo;{sig.comment}&rdquo;</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: DOCUMENT REQUESTS & ATTACHMENTS */}
      {activeTab === "documents" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Paperclip className="h-5 w-5 text-primary" />
              Document Requests & Verification Management
            </CardTitle>
            <CardDescription className="text-xs">
              Request missing invoices, driver receipts, or affidavits directly from the requisition submitter per RVE-094.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {requisitions.map((req) => (
              <div key={req.id} className="p-4 border rounded-xl bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{req.refNo}</span>
                    <span className="font-bold text-sm text-foreground">{req.items[0]?.description}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDocRequestModalReqId(req.id)}
                    className="h-7 text-xs font-bold gap-1 text-primary"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> Request Additional Document
                  </Button>
                </div>

                {/* Existing Attachments */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase text-muted-foreground">Uploaded Supporting Files ({req.attachments.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {req.attachments.map((att, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/20 text-xs font-bold">
                        <FileCheck className="h-4 w-4 text-emerald-600" />
                        <span>{att.name}</span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {att.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requested Documents Pending Submitter Upload */}
                {req.requestedDocs.length > 0 && (
                  <div className="p-3 border border-amber-500/30 rounded-lg bg-amber-500/5 space-y-1">
                    <p className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> Additional Documents Requested from {req.staffName}:
                    </p>
                    <ul className="list-disc list-inside text-xs text-muted-foreground font-semibold">
                      {req.requestedDocs.map((doc, i) => (
                        <li key={i}>{doc} (Awaiting Requester Upload)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB 4: BANK ACCOUNT CHANGE SAFEGUARDS */}
      {activeTab === "safeguards" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              Vendor Bank Account Detail Edit Safeguards
            </CardTitle>
            <CardDescription className="text-xs">
              Strict anti-fraud protocol: Bank account name or number modifications require mandatory Police Report and Stamped Bank Confirmation Letter before authorization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requisitions.filter((r) => r.isAccountNameChange).map((req) => (
              <div key={req.id} className="p-4 border border-rose-500/30 rounded-xl bg-rose-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-rose-700 bg-rose-500/20 px-2 py-0.5 rounded">
                      {req.refNo}
                    </span>
                    <span className="font-bold text-sm text-foreground">{req.items[0]?.description}</span>
                  </div>
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <Lock className="h-4 w-4" /> Hard Fraud Protocol Active
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-xs font-semibold">
                  <div className="p-3 border rounded-lg bg-card space-y-1">
                    <p className="text-[11px] text-muted-foreground font-bold">1. Police Fraud Clearance Report</p>
                    <p className={`font-bold flex items-center gap-1.5 ${req.policeReportAttached ? "text-emerald-600" : "text-rose-600"}`}>
                      {req.policeReportAttached ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {req.policeReportAttached ? "Verified & Attached" : "Missing — System Blocking Sign-Off"}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg bg-card space-y-1">
                    <p className="text-[11px] text-muted-foreground font-bold">2. Stamped Bank Confirmation Letter</p>
                    <p className={`font-bold flex items-center gap-1.5 ${req.confirmationLetterAttached ? "text-emerald-600" : "text-rose-600"}`}>
                      {req.confirmationLetterAttached ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {req.confirmationLetterAttached ? "Verified & Attached" : "Missing — System Blocking Sign-Off"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB 5: RETIREMENT & ACQUITTAL AUDIT */}
      {activeTab === "retirement" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-600" />
              Appendix 2 Retirement & Acquittal Audit Tracker
            </CardTitle>
            <CardDescription className="text-xs">
              Matching post-disbursement receipts, vendor invoices, phone numbers, and retirement details back to RF Numbers for physical audit filing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto rounded-xl border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b text-muted-foreground font-bold uppercase">
                  <tr>
                    <th className="p-3">RF Ref No.</th>
                    <th className="p-3">Program & Staff</th>
                    <th className="p-3 font-mono text-right">Amount (₦)</th>
                    <th className="p-3">Appendix 2 Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold">
                  {requisitions.map((req) => (
                    <tr key={req.id}>
                      <td className="p-3 font-mono font-bold text-primary">{req.refNo}</td>
                      <td className="p-3">
                        <p className="font-bold text-foreground">{req.program}</p>
                        <p className="text-[11px] text-muted-foreground">{req.staffName}</p>
                      </td>
                      <td className="p-3 font-mono font-bold text-right">₦{req.totalAmountNative.toLocaleString()}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.acquittalStatus === "Fully Retired"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : req.acquittalStatus === "Partially Retired"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          }`}
                        >
                          {req.acquittalStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button size="sm" variant="outline" onClick={handlePrint} className="h-7 text-[11px] font-bold gap-1">
                          <Printer className="h-3 w-3" /> Export Physical File
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal: Request Additional Document */}
      {docRequestModalReqId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-base font-bold text-foreground">Request Additional Document from Submitter</h3>
            <form onSubmit={handleRequestDocSubmit} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-muted-foreground mb-1 font-bold">Document Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stamped Driver Delivery Confirmation Sheet"
                  value={newRequestedDocName}
                  onChange={(e) => setNewRequestedDocName(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDocRequestModalReqId(null)} className="h-8 text-xs font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="h-8 text-xs bg-primary font-bold">
                  Send Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Official Zowasel Requisition Form */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Create Official Zowasel Requisition Form</h2>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequisitionSubmit} className="p-5 space-y-4 text-xs font-semibold max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1 font-bold">REF NO. *</label>
                  <input
                    type="text"
                    required
                    value={newRefNo}
                    onChange={(e) => setNewRefNo(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 font-mono font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-bold">DEPARTMENT *</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 font-bold focus:outline-none"
                  >
                    <option value="Supply Chain">Supply Chain</option>
                    <option value="Mechanization">Mechanization</option>
                    <option value="Finance & Ops">Finance & Ops</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1 font-bold">PROGRAM *</label>
                  <input
                    type="text"
                    required
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-bold">LOCATION / STATE *</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-bold">STAFF MEMBER NAME *</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 font-bold focus:outline-none"
                />
              </div>

              <div className="border-t pt-3 space-y-3">
                <p className="font-bold text-foreground">Line Item & Beneficiary Account Details:</p>
                <div>
                  <label className="block text-muted-foreground mb-1 font-bold">Item Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cost for Freight & Hand Tiller Logistics"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1 font-bold">Quantity / Unit</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Unit"
                      value={newQty}
                      onChange={(e) => setNewQty(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-bold">Amount (NGN ₦) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 84000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1 font-bold">Target Account Number</label>
                    <input
                      type="text"
                      placeholder="1039361671"
                      value={newAcctNum}
                      onChange={(e) => setNewAcctNum(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-bold">Target Account Name</label>
                    <input
                      type="text"
                      placeholder="Sotubo Michael"
                      value={newAcctName}
                      onChange={(e) => setNewAcctName(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-bold">Bank Name</label>
                    <input
                      type="text"
                      placeholder="VFD Bank"
                      value={newBank}
                      onChange={(e) => setNewBank(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="acctEditCheck"
                    checked={isAccountEditToggle}
                    onChange={(e) => setIsAccountEditToggle(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                  <label htmlFor="acctEditCheck" className="text-xs font-bold text-rose-600 cursor-pointer">
                    Flag as Bank Account Detail Modification (Requires Police Report & Bank Letter)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="h-8 text-xs font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="h-8 text-xs bg-primary font-bold">
                  Create Requisition Form
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
