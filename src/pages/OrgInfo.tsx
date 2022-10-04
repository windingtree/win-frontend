import { Breadcrumbs } from '../components/Breadcrumbs';
import MainLayout from 'src/layouts/main';
import { OrgDetails } from '../containers/OrgDetails';
import { useMemo } from 'react';
import { createSearchParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { useAppState } from '../store';

export const OrgInfo = () => {
  const { groupCheckout } = useAppState();
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
      location: latestQueryParams.location
    };
    return createSearchParams(params);
  }, [latestQueryParams, createSearchParams]);

  return (
    <MainLayout maxWidth="sm">
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
            href: groupCheckout
              ? `/facility/${groupCheckout.facilityId}`
              : `/search?${query}`
          }
        ]}
      />
      <OrgDetails />
    </MainLayout>
  );
};
