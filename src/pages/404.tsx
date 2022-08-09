import { MainLayout } from '../layouts/MainLayout';
import { Box, Text } from 'grommet';

export const FourOhFour = () => {
  return (
    <MainLayout
      breadcrumbs={[
        {
          label: 'Home',
          path: '/'
        }
      ]}
    >
      <Box align="center" overflow="hidden">
        <Text weight={500} size="2rem" margin="small">
          Could not find this page.
        </Text>
      </Box>
    </MainLayout>
  );
};
