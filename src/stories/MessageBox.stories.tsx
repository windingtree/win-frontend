/* eslint-disable @typescript-eslint/no-empty-function */
import type { Meta, Story } from '@storybook/react';
import type { MessageBoxProps } from '../components/MessageBox';
import { MessageBox } from '../components/MessageBox';

export default {
  title: 'Components/MessageBox',
  component: MessageBox
} as Meta;

const Template: Story<MessageBoxProps> = (args) => <MessageBox {...args} />;

export const TypeErro = Template.bind({});
TypeErro.args = {
  type: 'error',
  show: true,
  children: 'Error message goes here',
  onClose: undefined
};

export const TypeWarning = Template.bind({});
TypeWarning.args = {
  type: 'warn',
  show: true,
  children: 'Warning message goes here',
  onClose: undefined
};

export const TypeInfo = Template.bind({});
TypeInfo.args = {
  type: 'info',
  show: true,
  children: 'Info message goes here',
  onClose: undefined
};

export const HasCloseButton = Template.bind({});
HasCloseButton.args = {
  type: 'info',
  show: true,
  children: 'Message you can close goes here',
  onClose: () => {}
};

export const LoadingMessage = Template.bind({});
LoadingMessage.args = {
  type: 'info',
  show: true,
  children: 'Message with lodader',
  loading: true,
  onClose: undefined
};
