import * as Yup from 'yup';

export const SearchSchema = Yup.object().shape({
  location: Yup.string().required('Location is required'),
  adultCount: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Should be more then 0')
    .moreThan(0, 'Should be more then 0'),
  roomCount: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Should be more then 0')
    .moreThan(0, 'Should be more then 0'),
  dateRange: Yup.array()
    .of(
      Yup.object().shape({
        startDate: Yup.date().required('Pick a start date'),
        endDate: Yup.date().required('Pick a end date')
      })
    )
    .required('Should have a beginning and end date')
});
