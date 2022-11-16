// @mui
import { styled, Theme } from '@mui/material/styles';
import { Box, BoxProps, SxProps } from '@mui/material';
// import { LazyLoadImage, LazyLoadImageProps } from './LazyLoadImage';
import NoImage from '../images/no-image.png';
import { LazyLoadImage, LazyLoadImageProps } from 'react-lazy-load-image-component';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export type ImageRatio =
  | '4/3'
  | '3/4'
  | '6/4'
  | '4/6'
  | '16/9'
  | '9/16'
  | '21/9'
  | '9/21'
  | '1/1';

type IProps = BoxProps & LazyLoadImageProps;

interface ImageProps extends IProps {
  sx?: SxProps<Theme>;
  ratio?: ImageRatio;
  disabledEffect?: boolean;
  timeoutInSeconds?: number;
}

const ImageContainer = styled('span')(() => ({
  '&.img-loading': {
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: '#dddfe2',
      position: 'absolute',
      opacity: 0.5,
      top: 0,
      bottom: 0,
      width: '50%',
      height: '100%',
      transform: 'translateX(0)',
      animation: '1.2s loading-placeholder ease-in-out infinite'
    }
  },
  '@keyframes loading-placeholder': {
    '0%': {
      transform: 'translateX(-100%)'
    },
    '100%': {
      transform: 'translateX(200%)'
    }
  }
}));

export default function Image({
  ratio,
  sx,
  disabledEffect = false,
  timeoutInSeconds = 10,
  ...other
}: ImageProps) {
  const [loading, setLoading] = useState(true);

  // timer to handle 404/timeouts as image does not fire errors on 404s
  useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(false), timeoutInSeconds * 1000);

    return () => clearTimeout(timeoutId);
  }, [timeoutInSeconds]);

  const imageComponent = (
    <ImageContainer className={`${!disabledEffect && loading ? 'img-loading' : ''}`}>
      <Box
        component={LazyLoadImage}
        wrapperClassName="wrapper"
        placeholderSrc={NoImage}
        sx={{ width: 1, height: 1, objectFit: 'cover' }}
        afterLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
        }}
        alt="" // hide broken image icon
        {...other}
      />
    </ImageContainer>
  );

  if (ratio) {
    return (
      <Box
        component="span"
        sx={{
          width: 1,
          lineHeight: 0,
          display: 'block',
          overflow: 'hidden',
          position: 'relative',
          pt: getRatio(ratio),
          '& .wrapper': {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            lineHeight: 0,
            position: 'absolute',
            backgroundSize: 'cover !important',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'
          },
          ...sx
        }}
      >
        {imageComponent}
      </Box>
    );
  }

  return (
    <Box
      component="span"
      sx={{
        lineHeight: 1,
        display: 'block',
        overflow: 'hidden',
        '& .wrapper': { width: 1, height: 1, backgroundSize: 'cover !important' },
        ...sx
      }}
    >
      <ImageContainer className={`${!disabledEffect && loading ? 'img-loading' : ''}`}>
        {imageComponent}
      </ImageContainer>
    </Box>
  );
}

// ----------------------------------------------------------------------

function getRatio(ratio = '1/1') {
  return {
    '4/3': 'calc(100% / 4 * 3)',
    '3/4': 'calc(100% / 3 * 4)',
    '6/4': 'calc(100% / 6 * 4)',
    '4/6': 'calc(100% / 4 * 6)',
    '16/9': 'calc(100% / 16 * 9)',
    '9/16': 'calc(100% / 9 * 16)',
    '21/9': 'calc(100% / 21 * 9)',
    '9/21': 'calc(100% / 9 * 21)',
    '1/1': '100%'
  }[ratio];
}
