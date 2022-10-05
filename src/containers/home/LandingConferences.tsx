import {
  Box,
  Card,
  Typography,
  Button,
  Stack,
  Link,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Carousel, CarouselSettings } from '../../components/Carousel';
import Iconify from '../../components/Iconify';
import Image from '../../components/Image';
import { EventItemProps, upcomingEvents } from '../../config';

export default function LandingConferences() {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

  const eventsComponents = upcomingEvents.map((item, index) => (
    <ConferenceItem key={index} item={item} />
  ));

  // responsive maximum number of slides to show
  const responsiveSlidesToShow: CarouselSettings['responsiveSlidesToShow'] = [
    {
      breakpoint: theme.breakpoints.values['md'],
      slidesToShow: 2
    },
    {
      breakpoint: theme.breakpoints.values['sm'],
      slidesToShow: 1
    }
  ];

  // show a maximum of 4 slides
  const slidesToShow = eventsComponents.length > 4 ? 4 : eventsComponents.length;

  return (
    <Stack sx={{ pb: 5 }}>
      <Box
        sx={{ position: 'relative', textAlign: isMobileView ? 'center' : 'left' }}
        mb={1}
      >
        <Typography variant={isMobileView ? 'h4' : 'h3'}>
          Upcoming Blockchain Events
        </Typography>
        <Typography
          color="text.secondary"
          mb={2}
          variant={isMobileView ? 'body2' : undefined}
        >
          Need a place to stay for an event. Checkout our favourite stays below!
        </Typography>
      </Box>
      <Carousel
        items={eventsComponents}
        settings={{ slidesToShow, responsiveSlidesToShow, dots: false, centerMode: true }}
      />
    </Stack>
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
  );
}
