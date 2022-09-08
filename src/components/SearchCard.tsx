import { CSSProperties, forwardRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { emptyFunction } from '../utils/common';
import { Stack, Typography, Card, useTheme } from '@mui/material';
import Iconify from './Iconify';
import { AccommodationWithId } from '../hooks/useAccommodationsAndOffers.tsx/helpers';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { assetsCurrencies } from '@windingtree/win-commons/dist/types';
import { ImageCarousel } from './ImageCarousel';
import { buildAccommodationAddress } from '../utils/accommodation';

export interface SearchCardProps {
  facility: AccommodationWithId;
  isSelected?: boolean;
  numberOfDays: number;
  sm?: boolean;
  onSelect?: (...args) => void;
}
const pricePerNight = (prices: number[], numberOfDays: number) =>
  (Math.min(...prices) / numberOfDays).toFixed(2);

const currencyIcon = (currency: string) => {
  if (!assetsCurrencies.includes(currency)) {
    return '';
  }
  switch (currency) {
    case 'EUR':
      return <Iconify mb={-0.5} icon={'mdi-light:currency-eur'} width={16} height={16} />;
    case 'USD':
      return <Iconify mb={-0.5} icon={'mdi-light:currency-usd'} width={16} height={16} />;
    case 'JPY':
      return <Iconify mb={-0.5} icon={'mdi-light:currency-jpy'} width={16} height={16} />;
    case 'PLN':
      return 'PLN';
    case 'CHF':
      return 'CHF';
    case 'GBP':
      return <Iconify mb={-0.5} icon={'mdi-light:currency-gbp'} width={16} height={16} />;
    case 'AUD':
      return (
        <Iconify
          mb={-0.5}
          icon={'tabler:currency-dollar-australian'}
          width={16}
          height={16}
        />
      );
    case 'CAD':
      return (
        <Iconify
          mb={-0.5}
          icon={'tabler:currency-dollar-canadian'}
          width={16}
          height={16}
        />
      );
    case 'SEK':
      return 'SEK';
    case 'SDG':
      return 'SDG';
    default:
      return '';
  }
};

export const SearchCard = forwardRef<HTMLDivElement, SearchCardProps>(
  ({ sm, facility, isSelected, numberOfDays, onSelect = emptyFunction }, ref) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { winWidth } = useWindowsDimension();
    const selectedStyle: CSSProperties = isSelected
      ? {
          position: 'relative'
        }
      : {};
    const responsiveStyle: CSSProperties =
      winWidth < 900 || sm
        ? {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }
        : {};

    const smallCardStyle: CSSProperties = sm
      ? {
          minWidth: '380px',
          marginBottom: '0px'
        }
      : {
          marginBottom: '8px'
        };

    const prices = useMemo(
      () => facility.offers.map((o) => Number(o.price.public)),
      [facility]
    );
    const handleSelect = useCallback(() => onSelect(facility.id), []);

    if (facility.offers.length < 1) {
      return null;
    }

    return (
      <Card
        ref={ref}
        onMouseOver={handleSelect}
        style={{ ...selectedStyle, ...smallCardStyle }}
      >
        <Stack sx={{ ...responsiveStyle }}>
          <Stack width={theme.spacing(sm ? 16 : 36)} height={theme.spacing(sm ? 16 : 24)}>
            <ImageCarousel size={sm ? 'small' : 'large'} media={facility.media} />
          </Stack>
          <Stack
            onClick={() => navigate(`/facility/${facility.id}`)}
            justifyContent="center"
            spacing={1}
            sx={{ py: 2, px: 1.5, mt: 0, cursor: 'pointer' }}
          >
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Typography variant="subtitle1">{facility.name}</Typography>
              <Stack sx={{ color: 'text.secondary' }} direction="row" alignItems="center">
                <Iconify mr={0.5} icon={'clarity:star-solid'} width={12} height={12} />
                <Typography variant="caption">{facility.rating}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" sx={{ color: 'text.secondary' }}>
              <Typography variant="caption">
                {buildAccommodationAddress(facility)}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  textAlign="center"
                  variant="caption"
                  sx={{ color: 'text.secondary' }}
                >
                  Starting at
                </Typography>
                <Typography variant="subtitle2">
                  {currencyIcon(facility.offers[0]?.price?.currency)}
                  {pricePerNight(prices, numberOfDays)} night.
                </Typography>
                <Typography
                  alignItems="center"
                  variant="caption"
                  sx={{ color: 'text.secondary' }}
                >
                  {currencyIcon(facility.offers[0]?.price?.currency)}
                  {Math.min(...prices).toFixed(2)} total
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    );
  }
);
