<template>
<div>
    <!-- Errors & Alerts -->
    <b-alert v-if="alertMessage" class="b-alert" show variant="warning" dismissible>{{ alertMessage }}</b-alert>
    <b-alert v-if="errorMessage" class="b-alert" show variant="danger" dismissible>{{ errorMessage }}</b-alert>
    <b-alert v-if="errorNoCompanyPage" class="b-alert" show variant="danger">
      <span class="alert-non-premium" @click="$router.push('/company')">Mergi la pagina companiei</span> si finalizeaza contul
    </b-alert>

  <!-- Dashboard content -->
  <b-container fluid="sm" class="home">
    <b-alert v-if="!$auth.loading && !userAddedFreights" class="noFreightAddedWarning" show variant="warning">
      You haven't published any freight yet
    </b-alert>

    <div class="secondNavbar">
      <router-link v-if="$auth.isAuthenticated && !userAddedFreights" to="/addfreight" class="addFreightRouterLink">add freight</router-link>
    </div>

    <!-- Freights loop container -->
    <div id="freights" v-for="freight in freights" :key="freight._id">
      <div id="freight" @click="$router.push('/marfa/' + freight._id)">
        <!-- top -->
        <div class="top">
          <div class="location">
            <p v-if="freight.valability" class="createdAt">
              {{ new Date(freight.createdAt).toLocaleDateString() }} - <span>{{ expireDate(freight.createdAt, freight.valability) }}</span>
            </p>

            <p class="locationDestination"><b-icon-geo-alt-fill></b-icon-geo-alt-fill> {{ freight.location | truncate(35) }}</p>
            <p class="locationDestination"><b-icon-geo-alt-fill></b-icon-geo-alt-fill> {{ freight.destination | truncate(35) }}</p>
            <span v-if="freight.distance" class="distance"> {{ freight.distance }} </span>
          </div>

            <div class="tonnage">{{ freight.tonnage }} {{ freight.tonnage == 1 ? "tona" : "tone" }}</div>
            <span class="details"> {{ freight.details | truncate(80) }}</span>
        </div>

        <!-- bottom -->
        <div class="bottom">
          <div class="secondLine">
            <div class="leftAlign">

              <span class="detailsMobile"> {{ freight.details | truncate(32) }}</span>

              <div class="regime" v-for="regime in freight.regime" :key="regime">
                <span v-if="regime == 'ANY'">any truckload</span>
                <span v-if="regime == 'FTL'">FTL (full truckload)</span>
                <span v-if="regime == 'LTL'">LTL (less than truckload)</span>
              </div>

              <div class="pallet">
                <span v-if="freight.palletNumber">{{ freight.palletNumber }}x</span>
                <span v-if="freight.palletName"> {{ freight.palletName !== 'other' ? freight.palletName : 'other pallet type' }} </span>
              </div>

              <div v-if="freight.initialoffer" class="initialOffer">
                <span>{{ freight.initialoffer }}</span>EUR
                <span class="TVA"> {{ freight.TVA == 'included' ? 'with TVA' : 'without TVA'}}</span>
              </div>

              <div v-if="freight.trucktype" :class="['truckRequirements', freight.initialoffer > 1 ? 'trucktypeTopMargin' : '']">
                <span v-for="(truck, index) in freight.trucktype" :key="truck"
                  :class="[index > 0 ? 'infoSingleItemMargin' : '', index == freight.trucktype.length-1 ? 'block' : '']">
                  <b-icon-truck></b-icon-truck> {{ truck }}
                </span>
              </div>

              <div v-if="freight.features" class="featureRequirements">
                <span v-for="(feature, index) in freight.features" :key="feature" :class="['featureFlexIcon', index > 0 ? 'infoSingleItemMargin' : '']">
                  <b-icon-diamond class="iconFeature"></b-icon-diamond>{{ feature }}
                </span>
              </div>

            </div> <!-- div.leftAlign -->
          </div> <!-- div.secondLine -->
        </div> <!-- div.bottom -->

      </div> <!-- div#freight -->
    </div> <!-- div#freights (the loop container) -->


      <b-pagination
        v-if="freights.length"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="freights"
        align="center"
      ></b-pagination>
    </b-container>

  <!-- Footer -->
  <div class="footer">
    <div class="footerData">
      <a href="mailto:contact@4truckload.com" target="_blank"><b-icon-envelope-fill></b-icon-envelope-fill> contact@4truckload.com</a>
    </div>
  </div>

</div>
</template>

<script>
const HOST = 'https://truckloadserver.herokuapp.com';

const brandName = '4truckLoad';
const metaDesc = 'Find transporter, ship the goods. Get started now!';

export default {
  name: "exchange",

  metaInfo: {
    title: 'Freight Exchange',
    titleTemplate: `${ brandName } | %s `,
    meta: [
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: metaDesc },
    ]
  },

  filters: {
    truncate: function (text, stop, clamp) {
      return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
    }
  },

  data: () => ({
    alertMessage: '',
    errorMessage: '',
    errorNoCompanyPage: false,

    currentPage: 1,
    perPage: 8,
    howManyPages: 1,
    freights: []
  }),

  computed: { // computed proprierties are set in data.vue
    rows(x) {
      x = this.currentPage * this.perPage;

      if( this.currentPage !== 1 && this.freights.length < 1 ) return x;
      return this.perPage * this.howManyPages;
    },

    isUserPremium(subscriptionType) {
      subscriptionType = this.$auth.user['https://www.dev-h1e424j0.us.auth0.com.subscription'];
      if(subscriptionType == 'transportator' || subscriptionType == 'complet') return true;
      return false;
    },
  },

  watch: {
    currentPage(skipN) {
      skipN = this.currentPage - 1; // in mongoDB skip(0) it's the firstPage
      this.$auth.getIdTokenClaims().then(( token ) => {
        this.getFreights(skipN, token);
      });
    },
  },

  updated() {
    if(this.$auth.alertMessage) this.alertMessage = this.$auth.alertMessage;
    if(this.$auth.errorMessage) this.errorMessage = this.$auth.errorMessage;

    if(this.alertMessage || this.errorMessage) {
      setTimeout(() => {
        this.alertMessage = ''
        this.errorMessage = ''
      }, 3000);
    }
  },

  mounted() {
    if(!this.$auth.loading) {
      this.$auth.getIdTokenClaims().then(( token ) => {
        this.userAddedFreights(token);
        this.getFreights(null, token);
      });
    }
  },

  methods: {
    userAddedFreights(token) {
      fetch(`${HOST}/api/v1/userAddedFreights/`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + token.__raw,
        },
      })
      .then(res => res.json())
      .then(( result ) => {
        if(result.userAddedFreights == true) this.userAddedFreights = true
        else this.userAddedFreights = false;
      })
    },

    getFreights(skipN, token) {
      fetch(`${HOST}/api/v1/freights/`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + token.__raw,
          "skipN": skipN || 0
        },
      })
      .then(res => res.json())
      .then((result) => {
        if(result.length > 8 && this.currentPage == this.howManyPages) this.howManyPages++
        if(result.length > 8) result.pop();

        /* Initial FETCH */
        if(!this.freights.length) {
          this.freights = result
        }

        /* Page changed */
        this.freights = [];
        result.forEach(element => { // .push() triggers reactivity
          this.freights.push(element)
        });
      })
    },

    expireDate(createdAt, valability) {
      createdAt = new Date(createdAt).getTime() // get the day of the month
      valability = valability.split('days')[0] * 24 * 3600 * 1000 // string to days number

      return new Date( createdAt  + valability ).toLocaleDateString()
    },

    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    },
  },
}
</script>
<style>
</style>