import MainLayout from 'src/layouts/main';
import { FacilityOffers } from 'src/containers/facility/FacilityOffers';
import { useState } from 'react';
import { createRef, useCallback } from 'react';
import { FacilityIntroduction } from 'src/containers/facility/FacilityIntroduction';
import { FacilitySearchFormProvider } from 'src/containers/facility/FacilityOffers/FacilitySearchFormProvider';
import { FacilityCovid } from 'src/containers/facility/FacilityCovid';
import { SearchPropsType } from 'src/hooks/useAccommodationSingle';
import { FacilityBreadcrumbs } from 'src/containers/facility/FacilityBreadcrumbs';

export const Facility = () => {
  // The properties that are being passed for searching for offers.
  const [searchPropsQuery, setSearchPropsQuery] = useState<SearchPropsType | undefined>(
    undefined
  );
  const detailImagesRef = createRef<HTMLDivElement>();
  const scrollToDetailImages = useCallback(() => {
    detailImagesRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [detailImagesRef]);

  return (
    <FacilitySearchFormProvider>
      <MainLayout maxWidth="lg">
        <FacilityBreadcrumbs />
        <FacilityIntroduction
          scrollToDetailImages={scrollToDetailImages}
          searchPropsQuery={searchPropsQuery}
        />
        <FacilityOffers
          ref={detailImagesRef}
          searchPropsQuery={searchPropsQuery}
          setSearchPropsQuery={setSearchPropsQuery}
        />
        <FacilityCovid />
      </MainLayout>
    </FacilitySearchFormProvider>
  );
};
