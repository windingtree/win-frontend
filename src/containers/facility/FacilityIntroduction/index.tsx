import { FacilityDetailImages } from './FacilityDetailImages';
import { useParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';
import {
  AccommodationWithId,
  getGroupMode
} from 'src/hooks/useAccommodationsAndOffers/helpers';
import { MediaItem } from '@windingtree/glider-types/dist/win';
import {
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { useMemo, useState } from 'react';
import { stringToNumber } from 'src/utils/strings';
import {
  buildAccommodationAddress,
  getLargestImages,
  sortByLargestImage
} from 'src/utils/accommodation';
import { FacilityGallery } from './FacilityGallery';
import { daysBetween } from 'src/utils/date';
import 'react-image-lightbox/style.css';
import { LightboxModal } from 'src/components/LightboxModal';
import Iconify from 'src/components/Iconify';
import { currencySymbolMap } from '@windingtree/win-commons/dist/currencies';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',

  gap: theme.spacing(1),
  position: 'relative',
  marginBottom: theme.spacing(8),
  marginTop: theme.spacing(2.5),

  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
    height: '500px'
  }
}));

const HeaderTitleContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%'
}));

const HeaderButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',

  [theme.breakpoints.up('md')]: {
    alignItems: 'end',
    width: '100%'
  }
}));

const FacilityMainImage = styled('img')(() => ({
  flex: '50%',
  overflow: 'hidden',
  objectFit: 'cover'
}));

