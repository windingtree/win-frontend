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
import {
  getGroupMode,
  getOffersPriceRange
} from 'src/hooks/useAccommodationsAndOffers/helpers';
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

  // get lowest offer price
  const localPriceRange = useMemo(
    () => offers && getOffersPriceRange(offers, false),
    [offers]
  );

  const preferredCurrencyPriceRange = useMemo(
    () => offers && getOffersPriceRange(offers, false, true),
    [offers]
  );

  const priceRange = preferredCurrencyPriceRange ?? localPriceRange;

  let lowestAveragePrice: number | undefined, currency: string | undefined;

  if (priceRange) {
    const { lowestPrice: lowestTotalPrice } = priceRange;

    const numberOfDays = daysBetween(
      latestQueryParams?.arrival,
      latestQueryParams?.departure
    );

    const isGroupMode = getGroupMode(latestQueryParams?.roomCount);
    const numberOfRooms = isGroupMode ? 1 : latestQueryParams?.roomCount ?? 1;

    lowestAveragePrice = Number(lowestTotalPrice.price) / (numberOfDays * numberOfRooms);
    currency = lowestTotalPrice.currency;
  }

  return (
    <HeaderButtonContainer>
      <Stack direction="row" alignItems="center" mt={1}>
        <Typography>From</Typography>
        <Typography variant="h5" marginLeft={theme.spacing(1)}>
          {/* {currencySymbol} {lowestAveragePrice?.toFixed(2)} */}
          {isLoading ? (
            <Skeleton variant="text" width="100px" />
          ) : (
            displayPriceFromValues(lowestAveragePrice, currency)
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
