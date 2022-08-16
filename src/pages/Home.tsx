import { MainLayout } from '../layouts/MainLayout';
import { Search } from '../components/Search';
import { Box } from 'grommet';

export const Home = () => {
  return (
    <MainLayout kind="full">
      <Box pad="0" style={{ position: 'relative' }}>
        {/* Navigate to search page after click on search */}
        <Search />
      </Box>
    </MainLayout>
  );
};
