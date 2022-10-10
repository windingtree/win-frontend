import { Breadcrumbs } from '../components/Breadcrumbs';
import MainLayout from 'src/layouts/main';
import { OrgDetails } from '../containers/OrgDetails';
import { useMemo } from 'react';
import { createSearchParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { useCheckout } from 'src/hooks/useCheckout/useCheckout';

export const OrgInfo = () => {
  const { bookingInfo } = useCheckout();
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
            href: bookingInfo
              ? `/facility/${bookingInfo?.accommodation?.id}`
              : `/search?${query}`
          }
        ]}
      />
      <OrgDetails />
    </MainLayout>
  );
};
