"use client";
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, ExternalLink } from 'lucide-react';
import { Contact } from '@/lib/whatsapp/types';
import { toast } from 'sonner';

export default function ContactDrawer({
  open,
  onOpenChange,
  contact,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  contact: Contact | null;
  onSave: (data: Partial<Contact>) => void;
}) {
  const [name, setName] = useState(contact?.name || '');
  const [phone, setPhone] = useState(contact?.phone || '');
  const [department, setDepartment] = useState(contact?.department || '');
  const [tags, setTags] = useState<string[]>(contact?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [metadata, setMetadata] = useState<Record<string, string>>(contact?.metadata || {});
  const [metaKey, setMetaKey] = useState('');
  const [metaVal, setMetaVal] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const addMeta = () => {
    if (metaKey.trim() && metaVal.trim()) {
      setMetadata({ ...metadata, [metaKey.trim()]: metaVal.trim() });
      setMetaKey('');
      setMetaVal('');
    }
  };

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error('Name and phone are required');
      return;
    }
    onSave({ name, phone, department, tags, metadata });
    toast.success(contact ? 'Contact updated' : 'Contact created');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        <div className="p-6 space-y-8">
          <SheetHeader>
            <SheetTitle className="text-2xl">
              {contact ? 'Edit Contact' : 'New Contact'}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            <div>
              <Label>Full Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Farmer" />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234..." />
            </div>
            <div>
              <Label>Department</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Sales" />
            </div>
            {contact?.profileLink && (
              <a
                href={contact.profileLink}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary inline-flex items-center gap-1"
              >
                Open WhatsApp Profile <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <div className="border-t pt-6 space-y-4">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag"
              />
              <Button onClick={addTag} size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="gap-1">
                  #{t}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setTags(tags.filter((x) => x !== t))} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <Label>Custom Metadata</Label>
            <div className="flex gap-2">
              <Input value={metaKey} onChange={(e) => setMetaKey(e.target.value)} placeholder="Key" />
              <Input value={metaVal} onChange={(e) => setMetaVal(e.target.value)} placeholder="Value" />
              <Button onClick={addMeta} size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2">
              {Object.entries(metadata).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm bg-muted/40 rounded px-3 py-2">
                  <span><span className="font-medium">{k}:</span> {v}</span>
                  <X
                    className="h-4 w-4 cursor-pointer text-muted-foreground"
                    onClick={() => {
                      const next = { ...metadata };
                      delete next[k];
                      setMetadata(next);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}