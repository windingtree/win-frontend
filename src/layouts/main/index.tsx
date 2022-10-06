import { Box, Container, ContainerProps, Stack, SxProps } from '@mui/material';
import MainFooter from './MainFooter';
import MainHeader from './MainHeader';
import { ReactNode, useRef, useEffect } from 'react';

type Props = {
  children: ReactNode;
  footer?: boolean;
  childrenBelowHeader?: boolean;
  maxWidth?: ContainerProps['maxWidth'];
};

export default function MainLayout({
  children,
  childrenBelowHeader = true,
  maxWidth = false,
  footer = true
}: Props) {
  const ref = useRef<null | HTMLElement>(null);

  useEffect(() => {
    ref.current !== null && ref.current.scrollIntoView();
  }, [ref]);

  const mobileStyles: SxProps = {
    '&.MuiContainer-maxWidthSm': {
      px: 2
    }
  };

  return (
    <Stack ref={ref} sx={{ minHeight: 1 }}>
      <MainHeader childrenBelowHeader={childrenBelowHeader} />
      <Container
        disableGutters={maxWidth ? false : true}
        maxWidth={maxWidth}
        sx={mobileStyles}
      >
        {children}
      </Container>
      <Box sx={{ flexGrow: 1 }} />
      {footer && <MainFooter />}
    </Stack>
  );
}
