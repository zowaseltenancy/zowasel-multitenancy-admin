import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserModulePermission } from "@/types/user";

interface Props {
  permissions: UserModulePermission[];
}

export default function UserPermissionsTab({ permissions }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Granted Scope Permissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="p-3">Module Name</th>
                <th className="p-3 text-center">Read</th>
                <th className="p-3 text-center">Write</th>
                <th className="p-3 text-center">Approve</th>
                <th className="p-3 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {permissions.map((perm) => (
                <tr key={perm.moduleKey} className="hover:bg-muted/30">
                  <td className="p-3 font-medium">{perm.moduleName}</td>
                  <td className="p-3 text-center">
                    {perm.read ? (
                      <Check className="mx-auto h-4 w-4 text-green-600" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-gray-300" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {perm.write ? (
                      <Check className="mx-auto h-4 w-4 text-green-600" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-gray-300" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {perm.approve ? (
                      <Check className="mx-auto h-4 w-4 text-green-600" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-gray-300" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {perm.delete ? (
                      <Check className="mx-auto h-4 w-4 text-green-600" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-gray-300" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
