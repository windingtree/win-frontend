import { Alert, Container, Typography } from '@mui/material';
import { SearchForm } from '../search/SearchForm';

export default function LandingHero() {
  return (
    <>
      <Alert severity="info" sx={{ justifyContent: 'center' }}>
        This is a beta version that works best on a desktop.
      </Alert>
      <Container
        maxWidth="xl"
        sx={{ marginTop: { xs: 5, md: 10 }, marginBottom: 10, textAlign: 'center' }}
      >
        <Typography variant="h2" mb={2} component="h1">
          For frens who trav3l
        </Typography>
        <SearchForm />
      </Container>
    </>
  );
}
