import type { ReactNode } from 'react';
import { Anchor } from 'grommet';
import { Share as ShareIcon } from 'grommet-icons';

export interface ExternalLinkProps {
  href: string;
  target?: string;
  label?: ReactNode | string;
  children?: ReactNode;
}

export const ExternalLink = ({ href, target, label, children }: ExternalLinkProps) => (
  <Anchor
    href={href}
    target={target}
    label={label || children}
    icon={<ShareIcon size="small" />}
    reverse
  />
);
