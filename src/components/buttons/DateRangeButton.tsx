import { Button, ButtonProps, styled } from '@mui/material';
import { format } from 'date-fns';
import { forwardRef } from 'react';
import { useResponsive } from 'src/hooks/useResponsive';
import Iconify from '../Iconify';

const CalendarIcon = () => <Iconify icon="akar-icons:calendar" width={18} height={18} />;

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
    minWidth: '240px'
  }
}));

interface DatesButtonProps extends ButtonProps {
  startDate?: Date | null;
  endDate?: Date | null;
}

export const DateRangeButton = forwardRef<HTMLButtonElement, DatesButtonProps>(
  (
    {
      size = 'large',
      variant = 'outlined',
      color = 'inherit',
      startDate,
      endDate,
      ...rest
    }: DatesButtonProps,
    ref
  ) => {
    const isMobile = useResponsive('down', 'sm');

    return (
      <ButtonStyle
        ref={ref}
        startIcon={isMobile && <CalendarIcon />}
        size={size}
        variant={variant}
        color={color}
        disableRipple={isMobile}
        {...rest}
      >
        {startDateDisplay(startDate)} — {endDateDisplay(endDate)}
      </ButtonStyle>
    );
  }
);

export const startDateDisplay = (startDate) => {
  if (!startDate) return 'Check-in';

  return formatDisplayDate(startDate);
};

export const endDateDisplay = (endDate) => {
  if (!endDate) return 'Check-out';

  return formatDisplayDate(endDate);
};

const formatDisplayDate = (date) => {
  const dayNumber = format(date, 'dd');
  const dayName = format(date, 'EEEE');
  const shortendDayName = dayName.slice(0, 3);
  const month = format(date, 'LLLL');
  const shortendMonth = month.slice(0, 3);

  const displayedDate = `${shortendDayName}, ${shortendMonth} ${dayNumber}`;
  return displayedDate;
};
