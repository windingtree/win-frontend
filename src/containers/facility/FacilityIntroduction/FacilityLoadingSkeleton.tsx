import { Skeleton, Stack } from '@mui/material';
import { useResponsive } from 'src/hooks/useResponsive';

export const FacilityLoadingSkeleton = () => {
  const isDesktop = useResponsive('up', 'md');

  return (
    <>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Stack spacing={1} sx={{ height: '100px', width: { xs: '80%', md: '50%' } }}>
            <Skeleton variant="rounded" sx={{ height: '60px', width: '100%' }} />
            <Skeleton
              variant="rounded"
              sx={{ height: '40px', width: { xs: '80%', md: '50%' } }}
            />
          </Stack>

          {isDesktop && (
            <Skeleton variant="rounded" sx={{ height: '120px', width: '20%' }} />
          )}
        </Stack>

        {!isDesktop && (
          <Skeleton variant="rounded" sx={{ height: '40px', width: '50%' }} />
        )}
        <Skeleton variant="rounded" sx={{ height: '590px', width: { md: '100%' } }} />
      </Stack>
    </>
  );
};
