import { useAppState } from '../store';
import { MainLayout } from '../layouts/MainLayout';
import { Box, Text, Image, Grid } from 'grommet';
import { useMemo } from 'react';
import { RoomCard } from '../components/RoomCard';

export const Facility = () => {
  const { facilities, offers } = useAppState();

  const facility = useMemo(
    () => facilities.find((f) => '/facility/' + f.id === window.location.pathname),
    [facilities]
  );

  const facilityOffers = useMemo(
    () =>
      facility !== undefined
        ? offers.filter((offer) => offer.pricePlansReferences[facility.id] !== undefined)
        : null,
    [offers, facility]
  );

  return (
    // Put the MainLayout in the layout folder
    <MainLayout
      breadcrumbs={[
        {
          label: 'Search',
          path: `/`
        }
      ]}
    >
      {facility && (
        <Box align="center" overflow="hidden">
          <Text weight={500} size="2rem" margin="small">
            {facility.name}
          </Text>
          <Grid
            rows={['medium', 'medium']}
            columns={['medium']}
            gap="small"
            areas={[
              { name: 'image', start: [0, 0], end: [0, 0] },
              { name: 'text', start: [1, 0], end: [1, 0] }
            ]}
          >
            <Box gridArea="image">
              <Image />

              {/* <Image height={300} width={300} /> */}
            </Box>
            <Box gridArea="text">
              <Text weight={500} size="1rem" margin="small">
                {facility.description}
              </Text>
            </Box>
          </Grid>
          {facilityOffers?.map((offer) => {
            return (
              <RoomCard
                key={offer?.id}
                facilityId={facility?.id}
                offer={offer}
                room={
                  facility.roomTypes[offer.pricePlansReferences[facility.id].roomType]
                }
                roomId={offer.pricePlansReferences[facility.id].roomType}
              />
            );
          })}
        </Box>
      )}
    </MainLayout>
  );
};
