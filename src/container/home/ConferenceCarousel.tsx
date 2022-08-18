import { Box, Card, BoxProps, Typography, Grid, Button, Stack } from '@mui/material';
import Image from '../../components/Image';
import berlin from '../../images/berlin.jpeg'
import bogota from '../../images/bogota.jpeg'
import sydney from '../../images/sydney.jpeg'
import taipei from '../../images/taipei.jpeg'

type ItemProps = {
  id: string;
  name: string;
  image: string;
  url?: string;
  date: string;
  latlon?: number[];
};

interface Props extends BoxProps {
  title?: string;
  subheader?: string;
}

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
]

export default function ConferenceCarousel({ sx }: Props) {

  return (
    <Grid item xs={12}>
      <Box sx={{ p: 1, position: 'relative' }}>
        <Typography textAlign='center' variant="h3">Upcoming conferences</Typography>
      </Box>

      <Grid sx={{ py: 5, ...sx }} display='flex' direction='row' justifyContent='space-between'>
        {conferences.map((item) =>
          <ConferenceItem key={item.id} item={item} />
        )}
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
    <Card sx={{ pb: 1, mx: 1.5, borderRadius: 2, bgcolor: 'background.neutral', width: 300 }}>
      <Box sx={{ px: 5, pt: 5, pb: 2, position: 'relative' }}>
        <Image src={image} ratio="1/1" sx={{ borderRadius: 1.5 }} />
      </Box>
      <Typography textAlign='center' variant='subtitle2'>{name}</Typography>
      <Typography textAlign='center'  >{date}</Typography>
      <Stack direction='row' justifyContent='center'>
        <Button href={url} variant="outlined">More detains</Button>
      </Stack>
    </Card>
  );
}
