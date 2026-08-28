import { X, Tag, Phone, Building, Link } from 'lucide-react';
import { WhatsAppContact, Organization } from '@/types/whatsapp';
import { useWhatsAppRepo } from '@/hooks/useWhatsAppRepository';

interface Props {
  contactId: string;
  onClose: () => void;
}

export function ContactDrawer({ contactId, onClose }: Props) {
  const { repo } = useWhatsAppRepo();
  const contact = repo.getContact(contactId);
  if (!contact) return null;

  // Find organisation membership
  const orgs = repo.getOrganizations();
  const memberOrgs = orgs.filter((org) =>
    org.memberContactIds.includes(contactId)
  );

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Contact Info</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 flex flex-col items-center">
        <img
          src={contact.avatarUrl || 'https://i.pravatar.cc/100?u=default'}
          className="w-20 h-20 rounded-full mb-3"
          alt=""
        />
        <h2 className="text-xl font-bold">{contact.displayName}</h2>
        {contact.department && (
          <span className="text-sm text-muted-foreground">{contact.department}</span>
        )}
      </div>

      <div className="px-4 space-y-4 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{contact.phoneNumber}</span>
        </div>

        {contact.platformUserId && (
          <div className="flex items-center gap-2">
            <Link className="h-4 w-4 text-muted-foreground" />
            <a
              href={`/admin/users/${contact.platformUserId}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Platform Profile
            </a>
          </div>
        )}

        <div>
          <p className="font-medium mb-1">Tags</p>
          <div className="flex flex-wrap gap-1">
            {contact.tags.length > 0 ? (
              contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">No tags</span>
            )}
          </div>
        </div>

        {memberOrgs.length > 0 && (
          <div>
            <p className="font-medium mb-1">Organisations</p>
            {memberOrgs.map((org) => (
              <div key={org.id} className="flex items-center gap-2 text-muted-foreground">
                <Building className="h-3 w-3" />
                <span>{org.name}</span>
              </div>
            ))}
          </div>
        )}

        {contact.customMetadata && (
          <div>
            <p className="font-medium mb-1">Additional Info</p>
            <pre className="text-xs bg-muted p-2 rounded">
              {JSON.stringify(contact.customMetadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}