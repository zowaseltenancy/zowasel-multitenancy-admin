import ModuleDetailView from "@/features/modules/components/ModuleDetailView";

interface ModuleDetailPageProps {
  params: Promise<{
    moduleId: string;
  }>;
}

export default async function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  const { moduleId } = await params;

  return (
    <div className="space-y-6">
      <ModuleDetailView moduleId={moduleId} />
    </div>
  );
}
