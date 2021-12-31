<template>
  <div id="app">
    <b-navbar id="navBar"
      :class="$auth.isAuthenticated ? 'navDark' : 'navLight'">
      <!--Authenticated users navigation buttons -->
      <router-link v-if="$auth.isAuthenticated" class="buttonPadding" to="/">Exchange</router-link>
      <router-link v-if="$auth.isAuthenticated" class="buttonPadding" to="/addfreight">Add Freight</router-link>
      <router-link v-if="$auth.isAuthenticated" class="buttonPadding" to="/profile">Profile</router-link>
      <router-link v-if="$auth.isAuthenticated" class="buttonPadding" to="/company">Company</router-link>

      <!--New users authentication buttons
          Check that the SDK client is not currently loading before accessing is methods -->
      <b-navbar-nav v-if="!$auth.user" class="authentication ml-auto" right>
        <div v-if="!$auth.loading">
          <span v-if="!$auth.isAuthenticated" id="loginButton" @click="login">Login</span>
          <b-button v-if="!$auth.isAuthenticated" @click="signup" variant="outline-secondary" class="signup">Sign up</b-button>
        </div>
      </b-navbar-nav>
    </b-navbar>

  <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',

  updated() {
    /*
      App.vue is mounted in every route.

      Everytime DOM is re-rendered ( updated() hook )
      Call "refreshToken" method, to check if the client's subscription is different than the one in the database.

      It will request the server, receiving back a boolean.
      If it's true, re-login.
    */
    if(!this.$auth.loading && !this.$auth.refreshTokenHasBeenCalled && this.$auth.user) this.$auth.refreshToken();
  },

  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },

    signup() {
      this.$auth.loginWithRedirect({ action: 'signup' });
    },
  }
}
</script>
<style scoped>
  @import url('./styling/app.css');
</style>