import { initHotJar } from '../utils/hotjar.js';
import { useAppDispatch, useAppState } from '../store';
import { useEffect } from 'react';

export enum Cookies {
  essential = 'essential',
  all = 'all'
}

export const useAllowedCookies = () => {
  const { allowedCookies } = useAppState();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (
      allowedCookies === Cookies.all &&
      process &&
      process.env &&
      typeof process.env.REACT_APP_HOTJAR_ID === 'string' &&
      process.env.REACT_APP_HOTJAR_ID.length
    ) {
      const hjid = Number.parseInt(process.env.REACT_APP_HOTJAR_ID, 10);

      if (!Number.isNaN(hjid)) {
        // eslint-disable-next-line no-console
        console.log(`HotJar ID = '${hjid}'`);

        try {
          initHotJar(hjid);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Error while initializing HotJar code.');
        }
      }
    }
  }, [allowedCookies]);

  const setAllowedCookies = (cookies: Cookies) => {
    dispatch({
      type: 'SET_ALLOWED_COOKIES',
      payload: cookies
    });
  };

  return { allowedCookies, setAllowedCookies };
};
