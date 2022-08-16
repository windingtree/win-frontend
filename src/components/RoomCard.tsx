import type { Offer, RoomTypes } from '@windingtree/glider-types/types/derbysoft';
import { Box, Text, Image, Grid, Button, Notification, Carousel, Spinner } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { useCallback, useState } from 'react';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import Logger from '../utils/logger';
import axios from 'axios';
import { MessageBox } from './MessageBox';
import { PricedOfferRequest, PricedOfferResponse } from '../api/PricedOffer';

const logger = Logger('RoomCard');

const ResponsiveColumn = (winWidth: number): string[] => {
  if (winWidth <= 768) {
    return ['medium'];
  }
  return ['23rem', 'flex'];
};

const ResponsiveRow = (winWidth: number): string[] => {
  if (winWidth <= 768) {
    return ['medium', 'xsmall', 'small', 'xsmall'];
  }
  return ['xsmall', 'small', 'xsmall'];
};

const ResponsiveArea = (
  winWidth: number
): Array<{ name: string; start: Array<number>; end: Array<number> }> => {
  if (winWidth <= 768) {
    return [
      { name: 'img', start: [0, 0], end: [1, 0] },
      { name: 'header', start: [0, 1], end: [1, 1] },
      { name: 'main', start: [0, 2], end: [1, 2] },
      { name: 'action', start: [0, 3], end: [1, 3] }
    ];
  }
  return [
    { name: 'img', start: [0, 0], end: [1, 2] },
    { name: 'header', start: [1, 0], end: [1, 1] },
    { name: 'main', start: [1, 1], end: [1, 1] },
    { name: 'action', start: [1, 2], end: [1, 2] }
  ];
};

export const RoomCard: React.FC<{
  room: RoomTypes;
  roomId: string;
  offer: Offer;
  facilityId: string;
}> = ({ offer, facilityId, room }) => {
  const { winWidth } = useWindowsDimension();
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [notification] = useState<string | undefined>();
  const numberOfDays = 1;
  const roomsNumber = 1;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  const handleBook = useCallback(async () => {
    try {
      setError(undefined);
      setLoading(true);

      const res = await axios.request<PricedOfferResponse>(
        new PricedOfferRequest(offer.id as string)
      );
      dispatch({
        type: 'SET_CHECKOUT',
        payload: {
          facilityId,
          ...res.data.data
        }
      });

      logger.info('Get priced offer successfully');
      navigate('/guest-info');
    } catch (error) {
      const message = (error as Error).message || 'Unknown useAuthRequest error';
      setLoading(false);
      setError(message);
    }
  }, [dispatch]);

  return (
    <Box
      fill
      border={{
        color: '#000000',
        side: 'bottom'
      }}
      direction="row"
      align="center"
      alignSelf="center"
      overflow="hidden"
    >
      <Grid
        responsive
        width="100%"
        rows={ResponsiveRow(winWidth)}
        columns={ResponsiveColumn(winWidth)}
        areas={ResponsiveArea(winWidth)}
        pad="medium"
        gap="medium"
        align="center"
      >
        <Box gridArea="img" fill>
          <Carousel fill>
            {room?.media?.map((img, i) => (
              <Image key={i} fit="cover" src={img.url} />
            ))}
          </Carousel>
        </Box>
        <Box gridArea="header">
          <Text size="xxlarge" margin={{ bottom: 'xsmall' }}>
            {room?.name}
          </Text>
          {room?.maximumOccupancy && (
            <Text size="medium" margin={{ bottom: 'xsmall' }}>
              {room?.maximumOccupancy?.adults}{' '}
              {room?.maximumOccupancy?.adults !== undefined &&
              room?.maximumOccupancy?.adults > 1
                ? 'adults'
                : 'adult'}
              , {room?.maximumOccupancy?.children}{' '}
              {room?.maximumOccupancy?.children !== undefined &&
              room?.maximumOccupancy?.children > 1
                ? 'children'
                : 'child'}
            </Text>
          )}
        </Box>
        <Box direction="column" justify="start" gridArea="main">
          <Text size="large">{room?.description}</Text>
        </Box>
        <Box direction="row" justify="between" align="center" gridArea="action">
          <Text size="large">
            {numberOfDays} nights, {roomsNumber} room{roomsNumber > 1 ? 's' : ''}
          </Text>
          <Button
            label={`Book for ~ ${Number(offer.price?.public).toFixed(2)} ${
              offer.price?.currency
            }`}
            onClick={() => handleBook()}
            icon={loading ? <Spinner /> : undefined}
          />
        </Box>
        <MessageBox type="error" show={!!error}>
          {error}
        </MessageBox>
      </Grid>
      {notification && <Notification toast title={notification} status="warning" />}
    </Box>
  );
};
