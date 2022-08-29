import { Link } from '@mui/material';

export interface ExternalUnsafeLinkProps {
  href: string;
}

export const ExternallUnsafeLink = ({ href }: ExternalUnsafeLinkProps) => (
  <Link href={href} target="_blank" rel="noopener noreferer">
    {href}
  </Link>
);

export const ContactEmailLink = () => (
  <Link href="mailto:hi@windingtree.com" target="_blank">
    hi@windingtree.com
  </Link>
);
