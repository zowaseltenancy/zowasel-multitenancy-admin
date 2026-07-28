import { Input as InputPrimitive } from '@base-ui/react/input';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentPropsWithoutRef<typeof InputPrimitive> {
  'data-slot'?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, defaultValue, ...props }, ref) => {
    return (
      <InputPrimitive
        ref={ref}
        type={type}
        data-slot="input"
        value={value}
        defaultValue={defaultValue}
        className={cn(
          'h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground transition-all duration-200 outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
