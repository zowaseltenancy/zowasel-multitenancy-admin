import { ShieldCheck, Smartphone, MessageCircle, Mail, CheckCheck } from "lucide-react";
import { MarketingChannel } from "@/types/marketing";

interface Props {
  channel: MarketingChannel;
  title: string;
  body: string;
  audienceLabel: string;
  heroImageUrl?: string;
  ctaLabel?: string;
  timestamp?: string;
}

// Single rendering source for "what does this actually look like on a
// recipient's device" — used by both the campaign composer (live preview
// while editing) and the campaign detail page (viewing after creation), so
// the two can never silently drift into two different previews.
export default function MessagePreview({ channel, title, body, audienceLabel, heroImageUrl, ctaLabel, timestamp }: Props) {
  if (channel === "newsletter") {
    return (
      <div className="border rounded-2xl bg-white text-slate-900 shadow-sm overflow-hidden font-sans">
        <div className="bg-slate-100 p-4 border-b space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">From:</span>
            <span className="font-medium text-slate-800">Zowasel Broadcast &lt;newsletters@zowasel.com&gt;</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">To:</span>
            <span className="font-medium text-slate-800">{audienceLabel} Members</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Subject:</span>
            <span className="font-bold text-slate-900">{title}</span>
          </div>
        </div>

        <div className="space-y-6">
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob: preview, not an optimizable asset
            <img src={heroImageUrl} alt="" className="w-full h-40 object-cover" />
          ) : null}

          <div className="px-8 pt-2 space-y-6">
            <div className="border-b pb-4 flex items-center justify-between">
              <span className="font-extrabold text-emerald-700 tracking-wider text-lg">ZOWASEL</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Official Tenant Bulletin</span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">{title}</h2>

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{body}</div>

            {ctaLabel ? (
              <div className="pt-2 pb-4">
                <div className="inline-block bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm">
                  {ctaLabel}
                </div>
              </div>
            ) : null}

            <div className="border-t pt-6 pb-8 text-[11px] text-slate-400 space-y-1">
              <p>&copy; {new Date().getFullYear()} Zowasel Inc. All rights reserved.</p>
              <p>You received this email because your organization is subscribed to platform alerts.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (channel === "sms") {
    return (
      <div className="max-w-sm mx-auto border-4 border-slate-700 rounded-3xl bg-slate-950 p-4 shadow-xl text-white">
        <div className="w-20 h-4 bg-slate-700 rounded-full mx-auto mb-4" />
        <div className="text-center pb-3 border-b border-slate-800">
          <p className="font-bold text-xs text-slate-200">ZOWASEL</p>
          <p className="text-[10px] text-slate-400">Short Code: 34100 &bull; Verified SMS</p>
        </div>

        <div className="py-8 space-y-3">
          <div className="bg-slate-800 text-slate-100 p-3.5 rounded-2xl rounded-tl-xs text-xs leading-relaxed max-w-[90%] shadow-md">
            <p>{body}</p>
            <span className="block text-[9px] text-slate-400 text-right mt-1.5">
              {timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "10:30 AM"}
            </span>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-800">
          Character Count: {body.length} / 160 ({Math.max(1, Math.ceil(body.length / 160))} SMS Segment{body.length > 160 ? "s" : ""})
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto border-4 border-emerald-900/60 rounded-3xl bg-[#0b141a] p-4 shadow-xl text-white">
      <div className="w-20 h-4 bg-slate-700 rounded-full mx-auto mb-4" />
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">Z</div>
        <div>
          <div className="flex items-center gap-1">
            <p className="font-bold text-xs text-slate-100">Zowasel Official</p>
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
          </div>
          <p className="text-[9px] text-emerald-400">WhatsApp Official Business Account</p>
        </div>
      </div>

      <div className="py-6 space-y-3">
        <div className="bg-[#005c4b] text-slate-100 p-3.5 rounded-2xl rounded-tl-xs text-xs leading-relaxed max-w-[92%] shadow-md space-y-2">
          <p className="font-bold text-emerald-200 text-[11px]">{title}</p>
          <p>{body}</p>
          <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/80 pt-1">
            <span>{timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "09:15 AM"}</span>
            <CheckCheck className="h-3.5 w-3.5 text-cyan-300" />
          </div>
        </div>
      </div>

      <div className="bg-[#1f2c34] p-2.5 rounded-xl text-center text-[10px] text-slate-300">
        Reply to this verified business channel
      </div>
    </div>
  );
}

export function ChannelPreviewIcon({ channel, className }: { channel: MarketingChannel; className?: string }) {
  if (channel === "newsletter") return <Mail className={className} />;
  if (channel === "sms") return <Smartphone className={className} />;
  return <MessageCircle className={className} />;
}
