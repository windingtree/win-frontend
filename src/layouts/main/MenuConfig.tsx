import Iconify from 'src/components/Iconify';

const ICON_SIZE = {
  width: 22,
  height: 22
};

const menuConfig = [
  {
    title: 'Home',
    icon: <Iconify icon={'eva:home-fill'} {...ICON_SIZE} />,
    path: '/'
  },
  {
    title: 'Bookings',
    path: '/bookings',
    icon: <Iconify icon={'eva:bulb-outline'} {...ICON_SIZE} />
  }
];

export default menuConfig;
