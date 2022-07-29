import { useLocation } from 'react-router-dom';
import { Box, Header, Text } from 'grommet';
import { Menu } from './Menu';
import { usePageTitle } from '../hooks/usePageTitle';

export const AppHeader = () => {
  const location = useLocation();
  const pageTitle = usePageTitle();

  // const returnLocation = useMemo(() => (state as State)?.location as Location, [state]);

  return (
    <Header
      pad="medium"
      direction="row"
      width="100vw"
      style={
        location.pathname === '/'
          ? {
              position: 'absolute',
              zIndex: '1'
            }
          : {}
      }
    >
      {/* {returnLocation && account && <Navigate to={returnLocation} state={null} />} */}
      <Box background="white">
        <Text size="large" weight="bold" color="brand">
          {pageTitle}
        </Text>
      </Box>
      <Menu />
    </Header>
  );
};
