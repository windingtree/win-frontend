import { MainLayout } from '../layouts/MainLayout';
import { Box, Text } from 'grommet';

export const Security = () => {
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
          Security info
        </Text>
      </Box>
    </MainLayout>
  );
};
