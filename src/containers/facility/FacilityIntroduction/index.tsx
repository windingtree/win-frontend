import { FacilityDetailImages } from './FacilityDetailImages';
import { useParams } from 'react-router-dom';

import { MediaItem, WinAccommodation } from '@windingtree/glider-types/dist/win';
import { Alert, AlertTitle, Button, Link, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { useMemo, useState } from 'react';
import {
  buildAccommodationAddress,
  getLargestImages,
  sortByLargestImage
} from 'src/utils/accommodation';
import { FacilityGallery } from './FacilityGallery';
import 'react-image-lightbox/style.css';
import { LightboxModal } from 'src/components/LightboxModal';
import { useAccommodation } from 'src/hooks/useAccommodation';
import { FacilityLoadingSkeleton } from './FacilityLoadingSkeleton';
import { HeaderButton } from './HeaderButton';
import { getRndHotelImg, getAccommodationImage } from '../../../utils/getRndHotelImg';

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

const HeaderTitle = ({
  name,
  address,
  accommodation
}: {
  name?: string;
  address?: string;
  accommodation: WinAccommodation | null;
}) => {
  const theme = useTheme();

  return (
    <HeaderTitleContainer>
      <Box>
        <Typography variant="h2" marginBottom={theme.spacing(1.5)}>
          {name}
        </Typography>
        <HotelAddress
          address={address}
          coordinates={accommodation?.location?.coordinates}
        />
      </Box>
    </HeaderTitleContainer>
  );
};

export const FacilityIntroduction = ({
  scrollToDetailImages
}: {
  scrollToDetailImages: () => void;
}) => {
  const { id } = useParams();
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);
  const [slideOpen, setSlideOpen] = useState<boolean>(false);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const { accommodationQuery, offersQuery } = useAccommodation({ id });
  const { data, isLoading, error } = accommodationQuery;
  const accommodation = data?.accommodation;

  const sortedImages: MediaItem[] = useMemo(
    () => sortByLargestImage(accommodation?.media ?? []),
    [accommodation]
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

  // This random image will be used instead of the test image with text "TEST IMAGE: this image is not a bug".
  const rndImg = useMemo<string>(getRndHotelImg, []);
  const mainImageUrl = useMemo<string | undefined>(() => {
    const originalUrl = mainImage ? mainImage.url : '';
    return getAccommodationImage(originalUrl, rndImg);
  }, [mainImage, rndImg]);

  if (isLoading) return <FacilityLoadingSkeleton />;

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ display: 'inline-block' }}>
          <Stack>
            <AlertTitle>Something went wrong.</AlertTitle>
            Please try to search for accommodations again.
            <Button variant="contained">Search again</Button>
          </Stack>
        </Alert>
      </Box>
    );
  }

  if (!accommodation) return null;

  return (
    <>
      <Stack direction={{ md: 'row' }}>
        <HeaderTitle
          name={accommodation?.name}
          address={address}
          accommodation={accommodation}
        />
        <HeaderButton
          latestQueryParams={offersQuery.data?.latestQueryParams}
          offers={offersQuery.data?.offers}
          scrollToDetailImages={scrollToDetailImages}
          isLoading={offersQuery?.isFetching}
        />
      </Stack>
      <Container>
        <FacilityMainImage src={mainImageUrl} />
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
