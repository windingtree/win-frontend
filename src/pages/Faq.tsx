import { FaqAccordion } from '../containers/FaqAccordion';
import MainLayout from '../layouts/main';

export const Faq = () => {
  return (
    <MainLayout
    // breadcrumbs={[
    //   {
    //     label: 'Home',
    //     path: '/'
    //   }
    // ]}
    >
      <FaqAccordion />
    </MainLayout>
  );
};
