import * as Yup from 'yup';

export const SearchSchema = Yup.object().shape({
  location: Yup.string().required('Location is required'),
  adultCount: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Minimum is 1')
    .moreThan(0, 'Minimum is 1'),
  roomCount: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Minimum is 1')
    .moreThan(0, 'Minimum is 1'),
  dateRange: Yup.array()
    .of(
      Yup.object().shape({
        startDate: Yup.date().required('Pick a start date'),
        endDate: Yup.date().required('Pick a end date')
      })
    )
    .required('Should have a beginning and end date')
});
