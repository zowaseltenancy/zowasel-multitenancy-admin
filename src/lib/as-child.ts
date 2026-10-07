import * as React from "react"

type RenderableProps = {
  children?: React.ReactNode
  render?: unknown
}

/**
 * base-ui primitives take a `render` element where Radix took `asChild`.
 * Triggers call this so existing `<XTrigger asChild><Button/></XTrigger>`
 * usages keep working: the child becomes the rendered element.
 */
export function resolveAsChild<P extends RenderableProps>({
  asChild,
  children,
  ...rest
}: P & { asChild?: boolean }): P {
  if (asChild && React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return { ...rest, render: children, children: children.props.children } as unknown as P
  }
  return { ...rest, children } as unknown as P
}
