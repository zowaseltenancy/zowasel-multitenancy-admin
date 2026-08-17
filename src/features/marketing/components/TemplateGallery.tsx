import { Megaphone, ShoppingBag, Repeat2, Newspaper, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockTemplates } from "../data/mockTemplates";
import { MARKETING_TEMPLATE_COLORS } from "@/constants/marketing";
import { MarketingTemplateType } from "@/types/marketing";

const TEMPLATE_ICONS: Record<MarketingTemplateType, LucideIcon> = {
  announcement: Megaphone,
  product_listing: ShoppingBag,
  engagement: Repeat2,
  newsletter_digest: Newspaper,
};

interface Props {
  value: MarketingTemplateType | null;
  onSelect: (type: MarketingTemplateType) => void;
}

export default function TemplateGallery({ value, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {mockTemplates.map((template) => {
        const Icon = TEMPLATE_ICONS[template.type];
        const active = value === template.type;
        return (
          <button
            key={template.type}
            type="button"
            onClick={() => onSelect(template.type)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all cursor-pointer",
              active ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/40 hover:bg-muted/30"
            )}
          >
            <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-white", MARKETING_TEMPLATE_COLORS[template.type])}>
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-foreground">{template.name}</span>
            <span className="text-[11px] leading-snug text-muted-foreground">{template.description}</span>
          </button>
        );
      })}
    </div>
  );
}
