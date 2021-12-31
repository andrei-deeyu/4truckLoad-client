<template>
  <div>
    <!-- Alert Messages -->
    <b-alert v-if="successMessage" class="b-alert" show variant="success" dismissible>{{ successMessage }}</b-alert>

    <!-- Profile -->
    <b-container>
      <!-- User identification -->
      <img v-if="$auth.user.picture" :src="$auth.user.picture">
      <h2>{{ $auth.user.name }}</h2>


      <!-- E-mail -->
      <b-input-group v-if="email">
        <b-input-group-text>email</b-input-group-text>
          <div class="userInfo">{{ email }}</div>
      </b-input-group>

      <b-input-group v-if="email_verified">
        <b-input-group-text>email verified</b-input-group-text>
        <div class="userInfo">
          <b-icon-check2 v-if="email_verified"></b-icon-check2>
          <b-icon-x-circle-fill v-else></b-icon-x-circle-fill>
        </div>
      </b-input-group>


      <!-- Phone Number-->
      <b-input-group>
        <b-input-group-text>phone number</b-input-group-text>
        <b-form-input
          v-model="phone"
          type="text"
          class="form-control"
          placeholder="phone number" required>
        </b-form-input>
      </b-input-group>


      <!-- Company role -->
      <b-input-group>
        <b-input-group-text>company role</b-input-group-text>
        <b-form-input
          v-model="role"
          type="text"
          class="form-control"
          placeholder="company role" required>
        </b-form-input>
      </b-input-group>


      <!-- Submit button -->
      <b-button
        v-if="inputChanges"
        @click="changeUserMetadata()"
        class="updateChanges"
        variant="outline-secondary"><span>update the changes</span>
      </b-button>


      <!-- Subscription status -->
      <b-input-group v-if="subscription" id="subscription" :class="subscription == 'standard' ? 'REDhighlight' : 'GREENhighlight'">
        <b-input-group-text>subscription</b-input-group-text>
        <div class="userInfo">{{ subscription }}</div>
      </b-input-group>

      <p class="profileImageAlert">In the future you will be able to change your profile picture*</p>
    </b-container>


    <!-- Payment  -->
    <form @submit.prevent="createCheckoutSession()" method="POST">
      <b-container fluid class="subscriptionContainer">


        <!-- Transporter -->
        <b-card class="subscriptionCard">
          <p class="planName">Transporter</p>
          <p>199&euro; / <span class="perMonths">month</span></p>

          <b-input-group>
            <b-input-group-text>contacts</b-input-group-text>
              <div class="userInfo">unlimited</div>
          </b-input-group>

          <b-input-group>
            <b-input-group-text>publish freight</b-input-group-text>
              <div class="userInfo">-</div>
          </b-input-group>

          <div class="CTA">
            <b-button @click="createCheckoutSession('transportator')" id="submit" variant="primary">
              Pay by card
              <img class="partnerBranding" src="../assets/poweredByStripe.svg"/>
            </b-button>
          </div>
        </b-card>

        <!-- Complet -->
        <b-card class="subscriptionCard">
          <p class="planName">Complet</p>
          <p>299&euro; / <span class="perMonths">month</span></p>

          <b-input-group>
            <b-input-group-text>contacts</b-input-group-text>
              <div class="userInfo">unlimited</div>
          </b-input-group>

          <b-input-group>
            <b-input-group-text>publish freights</b-input-group-text>
              <div class="userInfo">unlimited</div>
          </b-input-group>

          <div class="CTA">
            <b-button @click="createCheckoutSession('complet')" id="submit" variant="primary">
              Pay by card
              <img class="partnerBranding" src="../assets/poweredByStripe.svg"/>
            </b-button>
          </div>
        </b-card>


      </b-container>
    </form>

    <!-- Footer -->
    <div class="logoutFooter">
      <p v-if="$auth.isAuthenticated" @click="logout" class="footerlogoutButton" variant="outline-secondary">Logout</p>
    </div>
  </div>
</template>
<script>
const HOST = 'https://truckloadserver.herokuapp.com';
const SUBSCRIPTION = 'https://truckload-subscription.herokuapp.com';
const brandName = '4truckLoad';

export default {
  name: "profile",

  metaInfo: {
    title: 'Freight exchange',
    titleTemplate: `%s | ${ brandName }`,
    meta: [
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ]
  },

  data: () => ({
    successMessage: '',

    tempRole: '',
    tempPhone: '',

    role: '',
    phone: ''
  }),

  computed: {
    email() {
      if( this.$auth.user ) return this.$auth.user.email;
      return '';
    },

    email_verified() {
      if( this.$auth.user.email_verified ) return true;
      return false;
    },

    subscription(subscriptionType) {
      subscriptionType = this.$auth.user['https://www.dev-h1e424j0.us.auth0.com.subscription'];

      if(subscriptionType == 'transportator' || subscriptionType == 'complet') return subscriptionType;
      else return 'standard';
    },

    inputChanges() {
      if(this.role !== this.tempRole || this.phone !== this.tempPhone) {
        return true;
      }
      return false;
    }
  },

  mounted() {
    this.getUserMetadata();
  },

  methods: {
    createCheckoutSession(planName, rawEmail, encodedEmail) {
      // Trigger Google Analytics event
      this.$analytics.logEvent('begin_checkout', { 'planName': planName });

      // Encode URL
      rawEmail = this.$auth.user.email.split("@");
      encodedEmail = rawEmail[0] + "%40" + rawEmail[1];

      // Go to payment page
      return window.location.href = `${SUBSCRIPTION}/checkout.html?email=${encodedEmail}?planName=${planName}`;
    },

    getUserMetadata() {
      // get the current changeable user metadata: phone number & company role
      this.$auth.getIdTokenClaims().then(( token ) => {
        fetch(`${HOST}/auth/getUserMetadata`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + token.__raw
          },
        })
        .then(res => res.json())
        .then((result) => {
          // "tempValue"s will be used to trigger inputChanges() in computed methods.
          this.tempRole = result.role;
          this.tempPhone = result.phone // "tempValue"

          this.role = result.role;
          this.phone = result.phone // "value"
        })
      });
    },

  changeUserMetadata(currentRole) {
    currentRole = {
      role: this.role,
      phone: this.phone
    }

    this.$auth.getIdTokenClaims().then(( token ) => {
      fetch(`${HOST}/auth/changeUserMetadata`, {
        method: 'POST',
        body: JSON.stringify(currentRole),
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer '  + token.__raw
        },
      })
      .then(res => res.json())
      .then(( result ) => {
        if(result.state !== 'changed.') {
          this.errorMessage = result.message;
          setTimeout(() => { this.errorMessage = '' }, 3000);
        } else {
          this.role = result.newRole;
          this.phone = result.newPhone;
          this.successMessage = 'Profile updated';
          setTimeout(() => { this.successMessage = '' }, 3000);
        }
      });
    });
  },

    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
}
</script>
<style scoped>
  @import url('../styling/profile.css');
</style>