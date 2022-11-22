import { useMemo } from 'react';
import { createSearchParams } from 'react-router-dom';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { useAccommodationMultiple } from 'src/hooks/useAccommodationMultiple';

export const FacilityBreadcrumbs = () => {
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
      location: latestQueryParams.location,
      focusedEvent: latestQueryParams.focusedEvent ?? ''
    };
    return createSearchParams(params);
  }, [latestQueryParams]);

  return (
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
  );
};
