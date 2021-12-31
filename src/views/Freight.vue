<template>
<div>
  <h1>Freight</h1>

  <!-- Alert Messages -->
  <b-alert v-if="alertMessage" class="b-alert" show variant="warning" dismissible>{{ alertMessage }}</b-alert>
  <b-alert v-if="errorMessage" class="b-alert" show variant="danger" dismissible>{{ errorMessage }}</b-alert>
  <b-alert v-if="successMessage" class="b-alert" show variant="success" dismissible>{{ successMessage }}</b-alert>
  <b-alert v-if="errorNoCompanyPage" class="b-alert" show variant="danger">
    <span class="alert-non-premium" @click="$router.push('/company')">Go to company page</span> and complete your account
  </b-alert>
  <b-alert v-if="!$auth.loading && !isUserPremium" class="b-alert" show variant="danger">
    <span class="alert-non-premium" @click="$router.push('/profile')">Pay a premium subscription</span> to contact the client
  </b-alert>


  <!-- Freight Data -->
  <div id="singleFreightContainer">
    <div id="singleFreight">
      <!-- Valability -->
      <p v-if="freight.valability" class="createdAt">
        {{ new Date(freight.createdAt).toLocaleDateString() }} - <span>{{ expireDate }}</span>
      </p>

      <!-- Location-Destination -->
      <p class="locationDestination"><b-icon-geo-alt-fill></b-icon-geo-alt-fill> {{ freight.location }}</p>
      <p class="locationDestination"><b-icon-geo-alt-fill></b-icon-geo-alt-fill> {{ freight.destination }}</p>

      <!-- Text description -->
      <span v-if="freight.details" class="showDetails"> {{ freight.details }}</span>

      <div class="info">
        <!-- Distance -->
        <span v-if="freight.distance" class="distance"> {{ freight.distance }} </span>

        <!-- Tonnage -->
        - <div class="tonnage">{{ freight.tonnage }} {{ freight.tonnage == 1 ? "ton" : "tons" }}</div>

        <!-- Regime -->
        <div class="regime" v-for="regime in freight.regime" :key="regime">
          <span v-if="regime == 'ANY'">any truckload</span>
          <span v-if="regime == 'FTL'">FTL (full truckload)</span>
          <span v-if="regime == 'LTL'">LTL (less than truckload)</span>
        </div>

        <!-- Initial offer -->
        <div v-if="freight.initialoffer" class="initialOffer">
          <span>{{ freight.initialoffer }}</span>EUR
          <span>{{ freight.TVA == 'included' ? 'with TVA' : 'without TVA'}}</span>
        </div>

        <!-- Packing (size + palletization type) -->
        <div class="packing">
          <div class="pallet">
            <span>
              <span v-if="freight.palletNumber">{{ freight.palletNumber }}x</span>
              <span v-if="freight.palletName"> {{ freight.palletName !== 'other' ? freight.palletName : 'other pallet type' }} </span>
            </span>
          </div>

          <div class="sizeMargin" :class="!freight.palletName ? 'noLeftMargin' : 'leftMargin'">
            <span v-if="freight.freightLength">L: {{ freight.freightLength }}m</span>
            <span v-if="freight.width">W: {{ freight.width }}m</span>
            <span v-if="freight.height">H: {{ freight.height }}m
              <span v-if="freight.volume">V: {{ freight.volume }}m3</span>
            </span>
          </div>
        </div>

        <!-- Truck Requirements -->
        <div v-if="freight.trucktype" class="truckRequirements">
          <span v-for="(truck, index) in freight.trucktype" :key="truck" :class="index > 0 ? 'infoSingleItemMargin' : ''"><b-icon-truck></b-icon-truck> {{ truck }}</span>
        </div>

        <div v-if="freight.features" class="featureRequirements">
          <span
            v-for="(feature, index) in freight.features"
            :key="feature"
            :class="['featureFlexIcon', index > 0 ? 'infoSingleItemMargin' : '']">
            <b-icon-diamond class="iconFeature"></b-icon-diamond>{{ feature }}
          </span>
        </div>

      </div> <!-- End div.info -->

      <!-- Expeditor contact -->
      <div class="contact">
        <div class="contactUserID">
          <b-icon-person-fill></b-icon-person-fill> <span v-if="freight.fromUser">{{ freight.fromUser[0].name }} -</span>
        </div>
        <div class="contactData">
          <span v-if="freight.fromUser">{{ freight.fromUser[0].email }}</span>
          <span v-if="freight.fromUser">{{ freight.fromUser[0].phone }}</span>
        </div>
      </div>

      <div v-if="freight.specimen" class="specimen">specimen</div> <!-- if no freight is published -->

    </div> <!-- End div#singleFreight -->
  </div> <!-- End div#singleFreightContainer -->

</div>
</template>
<script>
const HOST = 'https://truckloadserver.herokuapp.com';

const brandName = '4truckLoad';

export default {
  name: "Freight",

  metaInfo: {
    title: 'Freight exchange',
    titleTemplate: `%s | ${ brandName }`,
    meta: [
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ]
  },

  data: () => ({
    alertMessage: '',
    errorMessage: '',
    successMessage: '',
    errorNoCompanyPage: false,

    freight: {},
  }),

  computed: {
    isUserPremium(subscriptionType) {
      subscriptionType = this.$auth.user['https://www.dev-h1e424j0.us.auth0.com.subscription'];
      if(subscriptionType == 'transportator' || subscriptionType == 'complet') return true;
      else return false;
    },

    expireDate(createdAt, valability) {
      createdAt = new Date(this.freight.createdAt).getTime() // get the day of the month
      valability = this.freight.valability.split('days')[0] * 24 * 3600 * 1000 // string to days number

      return new Date( createdAt  + valability ).toLocaleDateString()
    }
  },

  mounted() {
    /* Get freight's data */
    this.$auth.getIdTokenClaims().then(( token ) => {
      fetch(`${HOST}/api/v1/freight/` + this.$route.params.freightID, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + token.__raw,
        },
      })
      .then(res => res.json())
      .then((result) => {
        if(result.message !== 'Ai nevoie de abonament pentru asta') this.freight = result;
      })
    });
  },
}
</script>
<style scoped>
  @import url('../styling/freight.css');
</style>