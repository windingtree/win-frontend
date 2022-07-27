import { useAppState } from '../store';
import { Box, Button, ResponsiveContext, Spinner, Text } from 'grommet';
import { Login, Logout } from 'grommet-icons';
import styled from 'styled-components';
import { useContext } from 'react';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

export const SignInButton = () => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, signIn, provider } = useAppState();

  if (!signIn || provider) {
    return null;
  }

  return (
    <Button onClick={() => signIn()} disabled={isConnecting}>
      {() => (
        <Box direction="row" align="center">
          {size !== 'small' && <Text>{isConnecting ? 'Connecting' : 'Connect'}</Text>}
          {size === 'small' && <Login />}
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </Button>
  );
};

export const SignOutButton = () => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, signOut, provider } = useAppState();

  if (!signOut || !provider) {
    return null;
  }

  return (
    <Button onClick={() => signOut()} disabled={isConnecting}>
      {() => (
        <Box direction="row" align="center">
          {size !== 'small' && <Text>{isConnecting ? 'Connecting' : 'Disconnect'}</Text>}
          {size === 'small' && <Logout />}
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </Button>
  );
};
