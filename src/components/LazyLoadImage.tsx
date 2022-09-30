import { styled } from '@mui/material';
import {
  forwardRef,
  FunctionComponent,
  ImgHTMLAttributes,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

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
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

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
    if (src && imgRef) {
      setImgSrc(src);
      imgRef.addEventListener('load', onLoad);
      imgRef.addEventListener('error', onError);

      return () => {
        if (imgRef) {
          imgRef.removeEventListener('load', onLoad);
          imgRef.removeEventListener('error', onError);
        }
      };
    }
  }, [src, onLoad, onError, imgRef]);

  useEffect(() => {
    imgRef?.complete ? setLoadComplete(true) : setLoadComplete(false);
    setLoading(false);
  }, [imgRef]);

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
    return <>{placeholderComponent ?? <ImageComponent src={placeholderImgSrc} />}</>;
  }, [placeholderComponent, placeholderImgSrc]);

  return (
    <>
      {showFallback && fallbackComponent ? (
        <ImageContainer>{fallbackComponent}</ImageContainer>
      ) : (
        <>
          {useMemo(
            () => (
              <ImageContainer
                className={`${wrapperClassName} ${
                  showLoadingEffect && loading ? 'img-loading' : ''
                }`}
              >
                {loading && !loadComplete ? placeholderImage : null}
                <ImageComponent
                  src={imgSrc}
                  ref={(ref) => setImgRef(ref)}
                  style={{ visibility: loading ? 'hidden' : 'visible' }}
                  {...props}
                />
              </ImageContainer>
            ),
            [imgSrc, loading]
          )}
        </>
      )}
    </>
  );
};
