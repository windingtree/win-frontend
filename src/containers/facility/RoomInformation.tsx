import { Box, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { RoomTypes } from '@windingtree/glider-types/dist/win';
import { IconButtonAnimate } from 'src/components/animate';
import Iconify from 'src/components/Iconify';
import { getIsRefundable } from 'src/utils/offers';

const getAdultText = (adultCount: number) => {
  if (adultCount === 1) return 'adult';
  return 'adults';
};

const getChildrenText = (adultCount: number | undefined) => {
  if (adultCount === 1) return 'child';
  return 'children';
};

interface RoomInformationType {
  room: RoomTypes;
}

export const RoomInformation = ({ room }: RoomInformationType): JSX.Element | null => {
  if (!room) return null;

  const { name, maximumOccupancy, description } = room;
  const { adults, children } = maximumOccupancy;
  const dummy = 'refundable_with_deadline';
  const isRefundable = getIsRefundable(dummy);
  const deadline = '3 oktober';
  const cancelationPolicy = isRefundable
    ? `Free cancellation until ${deadline}.`
    : 'Non-refundable';
  const disclaimer = 'Fees apply if cancellation takes place after that date';

  return (
    <Box>
      <Box>
        <Typography variant="h4" mb={2}>
          {name}
        </Typography>
        <Typography variant="body1" mb={1}>
          {adults > 0 && `Book your ${name} for ${adults} ${getAdultText(adults)} `}
          {children > 0 && `and ${children} ${getChildrenText(children)}`}
        </Typography>
      </Box>
      <Typography variant="body1">{description}</Typography>
      <Stack direction="row" alignItems="center">
        <Typography variant="body2">{cancelationPolicy}</Typography>
        <Tooltip title={disclaimer}>
          <IconButtonAnimate color="info" size="small">
            <Iconify icon="eva:info-outline" />
          </IconButtonAnimate>
        </Tooltip>
      </Stack>
    </Box>
  );
};
