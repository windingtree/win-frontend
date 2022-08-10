import { Box, Image } from 'grommet';
import styled from 'styled-components';

const DetailImage = styled(Image)`
  display: flex;
  flex: 50%;
  height: calc(50% - 8px);
  object-fit: cover;
`;

export const FacilityDetailImages = () => {
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
        <DetailImage src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" />
        <DetailImage src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" />
      </Box>

      <Box
        style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}
      >
        <DetailImage src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" />
        <DetailImage src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" />
      </Box>
    </Box>
  );
};
