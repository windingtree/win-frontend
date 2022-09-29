import { Box, styled } from '@mui/material';
import {
  FunctionComponent,
  ImgHTMLAttributes,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from 'react';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

export interface LazyLoadImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'placeholder' | 'onLoad' | 'onError'
  > {
  placeholderImgSrc?: string;
  fallbackImgSrc?: string;
  placeholderComponent?: ReactElement | null;
  fallbackComponent?: ReactElement | null;
  wrapperClassName?: string;
  showLoadingEffect?: boolean;
}

export const LazyLoadImage: FunctionComponent<LazyLoadImageProps> = ({
  src,
  placeholderImgSrc,
  fallbackImgSrc,
  placeholderComponent = null,
  fallbackComponent = null,
  wrapperClassName = '',
  showLoadingEffect = false,
  ...props
}: LazyLoadImageProps) => {
  const [imgSrc, setImgSrc] = useState(placeholderImgSrc || src);
  const [showPlaceHolder, setShowPlaceHolder] = useState<boolean>(
    !!placeholderComponent || false
  );
  const [showFallback, setShowFallback] = useState(false);

  const onLoad = useCallback(() => {
    setImgSrc(src);
    setShowPlaceHolder(false);
  }, [src]);

  const onError = useCallback(() => {
    if (fallbackComponent) {
      setShowFallback(true);
    } else if (fallbackImgSrc || placeholderImgSrc) {
      setImgSrc(fallbackImgSrc || placeholderImgSrc);
    } else if (placeholderComponent) {
      setShowPlaceHolder(true);
    }
  }, [fallbackImgSrc, placeholderImgSrc, fallbackComponent, placeholderComponent]);

  useEffect(() => {
    const img = new Image();
    img.src = src as string;
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, [src, onLoad, onError]);

  const ImageContainer = styled(Box)(() => ({
    '&.img-loading': {
      overflow: 'hidden',
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
        animation: '1.2s loading-placeholder ease-in-out 15s'
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

  return (
    <LazyLoadComponent>
      {showFallback ? (
        fallbackComponent
      ) : showPlaceHolder ? (
        placeholderComponent
      ) : (
        <ImageContainer
          className={`${showLoadingEffect && showPlaceHolder ? 'img-loading' : ''}`}
        >
          <img
            {...props}
            loading="lazy"
            src={imgSrc}
            width="100%"
            height="100%"
            style={{
              objectFit: 'cover'
            }}
            className={`${wrapperClassName}`}
          />
        </ImageContainer>
      )}
    </LazyLoadComponent>
  );
};
