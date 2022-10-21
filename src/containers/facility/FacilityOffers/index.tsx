import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';
import { styled } from '@mui/material';
import { Box } from '@mui/material';
import { forwardRef } from 'react';
import { FacilityOffersSelectMultiple } from './FacilityOffersSelectMultiple';
import { getGroupMode } from 'src/hooks/useAccommodationsAndOffers/helpers';
import { FacilityOffersSelectOne } from './FacilityOffersSelectOne';

const FacilityOffersContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5)
}));

export const FacilityOffers = forwardRef<HTMLDivElement>((_, ref) => {
  const { latestQueryParams } = useAccommodationsAndOffers();
  const roomCount = latestQueryParams?.roomCount;
  const isGroupMode = getGroupMode(roomCount);

  return (
    <FacilityOffersContainer ref={ref}>
      {isGroupMode && <FacilityOffersSelectMultiple />}
      {!isGroupMode && <FacilityOffersSelectOne />}
    </FacilityOffersContainer>
  );
});
