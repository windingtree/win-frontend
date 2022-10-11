import * as Yup from 'yup';
import { daysBetween } from '../../utils/date';
import { DISABLE_FEATURES, GROUP_MODE_ROOM_COUNT } from 'src/config';
//TODO: update this when group booking should be enabled
export const SearchSchema =
  DISABLE_FEATURES === true
    ? Yup.object().shape({
        location: Yup.string().required('location'),
        adultCount: Yup.number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required('number of adults')
          .moreThan(0, 'select at least 1 adult')
          .when('roomCount', (roomCount) =>
            Yup.number().min(
              roomCount,
              'ensure number of adults is not less than number of rooms'
            )
          ),
        roomCount: Yup.number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required('number of rooms')
          .moreThan(0, 'select at least 1 room')
          .lessThan(
            GROUP_MODE_ROOM_COUNT,
            `select at most ${GROUP_MODE_ROOM_COUNT - 1} rooms`
          ),

        dateRange: Yup.array()
          .required('a check-in date and a check-out date')
          .of(
            Yup.object().shape({
              startDate: Yup.date()
                .typeError('a valid check-in date')
                .required('a check-in date'),
              endDate: Yup.date()
                .typeError('a valid check-out date')
                .required('a check-out date')
            })
          )
      })
    : Yup.object().shape({
        location: Yup.string().required('location'),
        adultCount: Yup.number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required('number of adults')
          .moreThan(0, 'select at least 1 adult')
          .when('roomCount', (roomCount) =>
            Yup.number().min(
              roomCount,
              'ensure number of adults is not less than number of rooms'
            )
          ),
        roomCount: Yup.number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required('number of rooms')
          .moreThan(0, 'select at least 1 room'),

        dateRange: Yup.array()
          .required('a check-in date and an check-out date')
          .of(
            Yup.object().shape({
              startDate: Yup.date()
                .typeError('a valid check-in date')
                .required('a check-in date'),
              endDate: Yup.date()
                .typeError('a valid check-out date')
                .required('an check-out date')
                .test(
                  'startEndDate',
                  'ensure check-out date is at least 1 day from check-in date',
                  (value, { parent }) => {
                    const numDays = daysBetween(
                      new Date(parent.startDate as string),
                      value
                    );
                    return numDays >= 1;
                  }
                )
            })
          )
      });
