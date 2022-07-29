import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import { Box, Text, Image } from 'grommet';
import { useMemo } from 'react';
import { RoomCard } from '../components/RoomCard';
import { PricePlansReferences } from '../types/offers';

export const Facility = () => {
  const { isConnecting, facilities, offers } = useAppState();
  const facility = useMemo(
    () => facilities.find((f) => '/facility/' + f.id === window.location.pathname),
    [facilities]
  );

  const rooms = useMemo(
    () => facility !== undefined ? offers.find(offer =>
      Object.keys(offer.pricePlansReferences).includes(facility.id)
    ) : null,
    [offers, facility]
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
            {facility.name}
          </Text>
          <Box direction="row">
            <Image height={300} width={300} />
            <Box>
              <Text weight={500} size="1rem" margin="small">
                {facility.description}
              </Text>
            </Box>
          </Box>
          {/* {rooms && rooms.map((room, i) => (
            <RoomCard key={i} facilityId={facility.id} room={room} />
          ))} */}
        </Box>
      )}
    </PageWrapper>
  );
};
