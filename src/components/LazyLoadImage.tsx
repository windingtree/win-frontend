import { styled } from '@mui/material';
import {
  forwardRef,
  FunctionComponent,
  ImgHTMLAttributes,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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

const ImageComponent = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>(
  ({ src, style, ...props }, ref) => {
    return (
      <img
        {...props}
        src={src}
        loading="lazy"
        width="100%"
        height="100%"
        style={{
          objectFit: 'cover',
          ...style
        }}
        ref={ref}
      />
    );
  }
);

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
  const [imgSrc, setImgSrc] = useState(placeholderImgSrc);

  const [showFallback, setShowFallback] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [loading, setLoading] = useState(!!src);
  const imgRef = useRef<HTMLImageElement>(null);

  const onLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const onError = useCallback(() => {
    if (!showFallback) {
      setShowFallback(true);
      setImgSrc(fallbackImgSrc);
    } else {
      setLoading(false);
    }
  }, [fallbackImgSrc, showFallback]);

  useEffect(() => {
    if (src && imgRef && imgRef.current) {
      setImgSrc(src);
      imgRef.current.addEventListener('load', onLoad);
      imgRef.current.addEventListener('error', onError);

      return () => {
        if (imgRef && imgRef.current) {
          imgRef.current.removeEventListener('load', onLoad);
          imgRef.current.removeEventListener('error', onError);
        }
      };
    }
  }, [src, onLoad, onError, imgRef]);

  useEffect(() => {
    imgRef?.current?.complete ? setLoadComplete(true) : setLoadComplete(false);
    setLoading(false);
  }, [imgRef?.current?.complete]);

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

  const placeholderImage = useMemo(() => {
    return (
      <LazyLoadComponent>
        {placeholderComponent ?? <ImageComponent src={placeholderImgSrc} />}
      </LazyLoadComponent>
    );
  }, [placeholderComponent, placeholderImgSrc]);

  // console.log('img load complete', imgRef?.current?.complete);
  // console.log({loadComplete})

  return (
    <LazyLoadComponent>
      {showFallback && fallbackComponent ? (
        <LazyLoadComponent>
          <ImageContainer>{fallbackComponent}</ImageContainer>
        </LazyLoadComponent>
      ) : (
        <>
          {useMemo(
            () => (
              <ImageContainer
                className={`${wrapperClassName} ${
                  showLoadingEffect && loading ? 'img-loading' : ''
                }`}
                key={src}
              >
                {loading ? placeholderImage : null}
                <ImageComponent
                  src={imgSrc}
                  ref={imgRef}
                  style={{ visibility: loading ? 'hidden' : 'visible' }}
                  {...props}
                />
              </ImageContainer>
            ),
            [imgSrc]
          )}
        </>
      )}
    </LazyLoadComponent>
  );
};
