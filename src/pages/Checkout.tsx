import { Box } from 'grommet';
import { utils } from 'ethers';
import { useNavigate } from 'react-router-dom';
import MainLayout from 'src/layouts/main';
import { WinPay } from '../components/WinPay';
import Logger from '../utils/logger';
import { useAppState } from '../store';

const logger = Logger('Checkout');

export const Checkout = () => {
  const navigate = useNavigate();
  const { checkout } = useAppState();

  const isValid =
    checkout !== undefined &&
    checkout.offerId !== undefined &&
    checkout.offer !== undefined &&
    checkout.offer.price !== undefined &&
    checkout.offer.price.currency !== undefined &&
    checkout.offer.price.public !== undefined &&
    checkout.serviceId !== undefined &&
    checkout.provider !== undefined &&
    checkout.offer.expiration !== undefined;

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
    //   },
    //   {
    //     label: 'Guest Info',
    //     path: '/guest-info'
    //   }
    // ]}
    >
      <Box align="center" overflow="hidden">
        {isValid && (
          <WinPay
            payment={{
              currency: 'USD', //checkout.offer.price.currency should be passed
              value: utils.parseEther(checkout.offer.price.public.toString()),
              expiration: Math.ceil(Date.now() / 1000) + 500000000,
              providerId: String(checkout.provider),
              serviceId: String(checkout.serviceId)
            }}
            onSuccess={(result) => {
              logger.debug(`Payment result:`, result);
              navigate('/bookings/confirmation');
            }}
          />
        )}
      </Box>
    </MainLayout>
  );
};
