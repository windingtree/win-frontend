import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { currencySymbolMap } from '@windingtree/win-commons/dist/currencies';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from '../../components/hook-form';
import { RHFArrayCheckbox } from '../../components/hook-form/RHFArrayCheckbox';
import Iconify from '../../components/Iconify';
import {
  PriceRange,
  useAccommodationsAndOffers
} from '../../hooks/useAccommodationsAndOffers';
import { AccommodationWithId } from '../../utils/useAccommodationsAndOffers';
import { usePriceFilter } from '../../hooks/usePriceFilter';
import { useUserSettings } from '../../hooks/useUserSettings';
import { filterAccommodationsByPriceRanges } from '../../utils/accommodation';
import { emptyFunction, roundToNearest } from '../../utils/common';
import { compareObjects } from '../../utils/objects';
import { getPriceRangeFromPriceRanges } from '../../utils/price';
import { stringToNumber } from '../../utils/strings';

export interface SearchFilterFormProps {
  onCloseClick?: () => void;
  onSubmitClick?: (...args: unknown[]) => void;
}

interface SearchFilterFormData {
  priceRanges: string[];
}

// get price ranges in preferredCurrency and ignore others (unconverted)
const buildDefaultPriceRanges = (
  accommodations: AccommodationWithId[],
  preferredCurrency: string
) => {
  const result: PriceRange[] = [];
  if (!accommodations) return result;

  const priceRanges = accommodations
    .filter((acc) => !!acc.preferredCurrencyPriceRange)
    .map((acc) => acc.preferredCurrencyPriceRange as PriceRange);

  if (!priceRanges) return result;

  const globalPriceRange = getPriceRangeFromPriceRanges(
    priceRanges,
    preferredCurrency,
    'lowestPrices'
  );

  if (!globalPriceRange) return result;

  const { highestPrice } = globalPriceRange;

  const numberOfSteps = 4;
  const stepFactor = 1 / numberOfSteps;
  const initialStepValue = Math.round(highestPrice.price * stepFactor);
  const baseFive = Math.pow(10, initialStepValue.toString().length - 1) / 2;
  const nearestBaseFiveNumber = roundToNearest(initialStepValue, baseFive);

  // get price ranges in steps of 25% of highest price
  for (let i = 0; i <= 1; i += stepFactor) {
    result.push({
      lowestPrice: {
        currency: highestPrice.currency,
        price: roundToNearest(highestPrice.price * i, nearestBaseFiveNumber),
        decimals: highestPrice.decimals
      },
      highestPrice: {
        currency: highestPrice.currency,
        price:
          i < 1
            ? roundToNearest(highestPrice.price * (i + 0.25), nearestBaseFiveNumber)
            : Infinity,
        decimals: highestPrice.decimals
      }
    });
  }

  return result;
};

