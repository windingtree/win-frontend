import type { LatLngTuple } from 'leaflet';
import axios from 'axios';
import { DateTime } from 'luxon';
import { Box, Button, DateInput, Form, FormField, Grid, TextInput } from 'grommet';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logger from '../utils/logger';
import { MessageBox } from './MessageBox';
import { useWindowsDimension } from '../hooks/useWindowsDimension';

const logger = Logger('Search');
const today = DateTime.local().toMillis();
const tomorrow = DateTime.local().plus({ days: 1 }).toMillis();

export const ResponsiveTopGrid = (winWidth: number) => {
  if (winWidth >= 1300) {
    return ['50%', '50%'];
  } else if (winWidth >= 1000) {
    return ['50%', '50%'];
  } else if (winWidth >= 768) {
    return ['50%', '50%'];
  } else if (winWidth >= 600) {
    return ['100%'];
  } else if (winWidth <= 500) {
    return ['100%'];
  } else if (winWidth <= 400) {
    return ['100%'];
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
}> = ({ onSubmit, center, setOpen, open }) => {
  const navigate = useNavigate();
  const { winWidth } = useWindowsDimension();
  const { search } = useLocation();

  const [searchValue, setSearchValue] = useState<string>('');
  const [checkInCheckOut, setCheckInCheckOut] = useState<[number, number]>([
    today,
    tomorrow
  ]);
  const [numSpacesReq, setNumSpacesReq] = useState<number>(1);
  const [numAdults, setNumAdults] = useState<number>(1);
  const [numChildren, setNumChildren] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  const handleMapSearch: () => Promise<LatLngTuple | undefined> =
    useCallback(async () => {
      const params = new URLSearchParams(search);
      logger.info('requst map');
      setLoading(true);
      setError(undefined);

      try {
        const searchValue = params.get('searchValue');
        if (searchValue === null || searchValue === '') {
          setLoading(false);
          return;
        }
        const res = await axios.request({
          url: `https://nominatim.openstreetmap.org/search?format=json&q=${searchValue}`,
          method: 'GET'
        });

        if (res.data === undefined) {
          throw Error('Something went wrong');
        }
        if (res.data.length === 0) {
          throw Error('Could not find place');
        }

      onSubmit([res.data[0].lat, res.data[0].lon]);
      setOpen(false)
      setLoading(false);
      logger.info('map successfully fetched');
      return [res.data[0].lat, res.data[0].lon] as unknown as LatLngTuple;
    } catch (error) {
      logger.error(error);
      const message = (error as Error).message || 'Unknown Search error';
      setError(message);
      setLoading(false);
    }
  }, [search, onSubmit]);

  const handleSubmit = useCallback(async () => {
    const query = new URLSearchParams([
      ['searchValue', String(searchValue)],
      ['checkIn', String(checkInCheckOut[0])],
      ['checkOut', String(checkInCheckOut[1])],
      ['numSpacesReq', String(numSpacesReq)],
      ['numAdults', String(numAdults)],
      ['numChildren', String(numChildren)]
    ]);

    navigate(`?${query}`, { replace: true });
  }, [searchValue, checkInCheckOut, numSpacesReq, numAdults, numChildren, navigate]);

  const handleDateChange = ({ value }: { value: string[] }) => {
    const checkInisInPast = today > DateTime.fromISO(value[0]).toMillis();
    const checkOutisInPast = tomorrow > DateTime.fromISO(value[1]).toMillis();
    setCheckInCheckOut([
      checkInisInPast ? today : DateTime.fromISO(value[0]).toMillis(),
      checkOutisInPast ? tomorrow : DateTime.fromISO(value[1]).toMillis()
    ]);
  };

  useEffect(() => {
    const params = new URLSearchParams(search);
    setSearchValue(String(params.get('searchValue') ?? ''));
    setCheckInCheckOut([
      Number(params.get('checkIn') ?? today),
      Number(params.get('checkOut') ?? tomorrow)
    ]);
    setNumSpacesReq(Number(params.get('numSpacesReq') ?? 1));
    setNumAdults(Number(params.get('numAdults') ?? 1));
    setNumChildren(Number(params.get('numChildren') ?? 0));
  }, [search]);

  useEffect(() => {
    handleMapSearch();
  }, [search, handleMapSearch]);

  return (

    <Box
      pad="medium"
      style={{
        position: 'absolute',
        zIndex: `${open ? '2' : '-1'}`,

        width: winWidth > 900 ? '33rem' : '100%',
        maxWidth: '100%',
        left: 0,
        top: '10%',
      }}
    >

      <Form
        style={{
          background: 'white',
          padding: '0.75rem',
          borderRadius: '0.5rem',
        }}
        onSubmit={() => handleSubmit()}
      >
        {/* <Button onClick={() => setOpen(false)} alignSelf="end" icon={<Close size="medium" />} /> */}
        <Grid columns={'50%'} responsive={true}>
          <FormField label="Place">
            <TextInput value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="type here" />
          </FormField>
          <FormField label="Date">
            <DateInput
              buttonProps={{
                label: `${DateTime.fromMillis(checkInCheckOut[0]).toFormat('dd.MM.yy')}-${DateTime.fromMillis(
                  checkInCheckOut[1]
                ).toFormat('dd.MM.yy')}`,
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
                DateTime.fromMillis(checkInCheckOut[0]).toString(),
                DateTime.fromMillis(checkInCheckOut[1]).toString()
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
            <Button type="submit" label="Search..." />
          </Box>
        </Grid>
        <MessageBox loading type="info" show={loading}>
          loading...
        </MessageBox>
        <MessageBox type="error" show={!!error}>
          {error}
        </MessageBox>
      </Form>
    </Box>
  );
};
