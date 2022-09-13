import dappcon22 from '../images/conferences/dappcon22.jpg';
import blockchaineurope2022 from '../images/conferences/blockchaineurope2022.png';
import devcon6 from '../images/conferences/devcon6.jpeg';
import ethdownunder from '../images/conferences/ethdownunder.png';
import devcon6Icon from '../images/event-icons/devcon6.jpg';
import { DateTime } from 'luxon';
import { crowDistance } from './geo';

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

export const upcomingEvents: EventItemProps[] = [
  {
    name: 'DappCon22',
    location: 'Berlin',
    image: dappcon22,
    url: '/search?roomCount=1&adultCount=2&startDate=2022-09-12T00%3A00%3A00%2B02%3A00&endDate=2022-09-14T00%3A00%3A00%2B02%3A00&location=berlin',
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
    url: '/search?roomCount=1&adultCount=2&startDate=2022-09-20T00%3A00%3A00%2B02%3A00&endDate=2022-09-21T00%3A00%3A00%2B02%3A00&location=amsterdam',
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

export interface EventSearchParams {
  fromDate: Date;
  toDate: Date;
}

export const datesOverlap = (
  dateRange: EventSearchParams,
  targetDateRange: EventSearchParams
) => {
  const { fromDate: targetFromDate, toDate: targetToDate } = targetDateRange;
  return (
    (dateRange.fromDate <= targetFromDate && dateRange.toDate >= targetToDate) ||
    (dateRange.fromDate >= targetFromDate && dateRange.toDate >= targetToDate) ||
    (dateRange.fromDate <= targetFromDate && dateRange.toDate <= targetToDate)
  );
};

export const getCurrentEvents = (dateRange: EventSearchParams) => {
  return upcomingEvents.filter((evt) => {
    try {
      const eventFromDate = DateTime.fromFormat(
        evt.dateRange.fromDate,
        'd-MM-yyyy'
      ).toJSDate();
      const eventToDate = DateTime.fromFormat(
        evt.dateRange.toDate,
        'd-MM-yyyy'
      ).toJSDate();

      return datesOverlap(dateRange, { fromDate: eventFromDate, toDate: eventToDate });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error parsing upcoming event: ${(error as Error).message}`);
      return false;
    }
  });
};

export const getEventsWithinRadius = (
  events: EventItemProps[],
  centerLatLon: [number, number],
  maxRadius = 3,
  useKm = true
) => {
  return events.filter((evt) => {
    return (
      evt.latlon &&
      crowDistance(
        evt.latlon[0],
        evt.latlon[1],
        centerLatLon[0],
        centerLatLon[1],
        useKm
      ) <= maxRadius
    );
  });
};
