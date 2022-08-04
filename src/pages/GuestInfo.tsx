import { Box, FormField, TextInput, DateInput, Form, Button } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from './PageWrapper';
import Logger from '../utils/logger';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { MessageBox } from 'src/components/MessageBox';
import { DateTime } from 'luxon';
import { useAppDispatch, useAppState } from '../store';
import { PersonalInfo } from 'src/store/types';
import { backend } from '../config';

// const offerId = 1;
const logger = Logger('GuestInfo');
const defaultValue = {
  firstname: '',
  lastname: '',
  birthday: new Date(),
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
    try {
      setError(undefined);
      setLoading(true);
      if (
        value.firstname === '' ||
        value.lastname === '' ||
        value.email === '' ||
        value.phone === ''
      ) {
        throw Error('Empty fields');
      }
      if (checkout === undefined) {
        throw Error('Something went wrong');
      }

      await axios.post(
        backend.url + '/offers/' + checkout.pricedOffer.offerId + '/pii',
        value
      );
      dispatch({
        type: 'SET_CHECKOUT',
        payload: {
          ...checkout,
          personalInfo: value
        }
      });

      logger.info('Guest info sent successfully');
      navigate('/checkout/' + checkout.pricedOffer.offerId);
    } catch (error) {
      const message = (error as Error).message || 'Unknown useAuthRequest error';
      setLoading(false);
      setError(message);
    }
  }, [value]);

  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Search',
          path: '/'
        },
        {
          label: 'Facility',
          path: '/facilities/' + checkout?.facilityId
        }
      ]}
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
              validate={{
                regexp: /^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/g,
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
              validate={{
                regexp: /^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/g,
                message: 'Only a-z, A-Z chars',
                status: 'error'
              }}
            >
              <TextInput id="lastname" name="lastname" />
            </FormField>
            <FormField name="birthday" htmlFor="birthday" label="Date of birth">
              <DateInput
                calendarProps={{
                  bounds: ['01/01/1900', DateTime.now().toFormat('dd/mm/yyyy')]
                }}
                format="dd/mm/yyyy"
                name="birthday"
                id="birthday"
              />
            </FormField>
            <FormField
              name="email"
              htmlFor="email"
              label="Email"
              validate={{
                regexp: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g,
                message: 'Incorrect email',
                status: 'error'
              }}
            >
              <TextInput id="email" name="email" />
            </FormField>
            <FormField
              name="phone"
              htmlFor="phone"
              label="Phone"
              validate={{
                regexp:
                  /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/g,
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
    </PageWrapper>
  );
};
