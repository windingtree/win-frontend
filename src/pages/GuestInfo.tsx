import MainLayout from 'src/layouts/main';
import { GuestInfoContainer } from '../containers/GuestInfoContainer';

export const GuestInfo = () => {
  return (
    <MainLayout
    //TODO: check with designer whether breadcrumbs are still needed.
    // breadcrumbs={[
    //   {
    //     label: 'Search',
    //     path: '/'
    //   },
    //   {
    //     label: 'Facility',
    //     path: '/facilities/' + checkout?.facilityId
    //   }
    // ]}
    >
      <GuestInfoContainer />
    </MainLayout>
  );
};
