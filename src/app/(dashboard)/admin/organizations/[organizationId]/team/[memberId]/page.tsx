import { notFound } from "next/navigation";
import UserDetailView from "@/features/users/components/UserDetailView";
import { mockUsers } from "@/features/users/data/mockUsers";

interface Props {
  params: Promise<{
    organizationId: string;
    memberId: string;
  }>;
}

export default async function OrganizationTeamMemberPage({ params }: Props) {
  const { memberId } = await params;
  const user = mockUsers.find((u) => u.id === memberId);

  if (!user) {
    notFound();
  }

  return <UserDetailView user={user} />;
}
