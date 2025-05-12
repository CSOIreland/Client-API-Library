/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */

api.sso.msalConfig = function (pClientId, pAuthority, pRedirectUri) {
    return {
        auth: {
            clientId: pClientId, // This is the ONLY mandatory field that you need to supply.
            authority: pAuthority,//////'https://c2c05d52-cfdf-45bf-bc6d-dd64f9a5ad8.ciamlogin.com/', // Replace the placeholder with your tenant subdomain
            redirectUri: pRedirectUri, // You must register this URI on Microsoft Entra admin center/App Registration. Defaults to window.location.href e.g. http://localhost:3000/
            navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
        },//'https://login.microsoftonline.com/2be945b2-703e-45c4-bb9b-d456cffaf4a8',//////
        cache: {
            cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
            storeAuthStateInCookie: false, // set this to true if you have to support IE
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    if (containsPii) {
                        return;
                    }
                    switch (level) {
                        case msal.LogLevel.Error:
                            // console.error(message);
                            return;
                        case msal.LogLevel.Info:
                            //  console.info(message);
                            return;
                        case msal.LogLevel.Verbose:
                            //  console.debug(message);
                            return;
                        case msal.LogLevel.Warning:
                            //  console.warn(message);
                            return;
                    }
                },
            },
        },
    }
};