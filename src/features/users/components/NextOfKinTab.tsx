import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NextOfKin } from "@/types/user";

interface Props {
  nextOfKin?: NextOfKin;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-medium">{value || "Not on file"}</p>
    </div>
  );
}

export default function NextOfKinTab({ nextOfKin }: Props) {
  if (!nextOfKin) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No next of kin details on file for this entity.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next of Kin</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <Field label="Full Name" value={nextOfKin.name} />
        <Field label="Relationship" value={nextOfKin.relationship} />
        <Field label="Phone Number" value={nextOfKin.phone} />
        <Field label="Email Address" value={nextOfKin.email} />
        <Field label="Address" value={nextOfKin.address} />
      </CardContent>
    </Card>
  );
}
