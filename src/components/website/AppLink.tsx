import NextLink, { type LinkProps } from "next/link";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type PropsWithChildren,
} from "react";

type AnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
>;

export type AppLinkProps = PropsWithChildren<
  LinkProps &
    AnchorProps & {
      prefetch?: boolean;
    }
>;

const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink(
  { prefetch = false, children, ...props },
  ref,
) {
  return (
    <NextLink ref={ref} prefetch={prefetch} {...props}>
      {children}
    </NextLink>
  );
});

export default AppLink;
