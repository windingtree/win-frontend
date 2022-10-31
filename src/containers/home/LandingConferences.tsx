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
import { formatISO } from 'date-fns';
import { createSearchParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { EventItemType, filteredEvents } from 'src/config/events';
import { getFormattedBetweenDate, getIsInPast } from 'src/utils/date';
import { Carousel, CarouselSettings } from '../../components/Carousel';
import Iconify from '../../components/Iconify';
import Image from '../../components/Image';
import { CarouselContainer } from './CarouselContainer';

export default function LandingConferences() {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

  // If less then 3 events are included don't show anything to prevent weird layout shifts
  if (filteredEvents.length < 3) return null;

  const eventsComponents = filteredEvents.map((item, index) => (
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
      <Box sx={{ position: 'relative', textAlign: 'left' }} mb={1}>
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
      <CarouselContainer>
        <Carousel
          items={eventsComponents}
          settings={{
            slidesToShow,
            responsiveSlidesToShow,
            dots: false,
            centerMode: true,
            hideArrows: isMobileView
          }}
        />
      </CarouselContainer>
    </Stack>
  );
}

type ConferenceItemProps = {
  item: EventItemType;
};

function ConferenceItem({ item }: ConferenceItemProps) {
  const navigate = useNavigate();
  const { name, startDate, endDate, conferenceUrl, image, location, latlon } = item;

  const jsStartDate = new Date(startDate);
  // if an event starts in the past, use today as the current date
  const queryStartDate = getIsInPast(jsStartDate) ? new Date() : jsStartDate;

  const params = {
    roomCount: '1',
    adultCount: '2',
    location,
    endDate: formatISO(Number(new Date(endDate))),
    startDate: formatISO(Number(queryStartDate)),
    ...(latlon && { focusedEvent: name })
  };

  const searchObject = { pathname: '/search', search: `?${createSearchParams(params)}` };

  return (
    <Card sx={{ pb: 1, mx: 1.5, borderRadius: 2, bgcolor: 'background.neutral' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1, position: 'relative', textOverflow: 'ellipsis' }}>
        <RouterLink to={searchObject}>
          <Image src={image} ratio="1/1" sx={{ borderRadius: 1.5 }} />
        </RouterLink>
      </Box>
      <Typography
        textAlign="center"
        variant="subtitle2"
        sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
      >
        <Link href={conferenceUrl} target="_blank" rel="nopener">
          {name}
        </Link>
      </Typography>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
        <Iconify icon="uiw:date" sx={{ width: 20, height: 20 }} />
        <Typography variant="body2" textAlign="center" py={1}>
          {getFormattedBetweenDate(startDate, endDate)}
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
        <Button variant="outlined" onClick={() => navigate(searchObject)}>
          View accommodations
        </Button>
      </Stack>
    </Card>
  );
}
