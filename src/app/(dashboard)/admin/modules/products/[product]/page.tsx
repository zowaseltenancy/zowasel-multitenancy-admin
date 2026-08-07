import { notFound } from "next/navigation";
import ProductDetailView from "@/features/modules/components/ProductDetailView";
import { ModuleProduct } from "@/types/module";

const VALID_PRODUCTS: ModuleProduct[] = ["croppilot", "marketplace", "acess"];

interface Props {
  params: Promise<{ product: string }>;
}

export default async function ModuleProductPage({ params }: Props) {
  const { product } = await params;

  if (!VALID_PRODUCTS.includes(product as ModuleProduct)) {
    notFound();
  }

  return <ProductDetailView product={product as ModuleProduct} />;
}
