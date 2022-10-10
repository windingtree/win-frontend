import {
  GroupBookingRequest,
  GroupBookingRequestResponse
} from '@windingtree/glider-types/dist/win';
import axios from 'axios';
import { backend } from 'src/config';
import Logger from 'src/utils/logger';

const logger = Logger('useCheckout');

export const bookGroupRequest = async (mutationProps: GroupBookingRequest) => {
  const { data } = await axios
    .post<GroupBookingRequestResponse>(
      `${backend.url}/api/groups/bookingRequest`,
      mutationProps,
      {
        withCredentials: true
      }
    )
    .catch((e) => {
      //eslint-disable-next-line
      logger.error(e);
      throw new Error('Something went wrong with your booking. Please try again.');
    });

  if (!data.depositOptions || !data.requestId) {
    throw new Error('Something went wrong with your booking. Please try again.');
  }

  return data;
};
