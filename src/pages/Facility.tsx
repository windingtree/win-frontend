import MainLayout from 'src/layouts/main';
import { FacilityIntroduction } from '../containers/facility/FacilityIntroduction';
import { FacilityOffers } from 'src/containers/facility/FacilityOffers';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { createSearchParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from '../hooks/useAccommodationsAndOffers.tsx';
import { useMemo } from 'react';
import { createRef, useCallback } from 'react';
import { Box } from '@mui/material';

export const Facility = () => {
  const detailImagesRef = createRef<HTMLDivElement>();
  const scrollToDetailImages = useCallback(() => {
    detailImagesRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [detailImagesRef]);

  const { latestQueryParams } = useAccommodationsAndOffers();
  const query = useMemo(
    () => createSearchParams(JSON.stringify(latestQueryParams)),
    [latestQueryParams, createSearchParams]
  );

  return (
    <MainLayout>
      <Breadcrumbs
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Search',
            href: `/search?${query}`
          }
        ]}
      />
      <Box sx={{ px: 8 }}>
        <FacilityIntroduction scrollToDetailImages={scrollToDetailImages} />
        <FacilityOffers ref={detailImagesRef} />
      </Box>
    </MainLayout>
  );
};
