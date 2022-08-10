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
      facility !== undefined && offers !== undefined
        ? offers.filter(
          (offer) => offer.pricePlansReferences &&
            offer.pricePlansReferences[facility.id] !== undefined
        )
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
      {facility &&
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

          {facilityOffers  && facilityOffers.length  > 0 && facilityOffers.map(
            offer => facility.roomTypes &&
              offer.pricePlansReferences &&
              offer.pricePlansReferences[facility.id] &&
              offer.pricePlansReferences[facility.id].roomType !== undefined &&
              (
                <RoomCard
                  key={offer.id}
                  facilityId={facility.id}
                  offer={offer}
                  room={
                    facility.roomTypes[
                      // @todo review after the Derbysoft Proxy types fixes
                      offer.pricePlansReferences[facility.id].roomType as string
                    ]
                  }
                  // @todo review after the Derbysoft Proxy types fixes
                  roomId={offer.pricePlansReferences[facility.id].roomType as string}
                />
              )
          )}
        </Box>
      }
    </MainLayout>
  );
};
