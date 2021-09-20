import express from "express";

const kcConfig = { 
    "clientId": 'dashboards', 
    "bearerOnly": true,
    "public": true,
    "serverUrl": 'http://localhost/auth/',
    "realm": 'dashboards',
    "realmPublicKey": 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzAPeMSropPIkCictD8+W8YSxzX3LlRcCYiA1H+fgJ+C1BejKsL+D6VmZe8TAlSoSl/C1GDYtkKY15milscyd8s/U2+mCDy5QBDK6wK9zQYtna2saxbvwYsj/NA5ocNB+dGWlesoDjKrmp1c7qUNecgbjfEo3/V61apMn5PePSz9+d/6VfxQN+XXkr6RuztSAeSBsPK0HpmIy7pWZ7s/UTXAcQ7uTBCBuRsQZhHzwCf7VbbENBmXDizp0LfYVkTtlp7RPuC9+jdERhuJnvt1sJUdRl2Ev0OgYc82YnInvhmOqjbM8GZyjkbkWvTCTew7CNLAM5EHYUNMF7BP0r/kaqwIDAQAB'
};

export const getKeycloak = (api: express.Application) => {
    console.log("Initializing Keycloak...");
    let Keycloak = require('keycloak-connect'); 
    let session = require('express-session');
    let memoryStore = new session.MemoryStore();

    api.use(session({
        secret: 'mySecret',
        resave: false, 
        saveUninitialized: true,
        store: memoryStore
    }));           
    let keycloak = new Keycloak({ store: memoryStore }, kcConfig);
    api.use(keycloak.middleware());
    return keycloak;    
}
