import { Box, Header as BaseHeader, Text } from 'grommet';
import { Menu } from './Menu';
import { usePageTitle } from '../hooks/usePageTitle';

export const Header = () => {
  const pageTitle = usePageTitle();

  // const returnLocation = useMemo(() => (state as State)?.location as Location, [state]);

  return (
    <BaseHeader pad="medium" direction="row" width="100vw">
      {/* {returnLocation && account && <Navigate to={returnLocation} state={null} />} */}
      <Box background="white">
        <Text size="large" weight="bold" color="brand">
          {pageTitle}
        </Text>
      </Box>
      <Menu />
    </BaseHeader>
  );
};
