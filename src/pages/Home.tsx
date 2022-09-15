import MainLayout from 'src/layouts/main';
import LandingCities from 'src/containers/home/LandingCities';
import LandingConferences from 'src/containers/home/LandingConferences';
import LandingHero from 'src/containers/home/LandingHero';

export const Home = () => {
  return (
    <MainLayout maxWidth="lg">
      <LandingHero />
      <LandingConferences />
      <LandingCities />
    </MainLayout>
  );
};
