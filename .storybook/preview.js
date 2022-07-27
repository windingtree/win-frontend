import { Grommet, grommet } from 'grommet';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};

export const decorators = [
  (Story) => {
    return (
      <>
        <Grommet theme={grommet}>
          <Story />
        </Grommet>
      </>
    );
  }
];
