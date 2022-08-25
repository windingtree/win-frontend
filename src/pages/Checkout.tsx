import { utils } from 'ethers';
import { Container, Grid, Box, CircularProgress, Typography, Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import MainLayout from '../layouts/main';
import { WinPay } from '../components/WinPay';
import { MessageBox } from '../components/MessageBox';
import { SignInButton } from '../components/Web3Modal';
import { CardMediaFallback } from '../components/CardMediaFallback';
import { formatCost } from '../utils/strings';
import { useAppState } from '../store';
import { expirationGap } from '../config';
import { sortByLargestImage } from '../utils/accommodation';
import Logger from '../utils/logger';
import FallbackImage from '../images/hotel-fallback.webp';

const logger = Logger('Checkout');

export const normalizeExpiration = (expirationDate: string): number =>
  Math.ceil(DateTime.fromISO(expirationDate).toSeconds()) - expirationGap;

export const Checkout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { checkout, account } = useAppState();
  const payment = useMemo(
    () => checkout && ({
      currency: checkout.offer.price.currency,
      value: utils.parseEther(checkout.offer.price.public.toString()),
      expiration: normalizeExpiration(checkout.offer.expiration),
      providerId: String(checkout.provider),
      serviceId: String(checkout.serviceId)
    }),
    [checkout]
  );
  const hotelImage = useMemo(
    () => checkout && sortByLargestImage(checkout.accommodation.media)[0],
    [checkout]
  );


  console.log('@@@',  FallbackImage, checkout);

  if (!checkout || !payment) {
    return (
      <MainLayout>
        <Container sx={{ mb: theme.spacing(5) }}>
          <CircularProgress />
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container sx={{ mb: theme.spacing(5) }}>
        <MessageBox type="warn" show={!account}>
          <Grid
            container
            direction="row"
            alignItems="center"
          >
            <Grid item marginRight={theme.spacing(5)}>
              Please connect your wallet
            </Grid>
            <Grid item>
              <SignInButton />
            </Grid>
          </Grid>
        </MessageBox>

        <Box marginBottom={theme.spacing(5)}>
          <Typography variant="h3">
            Your payment value is {formatCost(payment)}
          </Typography>
        </Box>

        <Grid
          container
          direction="row"
          alignItems="center"
        >
          <Grid item marginRight={theme.spacing(5)}>
            <Card>
              <CardMediaFallback
                component="img"
                height="200"
                src={hotelImage?.url}
                fallback={FallbackImage}
                alt={checkout.accommodation.name}
              />
            </Card>
          </Grid>
          <Grid item>
            <Typography>
              You are paying for stay in {checkout.accommodation.name} from
            </Typography>
          </Grid>
        </Grid>

        <WinPay
          payment={payment}
          onSuccess={(result) => {
            logger.debug(`Payment result:`, result);
            navigate('/bookings/confirmation');
          }}
        />
      </Container>
    </MainLayout>
  );
};
