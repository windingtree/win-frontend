import { yupResolver } from '@hookform/resolvers/yup';
import { parseISO } from 'date-fns';
import { ReactNode, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';
import { FormProvider } from 'src/components/hook-form';
import { DISABLE_FEATURES, GROUP_MODE_ROOM_COUNT } from 'src/config';
import { useAccommodation } from 'src/hooks/useAccommodation';
import { convertToLocalTime, daysBetween } from 'src/utils/date';
import * as Yup from 'yup';

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
          .required('a check-in date'),
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

type FormValuesProps = {
  roomCount: number | string;
  adultCount: number | string;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
    key: string;
  }[];
};

export type Props = {
  children: ReactNode;
};
export const FacilitySearchFormProvider = ({ children }: Props) => {
  const { id } = useParams();
  if (!id) return null;

  const [searchParams] = useSearchParams();
  const defaultValues: FormValuesProps = useMemo(() => {
    const startDateParams = searchParams.get('startDate');
    const endDateParams = searchParams.get('endDate');

    return {
      adultCount: Number(searchParams.get('adultCount')) || 2,
      roomCount: Number(searchParams.get('roomCount')) || 1,
      dateRange: [
        {
          startDate: startDateParams ? parseISO(startDateParams) : null,
          endDate: endDateParams ? parseISO(endDateParams) : null,
          key: 'selection'
        }
      ]
    };
  }, [searchParams]);

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(SearchSchema),
    defaultValues
  });
  const { watch } = methods;
  const values = watch();

  const { roomCount, adultCount, dateRange } = values;
  const startDate = dateRange[0].startDate && convertToLocalTime(dateRange[0].startDate);
  const endDate = dateRange[0].endDate && convertToLocalTime(dateRange[0].endDate);

  const searchProps = {
    arrival: startDate,
    departure: endDate,
    adultCount: Number(adultCount),
    roomCount: Number(roomCount)
  };

  const { accommodationQuery, offersQuery } = useAccommodation({ id, searchProps });
  const { refetch } = offersQuery;

  console.log(accommodationQuery.data);

  return (
    <FormProvider methods={methods} onSubmit={() => refetch()}>
      {children}
    </FormProvider>
  );
};
