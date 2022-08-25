import type { PersonalInfo } from '../store/types';
import { Box, FormField, TextInput, DateInput, Form, Button } from 'grommet';
import { useNavigate } from 'react-router-dom';
import MainLayout from 'src/layouts/main';
import Logger from '../utils/logger';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { MessageBox } from '../components/MessageBox';
import { DateTime } from 'luxon';
import { useAppDispatch, useAppState } from '../store';
import { regexp } from '@windingtree/org.id-utils';
import { PersonalInfoRequest } from '../api/PersonalInfoRequest';

const logger = Logger('GuestInfo');
const defaultValue: PersonalInfo = {
  firstname: '',
  lastname: '',
  birthdate: null,
  email: '',
  phone: ''
};

export const GuestInfo = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { checkout } = useAppState();

  const [value, setValue] = useState<PersonalInfo>(defaultValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  const handleSubmit = useCallback(async () => {
    logger.info('submit user data', checkout);
    try {
      setError(undefined);
      setLoading(true);

      if (checkout === undefined) {
        throw Error('Priced offer undefined');
      }

      if (!checkout.offerId) {
        throw Error('Priced offer offerId not defined');
      }

      //todo improve typings
      const date = new Date(value.birthdate as unknown as string);
      const formattedDate = DateTime.fromObject({
        year: date.getFullYear(),
        month: date.getMonth() + 1, //js month starts from 0
        day: date.getDate(),
        hour: 0,
        minute: 0
      }).setZone('utc');
      value.birthdate = new Date(formattedDate.toISO());

      await axios.request(new PersonalInfoRequest(checkout.offerId, value));

      dispatch({
        type: 'SET_CHECKOUT',
        payload: {
          ...checkout,
          personalInfo: value
        }
      });

      logger.info('Guest info sent successfully');
      navigate('/checkout/' + checkout.offerId);
    } catch (error) {
      const message = (error as Error).message || 'Unknown useAuthRequest error';
      setLoading(false);
      setError(message);
    }
  }, [value, checkout]);

  return (
    <MainLayout
    //TODO: check with designer whether breadcrumbs are still needed.
    // breadcrumbs={[
    //   {
    //     label: 'Search',
    //     path: '/'
    //   },
    //   {
    //     label: 'Facility',
    //     path: '/facilities/' + checkout?.facilityId
    //   }
    // ]}
    >
      <Box align="center" overflow="hidden">
        <Box width="large" margin="small">
          <MessageBox loading type="info" show={loading}>
            Processsing...
          </MessageBox>
          <MessageBox type="error" show={!!error}>
            {error}
          </MessageBox>
          <Form
            onSubmit={() => handleSubmit()}
            onChange={(newValue) => setValue({ ...value, ...newValue })}
          >
            <FormField
              name="firstname"
              htmlFor="firstname"
              label="First Name"
              required
              validate={{
                regexp: /^[a-z ,.'-]+$/i,
                message: 'Only a-z, A-Z chars',
                status: 'error'
              }}
            >
              <TextInput id="firstname" name="firstname" />
            </FormField>
            <FormField
              name="lastname"
              htmlFor="lastname"
              label="Last Name"
              required
              validate={{
                regexp: /^[a-z ,.'-]+$/i,
                message: 'Only a-z, A-Z chars',
                status: 'error'
              }}
            >
              <TextInput id="lastname" name="lastname" />
            </FormField>
            <FormField
              name="birthdate"
              htmlFor="birthdate"
              label="Date of birth"
              required
              validate={{
                regexp: regexp.isoDate,
                message: 'Incorrect Date',
                status: 'error'
              }}
            >
              <DateInput
                calendarProps={{
                  bounds: ['01/01/1900', DateTime.now().toFormat('dd/mm/yyyy')]
                }}
                format="dd/mm/yyyy"
                name="birthdate"
                id="birthdate"
              />
            </FormField>
            <FormField
              required
              name="email"
              htmlFor="email"
              label="Email"
              validate={{
                regexp: regexp.email,
                message: 'Incorrect email',
                status: 'error'
              }}
            >
              <TextInput id="email" name="email" />
            </FormField>
            <FormField
              required
              name="phone"
              htmlFor="phone"
              label="Phone"
              validate={{
                regexp: regexp.phone,
                message: 'Incorrect phone number',
                status: 'error'
              }}
            >
              <TextInput id="phone" name="phone" />
            </FormField>
            <Button type="submit" label="Proceed checkout" />
          </Form>
        </Box>
      </Box>
    </MainLayout>
  );
};
