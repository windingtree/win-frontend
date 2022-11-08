import Slider from 'react-slick';
import { useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Image, { ImageRato } from './Image';
import { CarouselDots, CarouselArrows } from './carousel/';
import { MediaItem } from '@windingtree/glider-types/dist/win';

const RootStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .slick-list': {
    boxShadow: theme.customShadows.z16,
    borderRadius: Number(theme.shape.borderRadius) * 2
  }
}));

export const ImageCarousel: React.FC<{ media: MediaItem[]; ratio: ImageRato }> = ({
  media,
  ratio
}) => {
  const carouselRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,

    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
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
        <Slider ref={carouselRef} {...settings} lazyLoad={'anticipated'}>
          {media && media.length > 0 ? (
            media.map((item, i) => <Image key={i} src={item.url} ratio={ratio} />)
          ) : (
            <Image ratio={ratio} />
          )}
        </Slider>
      </CarouselArrows>
    </RootStyle>
  );
};
