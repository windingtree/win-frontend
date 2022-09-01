import { CSSProperties, forwardRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { emptyFunction } from '../utils/common';
import { Stack, Typography, Card } from '@mui/material';
import Iconify from './Iconify';
import { AccommodationWithId } from '../hooks/useAccommodationsAndOffers.tsx/helpers';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { CardMediaFallback } from './CardMediaFallback';
import FallbackImage from '../images/hotel-fallback.webp';
import { assetsCurrencies } from '@windingtree/win-commons/dist/types';

export interface SearchCardProps {
  facility: AccommodationWithId;
  isSelected?: boolean;
  numberOfDays: number;
  onSelect?: (...args) => void;
}
const totalPrice = (prices: number[], numberOfDays: number) =>
  (Math.min(...prices) * numberOfDays).toFixed(2);

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
      return 'JPY';
    case 'PLN':
      return 'PLN';
    case 'CHF':
      return 'CHF';
    case 'GBP':
      return 'GBP';
    case 'AUD':
      return 'AUD';
    case 'CAD':
      return 'CAD';
    case 'SEK':
      return 'SEK';
    case 'SDG':
      return 'SDG';
    default:
      return '';
  }
};

export const SearchCard = forwardRef<HTMLDivElement, SearchCardProps>(
  ({ facility, isSelected, numberOfDays, onSelect = emptyFunction }, ref) => {
    const navigate = useNavigate();
    const { winWidth } = useWindowsDimension();
    const selectedStyle: CSSProperties = isSelected
      ? {
          position: 'relative'
        }
      : {};
    const responsiveStyle: CSSProperties =
      winWidth < 900
        ? {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }
        : {};

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
        onClick={() => navigate(`/facility/${facility.id}`)}
        onMouseOver={handleSelect}
        style={selectedStyle}
        sx={{ mb: 1 }}
      >
        <Stack spacing={1} sx={{ ...responsiveStyle, mb: 1 }}>
          <Stack>
            <CardMediaFallback
              component="img"
              height="200"
              src={facility.media[0] !== undefined ? facility.media[0].url : undefined}
              fallback={FallbackImage}
            />
          </Stack>
          <Stack spacing={1} sx={{ p: 2, pb: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Typography variant="subtitle1">{facility.name}</Typography>
              <Stack sx={{ color: 'text.secondary' }} direction="row" alignItems="center">
                <Iconify mr={0.5} icon={'clarity:star-solid'} width={12} height={12} />
                <Typography variant="caption">{facility.rating}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" sx={{ color: 'text.secondary' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography textAlign="center" variant="caption">
                  Starting at
                </Typography>
                <Typography variant="caption">
                  {currencyIcon(facility.offers[0]?.price?.currency)}
                  {Math.min(...prices).toFixed(2)} night.
                </Typography>
                <Typography alignItems="center" variant="caption">
                  {currencyIcon(facility.offers[0]?.price?.currency)}
                  {totalPrice(prices, numberOfDays)} total
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    );
  }
);
