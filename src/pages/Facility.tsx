import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import { Box, Text, Image } from 'grommet';
import { useMemo } from 'react';
import { RoomCard } from '../components/RoomCard';

export const Facility = () => {
  const { isConnecting, facilities } = useAppState();
  const facility = useMemo(
    () => facilities.find((f) => '/facility/' + f.id === window.location.pathname),
    [facilities]
  );

  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Search',
          path: `/`
        }
      ]}
    >
      {!isConnecting && facility !== undefined && (
        <Box align="center" overflow="hidden">
          <Text weight={500} size="2rem" margin="small">
            {facility.hotelName}
          </Text>
          <Box direction="row">
            <Image height={300} width={300} />
            <Box>
              <Text weight={500} size="1rem" margin="small">
                {facility.description}
              </Text>
            </Box>
          </Box>
          {facility.roomTypes.map((room, i) => (
            <RoomCard key={i} facilityId={facility.id} room={room} />
          ))}
        </Box>
      )}
    </PageWrapper>
  );
};