export const SearchFilterForm = ({
  onCloseClick = emptyFunction,
  onSubmitClick = emptyFunction
}: SearchFilterFormProps) => {
  const fieldName = 'priceRanges';
  const theme = useTheme();
  const [totalAccommodationsSelected, setTotalAccommodationsSelected] = useState(0);
  const { allAccommodations } = useAccommodationsAndOffers();
  const { priceFilter, setPriceFilter } = usePriceFilter();
  const { preferredCurrencyCode } = useUserSettings();

  const defaultPriceRanges: PriceRange[] = useMemo(
    () => buildDefaultPriceRanges(allAccommodations, preferredCurrencyCode),
    [allAccommodations, preferredCurrencyCode]
  );

  const buildFormDefaultValues = useCallback(() => {
    return priceFilter.reduce((selectedIndexes: string[], filter) => {
      // find index of filter in defaultPriceRanges
      const foundIndex = defaultPriceRanges.findIndex((priceRange) => {
        return compareObjects(filter, priceRange);
      });

      if (foundIndex >= 0) {
        selectedIndexes.push(foundIndex.toString());
      }

      return selectedIndexes;
    }, []);
  }, [priceFilter, defaultPriceRanges]);

  const methods = useForm<SearchFilterFormData>({
    defaultValues: {
      priceRanges: useMemo(() => buildFormDefaultValues(), [buildFormDefaultValues])
    }
  });

  const { handleSubmit, watch, setValue } = methods;
  const priceRanges = watch(fieldName);

  // categorize accommodations into price ranges
  const accommodationsWithinPriceRanges = useMemo(() => {
    return defaultPriceRanges.map((priceRange) => {
      return filterAccommodationsByPriceRanges(allAccommodations, priceRange);
    });
  }, [allAccommodations, defaultPriceRanges]);

  // update the 'stays' count to the total number of accommodation
  // categories selected
  useEffect(() => {
    const selectedCount = priceRanges.reduce((sum, filteredIndex) => {
      const idx = stringToNumber(filteredIndex, undefined, false);
      if (idx < 0 || idx === undefined) return sum;
      return sum + accommodationsWithinPriceRanges[idx].length;
    }, 0);

    setTotalAccommodationsSelected(selectedCount);
  }, [accommodationsWithinPriceRanges, priceRanges]);

  // dispatch selected filters
  const onSubmit = useCallback(
    (formData) => {
      // process check boxes
      // get all selected indexes and build actual price range array
      const selectedPriceRanges = (formData as SearchFilterFormData).priceRanges.map(
        (stringIndex) => defaultPriceRanges[Number(stringIndex)]
      );

      // dispatch price filter
      setPriceFilter(selectedPriceRanges);

      // call onSubmit callback with values
      onSubmitClick(selectedPriceRanges);
    },
    [defaultPriceRanges, onSubmitClick, setPriceFilter]
  );

  // construct label for a given price range
  const getLabel = (priceRange: PriceRange) => {
    const { lowestPrice, highestPrice } = priceRange;
    return `${currencySymbolMap[lowestPrice.currency]}${lowestPrice.price}${
      highestPrice.price === Infinity
        ? '+'
        : ` - ${currencySymbolMap[highestPrice.currency]}${highestPrice.price}`
    }`;
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card
        sx={{
          minWidth: '260px'
        }}
      >
        <CardHeader
          title={'Filter by price'}
          titleTypographyProps={{
            variant: 'h6'
          }}
          action={
            <IconButton onClick={onCloseClick}>
              <Iconify icon="ci:close-big" />
            </IconButton>
          }
        />
        <CardContent
          sx={{
            fontSize: theme.typography.body2
          }}
        >
          <Stack>
            {defaultPriceRanges.length ? (
              defaultPriceRanges.map((priceRange, index) => {
                return (
                  <Stack
                    key={index}
                    justifyContent={'space-between'}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <RHFArrayCheckbox
                      label={getLabel(priceRange)}
                      name={fieldName}
                      value={index.toString()}
                      disabled={!accommodationsWithinPriceRanges[index].length}
                    />
                    <Typography color={theme.palette.grey[500]}>
                      {accommodationsWithinPriceRanges[index].length}
                    </Typography>
                  </Stack>
                );
              })
            ) : (
              <>
                <Typography>Filter is not available for</Typography>
                <Typography>the displayed currencies</Typography>
              </>
            )}
          </Stack>
        </CardContent>
        {defaultPriceRanges.length ? (
          <CardActions
            sx={{
              justifyContent: 'space-between',
              px: 3
            }}
          >
            <Link
              sx={{
                fontSize: theme.typography.caption,
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
              onClick={() => setValue('priceRanges', [])}
            >
              Clear all
            </Link>
            <Button
              size="small"
              variant="contained"
              sx={{
                fontSize: theme.typography.caption,
                mb: 1
              }}
              type="submit"
              disabled={!allAccommodations.length}
            >
              Show {totalAccommodationsSelected || allAccommodations.length} stay(s)
            </Button>
          </CardActions>
        ) : null}
      </Card>
    </FormProvider>
  );
};
