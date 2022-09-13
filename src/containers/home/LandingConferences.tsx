import { Box, Card, Typography, Grid, Button, Stack, Link } from '@mui/material';
import Iconify from '../../components/Iconify';
import Image from '../../components/Image';
import { EventItemProps, events } from '../../utils/events';
//import sydney from '../../images/sydney.jpeg';
//import taipei from '../../images/taipei.jpeg';

export default function LandingConferences() {
  return (
    <Grid sx={{ pb: 5 }} container>
      <Box sx={{ p: 1, position: 'relative' }}>
        <Typography textAlign="center" variant="h3">
          Upcoming blockchain conferences
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {events.map((item, index) => (
          <ConferenceItem key={index} item={item} />
        ))}
      </Grid>
    </Grid>
  );
}

type ConferenceItemProps = {
  item: EventItemProps;
};

function ConferenceItem({ item }: ConferenceItemProps) {
  const { name, date, url, conferenceUrl, image, location } = item;

  return (
    <Grid item xs={12} sm={6} md={3} lg={3}>
      <Card sx={{ pb: 1, mx: 1.5, borderRadius: 2, bgcolor: 'background.neutral' }}>
        <Box sx={{ px: 2, pt: 2, pb: 1, position: 'relative' }}>
          <Link href={url}>
            <Image src={image} ratio="1/1" sx={{ borderRadius: 1.5 }} />
          </Link>
        </Box>
        <Typography textAlign="center" variant="subtitle2">
          <Link href={conferenceUrl} target="_blank" rel="nopener">
            {name}
          </Link>
        </Typography>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <Iconify icon="uiw:date" sx={{ width: 20, height: 20 }} />
          <Typography variant="body2" textAlign="center" py={1}>
            {date}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          mb={1}
        >
          <Iconify icon="bxs:map-pin" sx={{ width: 20, height: 20 }} />
          <Typography variant="body2" textAlign="center">
            {location}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="center">
          <Button href={url} variant="outlined">
            View accommodations
          </Button>
        </Stack>
      </Card>
    </Grid>
  );
}
