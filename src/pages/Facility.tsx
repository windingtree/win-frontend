import { MainLayout } from '../layouts/MainLayout';

import { FacilityIntroduction } from '../container/facility/FacilityIntroduction';
import { FacilityOffers } from 'src/container/facility/FacilityOffers';

export const Facility = () => {
  return (
    <MainLayout
      breadcrumbs={[
        {
          label: 'Search',
          path: `/`
        }
      ]}
    >
      <FacilityIntroduction />
      <FacilityOffers />
    </MainLayout>
  );
};
