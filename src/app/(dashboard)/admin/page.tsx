export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">
          Welcome back 👋
        </h2>

        <p className="mt-2 text-muted-foreground">
          Here&apos;s an overview of your platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          "Organizations",
          "Users",
          "KYB Requests",
          "Revenue",
        ].map((card) => (
          <div
            key={card}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">
              {card}
            </p>

            <h3 className="mt-3 text-3xl font-bold">
              —
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}