import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DepartmentRole } from '@/types/staff';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';
import {
  Mail, Phone, Cake, VenusAndMars, Heart, Globe,
  Briefcase, Building2, CalendarDays, Clock, MapPin,
  Home, Users, GraduationCap, Building, Banknote, Paperclip, FileText,
} from 'lucide-react';
import { StaffMember, StaffRole } from '@/types/staff';

interface Props {
  staff: StaffMember;
  roles: StaffRole[];
  departmentRoles?: DepartmentRole[];
}

export function StaffProfileView({ staff, roles, departmentRoles  }: Props) {
  const roleName = roles.find(r => r.id === staff.roleId)?.name || 'N/A';
  const initials = `${staff.firstName?.[0] || ''}${staff.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gradient-to-br from-card to-primary/5 p-6 rounded-2xl border">
        <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-md bg-primary/10 flex items-center justify-center shrink-0">
          {staff.avatarUrl ? (
            <img
              src={staff.avatarUrl}
              alt={`${staff.firstName} ${staff.lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-primary">{initials}</span>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {staff.firstName} {staff.lastName}
            </h1>
            <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
              {staff.status}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" />
            {roleName} · {staff.department}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {staff.email}</span>
            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {staff.phone}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column – Personal, Address, Next of Kin */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Date of Birth</span>
                <p className="font-medium flex items-center gap-1 mt-0.5"><Cake className="h-3.5 w-3.5 opacity-70" /> {staff.dateOfBirth || '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Gender</span>
                <p className="font-medium flex items-center gap-1 mt-0.5"><VenusAndMars className="h-3.5 w-3.5 opacity-70" /> {staff.gender || '—'}</p>
              </div>
              {staff.maritalStatus && (
                <div>
                  <span className="text-muted-foreground">Marital Status</span>
                  <p className="font-medium flex items-center gap-1 mt-0.5"><Heart className="h-3.5 w-3.5 opacity-70" /> {staff.maritalStatus}</p>
                </div>
              )}
              {staff.nationality && (
                <div>
                  <span className="text-muted-foreground">Nationality</span>
                  <p className="font-medium flex items-center gap-1 mt-0.5"><Globe className="h-3.5 w-3.5 opacity-70" /> {staff.nationality}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {staff.address?.line1 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" /> Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{staff.address.line1}</p>
                {staff.address.line2 && <p>{staff.address.line2}</p>}
                <p className="text-muted-foreground">{staff.address.city}, {staff.address.state}, {staff.address.country}</p>
                {staff.address.postalCode && <p className="text-muted-foreground">Postal Code: {staff.address.postalCode}</p>}
              </CardContent>
            </Card>
          )}

          {staff.nextOfKin?.fullName && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Next of Kin
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><span className="text-muted-foreground">Name</span><p className="font-medium">{staff.nextOfKin.fullName}</p></div>
                <div><span className="text-muted-foreground">Relationship</span><p className="font-medium">{staff.nextOfKin.relationship}</p></div>
                <div><span className="text-muted-foreground">Phone</span><p className="font-medium">{staff.nextOfKin.phone}</p></div>
                {staff.nextOfKin.email && <div><span className="text-muted-foreground">Email</span><p className="font-medium truncate">{staff.nextOfKin.email}</p></div>}
                {staff.nextOfKin.address && <div className="col-span-2"><span className="text-muted-foreground">Address</span><p className="font-medium">{staff.nextOfKin.address}</p></div>}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column – Employment, Education, Experience, Bank, Documents */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Employment
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div><span className="text-muted-foreground">Role</span><p className="font-medium">{roleName}</p></div>
              <div><span className="text-muted-foreground">Department</span><p className="font-medium">{staff.department}</p></div>
              <div><span className="text-muted-foreground">Employee ID</span><p className="font-medium">{staff.employeeId || '—'}</p></div>
              <div><span className="text-muted-foreground">Manager ID</span><p className="font-medium">{staff.managerId || '—'}</p></div>
              <div><span className="text-muted-foreground">Date Joined</span><p className="font-medium flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 opacity-70" />{staff.dateJoined ? new Date(staff.dateJoined).toLocaleDateString() : '—'}</p></div>
              <div><span className="text-muted-foreground">Type</span><p className="font-medium flex items-center gap-1"><Clock className="h-3.5 w-3.5 opacity-70" /> {staff.employmentType || '—'}</p></div>
              <div className="col-span-2 sm:col-span-3"><span className="text-muted-foreground">Work Location</span><p className="font-medium flex items-center gap-1"><MapPin className="h-3.5 w-3.5 opacity-70" /> {staff.workLocation || '—'}</p></div>
            </CardContent>
          </Card>

          {staff.education && staff.education.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" /> Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {staff.education.map((edu, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-4">
                    <p className="font-semibold">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</p>
                    {(edu.startYear || edu.endYear) && <p className="text-xs text-muted-foreground mt-0.5">{edu.startYear || '—'} – {edu.endYear || 'Present'}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {departmentRoles && departmentRoles.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Department Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {departmentRoles.map((role) => (
                      <li key={role.id} className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{role.name}</Badge>
                        <span className="text-muted-foreground text-xs">
                          ({Object.keys(role.permissions).length} modules)
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          {staff.workExperience && staff.workExperience.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" /> Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {staff.workExperience.map((exp, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-4">
                    <p className="font-semibold">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">{exp.jobTitle}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{exp.startDate || '—'} – {exp.endDate || 'Present'}</p>
                    {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(staff.bank?.bankName || staff.bank?.accountNumber) && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-primary" /> Bank & Tax
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {staff.bank.bankName && <div><span className="text-muted-foreground">Bank</span><p className="font-medium">{staff.bank.bankName}</p></div>}
                {staff.bank.accountNumber && <div><span className="text-muted-foreground">Account No.</span><p className="font-medium">{staff.bank.accountNumber}</p></div>}
                {staff.bank.sortCode && <div><span className="text-muted-foreground">Sort Code</span><p className="font-medium">{staff.bank.sortCode}</p></div>}
                {staff.bank.taxId && <div><span className="text-muted-foreground">Tax ID</span><p className="font-medium">{staff.bank.taxId}</p></div>}
              </CardContent>
            </Card>
          )}

          {staff.documents && staff.documents.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-primary" /> Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {staff.documents.map((doc, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {staff.departmentRoleIds && staff.departmentRoleIds.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Department Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {staff.departmentRoleIds.map(roleId => {
                    const role = departmentRoles?.find(r => r.id === roleId);
                    return role ? (
                      <li key={roleId} className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{role.name}</Badge>
                        <span className="text-muted-foreground text-xs">({Object.keys(role.permissions).length} modules)</span>
                      </li>
                    ) : null;
                  })}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}