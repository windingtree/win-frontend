import { PageWrapper } from './PageWrapper';
import { Box, Text } from 'grommet';

export const Developers = () => {
  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Home',
          path: '/'
        }
      ]}
    >
      <Box align="center" overflow="hidden">
        <Text weight={500} size="2rem" margin="small">
          Developers info
        </Text>
      </Box>
    </PageWrapper>
  );
};
