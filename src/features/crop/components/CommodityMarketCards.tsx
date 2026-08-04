import { Sprout, ShoppingBag, Gavel, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CommodityMarketSummary } from "@/types/crop";

interface CommodityMarketCardsProps {
  summary: CommodityMarketSummary;
}

export default function CommodityMarketCards({ summary }: CommodityMarketCardsProps) {
  const cards = [
    {
      title: "Total Crops",
      count: summary.totalCrops,
      icon: Sprout,
      colorClass: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400",
      cardBorder: "border-cyan-500/20 bg-cyan-500/5 dark:bg-cyan-500/10",
    },
    {
      title: "Crops for Sale",
      count: summary.cropsForSale,
      icon: ShoppingBag,
      colorClass: "bg-teal-500/15 text-teal-600 border-teal-500/30 dark:text-teal-400",
      cardBorder: "border-teal-500/20 bg-teal-500/5 dark:bg-teal-500/10",
    },
    {
      title: "Crops for Auction",
      count: summary.cropsForAuction,
      icon: Gavel,
      colorClass: "bg-sky-500/15 text-sky-600 border-sky-500/30 dark:text-sky-400",
      cardBorder: "border-sky-500/20 bg-sky-500/5 dark:bg-sky-500/10",
    },
    {
      title: "Total Wanted Crops",
      count: summary.wantedCrops,
      icon: Search,
      colorClass: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:text-indigo-400",
      cardBorder: "border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title} className={`border shadow-2xs ${card.cardBorder}`}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </p>
                <h3 className="mt-2 text-3xl font-bold">{card.count.toLocaleString()}</h3>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${card.colorClass}`}>
                <Icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
