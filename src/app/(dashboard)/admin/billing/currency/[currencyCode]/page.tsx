"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck, Percent, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CountryFlag from "@/components/shared/CountryFlag";
import ExportMenu from "@/components/shared/ExportMenu";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";
import { ExportTable } from "@/lib/export";

interface PageProps {
  params: Promise<{ currencyCode: string }>;
}

export default function CountryCurrencyDetailPage({ params }: PageProps) {
  const { currencyCode } = use(params);

  const country = GLOBAL_COUNTRY_CURRENCIES.find(
    (c) =>
      c.countryCode.toLowerCase() === currencyCode.toLowerCase() ||
      c.currencyCode.toLowerCase() === currencyCode.toLowerCase()
  ) || GLOBAL_COUNTRY_CURRENCIES[0];

  const [individualMarkup, setIndividualMarkup] = useState(
    (country.customMarkupPercentage ?? country.markupPercentage).toString()
  );
  const [useRegionalMarkup, setUseRegionalMarkup] = useState(
    country.useRegionalMarkup ?? true
  );

  const regionalRate = useRegionalMarkup ? 1.5 : 0;
  const totalMarkup = Number(individualMarkup || 0) + regionalRate;
  const finalRate = country.baseRateToUSD * (1 + totalMarkup / 100);

  const handleSaveIndividualMarkup = () => {
    const val = Number(individualMarkup);
    if (!Number.isNaN(val)) {
      toast.success(`Individual markup rate for ${country.countryName} updated to ${val}%!`);
    }
  };

  const exportTableData: ExportTable = {
    title: `Currency Rate Record - ${country.countryName} (${country.currencyCode})`,
    headers: ["Property", "Value"],
    rows: [
      ["Country Name", country.countryName],
      ["Country Code", country.countryCode],
      ["Currency Code", country.currencyCode],
      ["Currency Name", country.currencyName],
      ["Symbol", country.currencySymbol],
      ["Continent", country.continent],
      ["Sub-Region", country.subRegionName],
      ["PAPSS Network Supported", country.papssSupported ? "Yes" : "No"],
      ["Base Wholesale Rate (USD)", country.baseRateToUSD.toString()],
      ["Individual Country Markup", `${individualMarkup}%`],
      ["Regional Markup Addition", `${regionalRate}%`],
      ["Total Combined Markup", `${totalMarkup.toFixed(1)}%`],
      ["Adjusted Final Exchange Rate", finalRate.toFixed(4)],
    ],
  };

  return (
    <div className="space-y-8 max-w-5xl" id="currency-detail-capture">
      {/* Navigation & Header */}
      <div>
        <Link href="/admin/billing/currency">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> Back to Currency Management
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <CountryFlag countryCode={country.countryCode} countryName={country.countryName} size="xl" className="rounded-lg shadow-md border" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{country.countryName}</h1>
                <Badge variant="outline" className="font-mono text-xs">{country.countryCode}</Badge>
                {country.isDefaultPlatformCurrency && (
                  <Badge className="bg-primary text-primary-foreground text-xs">Default Currency</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {country.subRegionName} • {country.continent.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ExportMenu
              table={exportTableData}
              captureElementId="currency-detail-capture"
            />

            {country.papssSupported ? (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5 px-3 py-1.5 text-xs">
                <ShieldCheck className="h-4 w-4" /> PAPSS Network Member
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted text-muted-foreground px-3 py-1.5 text-xs">
                Swift / International Network
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 space-y-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Official Currency</p>
            <p className="text-2xl font-bold">{country.currencyCode} ({country.currencySymbol})</p>
            <p className="text-xs text-muted-foreground">{country.currencyName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Base Provider Rate</p>
            <p className="text-2xl font-bold font-mono">1 USD = {country.currencySymbol}{country.baseRateToUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">Interbank wholesale rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Adjusted Final Rate</p>
            <p className="text-2xl font-bold font-mono text-primary">1 USD = {country.currencySymbol}{finalRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">Total Markup: {totalMarkup.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Country Markup Management Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Percent className="h-4 w-4 text-primary" /> Individual Country Markup Configuration
          </CardTitle>
          <CardDescription>
            Set the specific individual exchange markup rate for {country.countryName} ({country.currencyCode}).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-sm">Specific Country Markup Rate</div>
              <div className="text-xs text-muted-foreground">Overrides global defaults for transactions involving {country.countryName}.</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-32">
                <Input
                  type="number"
                  min={0}
                  max={30}
                  step={0.1}
                  value={individualMarkup}
                  onChange={(e) => setIndividualMarkup(e.target.value)}
                  className="pr-7 text-right text-sm font-semibold"
                />
                <Percent className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <Button size="sm" onClick={handleSaveIndividualMarkup} className="gap-1 cursor-pointer">
                <Save className="h-4 w-4" /> Save Rate
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-sm flex items-center gap-2">
                Regional Markup Addition (+1.5%)
                <Badge variant="outline" className={useRegionalMarkup ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-muted text-muted-foreground"}>
                  {useRegionalMarkup ? "Active" : "Disabled"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">Stack the {country.subRegionName} regional rate on top of this country's individual rate.</div>
            </div>

            <Button
              variant={useRegionalMarkup ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const nextState = !useRegionalMarkup;
                setUseRegionalMarkup(nextState);
                toast.info(`Regional markup ${nextState ? "enabled" : "disabled"} for ${country.countryName}`);
              }}
              className="cursor-pointer"
            >
              {useRegionalMarkup ? "Disable Regional Markup" : "Enable Regional Markup"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}