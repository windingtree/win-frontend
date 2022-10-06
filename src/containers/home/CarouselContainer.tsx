import { Box, styled } from '@mui/material';

// remove padding from carousel on mobile
export const CarouselContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginRight: theme.spacing(-2),
    marginLeft: theme.spacing(-2)
  }
}));
