import { alpha, styled } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Container } from '@mui/material';
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';
import navConfig from './MenuConfig';
import { Logo } from 'src/components/Logo';
import useOffSetTop from 'src/hooks/useOffsetTop';
import useResponsive from 'src/hooks/useResponsive';
import { HEADER } from 'src/config/componentSizes';
import { AccountInfo } from 'src/components/AccountInfo';

const BLUR = 8;

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  color: theme?.palette.background.default,
  backdropFilter: `blur(${BLUR}px)`,
  WebkitBackdropFilter: `blur(${BLUR}px)`, // Fix on Mobile
  backgroundColor: alpha(theme?.palette.background.default, 0.7),
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  [theme.breakpoints.up('md')]: {
    height: HEADER.MAIN_DESKTOP_HEIGHT
  }
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8
}));

const FillBox = styled('div')(({ theme }) => ({
  height: HEADER.MOBILE_HEIGHT,

  [theme.breakpoints.up('md')]: {
    height: HEADER.MAIN_DESKTOP_HEIGHT
  }
}));

type MainHeaderProps = {
  childrenBelowHeader?: boolean;
};

export default function MainHeader({ childrenBelowHeader }: MainHeaderProps) {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);
  const isDesktop = useResponsive('up', 'md');

  return (
    <>
      <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
        <ToolbarStyle disableGutters>
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Logo />

            <Box sx={{ flexGrow: 1 }} />
            <AccountInfo />

            {isDesktop && <MenuDesktop isOffset={isOffset} navConfig={navConfig} />}

            {!isDesktop && <MenuMobile isOffset={isOffset} navConfig={navConfig} />}
          </Container>
        </ToolbarStyle>

        {isOffset && <ToolbarShadowStyle />}
      </AppBar>
      {childrenBelowHeader && <FillBox />}
    </>
  );
}
