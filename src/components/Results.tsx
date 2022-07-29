import type { LatLngTuple } from 'leaflet';
import { useAppState, useAppDispatch } from '../store';
import { Button, Box, Card, CardHeader, CardBody, CardFooter } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Logger from "../utils/logger";
import mockOffers from '../mocks/all-offers-by-latlng.json'
import { PricePlansReferences } from 'src/types/offers';
import { useWindowsDimension } from '../hooks/useWindowsDimension';

const logger = Logger('Results');
const defaultCenter: LatLngTuple = [51.505, -0.09]

export const Results: React.FC<{
  center: LatLngTuple;
}> = ({ center }) => {
  const { facilities } = useAppState();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { winWidth } = useWindowsDimension();
  const [facilityIds, setFacilityIds] = useState<string[]>([])

  const filteredFacilities = useMemo(() => facilities.filter((f) =>
    facilityIds.includes(f.id)
  ), [facilities, facilityIds])

  useEffect(() => {
    logger.info(center)
    if (center[0] === defaultCenter[0] && center[1] === defaultCenter[1]) {
      return
    } else {
      const accommodations = mockOffers.data.accommodations
      Object.keys(accommodations).map(
        key => dispatch({
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
      const offers = mockOffers.data.offers
      Object.keys(offers).map(
        key => {
          facilityIds.push()
          const priceRef: PricePlansReferences = offers[key].pricePlansReferences
          Object.keys(priceRef).map(r => {
            setFacilityIds([
              ...facilityIds,
              priceRef[r].accommodation
            ])
          })

          dispatch({
            type: 'SET_RECORD',
            payload: {
              name: 'offers',
              record: {
                id: key,
                ...offers[key]
              }
            }
          })

        }
      );
    }
  }, [center, dispatch]);
  if (filteredFacilities.length === 0) {
    return null
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
        <Box gap="0.5rem" flex={false}>
          {filteredFacilities.map((facility) => (
            <Card key={facility.id} pad="small" background={'white'}>
              <CardHeader>{facility.name}</CardHeader>
              <CardBody pad={'small'}>{facility.description.substring(0, 80) + '...'}</CardBody>
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
  )
};
