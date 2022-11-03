import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export type AppHistory = {
  appHistory: string[];
  setAppHistory: Dispatch<SetStateAction<string[]>>;
  popHistory: () => void;
  goBack: () => void;
};

export const useAppHistory = (): AppHistory => {
  const [appHistory, setAppHistory] = useState<string[]>([]);

  // get current route and push to stack
  const { pathname, search } = useLocation();

  useEffect(() => {
    const fullPath = `${pathname}${search ? `${search}` : ''}`;
    setAppHistory((oldState) => [...oldState, fullPath]);
  }, [pathname, search]);

  const popHistory = useCallback(() => {
    setAppHistory((oldState) => oldState.slice(0, -1));
  }, []);

  const goBack = useCallback(() => {
    if (appHistory.length > 1) {
      window.location.replace(appHistory[appHistory.length - 2]);
    } else {
      window.location.replace('/');
    }
    popHistory();
  }, [appHistory, popHistory]);

  return {
    appHistory,
    setAppHistory,
    popHistory,
    goBack
  };
};
