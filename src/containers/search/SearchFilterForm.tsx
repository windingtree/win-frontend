import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Stack,
  useTheme
} from '@mui/material';
import { currencySymbolMap } from '@windingtree/win-commons/dist/currencies';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from '../../components/hook-form';
import { RHFArrayCheckbox } from '../../components/hook-form/RHFArrayCheckbox';
import Iconify from '../../components/Iconify';
import { defaultCurrencyCode } from '../../config';
import { PriceRange } from '../../hooks/useAccommodationsAndOffers';
import { emptyFunction } from '../../utils/common';

export interface SearchFilterFormProps {
  onCloseClick?: () => void;
  onSubmitClick?: (...args: unknown[]) => void;
}

const defaultPriceRanges: PriceRange[] = [
  {
    lowestPrice: {
      currency: defaultCurrencyCode,
      price: 20
    },
    highestPrice: {
      currency: defaultCurrencyCode,
      price: 50
    }
  },
  {
    lowestPrice: {
      currency: defaultCurrencyCode,
      price: 50
    },
    highestPrice: {
      currency: defaultCurrencyCode,
      price: 100
    }
  },
  {
    lowestPrice: {
      currency: defaultCurrencyCode,
      price: 100
    },
    highestPrice: {
      currency: defaultCurrencyCode,
      price: 150
    }
  },
  {
    lowestPrice: {
      currency: defaultCurrencyCode,
      price: 150
    },
    highestPrice: {
      currency: defaultCurrencyCode,
      price: 200
    }
  },
  {
    lowestPrice: {
      currency: defaultCurrencyCode,
      price: 200
    },
    highestPrice: {
      currency: defaultCurrencyCode,
      price: Infinity
    }
  }
];

interface SearchFilterFormData {
  priceRanges: string[];
}

export const SearchFilterForm = ({
  onCloseClick = emptyFunction,
  onSubmitClick = emptyFunction
}: SearchFilterFormProps) => {
  const fieldName = 'priceRanges';
  const theme = useTheme();
  const methods = useForm<SearchFilterFormData>({
    defaultValues: { priceRanges: [] }
  });

  const { handleSubmit, watch } = methods;
  const priceRanges = watch(fieldName);

  const onSubmit = useCallback(() => {
    // process check boxes
    // get all selected indexes and build actual price range array
    const selectedPriceRanges = priceRanges.map(
      (stringIndex) => defaultPriceRanges[Number(stringIndex)]
    );

    // call onSubmit callback with values
    onSubmitClick(selectedPriceRanges);
  }, [priceRanges]);

  const getLabel = (priceRange: PriceRange) => {
    const { lowestPrice, highestPrice } = priceRange;
    return `${currencySymbolMap[lowestPrice.currency]}${lowestPrice.price}${
      highestPrice.price === Infinity
        ? '+'
        : `- ${currencySymbolMap[highestPrice.currency]}${highestPrice.price}`
    }`;
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card
        sx={{
          minWidth: '320px'
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
            {defaultPriceRanges.map((priceRange, index) => {
              return (
                <RHFArrayCheckbox
                  label={getLabel(priceRange)}
                  name={fieldName}
                  key={index}
                  value={index.toString()}
                />
              );
            })}
          </Stack>
        </CardContent>
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
          >
            Clear all
          </Link>
          <Button
            size="small"
            variant="contained"
            onClick={onSubmit}
            sx={{
              fontSize: theme.typography.caption,
              mb: 1
            }}
          >
            Show xx stays
          </Button>
        </CardActions>
      </Card>
    </FormProvider>
  );
};
