import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';
import { Box } from '@mui/material';
import { forwardRef } from 'react';
import { FacilityOffersSelectMultiple } from './FacilityOffersSelectMultiple';
import { getGroupMode } from 'src/hooks/useAccommodationsAndOffers/helpers';
import { FacilityOffersSelectOne } from './FacilityOffersSelectOne';
import { FacilitySearchFormProvider } from './FacilitySearchFormProvider';
import { FacilitySearchInputs } from './FacilitySearchInputs';

export const FacilityOffers = forwardRef<HTMLDivElement>((_, ref) => {
  const { latestQueryParams } = useAccommodationsAndOffers();
  const roomCount = latestQueryParams?.roomCount;
  const isGroupMode = getGroupMode(roomCount);

  return (
    <Box mb={2.5} ref={ref}>
      <FacilitySearchFormProvider>
        <FacilitySearchInputs />
        {isGroupMode && <FacilityOffersSelectMultiple />}
        {!isGroupMode && <FacilityOffersSelectOne />}
      </FacilitySearchFormProvider>
    </Box>
  );
});
