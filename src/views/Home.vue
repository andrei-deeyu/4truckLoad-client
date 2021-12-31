<template>
<div>
  <!-- Errors & Alerts -->
  <b-alert v-if="alertMessage" class="b-alert" show variant="warning" dismissible>{{ alertMessage }}</b-alert>
  <b-alert v-if="errorMessage" class="b-alert" show variant="danger" dismissible>{{ errorMessage }}</b-alert>

  <!-- Header -->
  <b-container class="headline">
    <!-- Headline text -->
    <div>
      <div class="headlineData">
        <h1 class="headline1">Freight exchange</h1>
      </div>
      <h2 class="leftMargin">Find transporter, ship the goods</h2>
      <div class="begin">
        <b-button v-if="!$auth.loading && !$auth.isAuthenticated" @click="signup('1')" variant="primary" class="CTA">dispatch freights</b-button>
        <span v-if="!$auth.loading && !$auth.isAuthenticated" @click="signup('2')" class="transportator">carry <span>&#10095;</span></span>
      </div>
    </div>


    <!-- Email Verification -->
    <b-alert v-if="$auth.email_unverified" class="b-alert emailUnverified" show variant="success" dismissible>
      <p>Click the link sent to {{ emailSentTo }}.</p>
      or<button
          @click="$auth.resendVerificationEmail()"
          class="resendVerificationEmail"
          :disabled="$auth.loading_email_verification">resend verification email.
        </button>
      <span v-if="$auth.email_unverified">Check the spam file firstly.</span>
    </b-alert>
    <b-alert v-if="$auth.verificationEmailResent" class="b-alert successAlert" show variant="success" dismissible>Verification email resent. Check spam also</b-alert>


    <!-- Image to intrigue -->
    <div class="headlineImage">
      <div class="offers">
        <div class="data">
            <span class="companyName">Transport LLC</span>
            <div class="theOffer">
                <span class="cost">500 EUR</span>
              - <span class="distance">400km</span>
            </div>
        </div>
        <div class="fromUser">
            <b-icon-person-fill></b-icon-person-fill> <span class="name">David</span>
        </div>
      </div>

      <p class="newOffer">New offer!</p>
    </div>
  </b-container>

  <!-- Dashboard examples -->
  <div v-if="!emailUnverified" class="home">
    <b-container class="borderContainer">
      <p class="headline2 headline2BottomMargin">3 examples from the freight exchange:</p>
    </b-container>

    <b-container
      fluid="md"
      id="freights"
      v-for="(freight, index) in freights"
      :key="freight._id"
      :class="index == freights.length -1 ? 'lastHASHTAGFreights' : ''">
      <div id="freight">
        <!-- Link wrapper (go to auth)-->
        <div class="clickToRoute" @click="$router.push('/marfa/' + freight._id)">
          <!-- createdAt -->
          <p class="createdAt">{{ new Date(Date.now() - 43200000 - (Math.random() * 900000)).toLocaleString() }}</p>

          <!-- Location-Destination -->
          <p class="locationDestination"><b-icon-geo-alt-fill></b-icon-geo-alt-fill> {{ freight.location | truncate(35) }}</p>
          <p class="locationDestination"><b-icon-geo-alt-fill></b-icon-geo-alt-fill> {{ freight.destination | truncate(35) }}</p>

          <!-- Text description -->
          <span v-if="freight.details" class="details"> {{ freight.details }}</span>

          <div class="info">
            <!-- Distance -->
            <span v-if="freight.distance" class="distance"> {{ freight.distance }} </span>

            <!-- Regime -->
            <span v-for="regime in freight.regime" :key="regime">{{ regime !== 'ANY' ? regime : '' }} </span>
              <span v-for="(value, key) in freight.pallet" :key="key"> {{ value }}x  {{ key !== 'other' ? key : 'other pallet type' }} </span>
              - {{ freight.tonnage }} {{ freight.tonnage == 1 ? "ton" : "tons" }}
            </div>

          <!-- Expeditor contact -->
          <div class="contact">
            <b-icon-person-fill></b-icon-person-fill> <span v-if="freight.fromUser">{{ freight.fromUser.name }}</span>
            <span v-if="freight.fromUser"> - {{ freight.fromUser.email }}</span>
            <br v-if="freight.fromUser">
          </div>
        </div> <!-- end Link wrapper -->
      </div> <!-- end #freight -->

    </b-container>
  </div>

  <!-- Benefits -->
  <b-container fluid class="benefits mx-auto">
    <b-container class="borderContainer">
      <p class="sectionTitle">performance</p>
      <p class="headline2 lightText">Don't pay uselessly</p>
      <p>Deposit the desired amount into your account and pay only when you publish freight / contact the customer.</p>
      <div class="CTAContainer">
        <b-button v-if="!$auth.loading && !$auth.isAuthenticated" @click="signup('3')" variant="primary" class="CTA">dispatch freights</b-button>
        <b-button v-if="!$auth.loading && !$auth.isAuthenticated" @click="signup('4')" variant="outline-light" class="CTA">carry</b-button>
      </div>
    </b-container>
  </b-container>


  <!-- Steps -->
  <b-container fluid class="benefits mx-auto stepsDiv">
    <b-container fluid="sm">
      <p class="headline2 steps">Get started now</p>

      <div class="step">
        <span class="stepHeadline"><b-icon-person-fill></b-icon-person-fill> User signup</span>
        Insert your contact information, verify your email and log in.
      </div>

      <div class="step">
        <span class="stepHeadline"><b-icon-file-text-fill></b-icon-file-text-fill> Company page</span>
        Complete the identification data and pay the subscription according to the main activity: transporter / forwarder.
      </div>

      <div class="step">
        <span class="stepHeadline"><b-icon-check-circle-fill></b-icon-check-circle-fill> Full access</span>
        <span>Done! <span class="fastSignup" @click="signup('5')">Start using the platform.</span></span>
      </div>
    </b-container>
  </b-container>

