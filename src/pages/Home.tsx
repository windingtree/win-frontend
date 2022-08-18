import MainLayout from 'src/layouts/main';
import { Box } from 'grommet';
import { SearchForm } from 'src/containers/search/SearchForm';

export const Home = () => {
  return (
    <MainLayout>
      <Box pad="0" style={{ position: 'relative' }}>
        {/* Navigate to search page after click on search */}
        <SearchForm />
      </Box>
    </MainLayout>
  );
};
