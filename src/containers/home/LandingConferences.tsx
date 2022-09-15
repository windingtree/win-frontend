import { Box, Card, Typography, Grid, Button, Stack, Link } from '@mui/material';
import Iconify from '../../components/Iconify';
import Image from '../../components/Image';
import { EventItemProps, upcomingEvents } from '../../config';

export default function LandingConferences() {
  return (
    <Grid sx={{ pb: 5 }} container>
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h3">Upcoming Blockchain Events</Typography>
        <Typography color="text.secondary" mb={2}>
          Need a place to stay for an event. Checkout our favourite stays below!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {upcomingEvents.map((item, index) => (
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
  const { name, date, url: initialUrl, conferenceUrl, image, location } = item;
  const urlObj = initialUrl ? new URL(initialUrl, window.location.origin) : undefined;
  urlObj?.searchParams.set('focusedEvent', name);

  const url = urlObj?.toString();

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
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
