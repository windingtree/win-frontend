import { useMemo } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Header, Box, Text } from 'grommet';
import { Account } from './Account';
import { Menu } from './Menu';
import { useAppState, State } from '../store';
import { SignInButton, SignOutButton } from './Web3Modal';
import { usePageTitle } from '../hooks/usePageTitle';

export const AppHeader = () => {
  const { state } = useLocation();
  const { account, provider } = useAppState();
  const pageTitle = usePageTitle();

  const returnLocation = useMemo(() => (state as State)?.location as Location, [state]);

  return (
    <Header pad="medium" direction="row">
      {returnLocation && account && <Navigate to={returnLocation} state={null} />}
      <Text size="large" weight="bold" color="brand">
        {pageTitle}
      </Text>
      <Box direction="row" align="right" gap="small">
        <Account account={account} provider={provider} />
        {account ? <SignOutButton /> : <SignInButton />}
        <Menu />
      </Box>
    </Header>
  );
};
