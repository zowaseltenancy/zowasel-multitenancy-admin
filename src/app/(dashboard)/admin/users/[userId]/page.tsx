import { notFound } from "next/navigation";
import UserDetailView from "@/features/users/components/UserDetailView";
import { mockUsers } from "@/features/users/data/mockUsers";

interface Props {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { userId } = await params;
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    notFound();
  }

  return <UserDetailView user={user} />;
}
