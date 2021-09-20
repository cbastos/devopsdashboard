import { Redirect } from "react-router-dom";
import { useAuth } from './AuthProvider';

export default function Login() {
  let currentLocationState = {
    from: { pathname: '/home' },
  }

  let auth = useAuth();
  
  if (auth?.isAuthenticated)
    return <Redirect to={currentLocationState?.from} />;
  else return "";
}