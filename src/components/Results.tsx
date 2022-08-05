import type { LatLngTuple } from 'leaflet';
import { useAppState, useAppDispatch } from '../store';
import { Button, Box, Card, CardHeader, CardBody, CardFooter } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Logger from '../utils/logger';
import { PricePlansReferences } from 'src/types/offers';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import axios from 'axios';
import { MessageBox } from './MessageBox';
import { OffersRequest } from '../api/OffersRequest';

const logger = Logger('Results');
const defaultCenter: LatLngTuple = [51.505, -0.09];

export const Results: React.FC<{
  center: LatLngTuple;
}> = ({ center }) => {
  const { facilities, searchParams } = useAppState();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { winWidth } = useWindowsDimension();

  const [facilityIds, setFacilityIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  const filteredFacilities = useMemo(
    () => facilities.filter((f) => facilityIds.includes(f.id)),
    [facilities, facilityIds]
  );

  const handleResults: () => Promise<LatLngTuple | undefined> = useCallback(async () => {
    logger.info('requst results');
    setLoading(true);
    setError(undefined);

    try {
      if (searchParams === undefined) {
        throw new Error('searchParams must be provided');
      }
      const res = await axios.request(new OffersRequest(center, searchParams));

      if (res.data === undefined) {
        throw Error('Something went wrong');
      }
      if (res.data.length === 0) {
        throw Error('Could not find place');
      }

      const accommodations = res.data.offers;
      Object.keys(accommodations).map((key) =>
        dispatch({
          type: 'SET_RECORD',
          payload: {
            name: 'facilities',
            record: {
              id: key,
              ...accommodations[key]
            }
          }
        })
      );
      const offers = res.data.offers;
      const ids: string[] = [];
      Object.keys(offers).map((key) => {
        const priceRef: PricePlansReferences = offers[key].pricePlansReferences;
        Object.keys(priceRef).map((r) => ids.push(r));

        dispatch({
          type: 'SET_RECORD',
          payload: {
            name: 'offers',
            record: {
              id: key,
              ...offers[key]
            }
          }
        });
      });
      setFacilityIds([...ids]);
      setLoading(false);
      logger.info('map successfully mocked');

      setLoading(false);
      logger.info('map successfully fetched');
      return [res.data[0].lat, res.data[0].lon] as unknown as LatLngTuple;
    } catch (error) {
      logger.error(error);
      const message = (error as Error).message || 'Unknown Search error';
      setError(message);
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    logger.info(center);
    if (center[0] === defaultCenter[0] && center[1] === defaultCenter[1]) {
      return;
    } else {
      handleResults();
    }
  }, [center, dispatch]);

  if (filteredFacilities.length === 0 || searchParams === undefined) {
    return null;
  }

  return (
    <Box
      pad="medium"
      fill={true}
      overflow="hidden"
      style={{
        position: 'absolute',
        zIndex: '1',
        width: winWidth < 900 ? '100%' : '25rem',
        maxWidth: '100%',
        height: winWidth < 900 ? '45%' : '90%',
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0)'
      }}
    >
      <Box flex={true} overflow="auto">
        <Box>
          <MessageBox loading type="info" show={loading}>
            One moment...
          </MessageBox>
          <MessageBox type="error" show={!!error}>
            {error}
          </MessageBox>
        </Box>
        <Box gap="0.5rem" flex={false}>
          {filteredFacilities.map((facility) => (
            <Card key={facility.id} pad="small" background={'white'}>
              <CardHeader>{facility.name}</CardHeader>
              <CardBody pad={'small'}>
                {facility.description.substring(0, 80) + '...'}
              </CardBody>
              <CardFooter justify="end">
                <Button
                  label="book"
                  onClick={() => navigate(`/facility/${facility.id}`)}
                />
              </CardFooter>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
