import Slider from 'react-slick';
import { useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Paper, Avatar, BoxProps, Typography, CardHeader } from '@mui/material';
// components
// import Label from './Label';
import Image from './Image';
import Iconify from './Iconify';
import { CarouselArrows } from './carousel';

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  city: string;
  url: string;
  latlon: number[];
};

interface Props extends BoxProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function CityCarousel({ title, subheader, list, sx, ...other }: Props) {
  const theme = useTheme();

  const carouselRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Box sx={{ py: 2, ...sx }} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <CarouselArrows
            customIcon={'ic:round-keyboard-arrow-right'}
            onNext={handleNext}
            onPrevious={handlePrevious}
            sx={{ '& .arrow': { width: 28, height: 28, p: 0 } }}
          />
        }
        sx={{
          p: 0,
          mb: 3,
          '& .MuiCardHeader-action': { alignSelf: 'center' },
        }}
      />

      <Slider ref={carouselRef} {...settings}>
        {list.map((item) => (
          <CityItem key={item.id} item={item} />
        ))}
      </Slider>
    </Box>
  );
}

// ----------------------------------------------------------------------

type CityItemProps = {
  item: ItemProps;
};

function CityItem({ item }: CityItemProps) {
  const { id, city, url, latlon } = item;

  return (
    <Paper sx={{ mx: 1.5, borderRadius: 2, bgcolor: 'background.neutral' }}>
      <Typography variant="subtitle2">{city}</Typography>

      <Box sx={{ p: 1, position: 'relative' }}>
        <Image src={url} ratio="1/1" sx={{ borderRadius: 1.5 }} />
      </Box>
    </Paper>
  );
}
