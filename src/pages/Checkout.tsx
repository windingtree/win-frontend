import { Box } from 'grommet';
import { utils } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { WinPay } from '../components/WinPay';
import Logger from '../utils/logger';
import { useAppState } from '../store';
import { DateTime } from 'luxon';

const logger = Logger('Checkout');

export const Checkout = () => {
  const navigate = useNavigate();
  const { checkout } = useAppState();
  logger.info('checkout', checkout)

  return (
    <MainLayout
      breadcrumbs={[
        {
          label: 'Search',
          path: '/'
        },
        {
          label: 'Facility',
          path: '/facilities/' + checkout?.facilityId
        },
        {
          label: 'Guest Info',
          path: '/guest-info'
        }
      ]}
    >
      <Box align="center" overflow="hidden">
        {checkout && checkout.offerId && checkout.offer && checkout.offer.price && checkout.offer.price.currency && checkout.offer.price.public && checkout.offer.expiration &&
          <WinPay
            payment={{
              currency: 'USD', //checkout.offer.price.currency should be passed
              value: utils.parseEther('1.5'),
              expiration: Math.ceil(Date.now() / 1000) + 500000000,
              providerId: utils.id(checkout.facilityId),
              serviceId: utils.id(checkout.offerId)
            }}
            onSuccess={(result) => {
              logger.debug(`Payment result:`, result);
              navigate('/bookings/confirmation');
            }}
          />}
      </Box>
    </MainLayout>
  );
};
