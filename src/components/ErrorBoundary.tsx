import { Button, Stack, Typography } from '@mui/material';
import {
  Component,
  ComponentType,
  PropsWithChildren,
  PropsWithRef,
  ReactNode
} from 'react';
import {
  //NavigateProps,
  NavigateFunction,
  Params,
  useLocation,
  useNavigate,
  useParams,
  Location
} from 'react-router';
import { AppHistory, useAppHistory } from '../hooks/useAppHistory';

interface RouterProps {
  navigate: NavigateFunction;
  readonly params: Params<string>;
  location: Location;
}

type WithRouterProps<T> = T & RouterProps;
type OmitRouter<T> = Omit<T, keyof RouterProps>;

function withRouter<T>(Component: ComponentType<OmitRouter<T> & RouterProps>) {
  return (props: OmitRouter<T>) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const appHistory = useAppHistory();
    return (
      <Component
        location={location}
        navigate={navigate}
        params={params}
        appHistory={appHistory}
        {...props}
      />
    );
  };
}

type ErrorBoundaryState = {
  error: Error | null;
};

type ErrorBoundaryProps = {
  message?: string;
  children?: ReactNode;
  appHistory?: AppHistory;
};

class ErrorBoundaryComponent extends Component<
  WithRouterProps<PropsWithRef<PropsWithChildren<ErrorBoundaryProps>>>,
  ErrorBoundaryState
> {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error
    });
    // You can also log error messages to an error reporting service here
  }

  handleBackClick = () => {
    this.props.appHistory?.goBack();
  };

  render() {
    if (this.state.error) {
      // Error path
      return (
        <Stack justifyContent={'center'} alignItems={'center'} height={'60vh'}>
          <Typography variant={'h4'} mb={3}>
            A fatal error has occurred.
          </Typography>
          <Typography variant={'body1'}>{this.state.error.toString()}</Typography>
          <Button onClick={() => this.handleBackClick()}>Go back</Button>
        </Stack>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export const ErrorBoundary = withRouter<ErrorBoundaryProps>(ErrorBoundaryComponent);
