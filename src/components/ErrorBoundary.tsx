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

type ErrorBoundaryState = {
  error: Error | null;
};

type RoutedErrorBoundaryProps = RouterProps & {
  message?: string;
  children?: ReactNode;
  appHistory?: AppHistory;
};

type GlobalErrorBoundaryProps = {
  children?: ReactNode;
};

type OmitRouter<T> = Omit<T, keyof RouterProps>;

function withRouter(
  Component: ComponentType<OmitRouter<RoutedErrorBoundaryProps> & RouterProps>
) {
  return (props: OmitRouter<RoutedErrorBoundaryProps>) => {
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

abstract class ErrorBoundaryComponent<
  T extends PropsWithRef<PropsWithChildren>
> extends Component<T, ErrorBoundaryState> {
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
}

class RoutedErrorBoundaryComponent extends ErrorBoundaryComponent<RoutedErrorBoundaryProps> {
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

export class GlobalErrorBoundary extends ErrorBoundaryComponent<GlobalErrorBoundaryProps> {
  refresh() {
    window.location.replace('/');
  }

  render() {
    if (this.state.error) {
      <Stack justifyContent={'center'} alignItems={'center'} height={'60vh'}>
        <Typography variant={'h4'} mb={3}>
          A fatal error has occurred.
        </Typography>
        <Typography variant={'body1'}>{this.state.error.toString()}</Typography>
        <Button onClick={() => this.refresh()}>Reload</Button>
      </Stack>;
    }

    return this.props.children;
  }
}

export const RoutedErrorBoundary = withRouter(RoutedErrorBoundaryComponent);
