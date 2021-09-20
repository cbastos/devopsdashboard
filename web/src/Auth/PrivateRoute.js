import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../Auth/AuthProvider';

export default function PrivateRoute({
  component: Component,
  roles,
  ...rest
}) {
  const auth = useAuth();
  if (!auth.initialized){
    return "";
  } 
  const isAuthorized = (roles) => {
    if (auth.instance) {
      if (roles){
        return roles.some(r => {
          const realm =  auth.instance.hasRealmRole(r);
          const resource = auth.instance.hasResourceRole(r);
          return realm || resource;
        });
      }
      return true;
    }
    return false;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        auth.isAuthenticated ? (
          isAuthorized(roles) ? (
            <Component {...props} />
          ):(
            <Redirect
              to={{
                pathname: 'error',
                error: '403',
                state: { from: props.location },
              }}
            />
          )
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}