import { Breadcrumbs } from '../components/Breadcrumbs';
import MainLayout from 'src/layouts/main';
import { GuestInfoContainer } from '../containers/GuestInfoContainer';
import { useMemo } from 'react';
import { createSearchParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { useAppState } from '../store';

export const GuestInfo = () => {
  const { checkout } = useAppState();
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
          },
          {
            name: 'Facility',
            href: checkout ? `/facility/${checkout.facilityId}` : `/search?${query}`
          }
        ]}
      />
      <GuestInfoContainer />
    </MainLayout>
  );
};
