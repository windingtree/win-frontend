import {
  Box,
  Button,
  Skeleton,
  Stack,
  styled,
  Typography,
  useTheme
} from '@mui/material';
import { useMemo } from 'react';
import { SearchPropsType } from 'src/hooks/useAccommodation';
import { getOffersPriceRange } from 'src/hooks/useAccommodationsAndOffers/helpers';
import { OfferRecord } from 'src/store/types';
import { daysBetween } from 'src/utils/date';
import { displayPriceFromValues } from 'src/utils/price';

const HeaderButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',

  [theme.breakpoints.up('md')]: {
    alignItems: 'end',
    width: '100%'
  }
}));

interface HeaderButtonProps {
  scrollToDetailImages: () => void;
  isLoading: boolean;
  latestQueryParams: SearchPropsType | undefined;
  offers: OfferRecord[] | undefined;
}
export const HeaderButton = ({
  scrollToDetailImages,
  isLoading,
  latestQueryParams,
  offers
}: HeaderButtonProps) => {
  const theme = useTheme();

  const numberOfDays = daysBetween(
    latestQueryParams?.arrival,
    latestQueryParams?.departure
  );

  const nbRooms = latestQueryParams?.roomCount ?? 1;

  // get lowest offer price
  const localPriceRange = useMemo(
    () => offers && getOffersPriceRange(offers, true, true, false, numberOfDays, nbRooms),
    [nbRooms, numberOfDays, offers]
  );

  const preferredCurrencyPriceRange = useMemo(
    () => offers && getOffersPriceRange(offers, true, true, true, numberOfDays, nbRooms),
    [nbRooms, numberOfDays, offers]
  );

  const priceRange = preferredCurrencyPriceRange ?? localPriceRange;

  return (
    <HeaderButtonContainer>
      <Stack direction="row" alignItems="center" mt={1}>
        <Typography>From</Typography>
        <Typography variant="h5" marginLeft={theme.spacing(1)}>
          {/* {currencySymbol} {lowestAveragePrice?.toFixed(2)} */}
          {isLoading ? (
            <Skeleton variant="text" width="100px" />
          ) : (
            displayPriceFromValues(
              priceRange?.lowestPrice.price,
              priceRange?.lowestPrice.currency
            )
          )}
        </Typography>
      </Stack>
      <Typography textAlign={{ md: 'right' }}> Average price / room / night</Typography>
      <Button
        size="large"
        disableElevation
        variant="outlined"
        onClick={scrollToDetailImages}
        sx={{
          mt: 1
        }}
      >
        Select Room
      </Button>

      <Typography mt={1} variant="caption">
        {"You won't be charged yet"}
      </Typography>
    </HeaderButtonContainer>
  );
};