"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, ImagePlus, ArrowLeft } from "lucide-react";

import { createCampaignSchema, CreateCampaignSchema } from "@/schemas/marketing.schema";
import { CAMPAIGN_AUDIENCE_LABELS, MARKETING_CHANNEL_LABELS } from "@/constants/marketing";
import { MarketingChannel, MarketingTemplateType } from "@/types/marketing";
import { mockTemplates } from "../data/mockTemplates";
import TemplateGallery from "./TemplateGallery";
import MessagePreview from "./MessagePreview";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: MarketingChannel;
  onCreate: (values: CreateCampaignSchema) => void;
}

const AUDIENCES = Object.keys(CAMPAIGN_AUDIENCE_LABELS).filter(
  (key) => key !== "staff"
) as CreateCampaignSchema["audience"][];

export default function NewCampaignDialog({ open, onOpenChange, channel, onCreate }: Props) {
  const [step, setStep] = useState<"template" | "compose">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<MarketingTemplateType | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCampaignSchema>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      channel,
      templateType: "announcement",
      title: "",
      subject: "",
      body: "",
      heroImageUrl: "",
      ctaLabel: "",
      audience: "all",
      scheduledAt: "",
    },
  });

  useEffect(() => {
    if (open) {
      setStep("template");
      setSelectedTemplate(null);
      reset({
        channel,
        templateType: "announcement",
        title: "",
        subject: "",
        body: "",
        heroImageUrl: "",
        ctaLabel: "",
        audience: "all",
        scheduledAt: "",
      });
    }
  }, [open, channel, reset]);

  const handleTemplatePick = (type: MarketingTemplateType) => {
    setSelectedTemplate(type);
    const template = mockTemplates.find((t) => t.type === type)!;
    setValue("templateType", type);
    setValue("title", template.defaultHeadline);
    setValue("subject", template.defaultHeadline);
    setValue("body", template.defaultBody);
    if (channel === "newsletter") {
      setValue("ctaLabel", template.defaultCtaLabel);
    }
  };

  const handleHeroImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Local-only preview — no asset storage backend exists yet, so this
    // resets on refresh like the rest of the app's mock state does.
    const url = URL.createObjectURL(file);
    setValue("heroImageUrl", url);
  };

  const onSubmit = (values: CreateCampaignSchema) => {
    onCreate(values);
    onOpenChange(false);
  };

  const watchedTitle = watch("title");
  const watchedBody = watch("body");
  const watchedHero = watch("heroImageUrl");
  const watchedCta = watch("ctaLabel");
  const audienceLabel = CAMPAIGN_AUDIENCE_LABELS[watch("audience")];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={step === "compose" && channel === "newsletter" ? "sm:max-w-3xl" : "sm:max-w-lg"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            New {MARKETING_CHANNEL_LABELS[channel]} Campaign
          </DialogTitle>
          <DialogDescription>
            {step === "template"
              ? "Start from a template — pick the one that matches what you're sending."
              : `Drafting from the ${mockTemplates.find((t) => t.type === selectedTemplate)?.name} template.`}
          </DialogDescription>
        </DialogHeader>

        {step === "template" ? (
          <>
            <TemplateGallery value={selectedTemplate} onSelect={handleTemplatePick} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" disabled={!selectedTemplate} onClick={() => setStep("compose")}>
                Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className={channel === "newsletter" ? "grid gap-6 sm:grid-cols-2" : ""}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Title</label>
                  <Input {...register("title")} placeholder="July Harvest Season Update" />
                  {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
                </div>

                {channel === "newsletter" && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Subject Line</label>
                    <Input {...register("subject")} placeholder="Your July Harvest Season Update" />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Message</label>
                  <Textarea {...register("body")} rows={4} placeholder="Write your message..." />
                  {errors.body && <p className="mt-1 text-xs text-destructive">{errors.body.message}</p>}
                </div>

                {channel === "newsletter" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Hero Image</label>
                      <label className="mt-1 flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input px-3 text-xs font-semibold text-muted-foreground hover:bg-muted/40">
                        <ImagePlus className="h-3.5 w-3.5" />
                        {watchedHero ? "Change image" : "Upload image"}
                        <input type="file" accept="image/*" className="hidden" onChange={handleHeroImage} />
                      </label>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Button Label</label>
                      <Input {...register("ctaLabel")} placeholder="See What's New" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Audience</label>
                    <Select
                      value={watch("audience")}
                      onValueChange={(value) =>
                        setValue("audience", value as CreateCampaignSchema["audience"])
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AUDIENCES.map((key) => (
                          <SelectItem key={key} value={key}>
                            {CAMPAIGN_AUDIENCE_LABELS[key]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">
                      Schedule (optional)
                    </label>
                    <Input type="datetime-local" {...register("scheduledAt")} />
                  </div>
                </div>
              </div>

              {channel === "newsletter" && (
                <div className="rounded-xl border bg-muted/20 p-3">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Live Preview</p>
                  <div className="max-h-[420px] overflow-y-auto">
                    <MessagePreview
                      channel={channel}
                      title={watchedTitle || "Your headline"}
                      body={watchedBody || "Your message will appear here."}
                      audienceLabel={audienceLabel}
                      heroImageUrl={watchedHero || undefined}
                      ctaLabel={watchedCta || undefined}
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="sm:justify-between">
              <Button type="button" variant="ghost" className="gap-1.5" onClick={() => setStep("template")}>
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {watch("scheduledAt") ? "Schedule Campaign" : "Send Now"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
