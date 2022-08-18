// import { DateTime } from 'luxon';
// import {
//   Box,
//   Button,
//   DateInput,
//   DropButton,
//   Form,
//   FormField,
//   Grid,
//   TextInput
// } from 'grommet';
// import { useState } from 'react';
// import { MessageBox } from './MessageBox';
// import { useWindowsDimension } from '../hooks/useWindowsDimension';
// import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { DateRange } from 'react-date-range';

import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Popover,
  Typography,
  Stack,
  TextField,
  useTheme,
  Toolbar,
  Divider
} from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { format } from 'date-fns';

import React, { useState } from 'react';
import Iconify from 'src/components/Iconify';
import { getRandomValues } from 'crypto';
import { fileURLToPath } from 'url';
import { styled } from '@mui/system';

// const today = DateTime.local().toISO();
// const tomorrow = DateTime.local().plus({ days: 1 }).toISO();

// const prarseAdults = (count) => (count === 1 ? `${count} adult` : `${count} adults`);
// const prarseChildren = (count) => (count === 1 ? `${count} child` : `${count} children`);
// const prarseRooms = (count) => (count === 1 ? `${count} room` : `${count} rooms`);

// export const ResponsiveTopGrid = (winWidth: number) => {
//   if (winWidth >= 1300) {
//     return ['5fr', '3fr', '4fr', '2fr'];
//   } else if (winWidth >= 1000) {
//     return ['5fr', '3fr', '4fr', '2fr'];
//   } else if (winWidth >= 768) {
//     return ['1fr', '1fr'];
//   } else if (winWidth >= 600) {
//     return ['1fr', '1fr'];
//   } else if (winWidth <= 500) {
//     return ['1fr'];
//   } else if (winWidth <= 400) {
//     return ['1fr'];
//   }
// };
// export const ResponsiveBottomGrid = (winWidth: number) => {
//   if (winWidth >= 1300) {
//     return ['25%', '25%', '25%', '25%'];
//   } else if (winWidth >= 1000) {
//     return ['25%', '25%', '25%', '25%'];
//   } else if (winWidth >= 768) {
//     return ['25%', '25%', '25%', '25%'];
//   } else if (winWidth >= 600) {
//     return ['100%'];
//   } else if (winWidth <= 500) {
//     return ['100%'];
//   } else if (winWidth <= 400) {
//     return ['100%'];
//   }
// };
// export const Search: React.FC = () => {
//   const { winWidth } = useWindowsDimension();

//   /**
//    * Smart logic in relation to the form.
//    */
//   const [location, setLocation] = useState<string>('');
//   const [checkInCheckOut, setCheckInCheckOut] = useState<[string, string]>([
//     today,
//     tomorrow
//   ]);
//   const [numSpacesReq, setNumSpacesReq] = useState<number>(1);
//   const [numAdults, setNumAdults] = useState<number>(1);
//   const [numChildren, setNumChildren] = useState<number>(0);

//   const handleDateChange = ({ value }: { value: string[] }) => {
//     const checkInisInPast =
//       DateTime.fromISO(today).toMillis() > DateTime.fromISO(value[0]).toMillis();
//     const checkOutisInPast =
//       DateTime.fromISO(tomorrow).toMillis() > DateTime.fromISO(value[1]).toMillis();
//     setCheckInCheckOut([
//       checkInisInPast ? today : value[0],
//       checkOutisInPast ? tomorrow : value[1]
//     ]);
//   };

//   /**
//    * Smart logic in relation to quering the data.
//    */
//   const { refetch, isFetching, error } = useAccommodationsAndOffers({
//     date: checkInCheckOut,
//     adultCount: numAdults,
//     childrenCount: numChildren,
//     location,
//     roomCount: numSpacesReq
//   });

//   const handleSubmit = () => {
//     refetch();
//   };

