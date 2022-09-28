import MainLayout from 'src/layouts/main';
import { FacilityIntroduction } from '../containers/facility/FacilityIntroduction';
import { FacilityOffers } from 'src/containers/facility/FacilityOffers';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { createSearchParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from '../hooks/useAccommodationsAndOffers.tsx';
import { useMemo } from 'react';
import { createRef, useCallback } from 'react';

export const Facility = () => {
  const detailImagesRef = createRef<HTMLDivElement>();
  const scrollToDetailImages = useCallback(() => {
    detailImagesRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [detailImagesRef]);

  const { latestQueryParams } = useAccommodationsAndOffers();
  const query = useMemo(() => {
    if (latestQueryParams === undefined) {
      return '';
    }
    const params = {
      roomCount: latestQueryParams.roomCount.toString(),
      adultCount: latestQueryParams.adultCount.toString(),
      startDate: latestQueryParams.arrival?.toISOString() ?? '',
      endDate: latestQueryParams.departure?.toISOString() ?? '',
      location: latestQueryParams.location,
      focusedEvent: latestQueryParams.focusedEvent ?? ''
    };
    return createSearchParams(params);
  }, [latestQueryParams, createSearchParams]);

  return (
    <MainLayout maxWidth="lg">
      <Breadcrumbs
        sx={{ mb: 2 }}
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

      <FacilityIntroduction scrollToDetailImages={scrollToDetailImages} />
      <FacilityOffers ref={detailImagesRef} />
    </MainLayout>
  );
};
