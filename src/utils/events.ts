import dappcon22 from '../images/conferences/dappcon22.jpg';
import blockchaineurope2022 from '../images/conferences/blockchaineurope2022.png';
import devcon6 from '../images/conferences/devcon6.jpeg';
import ethdownunder from '../images/conferences/ethdownunder.png';
import devcon6Icon from '../images/event-icons/devcon6.jpg';

export type EventItemProps = {
  name: string;
  location: string;
  image: string;
  url?: string;
  conferenceUrl?: string;
  date: string;
  latlon?: [number, number];
  mapIcon?: string;
};

export const events: EventItemProps[] = [
  {
    name: 'DappCon22',
    location: 'Berlin',
    image: dappcon22,
    url: '/search?roomCount=1&adultCount=2&startDate=2022-09-12T00%3A00%3A00%2B02%3A00&endDate=2022-09-14T00%3A00%3A00%2B02%3A00&location=berlin',
    conferenceUrl: 'https://www.dappcon.io/',
    date: '12-14  September',
    latlon: [52.5170365, 13.3888599]
  },
  {
    name: 'Blockchain Expo Europe 2022',
    location: 'Amsterdam',
    image: blockchaineurope2022,
    url: '/search?roomCount=1&adultCount=2&startDate=2022-09-20T00%3A00%3A00%2B02%3A00&endDate=2022-09-21T00%3A00%3A00%2B02%3A00&location=amsterdam',
    conferenceUrl: 'https://blockchain-expo.com/europe/',
    date: '20-21  September',
    latlon: [52.5170365, 13.3888599]
  },
  {
    name: 'Devcon VI',
    location: 'Bogotá',
    image: devcon6,
    conferenceUrl: 'https://devcon.org',
    url: '/search?roomCount=1&adultCount=2&startDate=2022-10-07T00%3A00%3A00%2B02%3A00&endDate=2022-10-16T00%3A00%3A00%2B02%3A00&location=Bogota',
    date: '7-16  October',
    latlon: [4.6534649, -74.0836453],
    mapIcon: devcon6Icon
  },
  {
    name: 'ETHDownUnder',
    location: 'Sydney',
    image: ethdownunder,
    conferenceUrl: 'https://ethdownunder.com/',
    url: '/search?roomCount=1&adultCount=2&startDate=2022-12-01T00%3A00%3A00%2B01%3A00&endDate=2022-12-04T00%3A00%3A00%2B01%3A00&location=Sydney',
    date: '1-4  December',
    latlon: [-33.8698439, 151.208284]
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
