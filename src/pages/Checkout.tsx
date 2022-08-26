import { PaymentSuccessCallback } from '../components/PaymentCard';
import { utils } from 'ethers';
import { Container, Grid, Box, CircularProgress, Typography, Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCallback, useMemo } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
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
import useResponsive from '../hooks/useResponsive';
import FallbackImage from '../images/hotel-fallback.webp';
import Logger from '../utils/logger';

const logger = Logger('Checkout');

export const normalizeExpiration = (expirationDate: string): number =>
  Math.ceil(DateTime.fromISO(expirationDate).toSeconds()) - expirationGap;

export const Checkout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');
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

  const onPaymentSuccess = useCallback<PaymentSuccessCallback>(
    result => {
      logger.debug(`Payment result:`, result);
      navigate({
        pathname: '/bookings/confirmation',
        search: `?${createSearchParams({
          tx: result.tx.hash
        })}`
      });
    },
    []
  );

  if (!checkout || !payment) {
    return (
      <MainLayout>
        <Container sx={{
          mb: theme.spacing(5)
        }}>
          <CircularProgress />
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container sx={{
        marginBottom: theme.spacing(5)
      }}>
        <Box
          sx={{
            marginBottom: isDesktop ? theme.spacing(5) : theme.spacing(3),
            textAlign: isDesktop ? 'left' : 'center',
          }}
        >
          <Typography variant="h3">
            Your payment value is {formatCost(payment)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: isDesktop ? 'row' : 'column',
            alignItems: 'center',
            marginBottom: theme.spacing(5)
          }}
        >
          <Box
            sx={{
              marginRight: isDesktop ? theme.spacing(5) : 0,
              marginBottom: isDesktop ? 0 : theme.spacing(3)
            }}
          >
            <Card>
              <CardMediaFallback
                component="img"
                height="200"
                src={hotelImage?.url}
                fallback={FallbackImage}
                alt={checkout.accommodation.name}
              />
            </Card>
          </Box>
          <Box>
            <Typography>
              You are paying for stay in {checkout.accommodation.name}
            </Typography>
          </Box>
        </Box>

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

        <WinPay
          payment={payment}
          onSuccess={onPaymentSuccess}
        />
      </Container>
    </MainLayout>
  );
};
