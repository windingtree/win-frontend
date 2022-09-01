import { Box, Container, ContainerProps, Stack } from '@mui/material';
import MainFooter from './MainFooter';
import MainHeader from './MainHeader';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  childrenBelowHeader?: boolean;
  maxWidth?: ContainerProps['maxWidth'];
};
export default function MainLayout({
  children,
  childrenBelowHeader = true,
  maxWidth = false
}: Props) {
  return (
    <Stack sx={{ minHeight: 1 }}>
      <MainHeader childrenBelowHeader={childrenBelowHeader} />
      <Container maxWidth={maxWidth}>{children}</Container>
      <Box sx={{ flexGrow: 1 }} />
      <MainFooter />
    </Stack>
  );
}
