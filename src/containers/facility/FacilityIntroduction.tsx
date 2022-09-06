import { FacilityDetailImages } from './FacilityDetailImages';
import { createSearchParams, useParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from '../../hooks/useAccommodationsAndOffers.tsx';
import { AccommodationWithId } from '../../hooks/useAccommodationsAndOffers.tsx/helpers';
import { MediaItem } from '@windingtree/glider-types/types/win';
import {
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Link,
  Stack,
  SxProps,
  Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { useMemo, useState } from 'react';
import { stringToNumber } from '../../utils/strings';
import {
  buildAccommodationAddress,
  getLargestImages,
  sortByLargestImage
} from '../../utils/accommodation';
import { FacilityGallery } from './FacilityGallery';
import { daysBetween } from '../../utils/date';
import 'react-image-lightbox/style.css';
import { LightboxModal } from '../../components/LightboxModal';
import { Link as RouterLink } from 'react-router-dom';
import FallbackImage from '../../images/hotel-fallback.webp';
import Iconify from '../../components/Iconify';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '720px',
  gap: theme.spacing(1),
  position: 'relative',
  marginBottom: theme.spacing(8),
  marginTop: theme.spacing(2.5),

  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
    height: '500px'
  }
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2.5)
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
        <Typography textAlign={'right'}>Average price per night / per room</Typography>
      </div>

      <div>
        <Button
          disableElevation
          variant="contained"
          size="large"
          onClick={scrollToDetailImages}
          sx={{
            whiteSpace: 'nowrap'
          }}
        >
          Select Room
        </Button>
      </div>
      <Typography variant="caption">{"You won't be charged yet"}</Typography>
    </HeaderButtonContainer>
  );
};

const HotelAddress = ({
  address,
  accommodationId,
  name
}: {
  address?: string;
  accommodationId: string;
  name?: string;
}) => {
  const { latestQueryParams } = useAccommodationsAndOffers();
  const mapQuery = useMemo(() => {
    if (latestQueryParams === undefined) {
      return '';
    }

    const params = {
      roomCount: latestQueryParams.roomCount.toString(),
      adultCount: latestQueryParams.adultCount.toString(),
      startDate: latestQueryParams.arrival?.toISOString() ?? '',
      endDate: latestQueryParams.departure?.toISOString() ?? '',
      location: latestQueryParams.location,
      ...(accommodationId && name ? { focusedFacilityId: accommodationId + name } : {})
    };

    return createSearchParams(params);
  }, [latestQueryParams, createSearchParams]);

  return (
    <>
      <Box>
        {address}.{' '}
        <Link component={RouterLink} to={mapQuery ? `/search?${mapQuery}` : '#'}>
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
      left: 250,
      top: 95
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={paperStyles}
    >
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
  accommodationId
}: {
  name?: string;
  address?: string;
  accommodationId: string;
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
        <HotelAddress address={address} accommodationId={accommodationId} name={name} />
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

  // show all photos buttons
  const buttonStyle: SxProps = {
    position: 'absolute',
    right: '2%',
    bottom: '5%'
  };

  const [mainImage, ...rest] = sortedImages;
  const address = buildAccommodationAddress(accommodation);

  return (
    <>
      <HeaderContainer>
        <HeaderTitle
          name={accommodation?.name}
          address={address}
          accommodationId={accommodation?.hotelId ?? ''}
        />
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
          imageClickHandler={handleOpenSlide}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        />

        <LightboxModal
          images={largestImagesUrls}
          mainSrc={largestImagesUrls[slideIndex] ?? FallbackImage}
          isOpen={slideOpen}
          photoIndex={slideIndex}
          setPhotoIndex={setSlideIndex}
          onCloseRequest={handleCloseSlide}
        />
      </Container>
    </>
  );
};
