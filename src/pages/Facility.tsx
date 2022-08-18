import MainLayout from 'src/layouts/main';
import { FacilityIntroduction } from '../containers/facility/FacilityIntroduction';
import { FacilityOffers } from 'src/containers/facility/FacilityOffers';

export const Facility = () => {
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
      <FacilityIntroduction />
      <FacilityOffers />
    </MainLayout>
  );
};
