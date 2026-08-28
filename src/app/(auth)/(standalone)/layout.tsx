export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No header, no sidebar, no PageContainer
  return <>{children}</>;
}