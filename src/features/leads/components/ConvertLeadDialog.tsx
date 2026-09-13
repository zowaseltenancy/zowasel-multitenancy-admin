"use client";

import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  Lock,
  Globe,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { LEAD_INTENDED_TYPE_LABELS } from "@/constants/lead";
import { Lead } from "@/types/lead";
import { ConvertLeadValues } from "../hooks/useLeadConversion";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onConfirm: (values?: ConvertLeadValues) => void;
}


export default function ConvertLeadDialog({ lead, onClose, onConfirm }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 6 conversion fields:
  // 1. Business Owner Name
  const [ownerName, setOwnerName] = useState("");
  // 2. Phone Number
  const [ownerPhone, setOwnerPhone] = useState("");
  // 3. Email
  const [ownerEmail, setOwnerEmail] = useState("");
  // 5. Country
  const [country, setCountry] = useState("Nigeria");
  // 6. Date of Birth
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lead) {
      setOwnerName(lead.contactName || "");
      setOwnerPhone(lead.phone || "");
      setOwnerEmail(lead.email || "");
      setCountry(lead.countryName || "Nigeria");
      setDateOfBirth("");
      setErrors({});
    }
  }, [lead]);

  if (!lead) return null;



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

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
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

      onConfirm(values);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={!!lead} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col h-full bg-background border-l shadow-2xl"
      >
        <SheetHeader className="p-6 border-b bg-muted/20 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 text-primary border-primary/30 bg-primary/10">
              Convert Lead
            </Badge>
            <span className="text-xs text-muted-foreground">{lead.businessName}</span>
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight text-foreground">
            Owner Information & Credentials
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Complete the 6 required fields below to convert this lead into a tenant organization.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Field 1: Business Owner Name */}
          <div className="space-y-1.5">
            <Label htmlFor="ownerNameDialog" className="text-xs font-semibold flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Business Owner Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ownerNameDialog"
              value={ownerName}
              onChange={(e) => {
                setOwnerName(e.target.value);
                if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: "" }));
              }}
              placeholder="e.g. Musa Abdullahi"
              className="h-10"
            />
            {errors.ownerName && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.ownerName}
              </p>
            )}
          </div>

          {/* Field 2: Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="ownerPhoneDialog" className="text-xs font-semibold flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ownerPhoneDialog"
              type="tel"
              value={ownerPhone}
              onChange={(e) => {
                setOwnerPhone(e.target.value);
                if (errors.ownerPhone) setErrors((prev) => ({ ...prev, ownerPhone: "" }));
              }}
              placeholder="e.g. +234 803 123 4567"
              className="h-10"
            />
            {errors.ownerPhone && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.ownerPhone}
              </p>
            )}
          </div>

          {/* Field 3: Email */}
          <div className="space-y-1.5">
            <Label htmlFor="ownerEmailDialog" className="text-xs font-semibold flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ownerEmailDialog"
              type="email"
              value={ownerEmail}
              onChange={(e) => {
                setOwnerEmail(e.target.value);
                if (errors.ownerEmail) setErrors((prev) => ({ ...prev, ownerEmail: "" }));
              }}
              placeholder="e.g. musa@zariagrain.com"
              className="h-10"
            />
            {errors.ownerEmail && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.ownerEmail}
              </p>
            )}
          </div>

          {/* The owner sets their own password.
              POST /admin/leads/{id}/convert creates the account with a hash of
              a secret that is generated, hashed and immediately discarded, then
              emails them a single-use link valid for 7 days. An admin choosing,
              seeing or holding a customer's password is not something the
              endpoint accepts. */}
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              We&rsquo;ll email{' '}
              <span className="font-medium text-foreground">{ownerEmail || 'the owner'}</span>{' '}
              a secure link to set their own password. It works once and expires in 7 days.
            </p>
          </div>

          {/* Field 5: Country */}
          <div className="space-y-1.5">
            <Label htmlFor="countryDialog" className="text-xs font-semibold flex items-center gap-1.5">
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
              <SelectTrigger className="h-10 w-full">
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
                <AlertCircle className="h-3 w-3" /> {errors.country}
              </p>
            )}
          </div>

          {/* Field 6: Date of Birth */}
          <div className="space-y-1.5">
            <Label htmlFor="dobDialog" className="text-xs font-semibold flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Date of Birth <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dobDialog"
              type="date"
              value={dateOfBirth}
              onChange={(e) => {
                setDateOfBirth(e.target.value);
                if (errors.dateOfBirth) setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
              }}
              className="h-10"
            />
            {errors.dateOfBirth && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.dateOfBirth}
              </p>
            )}
          </div>
        </div>

        <SheetFooter className="p-4 border-t bg-card shrink-0 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isSubmitting ? "Converting..." : "Convert Lead"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
