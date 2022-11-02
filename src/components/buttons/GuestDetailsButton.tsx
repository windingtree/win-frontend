import { Button, ButtonProps, styled } from '@mui/material';
import { useResponsive } from 'src/hooks/useResponsive';
import Iconify from '../Iconify';

const ButtonStyle = styled(Button)(({ theme }) => ({
  ...theme.typography.body1,
  whiteSpace: 'nowrap',

  [theme.breakpoints.down('sm')]: {
    width: '100%',

    justifyContent: 'start',
    paddingLeft: theme.spacing(2),
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '&.highlighted': {
      border: `3px solid ${theme.palette.primary.main}`
    }
  },

  [theme.breakpoints.up('md')]: {
    justifyContent: 'center',
    minWidth: '144px'
  }
}));

const PersonIcon = () => <Iconify icon="akar-icons:person" width={18} height={18} />;

interface GuestDetailsButtonProps extends ButtonProps {
  adultCount: number;
  roomCount: number;
  childrenCount?: number;
}

const getChildrenText = (childrenCount: number | undefined) => {
  if (!childrenCount || childrenCount === 0) return '';
  if (childrenCount === 1) ', 1 child';
  return `,${childrenCount} children`;
};

export const GuestDetailsButton = ({
  roomCount,
  adultCount,
  childrenCount,
  size = 'large',
  variant = 'outlined',
  color = 'inherit',
  ...rest
}: GuestDetailsButtonProps) => {
  const isMobile = useResponsive('down', 'sm');
  const roomText = roomCount === 1 ? 'room' : 'rooms';
  const guestDetailsText = `${adultCount} guests, ${roomCount} ${roomText} ${getChildrenText(
    childrenCount
  )}`;

  return (
    <ButtonStyle
      startIcon={isMobile && <PersonIcon />}
      size={size}
      variant={variant}
      color={color}
      {...rest}
      //   disableRipple={isMobileView}
      //   className={highlightedInput === 'roomCount' ? 'highlighted' : ''}
    >
      {guestDetailsText}
    </ButtonStyle>
  );
};
