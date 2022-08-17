import { Box, Stack } from '@mui/material';
import MainFooter from './MainFooter';
import MainHeader from './MainHeader';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  childrenBelowHeader?: boolean;
};
export default function MainLayout({ children, childrenBelowHeader = true }: Props) {
  return (
    <Stack sx={{ minHeight: 1 }}>
      <MainHeader childrenBelowHeader={childrenBelowHeader} />
      {children}
      <Box sx={{ flexGrow: 1 }} />
      <MainFooter />
    </Stack>
  );
}
