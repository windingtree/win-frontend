import { Box, Card, BoxProps, Typography, Grid } from '@mui/material';
import Image from '../../components/Image';
import berlin from '../../images/berlin.jpeg'
import bogota from '../../images/bogota.jpeg'
import sydney from '../../images/sydney.jpeg'
import taipei from '../../images/taipei.jpeg'

type ItemProps = {
  id: string;
  city: string;
  image: string;
  latlon: number[];
};

interface Props extends BoxProps {
  title?: string;
  subheader?: string;
}

const cities = [
  {
    id: '1',
    city: 'Berlin',
    image: berlin,
    latlon: [52.5170365, 13.3888599],
  },
  {
    id: '2',
    city: 'Bogota',
    image: bogota,
    latlon: [4.6534649, -74.0836453],
  },
  {
    id: '3',
    city: 'Sydney',
    image: sydney,
    latlon: [-33.8698439, 151.208284],
  },
  {
    id: '4',
    city: 'Taipei',
    image: taipei,
    latlon: [25.0375198, 121.5636796],
  }
]

export default function CityCarousel({ sx }: Props) {

  return (
    <Grid item xs={12}>
      <Grid sx={{ py: 5, ...sx }} display='flex' direction='row' justifyContent='space-between'>
        {cities.map((item) =>
          <CityItem key={item.id} item={item} />
        )}
      </Grid>
    </Grid>
  );
}

type CityItemProps = {
  item: ItemProps;
};

function CityItem({ item }: CityItemProps) {
  const { city, image } = item;

  return (
    <Card sx={{ pb: 1, mx: 1.5, borderRadius: 2, bgcolor: 'background.neutral', width: 300 }}>
      <Box sx={{ p: 1, position: 'relative' }}>
        <Image src={image} ratio="3/4" sx={{ borderRadius: 1.5 }} />
      </Box>
      <Typography textAlign='center' variant="subtitle1">{city}</Typography>
    </Card>
  );
}
