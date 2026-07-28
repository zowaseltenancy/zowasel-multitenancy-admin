import { notFound } from "next/navigation";
import UserDetailView from "@/features/users/components/UserDetailView";
import { mockUsers } from "@/features/users/data/mockUsers";

interface Props {
  params: Promise<{
    organizationId: string;
    agentId: string;
  }>;
}

export default async function OrganizationAgentPage({ params }: Props) {
  const { agentId } = await params;
  const user = mockUsers.find((u) => u.id === agentId);

  if (!user) {
    notFound();
  }

  return <UserDetailView user={user} />;
}
