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
    gap='0.5rem'
    style={{
      position: 'absolute',
      zIndex: '1',
      background: 'white',
      width: '25rem',
      margin: '1rem',
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0)'
    }}
  >
    {facilities.map((facility) => <Card key={facility.id} pad='small' background={'white'}>
      <CardHeader>
        {facility.hotelName}
      </CardHeader>
      <CardBody pad={'small'}>
        {facility.description}
      </CardBody>
      <CardFooter justify="end">
        <Button label='book' onClick={() => navigate(`/facility/${facility.id}`)} />
      </CardFooter>
    </Card>
    )}
  </Box>;
};
