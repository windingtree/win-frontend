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
import { OffersRequest, OffersResponse, SearchParamsSchema } from '../api/OffersRequest';
import { object } from '@windingtree/org.id-utils';

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

  const handleResults = useCallback(async () => {
    logger.info('Init results fetch');
    setLoading(true);
    setError(undefined);

    try {
      if (searchParams === undefined) {
        throw new Error('searchParams must be provided');
      }
      const validateSearchParams = object.validateWithSchemaOrRef(
        SearchParamsSchema,
        '',
        searchParams
      );
      if (validateSearchParams !== null) {
        throw new Error('Invalid searchParams');
      }
      const res = await axios.request<OffersResponse>(
        new OffersRequest(center, searchParams)
      );
      if (
        res.data === undefined ||
        res.data.data === undefined ||
        res.data.data.derbySoft.data === undefined
      ) {
        throw Error('Unable to get offers request response');
      }
      const accommodations = res.data.data.derbySoft.data.accomodations;
      if (accommodations === undefined) {
        throw Error('accommodations undefined');
      }
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
      const offers = res.data.data.derbySoft.data.offers;
      if (offers === undefined) {
        throw Error('offers undefined');
      }
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
      logger.info('Results successfully fetched');
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
          <MessageBox
            loading
            type="info"
            show={!loading && !error && filteredFacilities.length === 0}
          >
            Could not find place
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
