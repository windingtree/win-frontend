import { CardMedia, CardMediaTypeMap } from '@mui/material';
import { OverrideProps } from '@mui/material/OverridableComponent';
import {
  SyntheticEvent,
  useRef,
  useState,
  useCallback,
  useEffect
} from 'react';

export interface FallbackProps {
  component: string;
  fallback: string;
}

type CardMediaProps<
  D extends React.ElementType = 'div',
  P = Record<string, unknown>
> = OverrideProps<CardMediaTypeMap<P, D>, D>;

export type CardMediaFallbackProps = CardMediaProps & FallbackProps;

export const CardMediaFallback = ({
  fallback,
  src,
  image,
  ...props
}: CardMediaFallbackProps) => {
  const timeout = useRef<NodeJS.Timeout | undefined>();
  const [source, setSource] = useState<string>(image || src || '');
  const resetTimeout = () => clearTimeout(timeout.current);

  const errorHandler = useCallback(
    (e: SyntheticEvent<HTMLDivElement, Event>) => {
      (e.target as HTMLImageElement).onerror = null;
      (e.target as HTMLImageElement).src = fallback;
    },
    [fallback]
  );

  useEffect(() => {
    timeout.current = setTimeout(() => setSource(fallback), 5000);
    return () => clearTimeout(timeout.current);
  }, [source, fallback]);

  return (
    <CardMedia {...props} src={source} onLoad={resetTimeout} onError={errorHandler} />
  );
};
