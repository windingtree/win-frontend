import { ReactElement } from 'react';

export type MenuItemProps = {
  title: string;
  path: string;
  icon?: ReactElement;
  to?: string;
};

export type MenuProps = {
  isOffset: boolean;
  navConfig: MenuItemProps[];
};
