import { Alert, Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRewards } from 'src/hooks/useRewards';
import { RewardCard } from './RewardCard';
import { RewardModal } from './RewardModal';
import { useCheckout } from 'src/hooks/useCheckout';
import { MHidden } from 'src/components/MHidden';
import { MobileRewardCard } from './MobileRewardCard';

const convertTonsToKilos = (tons: string | undefined): number => {
  if (!tons) return 0;
  return Number(tons) * 1000;
};

const RewardIntroduction = ({ children }) => {
  const { bookingMode } = useCheckout();
  const isGroupMode = bookingMode === 'group';
  return (
    <Box mt={6} mb={6}>
      <Typography variant="h4" component="h3">
        Choose your reward option
      </Typography>
      <Typography variant="body1" mb={3}>
        Numbers are estimated based on your booking value.{' '}
        {isGroupMode && 'They might change after your offer confirmation'}
      </Typography>
      {children}
    </Box>
  );
};

const LifRewardContent = () => {
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography variant="body1" mb={2} component="ul">
        <li>
          <a
            href="https://snapshot.org/#/windingtree.eth"
            target="_blank"
            rel="noreferrer"
          >
            Vote
          </a>{' '}
          on the evolution of the project.
        </li>
        <li>Receive incentivised POAPs/NFTs.</li>
        <li>
          Hold a token that as we grow, will have extended utility within the platform and
          DAO.
        </li>
      </Typography>

      <Typography variant="caption">
        Learn more about Winding Tree{' '}
        <a href="https://windingtree.com/" target="_blank" rel="noreferrer">
          here
        </a>
        <br />
        Join the community on discord{' '}
        <a href="https://discord.gg/rmpCCNDVRq" target="_blank" rel="noreferrer">
          here
        </a>{' '}
      </Typography>
    </Box>
  );
};

const NctRewardContent = () => {
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="body1" mb={2} component="ul">
          <li>
            {' '}
            We purchase and retire on your behalf Nature Carbon Tonne (NCT) from Toucan
            Protocol.
          </li>
          <li>Send you a proof as an NFT certificate.</li>
        </Typography>

        <Typography variant="caption">
          Read more about Toucan Protocol and NCT{' '}
          <a
            href="https://docs.toucan.earth/toucan/pool/pool-parties/nct-pool-party-report"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export const BookingRewards = () => {
  const { bookingMode, bookingInfo } = useCheckout();
  const isGroupMode = bookingMode === 'group';
  const offerId = isGroupMode ? bookingInfo?.requestId : bookingInfo?.pricedOfferId;

  const { data, isLoading, claimReward, error } = useRewards(offerId, isGroupMode);
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

  if (error || !bookingInfo) {
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
            <MHidden width="smUp">
              <MobileRewardCard
                iconUrl="/images/nct-token-logo.svg"
                title={`${convertTonsToKilos(nct?.quantity)} kg of CO₂ reduced`}
              >
                <RewardCard
                  isLoading={isLoading}
                  isMutationLoading={isMutationLoading}
                  isMutationSuccess={isMutationSuccess}
                  iconUrl="/images/nct-token-logo.svg"
                  title={`${convertTonsToKilos(nct?.quantity)} kg of CO₂ reduced`}
                  disclaimer="The amount displayed above is based on todays market price, of NCT and is subject to change. The exact amount you will receive, will be calculated based on the tokens value on the check-out date."
                  onClick={() => {
                    mutate({ id: offerId, rewardType: lif?.rewardType });
                  }}
                >
                  <NctRewardContent />
                </RewardCard>
              </MobileRewardCard>
            </MHidden>
            <MHidden width="smDown">
              <RewardCard
                isLoading={isLoading}
                isMutationLoading={isMutationLoading}
                isMutationSuccess={isMutationSuccess}
                iconUrl="/images/nct-token-logo.svg"
                title={`${convertTonsToKilos(nct?.quantity)} kg of CO₂ reduced`}
                disclaimer="The amount displayed above is based on todays market price, of NCT and is subject to change. The exact amount you will receive, will be calculated based on the tokens value on the check-out date."
                onClick={() => {
                  mutate({ id: offerId, rewardType: lif?.rewardType });
                }}
              >
                <NctRewardContent />
              </RewardCard>
            </MHidden>
          </Grid>
          <Grid item xs={12} md={6}>
            <MHidden width="smUp">
              <MobileRewardCard
                iconUrl="/images/lif-token.webp"
                title={`${lif?.quantity} LIF`}
              >
                <RewardCard
                  isLoading={isLoading}
                  isMutationLoading={isMutationLoading}
                  isMutationSuccess={isMutationSuccess}
                  iconUrl="/images/lif-token.webp"
                  title={`${lif?.quantity} LIF`}
                  disclaimer="The amount displayed above is based on todays market price, of LIF and is subject to change. The exact amount you will receive, will be calculated based on the tokens value on the check-out date."
                  onClick={() => {
                    mutate({ id: offerId, rewardType: lif?.rewardType });
                  }}
                >
                  <LifRewardContent />
                </RewardCard>
              </MobileRewardCard>
            </MHidden>
            <MHidden width="smDown">
              <RewardCard
                isLoading={isLoading}
                isMutationLoading={isMutationLoading}
                isMutationSuccess={isMutationSuccess}
                iconUrl="/images/lif-token.webp"
                title={`${lif?.quantity} LIF`}
                disclaimer="The amount displayed above is based on todays market price, of LIF and is subject to change. The exact amount you will receive, will be calculated based on the tokens value on the check-out date."
                onClick={() => {
                  mutate({ id: offerId, rewardType: lif?.rewardType });
                }}
              >
                <LifRewardContent />
              </RewardCard>
            </MHidden>
          </Grid>
        </Grid>
        {mutationError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {mutationError.message}
          </Alert>
        )}
      </>
    </RewardIntroduction>
  );
};
