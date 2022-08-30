import MainLayout from 'src/layouts/main';
import { Container } from '@mui/material';
import LandingCities from 'src/containers/home/LandingCities';
import LandingConferences from 'src/containers/home/LandingConferences';
import LandingHero from 'src/containers/home/LandingHero';

export const Home = () => {
  return (
    <MainLayout>
      <LandingHero />
      <Container maxWidth="xl">
        <LandingCities />
        <LandingConferences />
      </Container>
    </MainLayout>
  );
};
