import type { LatLngTuple } from "leaflet";
import { useAppState } from '../store';
import Logger from "../utils/logger";
import { Button, Box, Card, CardHeader, CardBody, CardFooter } from "grommet";
import { useNavigate } from "react-router-dom";

const logger = Logger('Results');

export const Results: React.FC<{
  center: LatLngTuple
}> = ({ center }) => {
  const { facilities } = useAppState();
  const navigate = useNavigate();

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
            {facility.description.substring(0,80)+ '...'}
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
