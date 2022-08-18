import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Grid, Link, Divider, Container, Typography, Stack } from '@mui/material';
import { Logo } from 'src/components/Logo';
import SocialsButton from 'src/components/SocialButton';

const LINKS = [
  {
    headline: 'win.so',
    children: [
      //TODO: replace this by using the Routes config fas the source of truth
      { name: 'About', href: '/about' },
      { name: 'FAQs', href: '/faq' }
    ]
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' }
    ]
  },
  {
    headline: 'Contact',
    children: [
      { name: 'hi@windingtree.com', href: '#' },
      { name: 'Newsletter', href: '#' },
    ]
  }
];

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

export default function MainFooter() {
  return (
    <RootStyle>
      <Divider />
      <Container sx={{ pt: 10, pb: 10 }}>
        <Grid
          container
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Logo sx={{ mx: { xs: 'auto', md: 'inherit' } }} />
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              win.so is a decentralized travel booking website powered by <a href="https://windingtree.com">Winding Tree</a>
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{ mt: 5, mb: { xs: 5, md: 0 } }}
            >
              <SocialsButton sx={{ mx: 0.5 }} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={3}
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
            >
              {LINKS.map((list) => (
                <Stack key={list.headline} spacing={2}>
                  <Typography component="p" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      to={link.href}
                      key={link.name}
                      color="inherit"
                      variant="body2"
                      component={RouterLink}
                      sx={{ display: 'block' }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
