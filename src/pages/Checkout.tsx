import { Box, Text } from 'grommet';
import { utils } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { WinPay } from '../components/WinPay';
import Logger from '../utils/logger';
import { useAppState } from '../store';

const logger = Logger('Checkout');

export const Checkout = () => {
  const navigate = useNavigate();
  const { checkout } = useAppState();

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
        <Text weight={500} size="2rem" margin="small">
          Checkout
        </Text>

        <WinPay
          payment={{
            currency: 'USD',
            value: utils.parseEther('1.5'),
            expiration: Math.ceil(Date.now() / 1000) + 500000000,
            providerId: utils.keccak256(utils.formatBytes32String('win_win_provider')),
            serviceId: utils.id(`test_payment_${Math.random().toString()}`)
          }}
          onSuccess={(result) => {
            logger.debug(`Payment result:`, result);
            navigate('/bookings/confirmation');
          }}
        />
      </Box>
    </MainLayout>
  );
};
