import { useCallback, useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web'

export const keycloakInitConfig = {
  onLoad: 'login-required'
};

export const useAuth = () => {
  const [user, setUser] = useState({});
  const { keycloak, initialized } = useKeycloak();

  keycloak.onAuthRefreshSuccess = () => {window.accessToken = keycloak.token};  

  useEffect(() => {
    if (!initialized) {
      return;
    }
    const fetchUserInfo = async () => {      
      const userProfile = await keycloak.loadUserProfile();
      setUser({ ...userProfile, fullName: `${userProfile.firstName} ${userProfile.lastName}` });      
    };
    window.accessToken = keycloak.token;

    if (keycloak.authenticated) {
      fetchUserInfo();
    }
  }, []);

  return {
    isAuthenticated: !!keycloak.authenticated,    
    initialized,
    instance: keycloak,
    token: keycloak.token,
    user,
    roles: keycloak.realmAccess,
    login: useCallback((data) => { keycloak.login(data); }, [keycloak]),
    logout: useCallback((data) => { keycloak.logout(data); }, [keycloak])
  };
};

export function AuthorizedFunction(roles) {
  const { keycloak } = useKeycloak();

  const isAuthorized = (roles) => {      
      if (keycloak.authenticated) {     
        if (roles){
          return roles.some(r => {
            const realm =  keycloak.hasRealmRole(r);
            const resource = keycloak.hasResourceRole(r);
            return realm || resource;
          });
        }
        return true;
      }
      return false;
  }
  return isAuthorized(roles);
}

export function AuthorizedElement({ roles, children }) {
  return AuthorizedFunction(roles) && children;
}

export default {
  useAuth,
};