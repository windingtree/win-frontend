import { Box, Typography } from '@mui/material';

export const RoomInformation = ({ room }) => {
  return (
    <Box>
      <Box>
        <Typography variant="h4" mb={2}>
          {room?.name}
        </Typography>
        {room?.maximumOccupancy && (
          <Typography variant="body1" mb={1}>
            {`Book your ${room?.name} `}
            {!room?.maximumOccupancy?.adults
              ? ''
              : room?.maximumOccupancy?.adults > 1
              ? `for ${room?.maximumOccupancy?.adults} adults`
              : `for ${room?.maximumOccupancy?.adults} adult`}
            {!room?.maximumOccupancy?.children
              ? ''
              : room?.maximumOccupancy?.children > 1
              ? ` and ${room?.maximumOccupancy?.children} children`
              : ` and ${room?.maximumOccupancy?.children} child`}
          </Typography>
        )}
      </Box>
      <Box flexDirection="column" justifyContent="start">
        <Typography variant="body1">{room?.description}</Typography>
      </Box>
    </Box>
  );
};
