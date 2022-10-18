import { alpha, styled, useTheme } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Container, Stack, Typography } from '@mui/material';
import { LogoBeta } from 'src/components/Logo';
import useOffSetTop from 'src/hooks/useOffsetTop';
import { useResponsive } from 'src/hooks/useResponsive';
import { HEADER } from 'src/config/componentSizes';
import { AccountInfo } from 'src/components/AccountInfo';
import { SocialsButton } from 'src/components/SocialButton';
import MenuDesktop from './MenuDesktop';
import navConfig from './MenuConfig';
import { useAccommodationsAndOffers } from '../../hooks/useAccommodationsAndOffers';

// this is commented out because the navconfig is currently commented out
// import MenuMobile from './MenuMobile';

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

const SOCIALS = [
  {
    name: 'Blog',
    icon: 'fluent:news-16-filled',
    socialColor: '#00AAEC',
    path: 'https://blog.windingtree.com/'
  },
  {
    name: 'Discord',
    icon: 'ic:outline-discord',
    socialColor: '#7289da',
    path: 'https://discord.gg/RWqqzT3Gf8'
  },
  {
    name: 'Twitter',
    icon: 'eva:twitter-fill',
    socialColor: '#00AAEC',
    path: 'https://twitter.com/windingtree'
  }
];

export default function MainHeader({ childrenBelowHeader }: MainHeaderProps) {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);
  const isDesktop = useResponsive('up', 'md');
  const { isGroupMode } = useAccommodationsAndOffers();
  const theme = useTheme();

  return (
    <>
      <AppBar sx={{ boxShadow: 0, bgcolor: theme.palette.background.default }}>
        <ToolbarStyle disableGutters>
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Stack direction={'row'} spacing={2}>
              <LogoBeta />
              {isGroupMode && (
                <>
                  <Typography
                    variant="h6"
                    color="common.black"
                    px={2}
                    borderLeft={(theme) => ({
                      borderLeft: `${theme.spacing(0.5)} ${
                        theme.palette.common.black
                      } solid`
                    })}
                  >
                    Group Booking
                  </Typography>
                </>
              )}
            </Stack>

            <Box sx={{ flexGrow: 1 }} />
            <AccountInfo />

            {isDesktop && <MenuDesktop isOffset={isOffset} navConfig={navConfig} />}

            {/* Currently the navConfig is empty, therefore it is commented out */}
            {/* {!isDesktop && <MenuMobile isOffset={isOffset} navConfig={navConfig} />} */}

            {isDesktop && <SocialsButton socials={SOCIALS} sx={{ mx: 0.5 }} />}
          </Container>
        </ToolbarStyle>

        {isOffset && <ToolbarShadowStyle />}
      </AppBar>
      {childrenBelowHeader && <FillBox />}
    </>
  );
}
