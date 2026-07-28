import { Input as InputPrimitive } from '@base-ui/react/input';
import * as React from 'react';

import { cn } from '@/lib/utils';

type InputProps = React.ComponentPropsWithoutRef<typeof InputPrimitive>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, defaultValue, ...props }, ref) => {
    const inputProps: InputProps = {
      type,
      'data-slot': 'input',
      className: cn(
        'h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground transition-all duration-200 outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      ),
      ...props,
    };

    if (value !== undefined) {
      inputProps.value = value;
    }

    if (defaultValue !== undefined) {
      inputProps.defaultValue = defaultValue;
    }

    return <InputPrimitive ref={ref} {...inputProps} />;
  }
);

Input.displayName = 'Input';

export { Input };
