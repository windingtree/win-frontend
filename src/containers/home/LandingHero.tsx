import { Alert, Box, SxProps, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { SearchForm } from '../search/SearchForm';

const betaEllipsisStyle: SxProps = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '17ch',
  textAlign: 'center'
};
export default function LandingHero() {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <>
      <Alert severity="info" sx={{ justifyContent: 'center' }}>
        <Typography sx={isMobileView ? betaEllipsisStyle : {}} variant={'body2'}>
          WIN is still in Beta. If you experience any instabilities please share your
          feedback with us{' '}
        </Typography>
        {!isMobileView && (
          <a
            href="https://winwindao.typeform.com/win-feedback"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
        )}
      </Alert>
      <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 10 }, mb: 10 }}>
        <Typography variant={isMobileView ? 'h3' : 'h2'} mb={1} component="h1">
          Book your next adventure on the blockchain
        </Typography>
        <Typography
          variant={isMobileView ? 'body2' : 'h5'}
          mb={{ xs: 4, md: 10 }}
          component="h2"
          sx={{ fontWeight: 'normal' }}
        >
          Pay in stablecoins, get rewarded and contribute to a more sustainable planet.{' '}
          Learn more <Link to="/faq">here</Link>.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <SearchForm />
        </Box>
      </Box>
    </>
  );
}