//   return (
//     <Box alignSelf="center">
//       <Form onSubmit={() => handleSubmit()}>
//         <Grid
//           margin={{ horizontal: 'large' }}
//           gap="small"
//           align="center"
//           columns={ResponsiveTopGrid(winWidth)}
//           responsive={true}
//         >
//           <FormField margin="0">
//             <TextInput
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               placeholder="Where are you going"
//             />
//           </FormField>
//           <FormField margin="0">
//             <DateInput
//               buttonProps={{
//                 placeholder: 'check-in check-out',
//                 label: `${DateTime.fromISO(checkInCheckOut[0]).toFormat(
//                   'dd.MM.yy'
//                 )}-${DateTime.fromISO(checkInCheckOut[1]).toFormat('dd.MM.yy')}`,
//                 icon: undefined,
//                 alignSelf: 'start',
//                 style: {
//                   border: 'none',
//                   padding: '0.51rem 0.75rem'
//                 }
//               }}
//               calendarProps={{
//                 // bounds: [defaultStartDay.toISO(), defaultEndDay.toISO()],
//                 fill: false,
//                 alignSelf: 'center',
//                 margin: 'small',
//                 size: 'medium'
//               }}
//               value={[
//                 DateTime.fromISO(checkInCheckOut[0]).toString(),
//                 DateTime.fromISO(checkInCheckOut[1]).toString()
//               ]}
//               onChange={({ value }) => handleDateChange({ value } as { value: string[] })}
//             />
//           </FormField>

//           <DropButton
//             label={`
//             ${prarseAdults(numAdults)}
//             ${prarseChildren(numChildren)}
//             ${prarseRooms(numSpacesReq)}
//           `}
//             dropContent={
//               <Box>
//                 <FormField label="Spaces">
//                   <TextInput
//                     value={numSpacesReq}
//                     type="number"
//                     min={1}
//                     disabled
//                     onChange={(e) => setNumSpacesReq(Number(e.target.value))}
//                     placeholder="type here"
//                   />
//                 </FormField>
//                 <FormField label="Adults">
//                   <TextInput
//                     min={1}
//                     value={numAdults}
//                     type="number"
//                     onChange={(e) => setNumAdults(Number(e.target.value))}
//                     placeholder="type here"
//                   />
//                 </FormField>
//                 <FormField label="Children">
//                   <TextInput
//                     min={0}
//                     value={numChildren}
//                     type="number"
//                     onChange={(e) => setNumChildren(Number(e.target.value))}
//                     placeholder="type here"
//                   />
//                 </FormField>
//               </Box>
//             }
//           />
//           <Box alignSelf="center">
//             <Button type="submit" label="Search" />
//           </Box>
//         </Grid>
//         <MessageBox loading type="info" show={isFetching}>
//           loading...
//         </MessageBox>
//         <MessageBox type="error" show={!!error}>
//           {(error as Error) && (error as Error).message
//             ? (error as Error).message
//             : 'Something went wrong '}
//         </MessageBox>
//       </Form>
//     </Box>
//   );
// };

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  borderRadius: 10,
  boxShadow: `0 8px 16px 0 ${theme.palette.grey['400']}`,
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('md')]: {
    minWidth: 570
  }
}));

const DatePicker = () => {
  const theme = useTheme();
  const primaryColors = theme.palette.primary;
  const { control } = useFormContext();

  return (
    <Controller
      name="dateRange"
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <DateRange
          editableDateInputs={true}
          onChange={(newValue) => onChange([newValue.selection])}
          moveRangeOnFirstSelection={false}
          ranges={value}
          rangeColors={[primaryColors.main, primaryColors.lighter, primaryColors.darker]}
        />
      )}
    />
  );
};

