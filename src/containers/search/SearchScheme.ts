import * as Yup from 'yup';
//TODO: update this when group booking should be enabled
export const SearchSchema =
  process.env.REACT_APP_DISABLE_FEATURES === 'true'
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
          .lessThan(10, 'Maximum is 9'),

        dateRange: Yup.array()
          .required('a start date and an end date')
          .of(
            Yup.object().shape({
              startDate: Yup.date()
                .typeError('a valid start date')
                .required('a start date'),
              endDate: Yup.date().typeError('a valid end date').required('an end date')
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
          .required('a start date and an end date')
          .of(
            Yup.object().shape({
              startDate: Yup.date()
                .typeError('a valid start date')
                .required('a start date'),
              endDate: Yup.date().typeError('a valid end date').required('an end date')
            })
          )
      });
