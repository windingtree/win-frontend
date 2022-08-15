import { DateTime } from 'luxon';
import { Box, Button, DateInput, Form, FormField, Grid, TextInput } from 'grommet';
import { useState } from 'react';
import { MessageBox } from './MessageBox';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';

const today = DateTime.local().toISO();
const tomorrow = DateTime.local().plus({ days: 1 }).toISO();

export const ResponsiveTopGrid = (winWidth: number) => {
  if (winWidth >= 1300) {
    return ['50%', '50%'];
  } else if (winWidth >= 1000) {
    return ['50%', '50%'];
  } else if (winWidth >= 768) {
    return ['50%', '50%'];
  } else if (winWidth >= 600) {
    return ['40%', '60%'];
  } else if (winWidth <= 500) {
    return ['40%', '60%'];
  } else if (winWidth <= 400) {
    return ['40%', '60%'];
  }
};
export const ResponsiveBottomGrid = (winWidth: number) => {
  if (winWidth >= 1300) {
    return ['25%', '25%', '25%', '25%'];
  } else if (winWidth >= 1000) {
    return ['25%', '25%', '25%', '25%'];
  } else if (winWidth >= 768) {
    return ['25%', '25%', '25%', '25%'];
  } else if (winWidth >= 600) {
    return ['100%'];
  } else if (winWidth <= 500) {
    return ['100%'];
  } else if (winWidth <= 400) {
    return ['100%'];
  }
};
export const Search: React.FC<{
  open: boolean;
}> = ({ open }) => {
  const { winWidth } = useWindowsDimension();

  /**
   * Smart logic in relation to the form.
   */
  const [location, setLocation] = useState<string>('');
  const [checkInCheckOut, setCheckInCheckOut] = useState<[string, string]>([
    today,
    tomorrow
  ]);
  const [numSpacesReq, setNumSpacesReq] = useState<number>(1);
  const [numAdults, setNumAdults] = useState<number>(1);
  const [numChildren, setNumChildren] = useState<number>(0);

  const handleDateChange = ({ value }: { value: string[] }) => {
    const checkInisInPast =
      DateTime.fromISO(today).toMillis() > DateTime.fromISO(value[0]).toMillis();
    const checkOutisInPast =
      DateTime.fromISO(tomorrow).toMillis() > DateTime.fromISO(value[1]).toMillis();
    setCheckInCheckOut([
      checkInisInPast ? today : value[0],
      checkOutisInPast ? tomorrow : value[1]
    ]);
  };

  /**
   * Smart logic in relation to quering the data.
   */
  const { refetch, isFetching, error } = useAccommodationsAndOffers({
    date: checkInCheckOut,
    adultCount: numAdults,
    childrenCount: numChildren,
    location,
    roomCount: numSpacesReq
  });

  const handleSubmit = () => {
    refetch();
  };

  return (
    <Box
      pad="medium"
      style={{
        position: 'absolute',
        zIndex: `${open ? '2' : '-1'}`,

        width: winWidth > 900 ? '33rem' : '100%',
        maxWidth: '100%',
        left: 0,
        top: '10%'
      }}
    >
      <Form
        style={{
          background: 'white',
          padding: '0.75rem',
          borderRadius: '0.5rem'
        }}
        onSubmit={() => handleSubmit()}
      >
        <Grid columns={ResponsiveTopGrid(winWidth)} responsive={true}>
          {/* TODO: Include form validation if there is an empty string for the location */}
          <FormField label="Place">
            <TextInput
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="type here"
            />
          </FormField>
          <FormField label="Date">
            <DateInput
              buttonProps={{
                label: `${DateTime.fromISO(checkInCheckOut[0]).toFormat(
                  'dd.MM.yy'
                )}-${DateTime.fromISO(checkInCheckOut[1]).toFormat('dd.MM.yy')}`,
                icon: undefined,
                alignSelf: 'start',
                style: {
                  border: 'none',
                  padding: '0.51rem 0.75rem'
                }
              }}
              calendarProps={{
                // bounds: [defaultStartDay.toISO(), defaultEndDay.toISO()],
                fill: false,
                alignSelf: 'center',
                margin: 'small',
                size: 'medium'
              }}
              value={[
                DateTime.fromISO(checkInCheckOut[0]).toString(),
                DateTime.fromISO(checkInCheckOut[1]).toString()
              ]}
              onChange={({ value }) => handleDateChange({ value } as { value: string[] })}
            />
          </FormField>
        </Grid>
        <Grid columns={'25%'} responsive={true}>
          <FormField label="Spaces">
            <TextInput
              value={numSpacesReq}
              type="number"
              disabled
              onChange={(e) => setNumSpacesReq(Number(e.target.value))}
              placeholder="type here"
            />
          </FormField>
          <FormField label="Adults">
            <TextInput
              value={numAdults}
              type="number"
              onChange={(e) => setNumAdults(Number(e.target.value))}
              placeholder="type here"
            />
          </FormField>
          <FormField label="Children">
            <TextInput
              value={numChildren}
              type="number"
              onChange={(e) => setNumChildren(Number(e.target.value))}
              placeholder="type here"
            />
          </FormField>
          <Box alignSelf="center" pad={{ vertical: 'small', horizontal: 'xsmall' }}>
            <Button type="submit" label="Search" />
          </Box>
        </Grid>
        <MessageBox loading type="info" show={isFetching}>
          loading...
        </MessageBox>
        <MessageBox type="error" show={!!error}>
          Something went wrong. Try again.
        </MessageBox>
      </Form>
    </Box>
  );
};
