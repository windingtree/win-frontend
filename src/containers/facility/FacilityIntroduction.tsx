import { Text, Image } from 'grommet';
import styled from 'styled-components';
import { FacilityDetailImages } from './FacilityDetailImages';
import { useParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from '../../hooks/useAccommodationsAndOffers.tsx';
import { AccommodationWithId } from '../../hooks/useAccommodationsAndOffers.tsx/helpers';
import { MediaItem } from '@windingtree/glider-types/types/win';
import { Button } from '@mui/material';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 720px;
  gap: 8px;
  padding: 20px;

  ${({ theme }) => theme.breakpoints.large} {
    flex-direction: row;
    height: 500px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
  padding: 20px;
`;

const HeaderTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
`;

const FacilityMainImage = styled(Image)`
  flex: 50%;
  overflow: hidden;
  object-fit: cover;
`;

const HeaderButtonFooter = styled.div`
  font-size: 8px;
`;

const sortByLargestImage = (images: MediaItem[]) => {
  if (!images?.length) return [];

  const compareImages = (itemOne: MediaItem, itemTwo: MediaItem) => {
    return Number(itemTwo.width) - Number(itemOne.width);
  };

  const sortedImages = images?.sort(compareImages);
  return sortedImages;
};

const HeaderButton = () => {
  return (
    <HeaderButtonContainer>
      <div>
        <Text>From</Text>
        <Text style={{ fontSize: '24px', marginLeft: '12px' }}>$100</Text>
      </div>
      <div>
        <Text>Per Night Per Room</Text>
      </div>

      <div>
        <Button
          sx={{
            marginRight: '10px',
            padding: '15px 30px',
            backgroundColor: 'purple',
            color: 'white'
          }}
        >
          Select Room
        </Button>
      </div>
      <HeaderButtonFooter>{"You won't be charged yet"}</HeaderButtonFooter>
    </HeaderButtonContainer>
  );
};

const HotelAddress = ({ address }: { address?: string }) => {
  return (
    <>
      <div>
        {address}. See Map {'>'}
      </div>
    </>
  );
};

const HeaderTitle = ({ name, address }: { name?: string; address?: string }) => {
  return (
    <HeaderTitleContainer>
      <Button sx={{ marginRight: '8px' }}>{'<'}</Button>
      <div>
        <Text
          weight={500}
          size="2rem"
          style={{ marginBottom: '10px', display: 'inline-block' }}
        >
          {name}
        </Text>
        <HotelAddress address={address} />
      </div>
    </HeaderTitleContainer>
  );
};

export const FacilityIntroduction = () => {
  const { getAccommodationById, accommodations } = useAccommodationsAndOffers();
  const { id } = useParams();
  const accommodation: AccommodationWithId | null = getAccommodationById(
    accommodations,
    String(id)
  );
  const sortedImages = sortByLargestImage(accommodation?.media ?? []);
  const [mainImage, ...rest] = sortedImages;
  const address = [
    accommodation?.contactInformation?.address?.streetAddress,
    accommodation?.contactInformation?.address?.locality,
    accommodation?.contactInformation?.address?.premise,
    accommodation?.contactInformation?.address?.country
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      <HeaderContainer>
        <HeaderTitle name={accommodation?.name} address={address} />
        <HeaderButton />
      </HeaderContainer>

      <Container>
        <FacilityMainImage src={mainImage?.url} />
        <FacilityDetailImages images={rest} />
      </Container>
    </>
  );
};
