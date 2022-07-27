import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu as MenuWrap } from 'grommet';
import { Menu as MenuIcon } from 'grommet-icons';
import { useAppState } from '../store';
import { pagesRoutesConfig, Routes } from '../Routes';

export const Menu = () => {
  const { isConnecting } = useAppState();
  const navigate = useNavigate();
  const buildMenuConfig = useMemo(
    () =>
      pagesRoutesConfig.reduce<Routes>(
        (a, v) => [
          ...a,
          ...(v.label // Items without labels are ignored
            ? [
                {
                  ...v,
                  onClick: () => navigate(v.path)
                }
              ]
            : [])
        ],
        []
      ),
    [navigate]
  );

  return (
    <MenuWrap
      dropBackground={{ color: 'black', opacity: 0.9 }}
      dropAlign={{
        top: 'bottom',
        left: 'left'
      }}
      disabled={isConnecting}
      icon={<MenuIcon color="black" />}
      items={buildMenuConfig}
    />
  );
};
