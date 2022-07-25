import type { Space } from '../store/actions';
import { Box, Text, Image, Grid, Button, Notification, Carousel, Anchor } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppState } from '../store';
import { useState } from 'react';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { v4 as uuidv4 } from 'uuid';

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

const ResponsiveArea = (winWidth: number): any[] => {
  if (winWidth <= 768) {
    return [
      { name: 'img', start: [0, 0], end: [1, 0] },
      { name: 'header', start: [0, 1], end: [1, 1] },
      { name: 'main', start: [0, 2], end: [1, 2] },
      { name: 'action', start: [0, 3], end: [1, 3] },
    ];
  }
  return [
    { name: 'img', start: [0, 0], end: [1, 2] },
    { name: 'header', start: [1, 0], end: [1, 1] },
    { name: 'main', start: [1, 1], end: [1, 1] },
    { name: 'action', start: [1, 2], end: [1, 2] },
  ];
};

export const SpaceCard: React.FC<{
  space: Space,
  // numberOfDays: number,
  facilityId: string
}> = ({ facilityId, space }) => {
  const { checkout } = useAppState();
  const { winWidth } = useWindowsDimension();
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [notification, setNotification] = useState<string | undefined>();
  const numberOfDays = 1
  const roomsNumber = 1

  const handleBook = () => {
    const id = uuidv4()
    dispatch({
      type: 'SET_CHECKOUT',
      payload: {
        id,
        spaceId: space.id,
        facilityId,
        from: 'today',
        to: 'tomorrow',
        roomsNumber: 2,
        timestamp: 0,      }
    });
    navigate(`/checkout/${id}`)
  }
  return (
    <Box
      fill
      border={{
        color: '#000000',
        side: 'bottom',
      }}
      direction='row'
      align='center'
      alignSelf='center'
      overflow='hidden'
    >
      <Grid
        responsive
        width='100%'
        rows={ResponsiveRow(winWidth)}
        columns={ResponsiveColumn(winWidth)}
        areas={ResponsiveArea(winWidth)}
        pad='medium'
        gap="medium"
        align='center'
      >
        <Box gridArea="img" fill>
          <Carousel fill>
            <Image
              fit="cover"
            // src={space.media.logo}
            />
            {/* {space.media.images?.map((img, i) =>
              <Image
                key={i}
                fit="cover"
                src={img.uri}
              />
            )} */}
          </Carousel>
        </Box>
        <Box gridArea="header">
          <Text size='xxlarge' margin={{ bottom: 'xsmall' }}>
            {space.name}
          </Text>
          <Text size='medium' margin={{ bottom: 'xsmall' }}>
            {space.beds} {space.beds > 1 ? 'beds' : 'bed'}
          </Text>
        </Box>
        <Box direction='column' justify='start' gridArea="main">
          <Text size='large'>
            {space.description}
          </Text>
        </Box>
        <Box direction='row' justify='between' align='center' gridArea="action">
          <Text size='large'>{numberOfDays} nights, {roomsNumber} room{roomsNumber > 1 ? 's' : ''}</Text>
          <Button
            label={'Book for ' + '$$$' + ' xDAI'}
            onClick={() => {
              handleBook();
            }}
          />
        </Box>
      </Grid>
      {notification &&
        <Notification
          toast
          title={notification}
          status='warning'
        />
      }
    </Box>
  );
};
