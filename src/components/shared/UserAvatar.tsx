'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  className?: string;
}

export default function UserAvatar({ avatarUrl, firstName, lastName, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (avatarUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatar URLs are arbitrary external hosts (Unsplash mock data); next/image would require whitelisting every domain up front
      <img
        src={avatarUrl}
        alt={`${firstName} ${lastName}`}
        className={cn('rounded-full object-cover shrink-0', className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary/10 font-bold text-primary shrink-0',
        className
      )}
    >
      {firstName[0]}
      {lastName[0]}
    </div>
  );
}
