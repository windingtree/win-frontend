import { MediaItem } from '@windingtree/glider-types/types/win';
import { Box, Image } from 'grommet';
import { forwardRef } from 'react';
import styled from 'styled-components';

const DetailImage = styled(Image)`
  display: flex;
  flex: 50%;
  height: calc(50% - 8px);
  object-fit: cover;
`;

interface FacilityDetailImagesProps {
  images: MediaItem[];
}

export const FacilityDetailImages = forwardRef<HTMLDivElement, FacilityDetailImagesProps>(
  ({ images }, ref) => {
    return (
      <Box
        direction="row"
        style={{
          gap: '8px',
          flex: '50%'
        }}
        ref={ref}
      >
        <Box direction="column" width="100%" style={{ gap: '8px' }}>
          <DetailImage src={images[0]?.url} />
          <DetailImage src={images[1]?.url} />
        </Box>

        <Box direction="column" width="100%" style={{ gap: '8px' }}>
          <DetailImage src={images[2]?.url} />
          <DetailImage src={images[3]?.url} />
        </Box>
      </Box>
    );
  }
);
