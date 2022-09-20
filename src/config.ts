import { Settings } from 'luxon';
import { config } from '@windingtree/win-commons';
import blockchaineurope2022 from './images/conferences/blockchaineurope2022.png';
import devcon6 from './images/conferences/devcon6.jpeg';
import ethdownunder from './images/conferences/ethdownunder.png';
import devcon6Icon from './images/event-icons/devcon_pin_50x73px.svg';
import ethdownunderIcon from './images/event-icons/blockchain_expo_europe_2022.svg';
import blockchaineurope2022Icon from './images/event-icons/eth_down_under_2022.svg';

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
    },
    mapIcon: {
      url: blockchaineurope2022Icon
    }
  },
  {
    name: 'Devcon VI',
    location: 'Bogotá',
    image: devcon6,
    conferenceUrl: 'https://devcon.org',
    url: '/search?roomCount=1&adultCount=2&startDate=2022-10-07T00%3A00%3A00%2B02%3A00&endDate=2022-10-16T00%3A00%3A00%2B02%3A00&location=Bogota',
    date: '7-16  October',
    latlon: [4.6296313, -74.0934695],
    mapIcon: {
      url: devcon6Icon
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
    },
    mapIcon: {
      url: ethdownunderIcon
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

export const SOCIALS = [
  {
    name: 'Winding Tree website',
    icon: 'iconoir:www',
    socialColor: '#7289da',
    path: 'https://windingtree.com/'
  },
  {
    name: 'Blog',
    icon: 'fluent:news-16-filled',
    socialColor: '#00AAEC',
    path: 'https://blog.windingtree.com/'
  },
  {
    name: 'Discord',
    icon: 'ic:outline-discord',
    socialColor: '#7289da',
    path: 'https://discord.gg/RWqqzT3Gf8'
  },
  {
    name: 'Twitter',
    icon: 'eva:twitter-fill',
    socialColor: '#00AAEC',
    path: 'https://twitter.com/windingtree'
  },
  {
    name: 'LinkedIn',
    icon: 'akar-icons:linkedin-box-fill',
    socialColor: '#00AAEC',
    path: 'https://www.linkedin.com/company/winding-tree/'
  },
  {
    name: 'Youtube',
    icon: 'mdi:youtube',
    socialColor: '#c4302b',
    path: 'https://youtube.com/windingtree'
  },
  {
    name: 'Github',
    icon: 'akar-icons:github-fill',
    socialColor: '#c4302b',
    path: 'https://github.com/windingtree/'
  }
];
