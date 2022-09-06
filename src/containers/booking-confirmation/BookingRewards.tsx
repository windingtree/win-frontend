import { Grid, Box, Typography, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRewards } from 'src/hooks/useRewards';
import { RewardCard } from './RewardCard';
import { RewardModal } from './RewardModal';

const convertTonsToKilos = (tons: string) => {
  const kilos = Number(tons) * 1000;
  return kilos;
};

const RewardIntroduction = ({ children }) => {
  return (
    <Box mt={6}>
      <Typography variant="h4" component="h3">
        Claim your reward
      </Typography>
      <Typography variant="body1" mb={3}>
        Because you have booked with win.so you are rewarded. Pick one of the two rewards
        below.
      </Typography>
      {children}
    </Box>
  );
};

export const BookingRewards = () => {
  //TODO: get offerId and transaction id from the url
  const offerId = 'c6541a8b-9e88-41d1-a773-17f94cb853e4';
  const { data, isLoading, claimReward, error } = useRewards(offerId);
  const {
    mutate,
    error: mutationError,
    isLoading: isMutationLoading,
    isSuccess: isMutationSuccess
  } = claimReward;
  const lif = data?.filter((item) => item.tokenName === 'LIF')[0];
  const nct = data?.filter((item) => item.tokenName === 'NCT')[0];
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isMutationSuccess) {
      setIsModalOpen(true);
    }
  }, [isMutationSuccess, setIsModalOpen]);

  if (error) {
    return (
      <RewardIntroduction>
        <Alert severity="error">Something went wrong with retrieving your rewards.</Alert>
      </RewardIntroduction>
    );
  }

  return (
    <RewardIntroduction>
      <>
        <RewardModal isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <RewardCard
              isLoading={isLoading}
              isMutationLoading={isMutationLoading}
              isMutationSuccess={isMutationSuccess}
              iconUrl="/images/lif-token.webp"
              title="Reward the climate"
              subtitle={`Safe ${convertTonsToKilos(nct?.quantity)} kilos CO2.`}
              disclaimer="Prices can fluctuate."
              onClick={() => {
                mutate({ id: offerId, rewardType: lif.rewardType });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RewardCard
              isLoading={isLoading}
              isMutationLoading={isMutationLoading}
              isMutationSuccess={isMutationSuccess}
              iconUrl="/images/lif-token.webp"
              title="Claim lif tokens"
              subtitle={`Claim ${lif?.quantity} lif tokens`}
              disclaimer="Prices can fluctuate."
              onClick={() => {
                mutate({ id: offerId, rewardType: lif.rewardType });
              }}
            />
          </Grid>
        </Grid>
        {mutationError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Something went wrong. Try again{' '}
          </Alert>
        )}
      </>
    </RewardIntroduction>
  );
};
