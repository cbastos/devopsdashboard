import React from 'react';
import { Route } from 'react-router-dom';
import Interview from './Interview/Interview';
import Configurator from './Configurator/Configurator';

export default () => (
	<React.Fragment>
		<Route path="/people/interview/:encryptedProfile" component={Interview} />
		<Route path="/people/config" component={Configurator} />
	</React.Fragment>
);