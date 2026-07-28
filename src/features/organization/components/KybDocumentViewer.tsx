"use client";

import { useState } from "react";
import { FileText, CheckCircle2, XCircle, ArrowLeft, Download, ShieldCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Organization } from "@/types/organization";
import KybRejectDialog from "./KybRejectDialog";

interface Props {
  organization: Organization;
}

export default function KybDocumentViewer({ organization }: Props) {
  const [selectedDoc, setSelectedDoc] = useState<string>("cac_certificate");
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const documents = [
    {
      id: "cac_certificate",
      title: "CAC Certificate of Incorporation",
      filename: `CAC_Reg_${organization.businessId}.pdf`,
      type: "PDF Document",
      size: "2.4 MB",
      status: "Verified",
      uploadDate: "2026-01-20",
    },
    {
      id: "tax_clearance",
      title: "Tax Clearance Certificate (TIN)",
      filename: `TIN_Tax_${organization.businessId}.pdf`,
      type: "PDF Document",
      size: "1.8 MB",
      status: "Verified",
      uploadDate: "2026-01-22",
    },
    {
      id: "director_id",
      title: "Director Identity Document (NIN/Passport)",
      filename: `Director_ID_${organization.owner.name.replace(/\s+/g, "_")}.jpg`,
      type: "Image JPEG",
      size: "850 KB",
      status: "Pending Review",
      uploadDate: "2026-01-25",
    },
  ];

  const currentDoc = documents.find((d) => d.id === selectedDoc) || documents[0];

  return (
    <div className="space-y-6">
      {/* Back button and status header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/admin/kyb" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to KYB Queue
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">KYB Document Inspection — {organization.name}</h1>
          <p className="text-sm text-muted-foreground">{organization.businessId} • Submitted by {organization.owner.name}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => setIsRejectOpen(true)}>
            <XCircle className="h-4 w-4 mr-2" /> Reject KYB
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Approve KYB Application
          </Button>
        </div>
      </div>

      {/* Grid: Left Document Selectors | Right Mock PDF Document Viewer */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Submitted Documents</CardTitle>
              <CardDescription>Click a document to inspect preview.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-3">
              {documents.map((doc) => {
                const isSelected = doc.id === selectedDoc;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <FileText className={`h-5 w-5 shrink-0 mt-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1 overflow-hidden">
                      <div className="font-semibold text-sm truncate">{doc.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{doc.filename} • {doc.size}</div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="h-full min-h-[500px] flex flex-col">
            <CardHeader className="border-b border-border py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{currentDoc.title}</CardTitle>
                <CardDescription>{currentDoc.filename} ({currentDoc.size})</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Download Document
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/20 text-center">
              <div className="max-w-md space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg">{currentDoc.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Verified document container for {organization.name}. Certificate registration hash match confirmed.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> Official Document Preview Verified
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Modal */}
      <KybRejectDialog
        open={isRejectOpen}
        organizationName={organization.name}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={(reason) => {
          setIsRejectOpen(false);
        }}
      />
    </div>
  );
}
