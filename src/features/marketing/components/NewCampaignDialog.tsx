"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import { createCampaignSchema, CreateCampaignSchema } from "@/schemas/marketing.schema";
import { CAMPAIGN_AUDIENCE_LABELS, MARKETING_CHANNEL_LABELS } from "@/constants/marketing";
import { MarketingChannel } from "@/types/marketing";

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
      title: "",
      subject: "",
      body: "",
      audience: "all",
      scheduledAt: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ channel, title: "", subject: "", body: "", audience: "all", scheduledAt: "" });
    }
  }, [open, channel, reset]);

  const onSubmit = (values: CreateCampaignSchema) => {
    onCreate(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            New {MARKETING_CHANNEL_LABELS[channel]} Campaign
          </DialogTitle>
          <DialogDescription>
            Draft a {MARKETING_CHANNEL_LABELS[channel].toLowerCase()} campaign targeting a specific
            user group.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {watch("scheduledAt") ? "Schedule Campaign" : "Send Now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
