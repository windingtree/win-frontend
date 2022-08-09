import { useAppState } from '../store';
import { MainLayout } from '../layouts/MainLayout';
import { Box, Text, Image } from 'grommet';
import { useMemo } from 'react';
import { RoomCard } from '../components/RoomCard';
import { Container, Row, Col } from 'react-grid-system';

const data = {
  _id: '62f097175af3807609f580e5',
  hotelId: 'GOH203',
  provider: 'derbySoft',
  checkinoutPolicy: {
    checkOutTime: '11:00:00',
    checkInTime: '15:00:00'
  },
  contactInformation: {
    address: {
      country: 'China',
      streetAddress: '14800 Landmark Blvd, Suite 640',
      locality: 'Nanjing, GA'
    },
    emails: ['test@derbysoft.com'],
    phoneNumbers: ['1 770 3957700', '1 770 3929503']
  },
  createdAt: '2022-08-08T15:00:48.002Z',
  description:
    "Welcome to the our hotel.  Atlanta is a dazzling Southern jewel. A vibrant, rich center for arts and culture. Featuring many museums, a presidential library and an incredible nightlife, Atlanta is tons of fun for business and leisure travelers alike. If you're looking for a convenient Atlanta airport hotel, we think you'll love our hotel. It's just north of Hartsfield-Jackson International Airport and just southwest of downtown Atlanta. Our Hartsfield hotel is two and a half miles from the Georgia International Convention Center, four miles from Atlanta Expo Center and 15 miles from Six Flags Over Georgia. Other nearby attractions include the World of Coca-Cola, Underground Atlanta, CNN Center, Georgia Dome, Georgia World Congress Center, and Georgia Aquarium-all less than 10 miles away from our property! Whatever brings you to this vibrant area, we think you'll have a splendid stay at our hotel near the Atlanta Airport. Our team looks forward to helping you have a terrific time. We are an excellent choice for your stay in the Atlanta Airport area. Welcome to our hotel, we're glad you landed here! We're passionate about taking good care of you. That's why we offer a broad range of services and amenities at our hotel to make your stay exceptional. Whether you're planning a corporate meeting or need accommodations for a family reunion or your child's sporting group, our ATL Airport hotel is delighted to offer you easy planning and booking tools to make the process quick and organized.",
  id: '3548a21e-c0f7-4b80-9ec2-aa5ed0869eaa',
  location: {
    coordinates: [13.554954, 52.520008],
    type: 'Point'
  },
  media: [
    {
      type: 'photo',
      height: 260,
      width: 260,
      url: 'https://media.iceportal.com/56618/photos/61679328_M.jpg'
    },
    {
      type: 'photo',
      height: 263,
      width: 263,
      url: 'https://media.iceportal.com/56618/photos/61679322_M.jpg'
    },
    {
      type: 'photo',
      height: 260,
      width: 260,
      url: 'https://media.iceportal.com/56618/photos/61679314_M.jpg'
    },
    {
      type: 'photo',
      height: 405,
      width: 405,
      url: 'https://media.iceportal.com/56618/photos/61679322_L.jpg'
    },
    {
      type: 'photo',
      height: 400,
      width: 400,
      url: 'https://media.iceportal.com/56618/photos/61679328_L.jpg'
    },
    {
      type: 'photo',
      height: 400,
      width: 400,
      url: 'https://media.iceportal.com/56618/photos/61679314_L.jpg'
    },
    {
      type: 'photo',
      height: 682,
      width: 682,
      url: 'https://media.iceportal.com/56618/photos/61679314_XL.jpg'
    },
    {
      type: 'photo',
      height: 691,
      width: 691,
      url: 'https://media.iceportal.com/56618/photos/61679322_XL.jpg'
    },
    {
      type: 'photo',
      height: 682,
      width: 682,
      url: 'https://media.iceportal.com/56618/photos/61679328_XL.jpg'
    },
    {
      type: 'photo',
      height: 1013,
      width: 1013,
      url: 'https://media.iceportal.com/56618/photos/61679322_XXL.jpg'
    },
    {
      type: 'photo',
      height: 1000,
      width: 1000,
      url: 'https://media.iceportal.com/56618/photos/61679328_XXL.jpg'
    },
    {
      type: 'photo',
      height: 1000,
      width: 1000,
      url: 'https://media.iceportal.com/56618/photos/61679314_XXL.jpg'
    },
    {
      type: 'photo',
      height: 1920,
      width: 1920,
      url: 'https://media.iceportal.com/56618/photos/61679314_3XL.jpg'
    },
    {
      type: 'photo',
      height: 1920,
      width: 1920,
      url: 'https://media.iceportal.com/56618/photos/61679328_3XL.jpg'
    },
    {
      type: 'photo',
      height: 1945,
      width: 1945,
      url: 'https://media.iceportal.com/56618/photos/61679322_3XL.jpg'
    },
    {
      type: 'photo',
      height: 2593,
      width: 2593,
      url: 'https://media.iceportal.com/56618/photos/61679322_4K.jpg'
    },
    {
      type: 'photo',
      height: 2400,
      width: 2400,
      url: 'https://media.iceportal.com/56618/photos/61679328_4K.jpg'
    },
    {
      type: 'photo',
      height: 2400,
      width: 2400,
      url: 'https://media.iceportal.com/56618/photos/61679314_4K.jpg'
    }
  ],
  name: 'This is a test hotel',
  otherPolicies: ['Non Refundable', 'cancel before 4PM of arrival date is free'],
  rating: 3,
  type: 'hotel',
  roomType: {
    amenities: [
      {
        name: 'Refrigerator Upon Request',
        description: 'Refrigerator Upon Request',
        otaCode: '88'
      },
      {
        name: 'Microwave Oven (Upon Request)',
        description: 'Microwave Oven (Upon Request)',
        otaCode: '68'
      },
      {
        name: 'Heavenly® Crib Available',
        description: 'Heavenly® Crib Available',
        otaCode: '26'
      },
      {
        name: 'Data Port',
        description: 'Data Port',
        otaCode: '27'
      },
      {
        name: 'Work Desk and Chair',
        description: 'Work Desk and Chair',
        otaCode: '28'
      },
      {
        name: 'Video Games',
        description: 'Video Games',
        otaCode: '254'
      },
      {
        name: 'Outlet Adaptors',
        description: 'Outlet Adaptors',
        otaCode: '159'
      },
      {
        name: 'Rollaway Bed Available Upon Request (Charge)',
        description: 'Rollaway Bed Available Upon Request (Charge)',
        otaCode: '91'
      },
      {
        name: 'Personalized Voicemail',
        description: 'Personalized Voicemail',
        otaCode: '118'
      },
      {
        name: 'In-Room Safe',
        description: 'In-Room Safe',
        otaCode: '92'
      },
      {
        name: 'Wake-Up Service',
        description: 'Wake-Up Service',
        otaCode: '119'
      },
      {
        name: 'Hairdryer',
        description: 'Hairdryer',
        otaCode: '50'
      },
      {
        name: 'Complimentary Daily Newspaper',
        description: 'Complimentary Daily Newspaper',
        otaCode: '73'
      },
      {
        name: 'High Speed Internet Access',
        description: 'High Speed Internet Access',
        otaCode: '51'
      },
      {
        name: '100% Smoke Free Guest Rooms',
        description: '100% Smoke Free Guest Rooms',
        otaCode: '74'
      },
      {
        name: 'Direct Dialing',
        description: 'Direct Dialing',
        otaCode: '31'
      },
      {
        name: 'Iron  Ironing Board',
        description: 'Iron  Ironing Board',
        otaCode: '55'
      },
      {
        name: 'Coffee/Tea Maker',
        description: 'Coffee/Tea Maker',
        otaCode: '19'
      },
      {
        name: 'ADA Accessible Rooms Available',
        description: 'ADA Accessible Rooms Available',
        otaCode: '161'
      },
      {
        name: 'Entertainment Center',
        description: 'Entertainment Center',
        otaCode: '184'
      },
      {
        name: 'Hypo-allergenic Pillows',
        description: 'Hypo-allergenic Pillows',
        otaCode: '187'
      },
      {
        name: 'Smoke Detectors',
        description: 'Smoke Detectors',
        otaCode: '100'
      },
      {
        name: 'Alarm/Clock/Radio',
        description: 'Alarm/Clock/Radio',
        otaCode: '3'
      },
      {
        name: 'Air-Conditioned',
        description: 'Air-Conditioned',
        otaCode: '126'
      },
      {
        name: 'Cordless Telephone',
        description: 'Cordless Telephone',
        otaCode: '107'
      }
    ],
    description:
      'Soak in city views in our Deluxe room, which features a well-appointed ensuite bathroom and up-to-date entertainment offerings.',
    maximumOccupancy: {
      adults: 2,
      children: 2
    },
    media: null,
    name: 'Family Room',
    policies: {
      AD100P_100P: 'Non Refundable',
      '4PM0D1N_100P': 'cancel before 4PM of arrival date is free'
    },
    size: null
  }
};

const FacilityIntroduction = ({ facility }) => (
  <>
    <Text weight={500} size="2rem">
      {facility.name}
    </Text>

    <Container style={{ padding: 0 }}>
      <Row>
        <Col
          lg={6}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}
        >
          <Image
            height="100%"
            width="100%"
            src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          />
        </Col>

        <Col lg={6}>
          <Image
            width="49%"
            height="48%"
            margin={{ right: '2%', bottom: '1%' }}
            src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          />
          <Image
            height="48%"
            width="49%"
            margin={{ bottom: '1%' }}
            src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          />
          <Image
            width="49%"
            height="48%"
            margin={{ right: '2%' }}
            src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          />
          <Image
            width="49%"
            height="48%"
            src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          />
        </Col>
      </Row>
    </Container>
  </>
);

export const Facility = () => {
  // get actual data
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
        <Box overflow="hidden">
          <FacilityIntroduction facility={facility} />

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
