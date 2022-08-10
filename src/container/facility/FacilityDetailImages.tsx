import { Box, Image } from 'grommet';
import styled from 'styled-components';

const DetailImage = styled(Image)`
  display: flex;
  flex: 50%;
  height: calc(50% - 8px);
  object-fit: cover;
`;

export const FacilityDetailImages = ({ images }) => {
  return (
    <Box
      style={{
        flex: '50%',
        display: 'flex',
        gap: '8px',

        flexDirection: 'row'
      }}
    >
      <Box
        style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}
      >
        <DetailImage src={images[0].url} />
        <DetailImage src={images[1].url} />
      </Box>

      <Box
        style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}
      >
        <DetailImage src={images[2].url} />
        <DetailImage src={images[3].url} />
      </Box>
    </Box>
  );
};
