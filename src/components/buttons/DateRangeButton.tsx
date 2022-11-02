import { Button, ButtonProps, styled } from '@mui/material';
import { DateRangeType } from 'src/components/hook-form/RHFDateRangePicker';
import { format } from 'date-fns';
import { useResponsive } from 'src/hooks/useResponsive';
import Iconify from '../Iconify';

const CalendarIcon = () => <Iconify icon="akar-icons:calendar" width={18} height={18} />;

const formatDisplayDate = (date) => {
  const dayNumber = format(date, 'dd');
  const dayName = format(date, 'EEEE');
  const shortendDayName = dayName.slice(0, 3);
  const month = format(date, 'LLLL');
  const shortendMonth = month.slice(0, 3);

  const displayedDate = `${shortendDayName}, ${shortendMonth} ${dayNumber}`;
  return displayedDate;
};

export const startDateDisplay = (startDate) => {
  if (!startDate) return 'Check-in';

  return formatDisplayDate(startDate);
};

export const endDateDisplay = (endDate) => {
  if (!endDate) return 'Check-out';

  return formatDisplayDate(endDate);
};

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
    justifyContent: 'center'
  }
}));

interface DatesButtonProps extends ButtonProps {
  dateRange: DateRangeType;
  startDate?: Date;
  endDate?: Date;
}

export const DateRangeButton = ({
  size = 'large',
  variant = 'outlined',
  color = 'inherit',
  startDate,
  endDate,
  ...rest
}: DatesButtonProps) => {
  const isMobile = useResponsive('down', 'sm');

  return (
    <ButtonStyle
      startIcon={isMobile && <CalendarIcon />}
      size={size}
      variant={variant}
      color={color}
      {...rest}
    >
      {startDateDisplay(startDate)} — {endDateDisplay(endDate)}
    </ButtonStyle>
  );
};
