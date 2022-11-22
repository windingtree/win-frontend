import { Breadcrumbs } from '../components/Breadcrumbs';
import MainLayout from 'src/layouts/main';
import { GuestInfoContainer } from '../containers/GuestInfoContainer';
import { useMemo } from 'react';
import { createSearchParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';
import { useAppState } from '../store';

export const GuestInfo = () => {
  const { checkout } = useAppState();
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
  }, [latestQueryParams]);

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
          ...(checkout
            ? [
                {
                  name: 'Facility',
                  href: `/facility/${checkout.facilityId}`
                }
              ]
            : [])
        ]}
      />
      <GuestInfoContainer />
    </MainLayout>
  );
};
