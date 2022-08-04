import { MainLayout } from '../layouts/MainLayout';
import { Box, Text } from 'grommet';

export const Contacts = () => {
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
          Contacts
        </Text>
      </Box>
    </MainLayout>
  );
};
