import { Button, ButtonProps, styled } from '@mui/material';
import { forwardRef } from 'react';
import { useResponsive } from 'src/hooks/useResponsive';
import Iconify from '../Iconify';

const ButtonStyle = styled(Button)(({ theme }) => ({
  ...theme.typography.body1,
  whiteSpace: 'nowrap',

  [theme.breakpoints.down('md')]: {
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
    minWidth: '160px'
  }
}));

const PersonIcon = () => <Iconify icon="akar-icons:person" width={18} height={18} />;

interface GuestDetailsButtonProps extends ButtonProps {
  adultCount: number | string;
  roomCount: number | string;
  childrenCount?: number;
}

const getChildrenText = (childrenCount: number | undefined) => {
  if (!childrenCount || childrenCount === 0) return '';
  if (childrenCount === 1) ', 1 child';
  return `,${childrenCount} children`;
};

export const GuestDetailsButton = forwardRef<HTMLButtonElement, GuestDetailsButtonProps>(
  (
    {
      roomCount,
      adultCount,
      childrenCount,
      size = 'large',
      variant = 'outlined',
      color = 'inherit',
      ...rest
    }: GuestDetailsButtonProps,
    ref
  ) => {
    const isMobile = useResponsive('down', 'sm');
    const roomText = Number(roomCount) === 1 ? 'room' : 'rooms';
    const guestDetailsText = `${adultCount} guests, ${roomCount} ${roomText} ${getChildrenText(
      childrenCount
    )}`;

    return (
      <ButtonStyle
        ref={ref}
        startIcon={isMobile && <PersonIcon />}
        size={size}
        variant={variant}
        color={color}
        {...rest}
        disableRipple={isMobile}
        //   className={highlightedInput === 'roomCount' ? 'highlighted' : ''}
      >
        {guestDetailsText}
      </ButtonStyle>
    );
  }
);
