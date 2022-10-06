import Slider, { Settings as SliderSettings } from 'react-slick';
import { useRef } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { CarouselDots, CarouselArrows } from './carousel';
import { IconifyIcon } from '@iconify/react';
import { useWindowsDimension } from '../hooks/useWindowsDimension';

const RootStyle = styled(Box)(() => ({
  position: 'relative',
  overflow: 'hidden'
}));

export interface CarouselSettings {
  dots?: boolean;
  arrows?: boolean;
  autoplay?: boolean;
  slidesToShow?: number;
  slidesToScroll?: number;
  spacing?: number;
  centerMode?: boolean;
  responsiveSlidesToShow?: {
    breakpoint: number;
    slidesToShow: number;
  }[];
  hideArrows?: boolean;
}

export const Carousel: React.FC<{
  items: JSX.Element[];
  customArrowIcon?: IconifyIcon | string;
  settings?: CarouselSettings;
}> = ({
  items,
  customArrowIcon,
  settings: {
    spacing = 2,
    responsiveSlidesToShow = [],
    centerMode = false,
    hideArrows = false,
    ...settings
  } = {}
}) => {
  const theme = useTheme();
  const carouselRef = useRef<Slider | null>(null);
  const { winWidth } = useWindowsDimension();

  const defaultSettings: SliderSettings = {
    dots: true,
    arrows: false,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    centerMode: false,
    centerPadding: '45px',
    adaptiveHeight: true,
    swipeToSlide: true,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselDots({
      rounded: true,
      sx: { mt: 3 }
    })
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  // normalize responsive slides to show
  let responsive;
  if (responsiveSlidesToShow?.length) {
    responsive = responsiveSlidesToShow?.map((item) => {
      return {
        breakpoint: item.breakpoint,
        settings: {
          slidesToShow: item.slidesToShow
        }
      };
    });
  }

  // prevent centerMode if no. of slides is less or equal to slidesToShow
  const actualSlidesToShow =
    responsiveSlidesToShow?.find((item) => winWidth <= item.breakpoint)?.slidesToShow ??
    settings.slidesToShow;

  const allowCenterMode = items.length > (actualSlidesToShow || 1);

  // hide arrows when all items are visible
  const allSlidesVisible = items?.length > (actualSlidesToShow || 1) ? false : true;
  const shouldHideArrows = hideArrows || allSlidesVisible;

  return (
    <RootStyle>
      <CarouselArrows
        filled
        onNext={handleNext}
        onPrevious={handlePrevious}
        sx={{
          '& .arrow': {
            '&.left': { left: 16 },
            '&.right': { right: 16 }
          }
        }}
        customIcon={customArrowIcon}
        hideArrows={shouldHideArrows}
      >
        <Slider
          ref={carouselRef}
          {...defaultSettings}
          {...settings}
          responsive={responsive}
          centerMode={centerMode && allowCenterMode}
        >
          {items && items.length > 0
            ? items.map((item, i) => {
                let adaptiveSpace = {};
                if (i === items.length - 1) {
                  adaptiveSpace = {};
                } else if (i >= 0 && items.length > 1) {
                  adaptiveSpace = { mr: spacing };
                }
                return (
                  <Box key={i} {...adaptiveSpace}>
                    {item}
                  </Box>
                );
              })
            : null}
        </Slider>
      </CarouselArrows>
    </RootStyle>
  );
};
