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
import { EventInfo } from '../hooks/useAccommodationsAndOffers.tsx';

export interface SearchCardProps {
  facility: AccommodationWithId;
  isSelected?: boolean;
  numberOfDays: number;
  sm?: boolean;
  focusedEvent?: EventInfo;
  onSelect?: (...args) => void;
}
/* const pricePerNight = (prices: number[], numberOfDays: number) =>
  (Math.min(...prices) / numberOfDays).toFixed(2); */

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
  (
    { sm, facility, isSelected, onSelect = emptyFunction, focusedEvent },
    ref
  ) => {
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
        : {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          };

    const smallCardStyle: CSSProperties = sm
      ? {
          minWidth: '380px',
          marginBottom: '0px',
          minHeight: '128px'
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
          <Stack
            width={theme.spacing(sm || winWidth < 900 ? 16 : 36)}
            height={theme.spacing(sm || winWidth < 900 ? 16 : 24)}
          >
            <ImageCarousel
              size={sm || winWidth < 900 ? 'small' : 'large'}
              media={facility.media}
            />
          </Stack>
          <Stack
            onClick={() => navigate(`/facility/${facility.id}`)}
            justifyContent="space-between"
            width={sm ? '252px' : '100%'}
            spacing={1}
            sx={{ py: 2, px: 1.5, mt: 0, cursor: 'pointer' }}
          >
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Typography noWrap overflow={'hidden'} variant="subtitle1">
                {facility.name}
              </Typography>
              <Stack sx={{ color: 'text.secondary' }} direction="row" alignItems="center">
                <Iconify mr={0.5} icon={'clarity:star-solid'} width={12} height={12} />
                <Typography variant="caption">{facility.rating}</Typography>
              </Stack>
            </Stack>

            {!sm && (
              <Stack direction="row" alignItems="center" sx={{ color: 'text.secondary' }}>
                <Typography variant="caption">
                  {buildAccommodationAddress(facility)}
                </Typography>
              </Stack>
            )}

            {focusedEvent && (
              <Stack direction="row" alignItems="center" sx={{ color: 'text.secondary', marginTop: '-8px' }}>
                <Typography variant="caption">
                  {`approx. ${focusedEvent.distance.toFixed(2)}km walking distance, ${Math.ceil(focusedEvent.durationInMinutes)}min from ${focusedEvent.eventName} `}
                </Typography>
              </Stack>
            )}

            <Stack
              direction={winWidth < 900 || sm ? 'row-reverse' : 'row'}
              alignItems="end"
              justifyContent="space-between"
            >
              <Stack
                direction={winWidth < 900 || sm ? 'column' : 'row'}
                alignItems={winWidth < 900 || sm ? 'end' : 'center'}
                justifyContent="space-between"
                spacing={sm ? 0 : 1}
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography
                    textAlign="center"
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    From
                  </Typography>
                  <Typography variant="subtitle2">
                    {facility.lowestPrice && currencyIcon(facility.lowestPrice.currency)}
                    {facility.lowestPrice && facility.lowestPrice.price.toFixed(2)}/night
                  </Typography>
                </Stack>

                {!(winWidth < 900 || sm) && <Typography>|</Typography>}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    alignItems="center"
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    {facility.lowestPrice && currencyIcon(facility.lowestPrice.currency)}
                    {Math.min(...prices).toFixed(2)} total
                  </Typography>
                </Stack>
              </Stack>
              {!sm && <Iconify icon="eva:info-outline" mb={0.5} width={16} height={16} />}
            </Stack>
          </Stack>
        </Stack>
      </Card>
    );
  }
);
