import { useAppState } from '../store';
import { MainLayout } from '../layouts/MainLayout';
import { Box, Text, Image } from 'grommet';
import { useMemo } from 'react';
import { RoomCard } from '../components/RoomCard';
import { Container, Row, Col } from 'react-grid-system';

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

          <Container>
            <Row justify="center">
              <Col
                lg={6}
                style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}
              >
                <Image height={300} width={300} />
              </Col>
              <Col lg={6}>
                <Text weight={500} size="1rem" margin="small">
                  {facility.description}
                </Text>
              </Col>
            </Row>
          </Container>

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
