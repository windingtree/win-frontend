import MainLayout from 'src/layouts/main';
import { Container } from '@mui/material';
import LandingCities from 'src/containers/home/LandingCities';
import LandingConferences from 'src/containers/home/LandingConferences';
import { SearchForm } from 'src/containers/search/SearchForm';

export const Home = () => {
  return (
    <MainLayout>
      <Container maxWidth="xl">
        <SearchForm navigateAfterSearch={true} />
        <LandingCities />
        <LandingConferences />
      </Container>
    </MainLayout>
  );
};
