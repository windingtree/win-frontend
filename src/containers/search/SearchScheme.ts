import * as Yup from 'yup';

export const SearchSchema = Yup.object().shape({
  location: Yup.string().required('location'),
  adultCount: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('number of adults')
    .moreThan(0, 'select at least 1 adult'),
  roomCount: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('number of rooms')
    .moreThan(0, 'select at least 1 room'),
  dateRange: Yup.array()
    .required('a start date and an end date')
    .of(
      Yup.object().shape({
        startDate: Yup.date().typeError('a valid start date').required('a start date'),
        endDate: Yup.date().typeError('a valid end date').required('an end date')
      })
    )
});
