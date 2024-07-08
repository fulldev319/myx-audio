import React from 'react';
import axios from 'axios';
import { Redirect, Route, Switch } from 'react-router-dom';

import * as LOADERS from './Loaders';
import { useLogin } from 'shared/hooks/useLogin';
import URL from 'shared/functions/getURL';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';

const Routes = () => {
  const isLogin = useLogin();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  const [isFree, setIsFree] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkFree = async () => {
      setIsChecking(true);
      axios
        .get(`${URL()}/maintenance/getAppFree/Myx`)
        .then((res) => {
          if (res.data.success) {
            setIsFree(res.data.data.status);
          }
        })
        .finally(() => {
          setIsChecking(false);
        });
    };

    checkFree();
  }, []);

  return (
    <LoadingWrapper loading={isChecking} height="100vh">
      <Switch>
        {!isFree && (
          <Route
            exact
            path="/connect"
            component={LOADERS.MusicDaoConnect}
          />
        )}
        {!isFree && (
          <Route path="/">
            {isLogin ? <LOADERS.MusicDao /> : <Redirect to="/connect" />}
          </Route>
        )}
        {isFree && <Route path="/" component={LOADERS.MusicDao} />}
      </Switch>
    </LoadingWrapper>
  );
};

export default Routes;
