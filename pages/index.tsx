import { App } from '~/components';
import { useIsServer } from '~/hooks';

export default function Index() {
  const isServer = useIsServer();
  return isServer ? null : <App />;
}
