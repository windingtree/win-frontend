import MainLayout from 'src/layouts/main';
import { Box, Text } from 'grommet';

export const About = () => {
  return (
    <MainLayout
    //TODO: check with designer whether breadcrumbs are still needed.

    // breadcrumbs={[
    //   {
    //     label: 'Home',
    //     path: '/'
    //   }
    // ]}
    >
      <Box align="center" overflow="hidden">
        <Text weight={500} size="2rem" margin="small">
          About
        </Text>
      </Box>
    </MainLayout>
  );
};
