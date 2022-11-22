import * as Yup from 'yup';
import { daysBetween } from '../../utils/date';
import { DISABLE_FEATURES, GROUP_MODE_ROOM_COUNT } from 'src/config';
//TODO: update this when group booking should be enabled

const baseRoomCountValidation = Yup.number()
  .transform((value) => (isNaN(value) ? undefined : value))
  .required('number of rooms')
  .moreThan(0, 'select at least 1 room');

const roomCountValidation =
  DISABLE_FEATURES !== true
    ? baseRoomCountValidation
    : baseRoomCountValidation.lessThan(
        GROUP_MODE_ROOM_COUNT,
        `select at most ${GROUP_MODE_ROOM_COUNT - 1} rooms`
      );

export const SearchSchema = Yup.object().shape({
  location: Yup.string().required('location'),
  roomCount: roomCountValidation,
  adultCount: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('number of adults')
    .moreThan(0, 'select at least 1 adult')
    .when('roomCount', (roomCount, schema) => {
      return schema
        .required('number of adults')
        .min(roomCount ?? 0, 'ensure number of adults is not less than number of rooms');
    }),
  dateRange: Yup.array()
    .required('a check-in date and an check-out date')
    .of(
      Yup.object().shape({
        startDate: Yup.date()
          .typeError('a valid check-in date')
          .required('a check-in date')
          .min(new Date(), 'ensure check-in date is not in the past'),
        endDate: Yup.date()
          .typeError('a valid check-out date')
          .required('an check-out date')
          .test(
            'startEndDate',
            'ensure check-out date is at least 1 day from check-in date',
            (value, { parent }) => {
              const numDays = daysBetween(new Date(parent.startDate as string), value);
              return numDays >= 1;
            }
          )
      })
    )
});
