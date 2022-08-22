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
  Divider,
  useMediaQuery
} from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Controller, useForm, useFormContext } from 'react-hook-form';

import React, { useRef, useState } from 'react';
import Iconify from 'src/components/Iconify';
import { getRandomValues } from 'crypto';
import { fileURLToPath } from 'url';
import { styled } from '@mui/system';
import { endDateDisplay, startDateDisplay } from './helpers';
import { RHFDateRangePicker } from 'src/components/hook-form/RHFDateRangePicker';

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
  width: '100%',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  boxShadow: `0 8px 16px 0 ${theme.palette.grey['400']}`,
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('md')]: {
    borderRadius: 10,
    width: 'auto',
    padding: 0,
    minWidth: 570,
    maxWidth: 600
  }
}));

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
            // TODO: display nummers
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
  const theme = useTheme();

  /**
   * Logic in relation to the popovers
   */
  const formRef = useRef<HTMLDivElement>();
  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<HTMLDivElement | null>(null);
  const [guestsAnchorEl, setGuestsAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const isDatePopoverOpen = Boolean(dateRangeAnchorEl);
  const isGuestsPopoverOpen = Boolean(guestsAnchorEl);

  /**
   * Logic in relation to handling the form
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
  const { roomCount, adultCount, dateRange } = values;
  //TODO: connect it to the actually query
  const onSubmit = async (data: FormValuesProps) => {
    console.log(data);
  };

  /**
   * Logic in relation to styling and textual UI
   */
  const roomText = roomCount === 1 ? 'room' : 'rooms';
  const guestDetailsText = `${adultCount} guests, ${roomCount} ${roomText}`;
  const fontSize = theme.typography.body2.fontSize;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Popover
        id="popover-date-range"
        open={isDatePopoverOpen}
        anchorEl={dateRangeAnchorEl}
        onClose={() => setDateRangeAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <RHFDateRangePicker name="dateRange" />
      </Popover>

      <Popover
        id="popover-guest-and-rooms"
        open={isGuestsPopoverOpen}
        anchorEl={guestsAnchorEl}
        onClose={() => setGuestsAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Persons />
      </Popover>
      {/* TODO: make sure it also looks good on mobile */}
      <ToolbarStyle ref={formRef}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          spacing={1}
          divider={
            <Divider
              orientation={
                useMediaQuery(theme.breakpoints.down('md')) ? 'horizontal' : 'vertical'
              }
              flexItem
            />
          }
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
              onClick={() => setDateRangeAnchorEl(formRef.current)}
              size="small"
              variant="text"
              sx={{
                whiteSpace: 'nowrap',
                ...theme.typography.body2
              }}
              color="inherit"
            >
              {startDateDisplay(dateRange)} — {endDateDisplay(dateRange)}
            </Button>
          </Box>

          <Box>
            <Button
              sx={{
                whiteSpace: 'nowrap',
                ...theme.typography.body2
              }}
              onClick={() => setGuestsAnchorEl(formRef.current)}
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
