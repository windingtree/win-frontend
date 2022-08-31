import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  Modal,
  ModalProps,
  Stack,
  styled,
  SxProps,
  Typography
} from '@mui/material';
import { MediaItem } from '@windingtree/glider-types/types/win';
import { emptyFunction } from '../../utils/common';

export type FacilityGalleryModalProps = Omit<ModalProps, 'children'>;
export interface FacilityGalleryProps extends FacilityGalleryModalProps {
  images?: MediaItem[];
  hotelName?: string;
  selectRoomHandler: () => void;
  closeHandler: () => void;
}

export const FacilityGallery = ({
  images,
  selectRoomHandler = emptyFunction,
  hotelName,
  closeHandler,
  ...props
}: FacilityGalleryProps) => {
  const GalleryContainer = styled(Box)(({ theme }) => ({
    width: '80%',
    height: 600,
    overflowY: 'scroll',
    backgroundColor: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(3)
  }));

  const closeButtonStyle: SxProps = {
    position: 'absolute',
    right: '1%',
    top: '1%',
    color: 'black'
  };

  const handleSelectRoom = () => {
    selectRoomHandler();
    closeHandler();
  };

  return (
    <Modal {...props}>
      <GalleryContainer>
        <Stack
          direction={'row'}
          justifyContent={'center'}
          position="relative"
          alignItems={'center'}
          gap={3}
          my={3}
        >
          <Typography variant="h5">{hotelName}</Typography>
          <Button variant="contained" disableElevation onClick={handleSelectRoom}>
            Select Room
          </Button>
          <Button variant="text" sx={closeButtonStyle} onClick={closeHandler}>
            x Close
          </Button>
        </Stack>
        {images?.length ? (
          <ImageList gap={3} variant="masonry" cols={4}>
            {images?.map((image, index) => {
              return image ? (
                <ImageListItem key={`${image.url}-${index}`}>
                  <img src={image.url} loading={'lazy'} />
                </ImageListItem>
              ) : null;
            })}
          </ImageList>
        ) : null}
      </GalleryContainer>
    </Modal>
  );
};
