<template>
  <div>
  <!-- Alert messages -->
  <b-alert v-if="alertMessage" class="b-alert" show variant="warning" dismissible>{{ alertMessage }}</b-alert>
  <b-alert v-if="errorMessage" class="b-alert" show variant="danger" dismissible>{{ errorMessage }}</b-alert>
  <b-alert v-if="successMessage" class="b-alert" show variant="success" dismissible>{{ successMessage }}</b-alert>

  <!-- Company content -->
  <b-container>
    <h2>Company page</h2>

    <form class="companyForm" @submit.prevent="setCompany()">
      <!-- Company name -->
      <b-input-group>
        <b-input-group-text><span class="mx-auto">Company name</span></b-input-group-text>
        <b-form-input
          v-model="company.companyName"
          type="text"
          class="form-control"
          id="companyName"
          aria-describedby="companyName"
          alt="company name"
          placeholder="Company name" required>
        </b-form-input>
      </b-input-group>

      <!-- CUI -->
      <b-input-group>
        <b-input-group-text><span class="mx-auto">CUI</span></b-input-group-text>
        <b-form-input
          v-model="company.cui"
          type="text"
          class="form-control"
          id="cui"
          aria-describedby="cui"
          placeholder="CUI" required>>
        </b-form-input>
      </b-input-group>


      <!-- Year establishment -->
      <b-input-group>
        <b-input-group-text><span class="mx-auto">Year establishment</span></b-input-group-text>
        <b-form-input
          v-model="company.fromYear"
          type="number"
          class="form-control"
          id="fromYear"
          aria-describedby="address"
          placeholder="Year establishment" required>
        </b-form-input>
      </b-input-group>

      <!-- Headquarters -->
      <b-input-group>
        <b-input-group-text><span class="mx-auto">Headquarters</span></b-input-group-text>
        <b-form-input
          v-model="company.address"
          type="text"
          class="form-control"
          id="address"
          aria-describedby="address"
          placeholder="Headquarters" required>
        </b-form-input>
      </b-input-group>

      <!-- Main activity -->
      <b-form-select v-model="company.activity" required>
        <b-form-select-option disabled value="">Select the main activity</b-form-select-option>
        <b-form-select-option value="transporter">transporter</b-form-select-option>
        <b-form-select-option value="expeditor">forwarder (client)</b-form-select-option>
        <b-form-select-option value="casa de expeditii">forwarding agent</b-form-select-option>
        <b-form-select-option value="altele">other</b-form-select-option>
      </b-form-select>

      <button type="submit" id="signupButton" class="btn btn-primary">Save</button>
    </form>
  </b-container>
  </div>
</template>
<script>
const HOST = 'https://truckloadserver.herokuapp.com';
const brandName = '4truckLoad';

export default {
  name: "Company",

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

    company: {
      companyName: '',
      cui: '',
      fromYear: null,
      address: '',
      activity: ''
    },

    companyEmptyElements: 0
  }),

  mounted() {
    this.getCompany()
  },

  methods: {
    getCompany() {
      this.$auth.getIdTokenClaims().then(( token ) => {
        fetch(`${HOST}/api/v1/company`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + token.__raw
          },
        })
        .then(res => res.json())
        .then((result) => {
          Object.entries(result).forEach((elem) => {
            let key = elem[0]; // .companyName, .cui, .address, etc..
            let value = elem[1]; // value
            this.company[key] = value;
          })
        })
      });
    },

    setCompany(object) {
      object = {
        companyName: this.company.companyName,
        cui: this.company.cui,
        fromYear: this.company.fromYear,
        address: this.company.address,
        activity: this.company.activity
      },

      this.$auth.getIdTokenClaims().then(( token ) => {
        fetch(`${HOST}/api/v1/company`, {
          method: 'POST',
          body: JSON.stringify(object),
          headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + token.__raw
          },
        })
        .then(res => res.json())
        .then((result) => {
          if(result.state == 'updated.') {
            this.successMessage = 'Company page updated!'
            setTimeout(() => { this.successMessage = '' }, 3000);

            Object.keys(this.company).forEach(elem => {
              window.localStorage.setItem(elem, result.company[elem]);
              this.company[elem] = result.company[elem];
            })
          } else {
            this.errorMessage = result.message;
            setTimeout(() => { this.errorMessage = '' }, 3000);
          }
        })
      });
    },


    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    },
  }
}
</script>
<style scoped>
  @import url('../styling/company.css');
</style>