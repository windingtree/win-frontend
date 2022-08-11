import type { LatLngTuple } from 'leaflet';
import axios from 'axios';
import { DateTime } from 'luxon';
import { Box, Button, DateInput, Form, FormField, Grid, TextInput } from 'grommet';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logger from '../utils/logger';
import { MessageBox } from './MessageBox';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { useAppDispatch, useAppState } from '../store';
import { CoordinatesRequest, CoordinatesResponse } from '../api/CoordinatesRequest';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';

const logger = Logger('Search');
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
  onSubmit: React.Dispatch<React.SetStateAction<LatLngTuple>>;
  center: LatLngTuple;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}> = ({ onSubmit, setOpen, open }) => {
  // TODO: check where we used to navigate for
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { winWidth } = useWindowsDimension();
  const { searchParams } = useAppState();

  const [searchValue, setSearchValue] = useState<string>('');
  const [checkInCheckOut, setCheckInCheckOut] = useState<[string, string]>([
    today,
    tomorrow
  ]);
  const [numSpacesReq, setNumSpacesReq] = useState<number>(1);
  const [numAdults, setNumAdults] = useState<number>(1);
  const [numChildren, setNumChildren] = useState<number>(0);

  const { refetch, isLoading, error } = useAccommodationsAndOffers({
    date: checkInCheckOut,
    adultCount: numAdults,
    childrenCount: numChildren,
    location: 'Berlin',
    roomCount: numSpacesReq
  });

  // const handleMapSearch: () => Promise<LatLngTuple | undefined> =
  //   useCallback(async () => {
  //     logger.info('requst map');
  //     setLoading(true);
  //     setError(undefined);

  //     try {
  //       if (searchParams === undefined) {
  //         setLoading(false);
  //         return;
  //       }
  //       const res = await axios.request<CoordinatesResponse>(
  //         new CoordinatesRequest(searchParams?.place)
  //       );

  //       if (res.data === undefined) {
  //         throw Error('Something went wrong');
  //       }
  //       if (res.data[0].length === 0) {
  //         throw Error('Could not find place');
  //       }

  //       onSubmit([Number(res.data[0].lat), Number(res.data[0].lon)]);
  //       setOpen(false);
  //       setLoading(false);
  //       logger.info('map successfully fetched');
  //       return [res.data[0].lat, res.data[0].lon] as unknown as LatLngTuple;
  //     } catch (error) {
  //       logger.error(error);
  //       const message = (error as Error).message || 'Unknown Search error';
  //       setError(message);
  //       setLoading(false);
  //     }
  //   }, [searchParams, dispatch]);

  const handleSubmit = () => {
    refetch();
  };

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

  useEffect(() => {
    setSearchValue(searchParams?.place ?? '');
    setCheckInCheckOut([
      searchParams?.arrival ?? today,
      searchParams?.departure ?? tomorrow
    ]);
    setNumSpacesReq(searchParams?.roomCount ?? 1);
    setNumAdults(searchParams?.adults ?? 1);
    setNumChildren(searchParams?.children ?? 0);
  }, [searchParams]);

  // useEffect(() => {
  //   handleMapSearch();
  // }, [searchParams, handleMapSearch]);

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
        {/* <Button onClick={() => setOpen(false)} alignSelf="end" icon={<Close size="medium" />} /> */}
        <Grid columns={ResponsiveTopGrid(winWidth)} responsive={true}>
          <FormField label="Place">
            <TextInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
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
        <MessageBox loading type="info" show={isLoading}>
          loading...
        </MessageBox>
        <MessageBox type="error" show={!!error}>
          Something went wrong. Try again.
        </MessageBox>
      </Form>
    </Box>
  );
};
