import { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Link,
  Typography,
  BreadcrumbsProps,
  Breadcrumbs as MUIBreadcrumbs,
  Container,
  useTheme
} from '@mui/material';
import Iconify from './Iconify';

type TLink = {
  href?: string;
  name: string;
  icon?: ReactElement;
};

export interface Props extends BreadcrumbsProps {
  links: TLink[];
  activeLast?: boolean;
}

export const Breadcrumbs = ({ links, activeLast = true, ...other }: Props) => {
  const theme = useTheme();
  const currentLink = links[links.length - 1].name;

  const listDefault = links.map((link) => <LinkItem key={link.name} link={link} />);

  const listActiveLast = links.map((link) => (
    <Box key={link.name}>
      {link.name !== currentLink ? (
        <LinkItem link={link} />
      ) : (
        <Typography
          variant="body2"
          sx={{
            m: 0,
            maxWidth: 260,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: 'text.disabled',
            textOverflow: 'ellipsis'
          }}
        >
          {currentLink}
        </Typography>
      )}
    </Box>
  ));

  return (
    <Container sx={{ mx: 3 }}>
      <MUIBreadcrumbs
        separator={
          <Iconify color={theme.palette.primary.main} icon="mdi:chevron-right" />
        }
        {...other}
      >
        {activeLast ? listDefault : listActiveLast}
      </MUIBreadcrumbs>
    </Container>
  );
};

type LinkItemProps = {
  link: TLink;
};

const LinkItem = ({ link }: LinkItemProps) => {
  const { href, name, icon } = link;
  const theme = useTheme();
  return (
    <Link
      key={name}
      variant="subtitle2"
      component={RouterLink}
      to={href || '#'}
      sx={{
        lineHeight: 2,
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.primary.main,
        '& > div': { display: 'inherit' }
      }}
    >
      {icon && <Box sx={{ mr: 1, '& svg': { width: 20, height: 20 } }}>{icon}</Box>}
      {name}
    </Link>
  );
};
