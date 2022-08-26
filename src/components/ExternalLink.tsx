import type { ReactNode } from 'react';
import { Chip } from '@mui/material';
import Iconify from '../components/Iconify';
import { useTheme } from '@mui/material/styles';

export interface ExternalLinkProps {
  href: string;
  target?: string;
  label?: ReactNode | string;
  children?: ReactNode;
}

export const ExternalLink = ({ href, target, label, children }: ExternalLinkProps) => {
  const theme = useTheme();

  return (
    <Chip
      component="a"
      label={label || children}
      variant="outlined"
      href={href}
      target={target}
      icon={
        <Iconify color="inherit" icon="cil:external-link" marginLeft={theme.spacing(1)} />
      }
      clickable
      sx={{
        fontSize: 'inherit',
        color: 'inherit',
        textDecoration: 'underline'
      }}
    />
  );
};
