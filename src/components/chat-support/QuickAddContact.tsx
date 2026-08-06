import { useState, useRef, useEffect } from 'react';
import { useWhatsAppRepo } from '@/hooks/useWhatsAppRepository';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ChevronDown, Search } from 'lucide-react';

// Common country codes with flag emojis (extend as needed)
const countryCodes = [
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
];

interface Props {
  onClose: () => void;
  onContactCreated?: (contactId: string) => void;
}

export function QuickAddContact({ onClose, onContactCreated }: Props) {
  const { repo, refresh } = useWhatsAppRepo();
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [tags, setTags] = useState('');
  const [organizationId, setOrganizationId] = useState<string>('');

  // Phone state: country code + local number
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]); // Nigeria default
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const organizations = repo.getOrganizations();

  // Close country picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCountryPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countryCodes.filter(
    (c) =>
      c.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || !name.trim()) return;

    const fullPhone = selectedCountry.code + phoneNumber.replace(/^0+/, ''); // strip leading zeros

    const newContact = repo.addExternalContact({
      phoneNumber: fullPhone,
      displayName: name,
      department: department || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      avatarUrl: undefined,
      platformUserId: undefined,
      customMetadata: {},
    });

    if (organizationId) {
      repo.addMemberToOrganization(organizationId, newContact.id);
    }

    refresh();
    onContactCreated?.(newContact.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Add External Contact</h3>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm">Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* Phone Number with Country Code Picker */}
          <div>
            <label className="text-sm">Phone Number *</label>
            <div className="flex gap-0 mt-1">
              {/* Country code selector */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center gap-1 h-10 px-3 rounded-l-lg border border-input bg-background text-sm hover:bg-accent"
                  onClick={() => setShowCountryPicker(!showCountryPicker)}
                >
                  <span>{selectedCountry.flag}</span>
                  <span>{selectedCountry.code}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>

                {showCountryPicker && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-lg shadow-lg z-20">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                        <input
                          className="w-full pl-7 pr-2 py-1.5 text-sm rounded bg-muted outline-none"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent ${
                            selectedCountry.code === country.code ? 'bg-accent' : ''
                          }`}
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountryPicker(false);
                            setCountrySearch('');
                          }}
                        >
                          <span>{country.flag}</span>
                          <span>{country.country}</span>
                          <span className="ml-auto text-muted-foreground">{country.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone number input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="8012345678"
                className="flex-1 h-10 px-3 rounded-r-lg border border-input border-l-0 bg-background text-sm outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="text-sm">Department</label>
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm">Tags (comma separated)</label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="farmer, maize" />
          </div>

          {/* Organization */}
          <div>
            <label className="text-sm">Organization</label>
            <select
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
            >
              <option value="">None (external only)</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Contact</Button>
          </div>
        </form>
      </div>
    </div>
  );
}