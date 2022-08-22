import { DateTime } from 'luxon';
import {
  Box,
  Button,
  DateInput,
  DropButton,
  Form,
  FormField,
  Grid,
  TextInput
} from 'grommet';
import { useEffect, useState } from 'react';
import { MessageBox } from './MessageBox';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { useNavigate, useSearchParams } from 'react-router-dom';

const today = DateTime.local().toISO();
const tomorrow = DateTime.local().plus({ days: 1 }).toISO();

const prarseAdults = (count) => (count === 1 ? `${count} adult` : `${count} adults`);
const prarseChildren = (count) => (count === 1 ? `${count} child` : `${count} children`);
const prarseRooms = (count) => (count === 1 ? `${count} room` : `${count} rooms`);

export const ResponsiveTopGrid = (winWidth: number) => {
  if (winWidth >= 1300) {
    return ['5fr', '3fr', '4fr', '2fr'];
  } else if (winWidth >= 1000) {
    return ['5fr', '3fr', '4fr', '2fr'];
  } else if (winWidth >= 768) {
    return ['1fr', '1fr'];
  } else if (winWidth >= 600) {
    return ['1fr', '1fr'];
  } else if (winWidth <= 500) {
    return ['1fr'];
  } else if (winWidth <= 400) {
    return ['1fr'];
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
export const Search: React.FC<{ onSubmit?: () => void }> = ({ onSubmit }) => {
  const { winWidth } = useWindowsDimension();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /**
   * Smart logic in relation to the form.
   */
  const [location, setLocation] = useState<string>('');
  const [checkInCheckOut, setCheckInCheckOut] = useState<[string, string]>([today, tomorrow]);
  const [numSpacesReq, setNumSpacesReq] = useState<number>(1);
  const [numAdults, setNumAdults] = useState<number>(1);
  const [numChildren, setNumChildren] = useState<number>(0);

  useEffect(() => {
    setCheckInCheckOut([
      searchParams.get('checkIn') || today,
      searchParams.get('checkOut') || tomorrow
    ])
    setLocation(searchParams.get('location') || '')
    setNumSpacesReq(Number(searchParams.get('numSpacesReq') || 1))
    setNumAdults(Number(searchParams.get('numAdults') || 1))
    setNumChildren(Number(searchParams.get('numChildren') || 0))
    console.log('searchparams', searchParams)
  }, [searchParams])

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
    const query = new URLSearchParams([
      ['checkIn', String(checkInCheckOut[0])],
      ['checkOut', String(checkInCheckOut[1])],
      ['numAdults', String(numAdults)],
      ['numChildren', String(numChildren)],
      ['location', String(location)],
      ['numSpacesReq', String(numSpacesReq)],
    ]);
    navigate(`/search?${query}`)
  };

  return (
    <Box alignSelf="center">
      <Form onSubmit={() => handleSubmit()}>
        <Grid
          margin={{ horizontal: 'large' }}
          gap="small"
          align="center"
          columns={ResponsiveTopGrid(winWidth)}
          responsive={true}
        >
          <FormField margin="0">
            <TextInput
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where are you going"
            />
          </FormField>
          <FormField margin="0">
            <DateInput
              buttonProps={{
                placeholder: 'check-in check-out',
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

          <DropButton
            label={`
            ${prarseAdults(numAdults)}
            ${prarseChildren(numChildren)}
            ${prarseRooms(numSpacesReq)}
          `}
            dropContent={
              <Box>
                <FormField label="Spaces">
                  <TextInput
                    value={numSpacesReq}
                    type="number"
                    min={1}
                    disabled
                    onChange={(e) => setNumSpacesReq(Number(e.target.value))}
                    placeholder="type here"
                  />
                </FormField>
                <FormField label="Adults">
                  <TextInput
                    min={1}
                    value={numAdults}
                    type="number"
                    onChange={(e) => setNumAdults(Number(e.target.value))}
                    placeholder="type here"
                  />
                </FormField>
                <FormField label="Children">
                  <TextInput
                    min={0}
                    value={numChildren}
                    type="number"
                    onChange={(e) => setNumChildren(Number(e.target.value))}
                    placeholder="type here"
                  />
                </FormField>
              </Box>
            }
          />
          <Box alignSelf="center">
            <Button type="submit" label="Search" />
          </Box>
        </Grid>
        <MessageBox loading type="info" show={isFetching}>
          loading...
        </MessageBox>
        <MessageBox type="error" show={!!error}>
          {(error as Error) && (error as Error).message
            ? (error as Error).message
            : 'Something went wrong '}
        </MessageBox>
      </Form>
    </Box>
  );
};
