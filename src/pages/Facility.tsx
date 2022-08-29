import MainLayout from 'src/layouts/main';
import { FacilityIntroduction } from '../containers/facility/FacilityIntroduction';
import { FacilityOffers } from 'src/containers/facility/FacilityOffers';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { createSearchParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from '../hooks/useAccommodationsAndOffers.tsx';
import { useMemo } from 'react';

export const Facility = () => {
  const { latestQueryParams } = useAccommodationsAndOffers();

  const query = useMemo(() => {
    if (latestQueryParams === undefined) {
      return '';
    }

    const params = {
      roomCount: latestQueryParams.roomCount.toString(),
      adultCount: latestQueryParams.adultCount.toString(),
      arrival: latestQueryParams.arrival?.toDateString() ?? '',
      departure: latestQueryParams.departure?.toDateString() ?? '',
      location: latestQueryParams.location
    };
    return createSearchParams(params);
  }, [latestQueryParams, createSearchParams]);

  return (
    <MainLayout
    //TODO: check with designer whether breadcrumbs are still needed.
    // breadcrumbs={[
    //   {
    //     label: 'Search',
    //     path: `/`
    //   }
    // ]}
    >
      <Breadcrumbs
        links={[
          {
            name: 'Home',
            href: `/`
          },
          {
            name: 'Search',
            href: `/search?${query}`
          }
        ]}
      />
      <FacilityIntroduction />
      <FacilityOffers />
    </MainLayout>
  );
};