</div>
</template>

<script>
const HOST = 'https://truckloadserver.herokuapp.com';

const brandName = '4truckLoad';
const metaDesc = 'Find transporter, ship the goods. Get started now!';
const email = 'contact@4truckload.com'

export default {
  name: "Home",

  metaInfo: {
    title: 'Freight Exchange',
    titleTemplate: `${ brandName } | %s `,
    meta: [
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: metaDesc },
      { name: 'google-site-verification', content: 'M_dQWrdYrAeDAbWcBkvb_ya2r60zd3Ep_BxaKj5Vfjs' },
    ]
  },

  filters: {
    truncate: function (text, stop, clamp) {
      return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
    }
  },

  data: () => ({
    brandName: brandName,
    metaDesc: metaDesc,
    contactEmail: email,

    alertMessage: '',
    errorMessage: '',

    currentPage: 1,
    perPage: 4,
    rows: 3,
    freights: [],
    remainingDays: null,
    remainingHours: null,
    remainingMinutes: null,
    remainingSeconds: null
  }),

  computed: {
    emailSentTo() {
      return window.localStorage.getItem('email_tried').replace('%40', '@') || '';
    },

    emailUnverified() {
      if(window.location.search.includes('email_unverified')) return true;
      return false;
    },
  },

  updated() {
    if( this.$auth.alertMessage ) this.alertMessage = this.$auth.alertMessage;
    if( this.$auth.errorMessage ) this.errorMessage = this.$auth.errorMessage;
  },

  mounted() {
    this.exampleFreights();
    if(window.localStorage.getItem("firstTimeLogin") == true) this.$router.push('/company');
  },

  methods: {
    exampleFreights() {
      let exampleFreights = [
        {
          "_id": "613f84c71ed1115b145a862e",
          "regime": [
              "LTL"
          ],
          "pallet": [],
          "trucktype": [
              "duba",
              "prelata"
          ],
          "features": [],
          "location": "București, România",
          "destination": "Timișoara, România",
          "details": "Table skeleton made of removable pipe and 2 chipboard countertops with a thickness of 2 cm.",
          "distance": "541 km",
          "initialoffer": 780,
          "TVA": "included",
          "tonnage": 0.08,
          "palletNumber": null,
          "volume": null,
          "width": null,
          "height": null,
          "valability": "3days",
          "fromUser": {
              "email": "0741xxxxxx",
              "name": "David"
          },
          "createdAt": "2021-09-13T17:05:11.433Z",
          "offers": [],
          "__v": 0
        },

        {
          "fromUser": {
              "email": "0741xxxxxx",
              "name": "Andrei"
          },
          "regime": [
              "LTL"
          ],
          "pallet": [],
          "trucktype": [
              "transport auto",
              "agabaritic"
          ],
          "features": [],
          "_id": "613f86b21ed1115b145a862f",
          "location": "București, România",
          "destination": "Cluj-Napoca, România",
          "details": "Tractor UTB 650",
          "distance": "453 km",
          "initialoffer": null,
          "TVA": "without",
          "tonnage": 3.6,
          "palletNumber": null,
          "volume": null,
          "width": 2.5,
          "height": 4,
          "valability": "7days",
          "createdAt": "2021-09-13T17:13:22.262Z",
          "offers": [],
          "__v": 0
        },
        {
          "fromUser": {
              "email": "0741xxxxxx",
              "name": "Lucian"
          },
          "regime": [
              "ANY"
          ],
          "pallet": {
            "other": 4
          },
          "trucktype": [
              "duba",
              "decopertat",
              "prelata"
          ],
          "features": [],
          "_id": "61403836e2feac4c6c020732",
          "location": "Craiova, România",
          "destination": "București, România",
          "details": "Interior doors, palletized. A vehicle with a clear floor length of 2.7m is required",
          "distance": "228 km",
          "initialoffer": null,
          "TVA": "without",
          "tonnage": 1.8,
          "volume": null,
          "width": 2.2,
          "height": 2.1,
          "valability": "3days",
          "createdAt": "2021-09-14T05:50:46.035Z",
          "offers": [],
          "__v": 0
        }
      ]
      this.freights = exampleFreights;
    },

    login() {
      this.$auth.loginWithRedirect();
    },

    signup(nr) {
      fetch(`${HOST}/auth/whichCTA`, {
        method: 'POST',
        body: JSON.stringify({ 'whichCTA': nr }),
        headers: {
          'content-type': 'application/json',
        },
      })
      .then(res => res.json());

      this.$analytics.logEvent('sign_up', { 'whichCTA': nr });
      this.$auth.loginWithRedirect({ action: 'signup', language: ['ro'] });
    },

    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    },
  },
}
</script>
<style scoped>
  @import url('../styling/home.css');
</style>