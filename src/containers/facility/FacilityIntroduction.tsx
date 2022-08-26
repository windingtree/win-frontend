import { FacilityDetailImages } from './FacilityDetailImages';
import { useParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from '../../hooks/useAccommodationsAndOffers.tsx';
import { AccommodationWithId } from '../../hooks/useAccommodationsAndOffers.tsx/helpers';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material';
import { Box } from '@mui/material';
import { sortByLargestImage } from '../../utils/accommodation';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '720px',
  gap: '8px',
  padding: '20px',

  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
    height: '500px'
  }
}));

const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: '5px',
  padding: '20px'
}));

const HeaderTitleContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}));

const HeaderButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'end'
}));

const FacilityMainImage = styled('img')(() => ({
  flex: '50%',
  overflow: 'hidden',
  objectFit: 'cover'
}));

const HeaderButtonFooter = styled(Box)(() => ({
  fontSize: '8px'
}));

const HeaderButton = () => {
  return (
    <HeaderButtonContainer>
      <Box display={'flex'} alignItems={'end'}>
        <Typography>From</Typography>
        <Typography fontSize={'24px'} marginLeft={'12px'}>
          $100
        </Typography>
      </Box>
      <div>
        <Typography>Per Night Per Room</Typography>
      </div>

      <div>
        <CtaButton onClick={scrollToDetailImages}>Select Room</CtaButton>
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
        <Typography fontWeight={500} fontSize="2rem" marginBottom={'10px'}>
          {name}
        </Typography>
        <HotelAddress address={address} />
      </div>
    </HeaderTitleContainer>
  );
};

export const FacilityIntroduction = ({
  scrollToDetailImages
}: {
  scrollToDetailImages: () => void;
}) => {
  const { getAccommodationById, accommodations } = useAccommodationsAndOffers();
  const { id } = useParams();
  const accommodation: AccommodationWithId | null = getAccommodationById(
    accommodations,
    String(id)
  );

  const sortedImages: MediaItem[] = sortByLargestImage(accommodation?.media ?? []);
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
        <HeaderButton scrollToDetailImages={scrollToDetailImages} />
      </HeaderContainer>

      <Container>
        <FacilityMainImage src={mainImage?.url} />
        <FacilityDetailImages images={rest} />
      </Container>
    </>
  );
};
