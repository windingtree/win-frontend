import MainLayout from 'src/layouts/main';
import { Alert, Container, Typography } from '@mui/material';
import LandingCities from 'src/containers/home/LandingCities';
import LandingConferences from 'src/containers/home/LandingConferences';
import { SearchForm } from 'src/containers/search/SearchForm';

export const Home = () => {
  return (
    <MainLayout>
      <Alert severity="info" sx={{ justifyContent: 'center' }}>
        This is a beta version that works best on a desktop.
      </Alert>
      <Container
        maxWidth="xl"
        sx={{ marginTop: { xs: 5, md: 10 }, marginBottom: 10, textAlign: 'center' }}
      >
        {/* Should be a h1 element but with h2 styling. Figure out how to do this with MUI */}
        <Typography variant="h2" mb={2}>
          For frens who trav3l
        </Typography>
        <SearchForm />
      </Container>
      <Container maxWidth="xl">
        <LandingCities />
        <LandingConferences />
      </Container>
    </MainLayout>
  );
};
