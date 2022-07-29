import axios from 'axios';
import Logger from '../utils/logger';
import { useAppDispatch } from '../store';
import { useCallback, useState } from 'react';
import { backend } from '../config';

const logger = Logger('useGetAuth');
const path = '/api/user/login';

export type UseGetAuthHook = [
  load: (login: string, password: string) => void,
  loading: boolean,
  error?: string
];

export const useGetAuth = (): UseGetAuthHook => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const load = useCallback(
    async (login: string, password: string) => {
      setLoading(true);
      setError(undefined);

      try {
        const res = await axios.post(backend.url + path, {
          login,
          password
        });
        //@todo handle res errors

        dispatch({
          type: 'SET_AUTHENTICATION_TOKEN',
          payload: {
            token: res.data.accessToken,
            timestamp: Math.round(Date.now() / 1000)
          }
        });
        setLoading(false);
      } catch (error) {
        logger.error(error);
        const message = (error as Error).message || 'Unknown useGetAuth error';
        setError(message);
        setLoading(false);
      }
    },
    [setError, setLoading, dispatch]
  );
  return [load, loading, error];
};
