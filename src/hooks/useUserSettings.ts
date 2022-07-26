import { useAppDispatch, useAppState } from '../store';
import { UserSettingsAction } from '../store/actions';
import { UserSettings } from '../store/types';

type AvailableSettings = keyof UserSettings;

const settingsUpdateActions: Record<AvailableSettings, UserSettingsAction['type']> = {
  preferredCurrencyCode: 'SET_PREFERRED_CURRENCY'
};

export const useUserSettings = () => {
  const { userSettings } = useAppState();
  const dispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setUserSetting = (setting: AvailableSettings, value: any) => {
    const type = settingsUpdateActions[setting];
    const action = {
      type,
      payload: value
    };

    dispatch(action);
  };

  return {
    ...userSettings,
    setUserSetting
  };
};
