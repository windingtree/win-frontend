import { LoadingButton } from '@mui/lab';
import { Box, Card, Skeleton, Stack, Typography } from '@mui/material';
import Image from 'src/components/Image';

type RewardCardProps = {
  isLoading: boolean;
  title: string;
  subtitle: string;
  iconUrl: string;
  disclaimer: string;
  onClick: VoidFunction;
  isMutationLoading: boolean;
  isMutationSuccess: boolean;
};

export const RewardCard = ({
  title,
  subtitle,
  disclaimer,
  iconUrl,
  onClick,
  isLoading,
  isMutationLoading,
  isMutationSuccess
}: RewardCardProps) => {
  const buttonText = isMutationSuccess ? 'Reward claimed' : 'Claim reward';
  return (
    <Card elevation={5} sx={{ p: 3, minHeight: { xs: '320px', md: '320px' } }}>
      {isLoading ? (
        <Skeleton width="100%" height="280px" />
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

              <LoadingButton
                disabled={isMutationSuccess}
                loading={isMutationLoading}
                variant="contained"
                size="large"
                fullWidth
                onClick={onClick}
                sx={{ mt: 0.5 }}
              >
                {buttonText}
              </LoadingButton>
            </Box>
          </Stack>
        </>
      )}
    </Card>
  );
};
