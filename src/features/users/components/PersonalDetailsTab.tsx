import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalDetails } from "@/types/user";

interface Props {
  personalDetails?: PersonalDetails;
}

const MARITAL_STATUS_LABELS: Record<string, string> = {
  single: "Single",
  married: "Married",
  divorced: "Divorced",
  widowed: "Widowed",
};

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-medium">{value || "Not on file"}</p>
    </div>
  );
}

export default function PersonalDetailsTab({ personalDetails }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <Field label="Date of Birth" value={personalDetails?.dateOfBirth} />
        <Field
          label="Marital Status"
          value={personalDetails?.maritalStatus ? MARITAL_STATUS_LABELS[personalDetails.maritalStatus] : undefined}
        />
        <Field label="State of Origin" value={personalDetails?.stateOfOrigin} />
        <Field label="Nationality" value={personalDetails?.nationality} />
        <Field label="Residential Address" value={personalDetails?.residentialAddress} />
      </CardContent>
    </Card>
  );
}
