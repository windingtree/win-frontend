import { Settings } from 'luxon';
import { config } from '@windingtree/win-commons';
import dappcon22 from '../images/conferences/dappcon22.jpg';
import blockchaineurope2022 from '../images/conferences/blockchaineurope2022.png';
import devcon6 from '../images/conferences/devcon6.jpeg';
import ethdownunder from '../images/conferences/ethdownunder.png';
import devcon6Icon from '../images/event-icons/devcon6.jpg';

export enum AppMode {
  dev = 'dev',
  stage = 'stage',
  prod = 'prod'
}

export interface Api {
  key: string;
  url: string;
}

export type EventItemProps = {
  name: string;
  location: string;
  image: string;
  url?: string;
  conferenceUrl?: string;
  date: string;
  latlon?: [number, number];
  mapIcon?: {
    url: string;
    rounded?: boolean;
  };
  dateRange: {
    fromDate: string;
    toDate: string;
  };
};

export const checkEnvVariables = (vars: string[]): void =>
  vars.forEach((variable) => {
    if (!process.env[variable] || process.env[variable] === '') {
      throw new Error(`${variable} must be provided in the ENV`);
    }
  });

checkEnvVariables(['REACT_APP_API_URL', 'REACT_APP_EXPIRATION_GAP', 'REACT_APP_MODE']);

// Configure the time zone
Settings.defaultZone = config.defaultZone;

// currency the asset is pegged to
export const assetsCurrencies = config.assetsCurrencies;

let mode: AppMode;

switch (process.env.REACT_APP_MODE) {
  case 'prod':
    mode = AppMode.prod;
    break;
  case 'dev':
    mode = AppMode.dev;
    break;
  case 'stage':
  default:
    mode = AppMode.stage;
}

export const allowedNetworks = config.getNetworksByMode(mode);

export const getNetworkInfo = config.getNetworkInfo;

export const backend = Object.freeze({
  url: process.env.REACT_APP_API_URL
});

export const expirationGap = Number(process.env.REACT_APP_EXPIRATION_GAP);

export const upcomingEvents: EventItemProps[] = [
  {
    name: 'DappCon22',
    location: 'Berlin',
    image: dappcon22,
    url: '/search?roomCount=1&adultCount=2&startDate=2022-09-12T00%3A00%3A00%2B02%3A00&endDate=2022-09-14T00%3A00%3A00%2B02%3A00&location=Berlin',
    conferenceUrl: 'https://www.dappcon.io/',
    date: '12-14  September',
    latlon: [52.5103084, 13.4265072],
    dateRange: {
      fromDate: '12-09-2022',
      toDate: '14-09-2022'
    }
  },
  {
    name: 'Blockchain Expo Europe 2022',
    location: 'Amsterdam',
    image: blockchaineurope2022,
    url: '/search?roomCount=1&adultCount=2&startDate=2022-09-20T00%3A00%3A00%2B02%3A00&endDate=2022-09-21T00%3A00%3A00%2B02%3A00&location=Amsterdam',
    conferenceUrl: 'https://blockchain-expo.com/europe/',
    date: '20-21  September',
    latlon: [52.3411921, 4.8824251],
    dateRange: {
      fromDate: '20-09-2022',
      toDate: '21-09-2022'
    }
  },
  {
    name: 'Devcon VI',
    location: 'Bogotá',
    image: devcon6,
    conferenceUrl: 'https://devcon.org',
    url: '/search?roomCount=1&adultCount=2&startDate=2022-10-07T00%3A00%3A00%2B02%3A00&endDate=2022-10-16T00%3A00%3A00%2B02%3A00&location=Bogota',
    date: '7-16  October',
    latlon: [4.6493578, -74.0915278],
    mapIcon: {
      url: devcon6Icon,
      rounded: true
    },
    dateRange: {
      fromDate: '7-10-2022',
      toDate: '16-10-2022'
    }
  },
  {
    name: 'ETHDownUnder',
    location: 'Sydney',
    image: ethdownunder,
    conferenceUrl: 'https://ethdownunder.com/',
    url: '/search?roomCount=1&adultCount=2&startDate=2022-12-01T00%3A00%3A00%2B01%3A00&endDate=2022-12-04T00%3A00%3A00%2B01%3A00&location=Sydney',
    date: '1-4  December',
    latlon: [-33.8698439, 151.208284],
    dateRange: {
      fromDate: '1-12-2022',
      toDate: '4-12-2022'
    }
  } /*
  {
    name: 'ETHTaipei',
    location: 'Taipei',
    image: taipei,
    url: '',
    date: '2-4  December'
    // latlon: [25.0375198, 121.5636796],
  }*/
];
