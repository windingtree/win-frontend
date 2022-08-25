import { CardMedia, CardMediaTypeMap } from '@mui/material';
import { OverrideProps } from '@mui/material/OverridableComponent';

export interface FallbackProps {
  component: string;
  fallback: string;
}

type CardMediaProps<D extends React.ElementType = 'div', P = Record<string, unknown>> = OverrideProps<
  CardMediaTypeMap<P, D>,
  D
>;

export type CardMediaFallbackProps = CardMediaProps & FallbackProps;

export const CardMediaFallback = (
  { fallback, ...props }: CardMediaFallbackProps
) => (
  <CardMedia
    {...props}
    onError={e => {
      (e.target as HTMLImageElement).onerror = null;
      (e.target as HTMLImageElement).src = fallback;
    }}
  />
);
