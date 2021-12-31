import Vue from "vue";
import createAuth0Client from "@auth0/auth0-spa-js";

import 'node-fetch';

const HOST_URL = 'https://4truckload.com'

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

let instance;

/** Returns the current instance of the SDK */
export const getInstance = () => instance;

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = ({
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  redirectUri = window.location.origin,
  ...options
}) => {
  if (instance) return instance;

  // The 'instance' is simply a Vue object
  instance = new Vue({
    data() {
      return {
        alertMessage: '',
        errorMessage: '',

        loading: true,
        isAuthenticated: false,

        user: {},
        auth0Client: null,
        popupOpen: false,
        error: null,

        email: '',
        email_unverified: window.localStorage.getItem('email_unverified'), // boolean
        verificationEmailResent: false,
        loading_email_verification: false,// for DOM button:disabled
        refreshTokenHasBeenCalled: false
      };
    },
    methods: {
      /** Authenticates the user using a popup window */
      async loginWithPopup(options, config) {
        this.popupOpen = true;

        try {
          await this.auth0Client.loginWithPopup(options, config);
          this.user = await this.auth0Client.getUser();
          this.isAuthenticated = await this.auth0Client.isAuthenticated();
          this.error = null;
        } catch (e) {
          this.error = e;
          this.errorMessage = 'Something happened! Try again.'
          setTimeout(() => { this.errorMessage = '' }, 3000);
          // eslint-disable-next-line
          console.error(e);
        } finally {
          this.popupOpen = false;
        }

        this.user = await this.auth0Client.getUser();
        console.log(this.user);
        this.isAuthenticated = true;
      },

      /** Handles the callback when logging in using a redirect */
      async handleRedirectCallback() {
        this.loading = true;
        try {
          await this.auth0Client.handleRedirectCallback();
          this.user = await this.auth0Client.getUser();

          this.isAuthenticated = true;
          this.error = null;
        } catch (e) {
          this.error = e;
          this.errorMessage = 'Something happened! Try again.'
          setTimeout(() => { this.errorMessage = '' }, 3000);
        } finally {
          this.loading = false;
          window.localStorage.setItem("firstTimeLogin", false);
        }
      },

      /** Authenticates the user using the redirect method */
      loginWithRedirect(o) {
        return this.auth0Client.loginWithRedirect(o)
      },

      /** Returns all the claims present in the ID token */
      getIdTokenClaims(o) {
        return this.auth0Client.getIdTokenClaims(o);
      },

      /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
      getTokenSilently(o) {
        return this.auth0Client.getTokenSilently({...o, audience: 'https://dev-h1e424j0.us.auth0.com/api/v2/'});
      },

      /** Gets the access token using a popup window */
      getTokenWithPopup(o) {
        return this.auth0Client.getTokenWithPopup({...o, audience: 'https://dev-h1e424j0.us.auth0.com/api/v2/'});
      },

      /** Calls server to request the Auth0 API for resending the verification email.
          * It must be made on the server-side because it needs the Management API */
      async resendVerificationEmail(decoded_user_id, user_id) {
        this.loading_email_verification = true // front end "rate limiting"

        // Decode user_id
        decoded_user_id = window.localStorage.getItem('user_id_tried').split('%7C')[1];
        user_id = 'auth0|' +  decoded_user_id

        await fetch('https://truckloadserver.herokuapp.com/auth/verification-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "user_id": user_id })
        })
        .then(( res ) => res.json())
        .then(( response ) => {
          window.localStorage.removeItem('email_unverified');
          this.email_unverified = false;
          this.loading_email_verification = false;

          if(response.status == "pending") return this.verificationEmailResent = true;
        });
    },

      /** Logs the user out and removes their session on the authorization server */
      logout(o) {
        window.localStorage.setItem("firstTimeLogin", false);
        return this.auth0Client.logout(o);
      },

      /** Return a promise with a resolve timeout of 3 seconds */
      delay() {
        return new Promise(resolve => setTimeout(() => {
          resolve();
        }, 3000));
      },

      /** Request the server to check if the subscription is different */
      async refreshToken(i, result) {
        this.refreshTokenHasBeenCalled = true;

        /*
          TLDR: request the server, receiving back a boolean.
                if it's true, re-login
          ____________________________
          if i > 0, request the server
            if it responses with a token, set i=0 && relogin.
            else, decrease i by 1 && request the server again
        */

        i = window.localStorage.getItem('refreshToken');
        this.getIdTokenClaims().then(async ( token ) => {
          while (i > 0) {
            if(i < 5) await this.delay() // if server's webhook is not triggered instant by Stripe

            await fetch('https://truckloadserver.herokuapp.com/auth/planchanged', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token.__raw,
              },
            })
            .then(( res ) => res.json())
            .then((response) => {
              // access { response } outside the scope.
              result = response;
            })

            if( result.refresh_the_Token == false) {
              window.localStorage.setItem('refreshToken', 0);
              return this.refreshTokenHasBeenCalled = false;
            }
            else if (result.refresh_the_Token == true) {
              // refreshToken() is triggered when the subscription plan has been changed
              // so we trigger the event to Google Analytics
              this.$analytics.logEvent('bought', {
                'email': this.user.email,
                'planName': result.planName
              });
              return this.auth0Client.loginWithRedirect({ prompt: 'none', redirect_uri: `${HOST_URL}/company` });
            }

            i--
            window.localStorage.setItem('refreshToken', i);
          }
        });
      }
    },

    /** Use this lifecycle method to instantiate the SDK client */
    async created() {
      // Create a new instance of the SDK client using members of the given options object
      this.auth0Client = await createAuth0Client({
        ...options,
        client_id: options.clientId,
        redirect_uri: redirectUri,
        cacheLocation: 'localstorage',
      });

      try {
        /*

          Surpass Auth0 limitations: clear the authentication inputs after login attempt

          I - If email is not verified, redirect back happens => store in localStorage the alert, value: 2
          II - The user => automatically logged out, to let him to replace the login credentials
          III - While logging out, the page auto refreshes => decrease the alert, value: 1.
          IV* - If user manually refreshes the page => delete the alert by setting it's value to 0.

        */
        let oldValue = window.localStorage.getItem('email_unverified');
        let newValue = oldValue-1;

        // we are in the created() hook, so everytime the SDK client is instantiated:
        window.localStorage.setItem('email_unverified', newValue);

        if(newValue <= 0) window.localStorage.removeItem('email_unverified');
        this.email_unverified = window.localStorage.getItem('email_unverified');


        // If the user is returning to the app after authentication..
        if (
          window.location.search.includes("code=") &&
          window.location.search.includes("state=")
        ) {
          // handle the redirect and retrieve tokens
          const { appState } = await this.auth0Client.handleRedirectCallback();
          this.error = null;

          // Notify subscribers that the redirect callback has happened, passing the appState
          // (useful for retrieving any pre-authentication state)
          onRedirectCallback(appState);
        }

        if(
          window.location.search.includes('email_unverified')
        ) {
          // deconstruct the redirect's URL to access data later (example: resend_email_verification, etc..)
          let email_tried = window.location.search.split('.email-')[1].split('.user_id')[0];
          let user_id_tried = window.location.search.split('.user_id-')[1].split('&state=')[0];

          window.localStorage.setItem('email_tried', email_tried);
          window.localStorage.setItem('user_id_tried', user_id_tried);

          window.localStorage.setItem('email_unverified', 2);
          this.auth0Client.logout();
        }

      } catch (e) {
        this.error = e;
        this.errorMessage = 'Something happened! Try again.'
        setTimeout(() => { this.errorMessage = '' }, 3000);
      } finally {
        // Initialize our internal authentication state
        this.isAuthenticated = await this.auth0Client.isAuthenticated();
        this.user = await this.auth0Client.getUser();
        console.log(this.user);

        if(this.user) {
          this.email_unverified = false;
          window.localStorage.removeItem('email_unverified')
        }

        if(window.location.pathname.includes('login_required')) {
          this.logout({ redirect_uri: `${HOST_URL}/login`});
        }

        // if plan changed, refresh token
        if(window.location.pathname.includes('planchanged')) {
          if( this.user ) { /* Check that the SDK client is not currently loading before accessing is methods */
            window.localStorage.setItem('refreshToken', 5)
            this.refreshToken();
          }
        }
        this.loading = false;
      }
    },
  });

  return instance;
};

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin = {
  install(Vue, options) {
    Vue.prototype.$auth = useAuth0(options);
  }
};