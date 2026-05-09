import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  PropsWithChildren,
} from "react";

type ElementTag = "div" | "section";

type ViewportSectionProps = PropsWithChildren<
  Omit<ComponentPropsWithoutRef<"div">, "as"> & {
    className?: string;
    intrinsicSize?: string;
    as?: ElementTag;
  }
>;

export default function ViewportSection({
  children,
  className,
  intrinsicSize = "900px",
  as = "section",
  ...props
}: ViewportSectionProps) {
  const Component = as as ElementTag;
  const style = {
    contentVisibility: "auto",
    containIntrinsicSize: intrinsicSize,
  } as CSSProperties;

  return (
    <Component className={className} style={style} {...props}>
      {children}
    </Component>
  );
}

/**
 * Keeps HTML fully server-rendered for SEO while letting the browser defer
 * offscreen rendering work until the section approaches the viewport.
 */
