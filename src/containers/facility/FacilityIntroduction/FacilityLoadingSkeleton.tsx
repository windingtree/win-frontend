import { Skeleton, Stack } from '@mui/material';
import { useResponsive } from 'src/hooks/useResponsive';

export const FacilityLoadingSkeleton = () => {
  const isMobile = useResponsive('down', 'sm');

  return (
    <>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Skeleton
            variant="rounded"
            sx={{ height: '60px', width: { xs: '80%', md: '50%' } }}
          />

          {!isMobile && (
            <Skeleton
              variant="rounded"
              sx={{ height: '120px', width: { xs: '80%', md: '20%' } }}
            />
          )}
        </Stack>

        <Skeleton
          variant="rounded"
          sx={{ height: '40px', width: { xs: '80%', md: '20%' } }}
        />

        {isMobile && (
          <Skeleton
            variant="rounded"
            sx={{ height: '40px', width: { xs: '80%', md: '20%' } }}
          />
        )}
        <Skeleton variant="rounded" sx={{ height: '600px', width: { md: '50%' } }} />
      </Stack>
    </>
  );
};
