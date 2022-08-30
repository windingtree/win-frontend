import { FacilityDetailImages } from './FacilityDetailImages';
import { useParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from '../../hooks/useAccommodationsAndOffers.tsx';
import { AccommodationWithId } from '../../hooks/useAccommodationsAndOffers.tsx/helpers';
import { MediaItem } from '@windingtree/glider-types/types/win';
import { Button, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { stringToNumber } from '../../utils/strings';
import { sortByLargestImage } from '../../utils/accommodation';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '720px',
  gap: theme.spacing(1),
  padding: theme.spacing(2.5),

  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
    height: '500px'
  }
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(2.5)
}));

const HeaderTitleContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}));

const HeaderButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'end',
  gap: theme.spacing(0.5)
}));

const FacilityMainImage = styled('img')(() => ({
  flex: '50%',
  overflow: 'hidden',
  objectFit: 'cover'
}));

const HeaderButton = ({ scrollToDetailImages }) => {
  const theme = useTheme();
  const params = useParams();
  const { getAccommodationById, accommodations } = useAccommodationsAndOffers();

  const id: string = params.id as string;
  const accommodation = getAccommodationById(accommodations, id);
  const offers = accommodation?.offers;

  // get lowest offer price
  const lowestPrice = useMemo(() => {
    return offers?.reduce(
      (lowestPrice, offer): { price: string; currency: string } => {
        return stringToNumber(offer.price?.public) > stringToNumber(lowestPrice.price)
          ? { price: offer.price?.public, currency: offer.price?.currency }
          : lowestPrice;
      },
      { price: '-1', currency: '' }
    );
  }, [offers]);

  return (
    <HeaderButtonContainer>
      <Box display={'flex'} alignItems={'end'}>
        <Typography>From</Typography>
        <Typography variant="body1" marginLeft={theme.spacing(1.5)}>
          {lowestPrice?.currency} {Number(lowestPrice?.price).toFixed(2)}
        </Typography>
      </Box>
      <div>
        <Typography>Per Night Per Room</Typography>
      </div>

      <div>
        <Button
          disableElevation
          variant="contained"
          size="large"
          onClick={scrollToDetailImages}
        >
          Select Room
        </Button>
      </div>
      <Typography variant="caption">{"You won't be charged yet"}</Typography>
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
  const theme = useTheme();
  return (
    <HeaderTitleContainer>
      <div>
        <Typography variant="h1" marginBottom={theme.spacing(1.5)}>
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
