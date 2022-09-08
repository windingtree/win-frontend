import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ReactNode } from 'react';
import { IconButtonAnimate } from 'src/components/animate';
import Iconify from 'src/components/Iconify';
import Image from 'src/components/Image';

type RewardCardProps = {
  isLoading: boolean;
  title: string;
  iconUrl: string;
  disclaimer: string;
  onClick: VoidFunction;
  isMutationLoading: boolean;
  isMutationSuccess: boolean;
  children: ReactNode;
};

export const RewardCard = ({
  title,
  disclaimer,
  iconUrl,
  onClick,
  isLoading,
  isMutationLoading,
  isMutationSuccess,
  children
}: RewardCardProps) => {
  const theme = useTheme();
  const tooltipPlacement = useMediaQuery(theme.breakpoints.down('md'))
    ? 'top'
    : 'right-end';
  const paddingContainer = theme.spacing(3);
  return (
    <Card
      elevation={5}
      sx={{
        p: paddingContainer,
        minHeight: { xs: '460px', md: '480px' },
        position: 'relative'
      }}
    >
      {isLoading ? (
        <Skeleton width="100%" height="400px" />
      ) : (
        <Stack>
          <Box>
            <Tooltip
              title={disclaimer}
              sx={{ position: 'absolute', right: 3, top: 3 }}
              placement={tooltipPlacement}
            >
              <IconButtonAnimate color="primary" size="small">
                <Iconify icon="eva:info-outline" width={24} height={24} />
              </IconButtonAnimate>
            </Tooltip>
            <Stack direction="column" mb={2} alignItems="center">
              <Image src={iconUrl} sx={{ width: '100px', height: '100px' }} />
              <Typography variant="h4" component="h3" mt={2}>
                {title}
              </Typography>
            </Stack>
            {children}
          </Box>

          <Box mt={2}>
            <LoadingButton
              disabled={isMutationSuccess}
              loading={isMutationLoading}
              variant="contained"
              size="large"
              fullWidth
              onClick={onClick}
              sx={{
                mt: 1,
                position: 'absolute',
                bottom: theme.spacing(3),
                marginLeft: 'auto',
                marginRight: 'auto',
                left: '0',
                right: '0',
                width: `calc(100% - (2 * ${paddingContainer}));`
              }}
            >
              Choose Reward
            </LoadingButton>
          </Box>
        </Stack>
      )}
    </Card>
  );
};
