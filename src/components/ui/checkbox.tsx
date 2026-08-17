"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4.5 shrink-0 items-center justify-center rounded-[5px] border-2 border-neutral-400 bg-white shadow-2xs transition-colors outline-none hover:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-80 aria-invalid:border-destructive dark:border-neutral-500 dark:bg-neutral-800 dark:hover:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:border-primary dark:data-checked:bg-primary cursor-pointer",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon strokeWidth={3} className="text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
