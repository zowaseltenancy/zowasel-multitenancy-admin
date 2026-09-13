"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Lock,
  Globe,
  Calendar,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

import { usePageHeader } from "@/components/layout/PageHeaderContext";
import { useLead } from "@/features/leads/hooks/useLeads";
import { ConvertLeadValues, useLeadConversion } from "@/features/leads/hooks/useLeadConversion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";
import { LEAD_INTENDED_TYPE_LABELS, LEAD_SOURCE_LABELS } from "@/constants/lead";

interface Props {
  leadId: string;
}


export default function ConvertLeadPageView({ leadId }: Props) {
  const router = useRouter();
  const leadQuery = useLead(leadId);
  const lead = leadQuery.data;
  const { convert, isConverting } = useLeadConversion();


  // Form Fields:
  // 1. Business Owner Name
  const [ownerName, setOwnerName] = useState(lead?.contactName || "");
  // 2. Phone Number
  const [ownerPhone, setOwnerPhone] = useState(lead?.phone || "");
  // 3. Email
  const [ownerEmail, setOwnerEmail] = useState(lead?.email || "");
  // 5. Country
  const [country, setCountry] = useState(lead?.countryName || "Nigeria");
  // 6. Date of Birth
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  usePageHeader(
    lead ? `Convert: ${lead.businessName}` : "Convert Lead",
    "Onboarding & Provisioning"
  );

  if (leadQuery.isLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading prospective lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <Card className="mx-auto max-w-xl text-center p-8 mt-12 space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive/80" />
        <h2 className="text-xl font-bold text-foreground">Lead Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested lead ID ({leadId}) could not be located in the pipeline.
        </p>
        <Link href="/admin/leads/pipeline">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return to Lead Pipeline
          </Button>
        </Link>
      </Card>
    );
  }



  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!ownerName.trim()) {
      newErrors.ownerName = "Business owner name is required.";
    }
    if (!ownerPhone.trim()) {
      newErrors.ownerPhone = "Phone number is required.";
    }
    if (!ownerEmail.trim()) {
      newErrors.ownerEmail = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(ownerEmail)) {
      newErrors.ownerEmail = "Please enter a valid email address.";
    }
    if (!country.trim()) {
      newErrors.country = "Country is required.";
    }
    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation waits on the server's answer.
  //
  // Conversion can be refused — 409 if the lead is not CLOSED_WON or is already
  // converted, 422 if it has no email address. Redirecting on the click left
  // the admin back on the pipeline with only an error toast and the lead
  // untouched, which reads as though it worked.
  const handleConvert = () => {
    if (!validate()) return;

    const selectedGeo = GLOBAL_COUNTRY_CURRENCIES.find((c) => c.countryName === country);

    const values: ConvertLeadValues = {
      ownerName: ownerName.trim(),
      ownerPhone: ownerPhone.trim(),
      ownerEmail: ownerEmail.trim(),
      country: country.trim(),
      countryCode: selectedGeo?.countryCode ?? lead.countryCode,
      dateOfBirth,
      businessName: lead.businessName,
      intendedType: lead.intendedType,
      notes: lead.notes,
    };

    convert(lead, values, {
      onSuccess: () => router.push("/admin/leads/pipeline"),
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Breadcrumb & Header */}
      <div className="space-y-1 border-b pb-5">
        <Link
          href="/admin/leads/pipeline"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Leads Pipeline
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Convert {lead.businessName}
              </h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {LEAD_INTENDED_TYPE_LABELS[lead.intendedType]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the required owner credentials and personal details below to convert this lead into an organization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/admin/leads/${lead.id}`}>
              <Button variant="outline" size="sm">
                View Lead
              </Button>
            </Link>
            <Link href="/admin/leads/pipeline">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Conversion Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form Container (8 columns) */}
        <Card className="md:col-span-8 border shadow-xs">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Owner Account Information
            </CardTitle>
            <CardDescription className="text-xs">
              Fill in the 6 required fields below to initialize the business owner profile and secure platform credentials.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Field 1: Business Owner Name */}
            <div className="space-y-1.5">
              <Label htmlFor="ownerName" className="text-sm font-semibold flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Business Owner Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ownerName"
                value={ownerName}
                onChange={(e) => {
                  setOwnerName(e.target.value);
                  if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: "" }));
                }}
                placeholder="e.g. Musa Abdullahi"
                className="h-11"
              />
              {errors.ownerName && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.ownerName}
                </p>
              )}
            </div>

            {/* Field 2 & 3: Phone Number and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="ownerPhone" className="text-sm font-semibold flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ownerPhone"
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => {
                    setOwnerPhone(e.target.value);
                    if (errors.ownerPhone) setErrors((prev) => ({ ...prev, ownerPhone: "" }));
                  }}
                  placeholder="e.g. +234 806 112 3344"
                  className="h-11"
                />
                {errors.ownerPhone && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.ownerPhone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="ownerEmail" className="text-sm font-semibold flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => {
                    setOwnerEmail(e.target.value);
                    if (errors.ownerEmail) setErrors((prev) => ({ ...prev, ownerEmail: "" }));
                  }}
                  placeholder="e.g. musa@zariagrain.com"
                  className="h-11"
                />
                {errors.ownerEmail && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.ownerEmail}
                  </p>
                )}
              </div>
            </div>

            {/* The owner sets their own password.
                POST /admin/leads/{id}/convert creates the account with a hash of
                a secret that is generated, hashed and immediately discarded,
                then emails them a single-use link valid for 7 days. An admin
                choosing, seeing or holding a customer's password is not
                something the endpoint accepts. */}
            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 p-4">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                We&rsquo;ll email <span className="font-medium text-foreground">{ownerEmail || "the owner"}</span> a
                secure link to set their own password. It works once and expires in 7 days.
              </p>
            </div>

            {/* Field 5 & 6: Country and Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Country */}
              <div className="space-y-1.5">
                <Label htmlFor="country" className="text-sm font-semibold flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  Country <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={country}
                  onValueChange={(val) => {
                    if (val) {
                      setCountry(val);
                      if (errors.country) setErrors((prev) => ({ ...prev, country: "" }));
                    }
                  }}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {GLOBAL_COUNTRY_CURRENCIES.map((c) => (
                      <SelectItem key={c.countryCode} value={c.countryName}>
                        {c.flag} {c.countryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.country}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth" className="text-sm font-semibold flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    if (errors.dateOfBirth) setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
                  }}
                  className="h-11"
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t flex items-center justify-end gap-3">
              <Link href="/admin/leads/pipeline">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                onClick={handleConvert}
                disabled={isConverting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 px-6"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isConverting ? "Converting..." : "Convert Lead"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lead Intelligence Card (4 columns) */}
        <div className="md:col-span-4 space-y-4">
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Lead Information
                </span>
                <span className="text-xs font-mono text-muted-foreground">{lead.id}</span>
              </div>
              <CardTitle className="text-base font-bold text-foreground">
                {lead.businessName}
              </CardTitle>
              <CardDescription className="text-xs">
                {LEAD_INTENDED_TYPE_LABELS[lead.intendedType]}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Original Contact:</span>
                <span className="font-semibold text-foreground">{lead.contactName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Original Phone:</span>
                <span className="font-semibold text-foreground">{lead.phone}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Source:</span>
                <span className="font-semibold text-foreground uppercase">
                  {LEAD_SOURCE_LABELS[lead.source]}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Captured Date:</span>
                <span className="font-semibold text-foreground">{lead.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="capitalize text-[11px]">
                  {lead.status.replace("_", " ")}
                </Badge>
              </div>

              {lead.notes && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground block mb-1">Notes:</span>
                  <p className="text-muted-foreground italic text-[11px]">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <h5 className="font-semibold text-primary text-xs flex items-center gap-1.5">
              <FileCheck2 className="h-4 w-4" />
              Conversion Actions:
            </h5>
            <ul className="text-[11px] text-muted-foreground space-y-1 list-disc pl-4">
              <li>Creates tenant organization in directory</li>
              <li>Saves owner profile with phone, birthdate & country</li>
              <li>Emails the owner a single-use link to set their password</li>
              <li>Marks lead as converted in pipeline</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
