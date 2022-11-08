import { Box } from '@mui/material';
import { forwardRef } from 'react';
import { FacilityOffersSelectMultiple } from './FacilityOffersSelectMultiple';
import { getGroupMode } from 'src/hooks/useAccommodationsAndOffers/helpers';
import { FacilityOffersSelectOne } from './FacilityOffersSelectOne';
import { FacilitySearchInputs } from './offer-item/search/FacilitySearchInputs';
import { useFormContext } from 'react-hook-form';

export const FacilityOffers = forwardRef<HTMLDivElement>((_, ref) => {
  const { watch } = useFormContext();
  const { roomCount } = watch();
  const isGroupMode = getGroupMode(roomCount);

  return (
    <Box mb={2.5} ref={ref}>
      <FacilitySearchInputs />
      {isGroupMode && <FacilityOffersSelectMultiple />}
      {!isGroupMode && <FacilityOffersSelectOne />}
    </Box>
  );
});
