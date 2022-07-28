import type { State } from '../store';
import { useMemo } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Header, Text } from 'grommet';
import { Menu } from './Menu';
import { usePageTitle } from '../hooks/usePageTitle';

export const AppHeader = () => {
  // const { state } = useLocation();
  const pageTitle = usePageTitle();

  // const returnLocation = useMemo(() => (state as State)?.location as Location, [state]);

  return (
    <Header pad="medium" direction="row">
      {/* {returnLocation && account && <Navigate to={returnLocation} state={null} />} */}
      <Text size="large" weight="bold" color="brand">
        {pageTitle}
      </Text>
      <Menu />
    </Header>
  );
};
