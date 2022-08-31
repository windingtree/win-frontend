import { FacilityDetailImages } from './FacilityDetailImages';
import { useParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from '../../hooks/useAccommodationsAndOffers.tsx';
import { AccommodationWithId } from '../../hooks/useAccommodationsAndOffers.tsx/helpers';
import { MediaItem } from '@windingtree/glider-types/types/win';
import { Button, SxProps, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { useMemo, useState } from 'react';
import { stringToNumber } from '../../utils/strings';
import { getLargestImages, sortByLargestImage } from '../../utils/accommodation';
import { FacilityGallery } from './FacilityGallery';
import { daysBetween } from '../../utils/date';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '720px',
  gap: theme.spacing(1),
  padding: theme.spacing(2.5),
  position: 'relative',

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
  alignItems: 'end',
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
  const { getAccommodationById, accommodations, latestQueryParams } =
    useAccommodationsAndOffers();

  const id: string = params.id as string;
  const accommodation = getAccommodationById(accommodations, id);
  const offers = accommodation?.offers;

  // get lowest offer price
  const lowestTotalPrice = useMemo(() => {
    return offers?.reduce(
      (lowestPrice, offer): { price: string; currency: string } => {
        return !lowestPrice.price ||
          stringToNumber(offer.price?.public) < stringToNumber(lowestPrice.price)
          ? { price: offer.price?.public, currency: offer.price?.currency }
          : lowestPrice;
      },
      { price: '', currency: '' }
    );
  }, [offers]);

  const numberOfDays = daysBetween(
    latestQueryParams?.arrival,
    latestQueryParams?.departure
  );
  const numberOfRooms = latestQueryParams?.roomCount ?? 1;
  const lowestAveragePrice =
    lowestTotalPrice && Number(lowestTotalPrice.price) / (numberOfDays * numberOfRooms);

  return (
    <HeaderButtonContainer>
      <Box display={'flex'} alignItems={'end'}>
        <Typography>From</Typography>
        <Typography variant="h5" marginLeft={theme.spacing(1)}>
          {lowestTotalPrice?.currency} {lowestAveragePrice?.toFixed(2)}
        </Typography>
      </Box>
      <div>
        <Typography>Average price per night / per room</Typography>
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

  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);
  const handleOpenGallery = () => setGalleryOpen(true);
  const handleCloseGallery = () => setGalleryOpen(false);

  const buttonStyle: SxProps = {
    position: 'absolute',
    right: 50,
    bottom: 50
  };

  const sortedImages: MediaItem[] = useMemo(
    () => sortByLargestImage(accommodation?.media ?? []),
    [accommodation?.media]
  );

  const largestImages = useMemo(() => getLargestImages(sortedImages), [sortedImages]);

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
        <Button
          variant="contained"
          color="secondary"
          size={'large'}
          sx={buttonStyle}
          onClick={handleOpenGallery}
        >
          {largestImages.length > 5 ? 'Show all photos' : 'View Photos'}
        </Button>
        <FacilityGallery
          open={galleryOpen}
          onClose={handleCloseGallery}
          closeHandler={handleCloseGallery}
          hotelName={accommodation?.name}
          selectRoomHandler={scrollToDetailImages}
          images={largestImages}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        />
      </Container>
    </>
  );
};
