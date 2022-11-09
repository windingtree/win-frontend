import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { useState } from 'react';
import Iconify from 'src/components/Iconify';

const CovidDialog = ({
  open = false,
  handleClose
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle mb={1}>
        <Stack direction="row" alignItems="center">
          <Iconify
            icon="eva:info-outline"
            sx={{
              mr: 1
            }}
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
          .
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export const FacilityCovid = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <Box>
      <CovidDialog open={dialogOpen} handleClose={handleCloseDialog} />

      <Link href="#" onClick={handleOpenDialog} sx={{ mx: 2 }}>
        <Stack direction="row" alignItems={'center'}>
          <Typography mr={1}>COVID-19 Support</Typography>
          <Iconify icon="eva:info-outline" />
        </Stack>
      </Link>
    </Box>
  );
};
