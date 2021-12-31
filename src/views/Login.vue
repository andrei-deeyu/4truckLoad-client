<template>
  <div>
  </div>
</template>

<script>
export default {
  name: "login",
  data: () => ({
  }),

  created() {
    this.$auth.loginWithRedirect({ redirect_uri: 'https://4truckload.com/profile' });
  },
}
</script>