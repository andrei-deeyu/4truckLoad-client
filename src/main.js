import Vue from "vue";
import VueMeta from 'vue-meta'
import App from "./App.vue";
import router from './router'

// Import the Auth0 configuration
import { domain, clientId } from "../auth_config.json";

// Import the Auth0 plugin here
import { Auth0Plugin } from "./auth";


// Import the Firebase SDK
import firebase from "firebase/app";
import "firebase/analytics";


// Import the Bootstrap-Vue plugin
import BootstrapVue from 'bootstrap-vue';

// Import the Bootstrap-Vue icons here
import {
  BIcon,
  BIconPersonFill,
  BIconGeoAltFill,

  BIconCheckCircleFill,
  BIconCheck2,
  BIconXCircleFill,

  BIconCardList,
  BIconFileTextFill,
  BIconPeople,
  BIconHandIndexThumb,
  BIconTruck,
  BIconEnvelopeFill,
  BIconDiamond
} from 'bootstrap-vue';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


// Import the custom CSS styling
import './styling/style.css';


// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
Vue.component('BIcon', BIcon)
Vue.component('BIconPersonFill', BIconPersonFill)
Vue.component('BIconGeoAltFill', BIconGeoAltFill)
Vue.component('BIconCheckCircleFill', BIconCheckCircleFill);
Vue.component('BIconCardList', BIconCardList)
Vue.component('BIconFileTextFill', BIconFileTextFill)
Vue.component('BIconPeople', BIconPeople)
Vue.component('BIconHandIndexThumb', BIconHandIndexThumb)
Vue.component('BIconTruck', BIconTruck)
Vue.component('BIconEnvelopeFill', BIconEnvelopeFill)
Vue.component('BIconDiamond', BIconDiamond)
Vue.component('BIconCheck2', BIconCheck2)
Vue.component('BIconXCircleFill', BIconXCircleFill)


// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

Vue.config.productionTip = false;


// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// The apiKey in this configuration snippet just identifies the Firebase project on the Google servers.
// It is not a security risk for someone to know it.
const firebaseConfig = {
  apiKey: "AIzaSyDifmlk83Uowh3IPVswLYENKMnSNMHt9UA",
  authDomain: "cargovide.firebaseapp.com",
  projectId: "cargovide",
  storageBucket: "cargovide.appspot.com",
  messagingSenderId: "1081383028110",
  appId: "1:1081383028110:web:a5de4b367dc3b81bfa10df",
  measurementId: "G-577STE9JX3",
  cookie_flags: 'SameSite=None;Secure'
};


// Install Vue Meta
Vue.use(VueMeta);

new Vue({
  router,
  render: h => h(App),
  created() {
    firebase.initializeApp(firebaseConfig);

    // Make analytics accessible to all instances
    // it will be used to trigger events (such as "Signup", "CTA", etc..)
    Vue.prototype.$analytics = firebase.analytics();
  },
}).$mount("#app");