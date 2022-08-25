import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useRoutes, useLocation, Navigate } from 'react-router-dom';
import { useAppState } from './store';

// Pages
import { Home } from './pages/Home';
import { Facility } from './pages/Facility';
import { Bookings } from './pages/Bookings';
import { Faq } from './pages/Faq';
import { About } from './pages/About';
import { Contacts } from './pages/Contacts';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { Security } from './pages/Security';
import { Developers } from './pages/Developers';
import { Checkout } from './pages/Checkout';
import { GuestInfo } from './pages/GuestInfo';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { Search } from './pages/Search';

export interface ProtectedProps {
  component: ReactNode;
  path?: string;
}

export interface RouteConfig {
  path: string;
  element: ReactNode;
  title: string;
  label?: string;
  protected?: boolean;
}

export type Routes = RouteConfig[];

export const Protected = ({ component, path = '/' }: ProtectedProps) => {
  const location = useLocation();
  const { account } = useAppState();

  return (
    <>{account !== undefined ? component : <Navigate to={path} state={{ location }} />}</>
  );
};

export const pagesRoutesConfig: Routes = [
  {
    path: '/',
    element: <Home />,
    title: 'Stays',
    label: 'Home'
  },
  {
    path: '/facility/:id',
    element: <Facility />,
    title: 'Facility'
    // label: "Facility",
  },
  {
    path: '/bookings',
    element: <Bookings />,
    title: 'Bookings',
    label: 'Bookings'
  },
  {
    path: '/bookings/confirmation',
    element: <BookingConfirmation />,
    title: 'Booking confirmation',
    label: 'Bookings'
  },
  {
    path: '/faq',
    element: <Faq />,
    title: 'FAQ',
    label: 'FAQ'
  },
  {
    path: '/about',
    element: <About />,
    title: 'About',
    label: 'About'
  },
  {
    path: '/security',
    element: <Security />,
    title: 'Security info',
    label: 'Security info'
  },
  {
    path: '/privacy',
    element: <PrivacyPolicy />,
    title: 'Privacy and Cookie Policy',
  },
  {
    path: '/terms',
    element: <TermsAndConditions />,
    title: 'Terms and Conditions',
  },
  {
    path: '/contacts',
    element: <Contacts />,
    title: 'Contacts',
    label: 'Contacts'
  },
  {
    path: '/developers',
    element: <Developers />,
    title: 'Developers'
    // label: "Developers",
  },
  {
    path: '/checkout/:id',
    element: <Checkout />,
    title: 'Checkout',
    label: 'Checkout'
  },
  {
    path: '/guest-info',
    element: <GuestInfo />,
    title: 'Guest Info',
    label: 'Guest Info'
  },
  {
    path: '/search',
    element: <Search />,
    title: 'Search',
    label: 'Search'
  }
];

export const processPagesConfig = (config: Routes): Routes =>
  config.map((route: RouteConfig) =>
    route.protected
      ? {
          ...route,
          element: <Protected component={route.element} />
        }
      : route
  );

export const AppRoutes = () =>
  useRoutes(useMemo(() => processPagesConfig(pagesRoutesConfig), []));
