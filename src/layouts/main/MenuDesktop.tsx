import { NavLink as RouterLink, NavLinkProps } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Link, Stack, LinkProps } from '@mui/material';
import { MenuProps, MenuItemProps } from './type';

interface LinkStyleProps extends LinkProps {
  component?: React.ForwardRefExoticComponent<
    NavLinkProps & React.RefAttributes<HTMLAnchorElement>
  >;
  to?: string;
  end?: boolean;
}

const LinkStyle = styled(Link)<LinkStyleProps>(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.primary,
  marginRight: theme.spacing(5),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter
  }),
  '&:hover': {
    opacity: 0.48,
    textDecoration: 'none'
  }
}));

export default function MenuDesktop({ isOffset, navConfig }: MenuProps) {
  return (
    <Stack direction="row">
      {navConfig.map((link) => (
        <MenuDesktopItem key={link.title} item={link} isOffset={isOffset} />
      ))}
    </Stack>
  );
}

type MenuDesktopItemProps = {
  item: MenuItemProps;
  isOffset: boolean;
};

function MenuDesktopItem({ item, isOffset }: MenuDesktopItemProps) {
  const { title, path } = item;

  return (
    <LinkStyle
      to={path}
      component={RouterLink}
      end={path === '/'}
      sx={{
        ...(isOffset && { color: 'text.primary' }),

        '&.active': {
          color: 'primary.main'
        }
      }}
    >
      {title}
    </LinkStyle>
  );
}
