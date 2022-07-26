import type { LatLngTuple } from "leaflet";
import { useAppState, useAppDispatch } from '../store';
import Logger from "../utils/logger";
import { Button, Box, Card, CardHeader, CardBody, CardFooter } from "grommet";
import { useNavigate } from "react-router-dom";
//@ts-ignore
import mockdata from '../mocks/derby-soft-hotels.json'
import { useEffect } from "react";

const logger = Logger('Results');

export const Results: React.FC<{
  center: LatLngTuple
}> = ({ center }) => {
  const { facilities } = useAppState();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // todo: should send API to win-backend and save response to store/local-storage
  // dep/input: geo center point
  useEffect(() => {
    const defaultCenter: LatLngTuple = [51.505, -0.09]
    console.log('center', center)
    if (center[0] === defaultCenter[0] && center[1] === defaultCenter[1]) {
      return
    } else {
      mockdata.data.map(
        record => dispatch({
          type: 'SET_RECORD',
          payload: {
            name: 'facilities',
            record: {
              ...record
            }
          }
        })
      );
    }
  }, [center, dispatch]);

  return <Box
    fill={true}
    overflow='hidden'
    style={{
      position: 'absolute',
      zIndex: '1',
      width: '25rem',
      height: '95vh',
      margin: '1rem',
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0)'
    }}
  >
    <Box flex={true} overflow='auto'>
      <Box gap='0.5rem' flex={false}>
        {facilities.map((facility) => <Card key={facility.id} pad='small' background={'white'}>
          <CardHeader>
            {facility.hotelName}
          </CardHeader>
          <CardBody pad={'small'}>
            {facility.description.substring(0, 80) + '...'}
          </CardBody>
          <CardFooter justify="end">
            <Button label='book' onClick={() => navigate(`/facility/${facility.id}`)} />
          </CardFooter>
        </Card>
        )}
      </Box>
    </Box>
  </Box>;
};
