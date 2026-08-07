"use client";

import { useState } from "react";
import {
  Users,
  CheckCircle2,
  Leaf,
  CloudSun,
  Award,
  Search,
  Download,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  TooltipValueType,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import AnalysisNav from "@/features/analysis/components/AnalysisNav";
import { GeographicFilterState } from "@/types/geo";

interface SustainabilityProgram {
  id: string;
  name: string;
  sponsoringBuyer: string;
  farmers: number;
  hectares: number;
  targetMt: number;
  deliveredMt: number;
  co2Reduction: number; // tCO2e
  verificationStatus: "Verified & Audit Ready" | "In Satellite Audit" | "Pending Baseline";
  ndviScore: number;
}

const mockPrograms: SustainabilityProgram[] = [
  {
    id: "MRV-9081",
    name: "East Africa Sustainable Maize MRV",
    sponsoringBuyer: "Kilimanjaro Produce Ltd",
    farmers: 28400,
    hectares: 48000,
    targetMt: 15000,
    deliveredMt: 14200,
    co2Reduction: 16400,
    verificationStatus: "Verified & Audit Ready",
    ndviScore: 0.78,
  },
  {
    id: "MRV-9082",
    name: "West Africa Regenerative Soy Initiative",
    sponsoringBuyer: "Greenfield Foods Corp",
    farmers: 34100,
    hectares: 62000,
    targetMt: 20000,
    deliveredMt: 19800,
    co2Reduction: 21200,
    verificationStatus: "Verified & Audit Ready",
    ndviScore: 0.81,
  },
  {
    id: "MRV-9083",
    name: "Northern Nigeria Agroforestry Offset",
    sponsoringBuyer: "Zowasel Climate Alliance",
    farmers: 22300,
    hectares: 32000,
    targetMt: 8000,
    deliveredMt: 7600,
    co2Reduction: 5250,
    verificationStatus: "In Satellite Audit",
    ndviScore: 0.73,
  },
];

const carbonTrendData = [
  { month: "Jan", co2: 5200 },
  { month: "Feb", co2: 6800 },
  { month: "Mar", co2: 8400 },
  { month: "Apr", co2: 11200 },
  { month: "May", co2: 14500 },
  { month: "Jun", co2: 16400 },
];

export default function CropPilotMRVSustainabilityPage() {
  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const [programs] = useState<SustainabilityProgram[]>(mockPrograms);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<SustainabilityProgram | null>(null);

  const filteredPrograms = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sponsoringBuyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">CropPilot MRV & Sustainability</h1>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                Verra & ISO 14064 Compliant
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Program coverage, CO₂ reduction, carbon sequestration, satellite NDVI crop health, and soil organic carbon metrics.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-5 flex justify-end w-full h-full">
          <CompactRegionScopeSelector value={geoFilter} onChange={setGeoFilter} />
        </div>
      </div>

      <AnalysisNav />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                CO₂ Reduction (tCO₂e)
              </p>
              <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">42,850 tCO₂e</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-bold">+14.2% vs target</span>
              <span className="text-muted-foreground font-semibold">{programs.length} Active Programs</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-teal-500/5 dark:bg-teal-500/10 border-teal-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Farmers Onboarded
              </p>
              <Users className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">
              {programs.reduce((total, p) => total + p.farmers, 0).toLocaleString()}
            </p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-teal-600 font-bold">
                {programs.reduce((total, p) => total + p.hectares, 0).toLocaleString()} Hectares
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Satellite NDVI Crop Health
              </p>
              <CloudSun className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">0.78 NDVI</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-cyan-600 font-bold">Confidence: 98.4%</span>
              <span className="text-muted-foreground font-semibold">SOC: 3.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Audit Readiness Flag
              </p>
              <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">100% Certified</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-purple-600 font-bold">ISO & Verra Compliant</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-2xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <span>Cumulative CO₂ Reduction Trajectory (tCO₂e)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Satellite verified carbon sequestration across CropPilot farming programs.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={carbonTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: TooltipValueType | undefined) => [`${Number(value)} tCO₂e`, "Carbon Offset"]}
                  contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="co2" name="Carbon Sequestration" stroke="#10b981" fillOpacity={1} fill="url(#co2Grad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-2xs">
        <CardContent className="p-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search program name, buyer, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-2xs">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Active CropPilot Sustainability & MRV Programs</CardTitle>
              <CardDescription className="text-xs">
                Corporate buyer-supported programs tracking farmer impact, MT delivered, and CO₂ offset certification.
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold bg-muted px-2.5 py-1 rounded-md">
              Satellite Provider: Sentinel-2 NDVI
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Program ID & Name</th>
                  <th className="p-3">Sponsoring Buyer</th>
                  <th className="p-3">Farmer Reach</th>
                  <th className="p-3">Target vs Delivered MT</th>
                  <th className="p-3">NDVI Crop Health</th>
                  <th className="p-3">CO₂ Reduction</th>
                  <th className="p-3">Audit Certification</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y font-semibold">
                {filteredPrograms.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono">
                      <p className="font-bold text-foreground">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.id}</p>
                    </td>
                    <td className="p-3 font-bold text-foreground">{p.sponsoringBuyer}</td>
                    <td className="p-3">
                      <p className="font-bold text-foreground">{p.farmers.toLocaleString()} Farmers</p>
                      <p className="text-[11px] text-muted-foreground">{p.hectares.toLocaleString()} Hectares</p>
                    </td>
                    <td className="p-3 font-mono font-bold">
                      <span className="text-emerald-600">{p.deliveredMt.toLocaleString()}</span> / {p.targetMt.toLocaleString()} MT
                    </td>
                    <td className="p-3 font-bold font-mono text-cyan-600">{p.ndviScore} NDVI</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">{p.co2Reduction.toLocaleString()} tCO₂e</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> {p.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedProgram(p)}
                        className="h-7 text-[11px] font-bold text-primary border-primary/30"
                      >
                        Audit Certificate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-600" />
                <h2 className="text-base font-bold text-foreground">MRV Carbon Offset Audit Certificate</h2>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-semibold">
              <div className="p-4 border rounded-xl bg-emerald-500/5 border-emerald-500/20 space-y-2 text-center">
                <Award className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-foreground">{selectedProgram.name}</h3>
                <p className="text-xs text-muted-foreground">Certified Sponsoring Buyer: {selectedProgram.sponsoringBuyer}</p>
                <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono font-bold">
                  <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-md border border-emerald-500/20">
                    {selectedProgram.co2Reduction.toLocaleString()} tCO₂e Offset
                  </span>
                  <span className="bg-cyan-500/10 text-cyan-600 px-3 py-1 rounded-md border border-cyan-500/20">
                    {selectedProgram.ndviScore} NDVI Health Score
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-muted-foreground">
                <p className="flex justify-between"><span>Verra / ISO Registry ID:</span> <span className="font-mono text-foreground font-bold">VERRA-ZA-2026-90812</span></p>
                <p className="flex justify-between"><span>Satellite Confidence Index:</span> <span className="font-mono text-emerald-600 font-bold">98.4% (Sentinel-2 L2A)</span></p>
                <p className="flex justify-between"><span>Farmer Audit Headcount:</span> <span className="font-mono text-foreground font-bold">{selectedProgram.farmers.toLocaleString()} Verified Farmers</span></p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => setSelectedProgram(null)} className="h-8 text-xs font-bold">
                  Close
                </Button>
                <Button className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1">
                  <Download className="h-3.5 w-3.5" /> Download Verra Certificate PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
