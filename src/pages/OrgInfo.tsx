import { Breadcrumbs } from '../components/Breadcrumbs';
import MainLayout from 'src/layouts/main';
import { OrgDetails } from '../containers/OrgDetails';
import { useMemo } from 'react';
import { createSearchParams } from 'react-router-dom';
import { useAccommodationMultiple } from 'src/hooks/useAccommodationMultiple';
import { useCheckout } from 'src/hooks/useCheckout';

export const OrgInfo = () => {
  const { bookingInfo } = useCheckout();
  const { latestQueryParams } = useAccommodationMultiple();

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
          ...(bookingInfo?.accommodation?.id
            ? [
                {
                  name: 'Facility',
                  href: `/facility/${bookingInfo?.accommodation?.id}`
                }
              ]
            : [])
        ]}
      />
      <OrgDetails />
    </MainLayout>
  );
};
