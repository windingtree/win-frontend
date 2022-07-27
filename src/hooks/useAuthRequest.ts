import axios from 'axios';
import Logger from '../utils/logger';
import { useCallback, useState } from 'react';
import { useAppDispatch, useAppState } from '../store';
import { backend } from '../config';

const logger = Logger('useAuthRequest');

// Allow cookie
axios.defaults.withCredentials = true;

export type UseRequestHook = [send: () => void, response: any, loading: boolean, error?: string];

export enum Method {
  post = 'post',
  get = 'get'
}

export const requests = {
  refresh: {
    url: backend.url + '/api/user/refresh',
    method: Method.post
  },
  getAll: {
    url: backend.url + '/api/user/get-all',
    method: Method.get
  }
};

export const useAuthRequest = ({ url, method, data }: { url: string; method: Method; data?: any }): UseRequestHook => {
  const dispatch = useAppDispatch();
  const { authentication } = useAppState();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState();

  const send = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const res = await axios.request({
        headers: {
          Authorization: `Bearer ${authentication.token}`,
          'Content-Type': 'application/json'
        },
        url,
        method,
        data
      });
      if (res.status === 401) {
        try {
          const refresh = await axios.request({
            headers: {
              Authorization: `Bearer ${authentication.token}`,
              'Content-Type': 'application/json'
            },
            ...requests.refresh
          });

          dispatch({
            type: 'SET_AUTHENTICATION_TOKEN',
            payload: {
              token: refresh.data.accessToken,
              timestamp: Math.round(Date.now() / 1000)
            }
          });
        } catch (error) {
          const message = (error as Error).message || 'Unknown useAuthRequest error';
          setError(message);
        }
      }
      //@todo handle res errors
      setLoading(false);
      setResponse(res.data);
    } catch (error) {
      logger.error(error);
      const message = (error as Error).message || 'Unknown useAuthRequest error';
      setError(message);
      setLoading(false);
    }
  }, [url, method, data, authentication, setError, setLoading, dispatch]);
  return [send, response, loading, error];
};
