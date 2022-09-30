import Slider from 'react-slick';
import { useRef } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Image from './Image';
import { CarouselDots, CarouselArrows } from './carousel';
import { MediaItem } from '@windingtree/glider-types/dist/win';

const RootStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .slick-list': {
    boxShadow: theme.customShadows.z16,
    borderRadius: Number(theme.shape.borderRadius) * 2
  }
}));

export const ImageCarousel: React.FC<{ media: MediaItem[]; size: string }> = ({
  media,
  size
}) => {
  const theme = useTheme();
  const carouselRef = useRef<Slider | null>(null);

  const settings = {
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
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
        hideArrows={media?.length > 1 ? false : true} // hide arrows when image is less than 2
      >
        <Slider ref={carouselRef} {...settings}>
          {media && media.length > 0 ? (
            media.map((item, i) => (
              <Image key={i} src={item.url} ratio={size === 'small' ? '1/1' : '6/4'} />
            ))
          ) : (
            <Image ratio={size === 'small' ? '1/1' : '6/4'} />
          )}
        </Slider>
      </CarouselArrows>
    </RootStyle>
  );
};