const AllPhotosButton = styled(Button)(({ theme }) => ({
  width: '50%',
  [theme.breakpoints.up('lg')]: {
    width: 'auto',
    position: 'absolute',
    right: 0,
    bottom: 0
  }
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
  const isGroupMode = getGroupMode(latestQueryParams?.roomCount);
  const numberOfRooms = isGroupMode ? 1 : latestQueryParams?.roomCount ?? 1;
  const lowestAveragePrice =
    lowestTotalPrice && Number(lowestTotalPrice.price) / (numberOfDays * numberOfRooms);
  const currencySymbol =
    lowestTotalPrice?.currency && currencySymbolMap[lowestTotalPrice?.currency]
      ? currencySymbolMap[lowestTotalPrice?.currency]
      : lowestTotalPrice?.currency;

  return (
    <HeaderButtonContainer>
      <Stack direction="row" alignItems="center" mt={1}>
        <Typography>From</Typography>
        <Typography variant="h5" marginLeft={theme.spacing(1)}>
          {currencySymbol} {lowestAveragePrice?.toFixed(2)}
        </Typography>
      </Stack>
      <Typography textAlign={{ md: 'right' }}>Average price / room / night</Typography>
      <Button
        size="large"
        disableElevation
        variant="outlined"
        onClick={scrollToDetailImages}
        sx={{
          mt: 1
        }}
      >
        Select Room
      </Button>

      <Typography mt={1} variant="caption">
        {"You won't be charged yet"}
      </Typography>
    </HeaderButtonContainer>
  );
};

const HotelAddress = ({
  address,
  coordinates
}: {
  address?: string;
  coordinates: number[] | undefined;
}) => {
  const googleBaseUrl = new URL('https://www.google.com/maps/@?api=1&map_action=map');
  coordinates &&
    googleBaseUrl.searchParams.set('center', `${coordinates[1]},${coordinates[0]}`);

  return (
    <>
      <Box>
        {address}.{' '}
        <Link href={googleBaseUrl.toString()} target="_blank" rel="_noreferrer">
          See Map
        </Link>
      </Box>
    </>
  );
};

const CovidDialog = ({
  open = false,
  handleClose
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const theme = useTheme();
  const paperStyles: DialogProps['PaperProps'] = {
    sx: {
      '&.MuiPaper-rounded': {
        border: `1px solid ${theme.palette.error.main}`
      },
      position: 'absolute',
      left: 200,
      top: 95
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={paperStyles}>
      <DialogTitle mb={1}>
        <Stack direction={'row'} alignItems={'center'}>
          <Iconify
            icon={'typcn:info-large'}
            sx={{
              border: `1px solid ${theme.palette.error.darker}`,
              borderRadius: '50%',
              color: theme.palette.error.darker,
              mr: 1
            }}
            fontSize="large"
          />
          <Typography variant="h6">Coronavirus (COVID-19) Support</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Please check for travel restrictions. In response to Coronavirus (COVID-19),
          travel may be permitted only for certain purposes and in particular, touristic
          travel may not be allowed, and certain services and amenities may be
          unavailable.
        </Typography>
        <br />
        <Typography variant="body2">
          Please verify the information published by the government authorities. An
          overview of country specific rules for COVID can be found{' '}
          <Link
            href="https://apply.joinsherpa.com/travel-restrictions"
            target={'_blank'}
            rel="noreferrer"
          >
            here
          </Link>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

const HeaderTitle = ({
  name,
  address,
  accommodation
}: {
  name?: string;
  address?: string;
  accommodation: AccommodationWithId | null;
}) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  return (
    <HeaderTitleContainer>
      <Box>
        <Box mb={3}>
          <Link href="#" onClick={handleOpenDialog} variant={'h6'}>
            COVID-19 Support
          </Link>
        </Box>
        <Typography variant="h2" marginBottom={theme.spacing(1.5)}>
          {name}
        </Typography>
        <HotelAddress
          address={address}
          coordinates={accommodation?.location?.coordinates}
        />
        <CovidDialog open={dialogOpen} handleClose={handleCloseDialog} />
      </Box>
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

  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);
  const [slideOpen, setSlideOpen] = useState<boolean>(false);
  const [slideIndex, setSlideIndex] = useState<number>(0);

  const accommodation: AccommodationWithId | null = getAccommodationById(
    accommodations,
    String(id)
  );

  const sortedImages: MediaItem[] = useMemo(
    () => sortByLargestImage(accommodation?.media ?? []),
    [accommodation?.media]
  );

  // get largest images and their urls
  const largestImages = useMemo(() => getLargestImages(sortedImages), [sortedImages]);
  const largestImagesUrls = useMemo(
    () => largestImages.map(({ url }) => url as string),
    [largestImages]
  );

  // slide handlers
  const handleOpenSlide = (targetSlideIndex = 0) => {
    setSlideIndex(targetSlideIndex);
    setSlideOpen(true);
  };

  const handleCloseSlide = () => setSlideOpen(false);

  // gallery handlers
  const handleOpenGallery = () => {
    if (largestImages.length > 5) {
      setGalleryOpen(true);
    } else {
      handleCloseGallery();
      handleOpenSlide();
    }
  };

  const handleCloseGallery = () => setGalleryOpen(false);

  const [mainImage, ...rest] = sortedImages;
  const address = buildAccommodationAddress(accommodation);

  return (
    <>
      <Stack direction={{ md: 'row' }}>
        <HeaderTitle
          name={accommodation?.name}
          address={address}
          accommodation={accommodation}
        />
        <HeaderButton scrollToDetailImages={scrollToDetailImages} />
      </Stack>

      <Container>
        <FacilityMainImage src={mainImage?.url} />
        <FacilityDetailImages images={rest} />
        <AllPhotosButton variant="outlined" size="medium" onClick={handleOpenGallery}>
          {largestImages.length > 5 ? 'Show all photos' : 'View Photos'}
        </AllPhotosButton>
        <FacilityGallery
          open={galleryOpen}
          onClose={handleCloseGallery}
          closeHandler={handleCloseGallery}
          hotelName={accommodation?.name}
          selectRoomHandler={scrollToDetailImages}
          images={largestImages}
          imageClickHandler={handleOpenSlide}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        />

        <LightboxModal
          images={largestImagesUrls}
          mainSrc={largestImagesUrls[slideIndex] ?? '/images/hotel-fallback.webp'}
          isOpen={slideOpen}
          photoIndex={slideIndex}
          setPhotoIndex={setSlideIndex}
          onCloseRequest={handleCloseSlide}
        />
      </Container>
    </>
  );
};