const Persons = () => {
  const FIELD_WIDTH = '60px';
  return (
    <Stack spacing={2} p={4}>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography fontWeight="bold">Adults</Typography>
          <Typography variant="caption">18 years or older</Typography>
        </Box>
        <Box width={FIELD_WIDTH}>
          <RHFTextField
            size="small"
            name="adultCount"
            type="number"
            InputProps={{
              inputMode: 'numeric',
              inputProps: {
                min: 1
              }
            }}
          />
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography fontWeight="bold">Rooms</Typography>
          <Typography variant="caption">Select number of rooms.</Typography>
        </Box>
        <Box width={FIELD_WIDTH}>
          <RHFTextField
            size="small"
            name="roomCount"
            type="number"
            defaultValue={1}
            InputProps={{
              inputMode: 'numeric',
              inputProps: {
                min: 1
              }
            }}
          />
        </Box>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography fontWeight="bold">Children</Typography>
          <Typography variant="caption">
            We don&apos;t support booking with children yet.
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};
type FormValuesProps = {
  location: string;
  roomCount: number;
  adultCount: number;
};

const LocationIcon = () => <Iconify icon={'eva:pin-outline'} width={12} height={12} />;

export const SearchForm: React.FC = () => {
  /**
   * Logic in relation to the dates
   */
  const theme = useTheme();
  const primaryColors = theme.palette.primary;
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  ]);

  const formatDisplayDate = (date) => {
    const dayNumber = format(date, 'dd');
    const dayName = format(date, 'EEEE');
    const shortendDayName = dayName.slice(0, 3);
    const month = format(date, 'LLLL');
    const shortendMonth = month.slice(0, 3);

    const displayedDate = `${shortendDayName}, ${shortendMonth} ${dayNumber}`;
    return displayedDate;
  };

  const startDateDisplay = () => {
    const startDate = dateRange[0].startDate;

    if (!startDate) return 'Check-in';

    return formatDisplayDate(startDate);
  };

  const endDateDisplay = () => {
    const startDate = dateRange[0].endDate;

    if (!startDate) return 'Check-out';

    return formatDisplayDate(startDate);
  };

  /**
   * Logic in relation to the date popover
   */
  const formRef = React.useRef<HTMLDivElement>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleOpenDatePopOver = () => {
    setAnchorEl(formRef.current);
  };

  const handleCloseDatePopOver = () => {
    setAnchorEl(null);
  };
  const isDatePopoverOpen = Boolean(anchorEl);
  const idDatePopover = isDatePopoverOpen ? 'date-popover' : undefined;

  /**
   * Logic in relation to the persons popover
   */

  const [guestsAnchorEl, setGuestsAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleOpenGuestsPopover = () => {
    setGuestsAnchorEl(formRef.current);
  };

  const handleCloseGuestsPopover = () => {
    setGuestsAnchorEl(null);
  };

  const isGuestsPopoverOpen = Boolean(guestsAnchorEl);
  const idGuestsPopover = isDatePopoverOpen ? 'guests-popover' : undefined;

  /**
   * Handling the form
   */
  const defaultValues = {
    location: '',
    adultCount: '2',
    roomCount: '1',
    dateRange: [
      {
        startDate: null,
        endDate: null,
        key: 'selection'
      }
    ]
  };

  const methods = useForm<FormValuesProps>({
    defaultValues
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const values = watch();

  const { roomCount, adultCount } = values;

  const roomText = roomCount === 1 ? 'room' : 'rooms';
  const guestDetailsText = `${adultCount} guests, ${roomCount} ${roomText}`;

  const onSubmit = async (data: FormValuesProps) => {
    console.log(data);
  };

  const fontSize = theme.typography.body2.fontSize;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Popover
        id={idDatePopover}
        open={isDatePopoverOpen}
        anchorEl={anchorEl}
        onClose={handleCloseDatePopOver}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        {/* <DateRange
            editableDateInputs={true}
            onChange={(item) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            rangeColors={[
              primaryColors.main,
              primaryColors.lighter,
              primaryColors.darker
            ]}
          /> */}

        <DatePicker />
      </Popover>

      <Popover
        id={idGuestsPopover}
        open={isGuestsPopoverOpen}
        anchorEl={guestsAnchorEl}
        onClose={handleCloseGuestsPopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <Persons />
      </Popover>
      <ToolbarStyle ref={formRef} aria-describedby={idDatePopover}>
        <Stack
          fullWidth
          spacing={1}
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
        >
          <RHFTextField
            variant="standard"
            placeholder="Where are you going?"
            name="location"
            InputProps={{
              style: { fontSize },
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon />
                </InputAdornment>
              )
            }}
          />
          <Box>
            <Button
              onClick={handleOpenDatePopOver}
              size="small"
              variant="text"
              sx={{
                whiteSpace: 'nowrap',
                ...theme.typography.body2
              }}
              color="inherit"
            >
              {startDateDisplay()} — {endDateDisplay()}
            </Button>
          </Box>

          <Box>
            <Button
              sx={{
                whiteSpace: 'nowrap',
                ...theme.typography.body2
              }}
              onClick={handleOpenGuestsPopover}
              size="small"
              variant="text"
              color="inherit"
            >
              {guestDetailsText}
            </Button>
          </Box>
        </Stack>
      </ToolbarStyle>
    </FormProvider>
  );
};
