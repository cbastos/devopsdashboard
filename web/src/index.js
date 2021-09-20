import React from 'react';
import { render } from 'react-dom';
import SoftwareProductionSystem from './SoftwareProductionSystem';
import keycloak from './Auth/keycloak';
import { keycloakInitConfig } from './Auth/AuthProvider';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Tutorial from './Tutorial';
import { SnackbarProvider } from 'notistack';

render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={keycloakInitConfig}>
    <SnackbarProvider>
      <SoftwareProductionSystem />
      <Tutorial />
    </SnackbarProvider>
  </ReactKeycloakProvider>
  , document.getElementById('root'));
