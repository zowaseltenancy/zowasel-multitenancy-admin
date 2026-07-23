import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        outline:
          "border-border bg-background hover:bg-muted hover:border-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:opacity-90",
        ghost:
          "hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive text-white hover:opacity-90",
        link:
          "text-primary underline-offset-4 hover:underline",
      },

      size: {
        default: "h-10 px-4",
        xs: "h-7 px-2 text-xs rounded-lg",
        sm: "h-9 px-3 text-sm rounded-lg",
        lg: "h-11 px-5 text-base",
        icon: "size-10",
        "icon-xs": "size-7 rounded-lg",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-11",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
