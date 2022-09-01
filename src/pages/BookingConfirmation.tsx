import { useSearchParams } from 'react-router-dom';
import { Grid, Box, Paper, Typography, Card, Button, Skeleton } from '@mui/material';
import MainLayout from 'src/layouts/main';
import { ExternalLink } from '../components/ExternalLink';
import { useAppState } from '../store';
import React, { useState } from 'react';
import Image from 'src/components/Image';
import { Stack } from '@mui/system';
import { useRewards } from 'src/hooks/useRewards';

type RewardCardProps = {
  isLoading: boolean;
  title: string;
  subtitle: string;
  iconUrl: string;
  disclaimer: string;
  onClick: VoidFunction;
};
export const RewardCard = ({
  title,
  subtitle,
  disclaimer,
  iconUrl,
  onClick,
  isLoading
}: RewardCardProps) => {
  return (
    <Card elevation={5} sx={{ p: 3, height: { md: '320px' } }}>
      {isLoading ? (
        <Skeleton width="100%" height="100%" />
      ) : (
        <>
          <Stack
            height="100%"
            justifyContent="space-between"
            alignItems="center"
            sx={{ textAlign: 'center' }}
          >
            <Stack direction="column" alignItems="center">
              <Image src={iconUrl} sx={{ width: '80px', height: '80px' }} />
              <Typography variant="h5" component="h3" mt={2} mb={0.5}>
                {title}
              </Typography>

              <Typography variant="body1" component="h4" mb={2}>
                {subtitle}
              </Typography>
            </Stack>
            <Box>
              <Typography variant="caption">{disclaimer}</Typography>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={onClick}
                sx={{ mt: 0.5 }}
              >
                Claim reward
              </Button>
            </Box>
          </Stack>
        </>
      )}
    </Card>
  );
};

const BookingDetails = () => {
  //TODO: retrieve offer ID and transaction id
  const { selectedNetwork } = useAppState();
  const [params] = useSearchParams();

  return (
    <Box mt={4}>
      <Typography variant="h3" component="h1" mb={1}>
        Booking confirmed 🥳
      </Typography>
      <Typography variant="body1">
        Your{' '}
        <ExternalLink
          href={`${selectedNetwork?.blockExplorer}/tx/${params.get('tx')}`}
          target="_blank"
        >
          transaction
        </ExternalLink>{' '}
        and booking was successful. Your booking confirmation will be sent by email. Thank
        you for booking using win.so!
      </Typography>
    </Box>
  );
};

const BookingRewards = () => {
  const { data, isLoading } = useRewards('c6541a8b-9e88-41d1-a773-17f94cb853e4');
  const lif = data?.filter((item) => item.tokenName === 'LIF')[0];
  const nct = data?.filter((item) => item.tokenName === 'NCT')[0];

  return (
    <Box mt={6}>
      <Typography variant="h4" component="h3">
        Claim your reward
      </Typography>
      <Typography variant="body1" mb={3}>
        Because you have booked with win.so you are rewarded. Pick one of the two rewards
        below.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RewardCard
            isLoading={isLoading}
            iconUrl="/images/lif-token.webp"
            title="Reward the climate"
            subtitle="Reduce your CO2 by buying a NCT Token."
            disclaimer="Prices can fluctuate."
            onClick={() => {
              return 'sil';
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RewardCard
            isLoading={isLoading}
            iconUrl="/images/lif-token.webp"
            title="Claim lif tokens"
            subtitle={`Claim ${lif?.quantity} lif tokens`}
            disclaimer="Prices can fluctuate."
            onClick={() => {
              return 'sil';
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export const BookingConfirmation = () => {
  return (
    <MainLayout maxWidth="sm">
      <BookingDetails />
      <BookingRewards />
    </MainLayout>
  );
};
