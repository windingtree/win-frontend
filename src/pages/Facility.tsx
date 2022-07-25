import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import { Box, Text, Image } from 'grommet';
import { useMemo } from 'react';
import { SpaceCard } from '../components/SpaceCard';

export const Facility = () => {
  const { isConnecting, facilities } = useAppState();
  const facility = useMemo(() => facilities.find(f => '/facility/' + f.id === window.location.pathname), [facilities])

  const hasPhotos = facility !== undefined && facility.photos.length > 0

  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Search',
          path: `/`
        }
      ]}
    >
      {!isConnecting && facility !== undefined &&
        <Box align='center' overflow='hidden'>
          <Text weight={500} size='2rem' margin='small'>
            {facility.name}
          </Text>
          <Box direction='row'>
            <Image
              height={300}
              width={300}
              src={hasPhotos ? facility.photos[0] : ''}
            />
            <Box>
              <Text weight={500} size='2rem' margin='small'>
                {facility.description}
              </Text>
            </Box>
          </Box>
          {facility.spaces.map((space) => <SpaceCard key={space.id} facilityId={facility.id} space={space} />)}
        </Box>
      }
    </PageWrapper>
  );
};
