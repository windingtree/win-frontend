import { Alert, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { SearchForm } from '../search/SearchForm';

export default function LandingHero() {
  return (
    <>
      <Alert severity="info" sx={{ justifyContent: 'center' }}>
        WIN is still in Beta. If you experience any instabilities please share your
        feedback with us{' '}
        <a
          href="https://winwindao.typeform.com/win-feedback"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>{' '}
      </Alert>
      <Box sx={{ textAlign: 'center', mt: { xs: 5, md: 10 }, mb: 10 }}>
        <Typography variant="h2" mb={1} component="h1">
          Book your next adventure on the blockchain
        </Typography>
        <Typography variant="h5" mb={10} component="h2" sx={{ fontWeight: 'normal' }}>
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
