import { Box, Card, Typography, Grid, Button, Stack, Link } from '@mui/material';
import Iconify from '../../components/Iconify';
import Image from '../../components/Image';
import dappcon22 from '../../images/conferences/dappcon22.jpg';
import blockchaineurope2022 from '../../images/conferences/blockchaineurope2022.png';
import devcon6 from '../../images/conferences/devcon6.jpeg';
import ethdownunder from '../../images/conferences/ethdownunder.png';
//import sydney from '../../images/sydney.jpeg';
//import taipei from '../../images/taipei.jpeg';

type ItemProps = {
  name: string;
  location: string;
  image: string;
  url?: string;
  date: string;
  latlon?: number[];
};

const conferences: ItemProps[] = [
  {
    name: 'DappCon22',
    location: 'Berlin',
    image: dappcon22,
    url: 'https://www.dappcon.io/',
    date: '12-14  September'
    // latlon: [52.5170365, 13.3888599],
  },
  {
    name: 'Blockchain Expo Europe 2022',
    location: 'Amsterdam',
    image: blockchaineurope2022,
    url: 'https://blockchain-expo.com/europe/',
    date: '20-21  September'
    // latlon: [52.5170365, 13.3888599],
  },
  {
    name: 'Devcon VI',
    location: 'Bogotá',
    image: devcon6,
    url: 'https://devcon.org',
    date: '7-16  October'
    // latlon: [4.6534649, -74.0836453],
  },
  {
    name: 'ETHDownUnder',
    location: 'Sydney',
    image: ethdownunder,
    url: 'https://ethdownunder.com/',
    date: '1-4  December'
    // latlon: [-33.8698439, 151.208284],
  } /*
  {
    name: 'ETHTaipei',
    location: 'Taipei',
    image: taipei,
    url: '',
    date: '2-4  December'
    // latlon: [25.0375198, 121.5636796],
  }*/
];

export default function LandingConferences() {
  return (
    <Grid sx={{ pb: 5 }} container xs={12}>
      <Box sx={{ p: 1, position: 'relative' }}>
        <Typography textAlign="center" variant="h3">
          Upcoming blockchain conferences
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {conferences.map((item, index) => (
          <ConferenceItem key={index} item={item} />
        ))}
      </Grid>
    </Grid>
  );
}

type ConferenceItemProps = {
  item: ItemProps;
};

function ConferenceItem({ item }: ConferenceItemProps) {
  const { name, date, url, image, location } = item;

  return (
    <Grid item xs={6} md={3} lg={3}>
      <Card sx={{ pb: 1, mx: 1.5, borderRadius: 2, bgcolor: 'background.neutral' }}>
        <Box sx={{ px: 2, pt: 2, pb: 1, position: 'relative' }}>
          <Image src={image} ratio="1/1" sx={{ borderRadius: 1.5 }} />
        </Box>
        <Typography textAlign="center" variant="subtitle2">
          <Link href={url} target="_blank" rel="nopener">
            {name}
          </Link>
        </Typography>
        <Stack direction="row" justifyContent="center" spacing={1}>
          <Iconify icon="uiw:date" sx={{ width: 20, height: 20 }} />
          <Typography textAlign="center">{date}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="center" spacing={1}>
          <Iconify icon="bxs:map-pin" sx={{ width: 20, height: 20 }} />
          <Typography textAlign="center">{location}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="center">
          <Button href={url} variant="outlined">
            Book Accommodation
          </Button>
        </Stack>
      </Card>
    </Grid>
  );
}
