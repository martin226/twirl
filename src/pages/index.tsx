import React, { useState } from 'react';
import Main from '../components/Main';

import { Auth0Provider } from '@auth0/auth0-react';

const HomePage: React.FC = () => {
    
    return (
        <Auth0Provider
        domain = "dev-kkj7pllhkysaa0fp.us.auth0.com"
        clientId = "P9Rf10cP0gxyBuvJ1rdfPcJ35aQcArEx"
        authorizationParams={{ redirect_uri: window.location.origin }}
        >
            <Main />
        </Auth0Provider>
    );
};

export default HomePage;