import { Box, Card, Typography, Grid, Button, Stack } from '@mui/material';
import Image from '../../components/Image';
import berlin from '../../images/berlin.jpeg';
import bogota from '../../images/bogota.jpeg';
import sydney from '../../images/sydney.jpeg';
import taipei from '../../images/taipei.jpeg';

type ItemProps = {
  id: string;
  name: string;
  image: string;
  url?: string;
  date: string;
  latlon?: number[];
};

const conferences: ItemProps[] = [
  {
    id: '1',
    name: 'DappCon',
    image: berlin,
    url: 'https://www.dappcon.io/',
    date: '12-14  September'
    // latlon: [52.5170365, 13.3888599],
  },
  {
    id: '2',
    name: 'Devcon',
    image: bogota,
    url: 'https://devcon.org',
    date: '7-16  October'
    // latlon: [4.6534649, -74.0836453],
  },
  {
    id: '3',
    name: 'ETHDownUnder',
    image: sydney,
    url: '',
    date: '1-4  December'
    // latlon: [-33.8698439, 151.208284],
  },
  {
    id: '4',
    name: 'ETHTaipei',
    image: taipei,
    url: '',
    date: '2-4  December'
    // latlon: [25.0375198, 121.5636796],
  }
];

export default function LandingConfereces() {
  return (
    <Grid sx={{ pb: 5 }} container xs={12}>
      <Box sx={{ p: 1, position: 'relative' }}>
        <Typography textAlign="center" variant="h3">
          Upcoming conferences
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {conferences.map((item) => (
          <ConferenceItem key={item.id} item={item} />
        ))}
      </Grid>
    </Grid>
  );
}

type ConferenceItemProps = {
  item: ItemProps;
};

function ConferenceItem({ item }: ConferenceItemProps) {
  const { name, date, url, image } = item;

  return (
    <Grid item xs={6} md={3} lg={3}>
      <Card sx={{ pb: 1, mx: 1.5, borderRadius: 2, bgcolor: 'background.neutral' }}>
        <Box sx={{ px: 2, pt: 2, pb: 1, position: 'relative' }}>
          <Image src={image} ratio="1/1" sx={{ borderRadius: 1.5 }} />
        </Box>
        <Typography textAlign="center" variant="subtitle2">
          {name}
        </Typography>
        <Typography textAlign="center">{date}</Typography>
        <Stack direction="row" justifyContent="center">
          <Button href={url} variant="outlined">
            More detains
          </Button>
        </Stack>
      </Card>
    </Grid>
  );
}
