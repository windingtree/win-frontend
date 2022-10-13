import { CSSProperties, forwardRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography, Card, useTheme } from '@mui/material';
import Iconify from './Iconify';
import { AccommodationWithId } from '../hooks/useAccommodationsAndOffers.tsx/helpers';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { ImageCarousel } from './ImageCarousel';
import { buildAccommodationAddress } from '../utils/accommodation';
import {
  EventInfo,
  useAccommodationsAndOffers
} from '../hooks/useAccommodationsAndOffers.tsx';
import { currencySymbolMap } from '../utils/currencies';

export interface SearchCardProps {
  facility: AccommodationWithId;
  isSelected?: boolean;
  numberOfDays: number;
  sm?: boolean;
  focusedEvent?: EventInfo[];
}

export const SearchCard = forwardRef<HTMLDivElement, SearchCardProps>(
  ({ sm, facility, focusedEvent }, ref) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { winWidth } = useWindowsDimension();
    const { isGroupMode } = useAccommodationsAndOffers();

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
          minHeight: '128px',
          maxWidth: '100vw'
        }
      : {
          marginBottom: '8px'
        };

    const prices = useMemo(
      () => facility.offers.map((o) => Number(o.price.public)),
      [facility]
    );

    if (facility.offers.length < 1) {
      return null;
    }

    return (
      <Card ref={ref} style={{ ...smallCardStyle }}>
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

            {focusedEvent?.length ? (
              <Stack
                direction="row"
                alignItems="center"
                sx={{ color: 'text.secondary', marginTop: '-8px' }}
              >
                <Typography variant="caption">
                  {`Approx.  ${Math.ceil(
                    focusedEvent[0].durationInMinutes
                  )}min walking distance, ${focusedEvent[0].distance.toFixed(1)}km from ${
                    focusedEvent[0].eventName
                  } `}
                </Typography>
              </Stack>
            ) : null}

            <Stack
              direction={winWidth < 900 || sm ? 'row-reverse' : 'row'}
              alignItems="end"
              justifyContent={winWidth < 900 || sm ? 'start' : 'space-between'}
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
                    {facility.lowestPrice &&
                      currencySymbolMap[facility.lowestPrice.currency]}
                    {facility.lowestPrice && facility.lowestPrice.price.toFixed(2)}/night
                  </Typography>
                </Stack>

                {!(winWidth < 900 || sm) && !isGroupMode && <Typography>|</Typography>}
                {!sm && !isGroupMode && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      alignItems="center"
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      {facility.lowestPrice &&
                        currencySymbolMap[facility.lowestPrice.currency]}
                      {Math.min(...prices).toFixed(2)} total
                    </Typography>
                  </Stack>
                )}
              </Stack>
              {!sm && <Iconify icon="eva:info-outline" mb={0.5} width={16} height={16} />}
            </Stack>
            {isGroupMode && <Typography variant="subtitle2">Select Rooms</Typography>}
          </Stack>
        </Stack>
      </Card>
    );
  }
);
